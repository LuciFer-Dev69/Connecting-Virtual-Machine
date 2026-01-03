
import os
import base64
import random

FILES_DIR = "challenge_files"

def ensure_dir():
    if not os.path.exists(FILES_DIR):
        os.makedirs(FILES_DIR)

def generate_crypto_assets():
    print("Generating Crypto Assets...")
    # L1: Base64
    with open(f"{FILES_DIR}/secret_enc.txt", "w") as f:
        f.write(base64.b64encode(b"flag{base64_is_just_encoding}").decode())
    
    # L1: Caesar / ROT13
    # flag{julius_caesar_would_be_proud} -> synt{whyvhf_pnrfne_johyq_or_cebhq}
    with open(f"{FILES_DIR}/caesar.txt", "w") as f:
        f.write("synt{whyvhf_pnrfne_johyq_or_cebhq}")

    # L3: Hardcoded AES Key (JS file)
    with open(f"{FILES_DIR}/app.js", "w") as f:
        f.write("""
        function encrypt(data) {
            const key = "super_secret_aes_key_123!"; // TODO: Remove this before prod
            return aes.encrypt(data, key);
        }
        // Encrypted Flag: U2FsdGVkX1+... (Simulation)
        // Real Flag: flag{aes_keys_should_be_secret}
        """)

def generate_forensics_assets():
    print("Generating Forensics Assets...")
    # L2: Server Logs
    with open(f"{FILES_DIR}/access.log", "w") as f:
        # Generate noise
        for i in range(100):
            f.write(f"192.168.1.{random.randint(2,200)} - - [03/Jan/2026:10:{i}:00 +0000] \"GET /index.html HTTP/1.1\" 200 1024\n")
        # Hidden SQLi
        f.write("10.0.0.66 - - [03/Jan/2026:10:30:00 +0000] \"GET /login.php?user=admin' OR 1=1-- HTTP/1.1\" 200 5000 \"Mozilla/5.0 (flag{sqli_in_user_agent})\"\n")
        for i in range(50):
            f.write(f"192.168.1.{random.randint(2,200)} - - [03/Jan/2026:11:{i}:00 +0000] \"GET /about.html HTTP/1.1\" 200 512\n")

    # L2: Bash History
    with open(f"{FILES_DIR}/.bash_history", "w") as f:
        f.write("ls -la\ncd /var/www/html\nwhoami\n")
        # Base64 encoded command: echo "flag{rm_rf_is_bad_news}"
        # ZWNobyAiZmxhZ3tybV9yZl9pc19iYWRfbmV3c30i
        f.write("echo ZWNobyAiZmxhZ3tybV9yZl9pc19iYWRfbmV3c30i | base64 -d | bash\n")
        f.write("exit\n")

if __name__ == "__main__":
    ensure_dir()
    generate_crypto_assets()
    generate_forensics_assets()
    print("✅ Assets generated in /challenge_files")
