
import paramiko
import os
from dotenv import load_dotenv

load_dotenv()

def verify_files():
    print("🔍 Verifying Challenge Files in PwnBox...")
    
    host = os.getenv("SSH_HOST", "pwnbox")
    user = os.getenv("SSH_USER", "chakra")
    password = os.getenv("SSH_PASSWORD", "user")
    port = int(os.getenv("SSH_PORT", 22))

    client = paramiko.SSHClient()
    client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    
    try:
        client.connect(host, port=port, username=user, password=password, timeout=10)
        
        files_to_check = [
            ".hidden_flag",
            "server_logs.txt",
            "secrets.b64",
            "root_only.txt"
        ]

        all_ok = True
        for f in files_to_check:
            stdin, stdout, stderr = client.exec_command(f"ls -la /home/chakra/{f}")
            out = stdout.read().decode().strip()
            if out:
                print(f"✅ Found: {f}")
            else:
                print(f"❌ MISSING: {f}")
                all_ok = False

        if all_ok:
            print("🎉 All files verified!")
        client.close()

    except Exception as e:
        print(f"❌ Failure: {e}")

if __name__ == "__main__":
    verify_files()
