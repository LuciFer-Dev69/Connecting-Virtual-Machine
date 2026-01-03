
import mysql.connector
import os
from dotenv import load_dotenv

load_dotenv()

db_config = {
    "host": os.getenv("DB_HOST", "localhost"),
    "user": os.getenv("DB_USER", "root"),
    "password": os.getenv("DB_PASSWORD", ""),
    "database": os.getenv("DB_NAME", "chakraDB")
}

def add_web_curriculum():
    try:
        conn = mysql.connector.connect(**db_config)
        cursor = conn.cursor()
        print("🌐 Adding Advanced Web Curriculum Challenges...")

        def upsert_challenge(title, description, category, level, flag, hint, points, difficulty="Easy"):
            cursor.execute("""
                INSERT INTO challenges (title, description, category, difficulty, level, flag, hint, points)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
                ON DUPLICATE KEY UPDATE
                    description = VALUES(description),
                    difficulty = VALUES(difficulty),
                    flag = VALUES(flag),
                    hint = VALUES(hint),
                    points = VALUES(points)
            """, (title, description, category, difficulty, level, flag, hint, points))
            print(f"✅ [{category}] Level {level}: {title}")

        CATEGORY = "Web"

        # --- LEVEL 1: WEB BASICS & RECON ---
        upsert_challenge(
            "Hidden Endpoint Discovery", 
            "A company website hides an admin panel accidentally exposed. Analyze robots.txt to find the hidden path.", 
            CATEGORY, 1, "flag{robots_txt_revealed_admin}", 
            "Check /robots.txt and look for Disallow entries.", 100, "Easy"
        )
        upsert_challenge(
            "Client-Side Auth Bypass", 
            "The login form validates credentials only using JavaScript. Bypass it.", 
            CATEGORY, 1, "flag{js_validation_bypass_success}", 
            "You can disable JavaScript or inspect the code to find the logic flaw.", 100, "Easy"
        )

        # --- LEVEL 2: INPUT VALIDATION & LOGIC FLAWS ---
        upsert_challenge(
            "Basic SQL Injection", 
            "An employee login portal is vulnerable to SQL injection. Login as admin without a password.", 
            CATEGORY, 2, "flag{sqli_login_bypass_admin}", 
            "Try common SQL payloads like ' OR 1=1--", 200, "Easy"
        )
        upsert_challenge(
            "IDOR Invoice Viewer", 
            "Users can view invoices by changing IDs in the URL. Access User #105's invoice.", 
            CATEGORY, 2, "flag{idor_invoice_access_granted}", 
            "Change the ID parameter in the URL /api/vuln/invoice?id=...", 200, "Easy"
        )

        # --- LEVEL 3: AUTHENTICATION & FILE ATTACKS ---
        upsert_challenge(
            "File Upload Vulnerability", 
            "Upload a PHP web shell to get RCE. Parameter: cmd=id.", 
            CATEGORY, 3, "flag{file_upload_rce_shell}", 
            "The server checks mime-type but not file extension locally? Try uploading a php file.", 300, "Medium"
        )
        upsert_challenge(
            "Password Reset Logic Flaw", 
            "Reset tokens are predictable. Take over the admin account.", 
            CATEGORY, 3, "flag{logic_flaw_token_prediction}", 
            "Observe how the token is generated. Is it time-based?", 300, "Medium"
        )

        # --- LEVEL 4: SERVER-SIDE EXPLOITATION ---
        upsert_challenge(
            "Command Injection", 
            "A ping tool executes OS commands. Read /etc/passwd.", 
            CATEGORY, 4, "flag{command_injection_success_root}", 
            "Use command separators like ; or &&.", 400, "Hard"
        )
        upsert_challenge(
            "Local File Inclusion (LFI)", 
            "A language parameter loads files dynamically. Read sensitive system files.", 
            CATEGORY, 4, "flag{lfi_read_passwd_success}", 
            "Use directory traversal ../../../etc/passwd", 400, "Hard"
        )

        # --- LEVEL 5: REAL-WORLD ADVANCED ATTACKS ---
        upsert_challenge(
            "JWT Authentication Bypass", 
            "Modify the JWT token to become admin (alg=none attack).", 
            CATEGORY, 5, "flag{jwt_alg_none_admin_bypass}", 
            "Change the algorithm to 'none' and remove the signature.", 500, "Hard"
        )
        upsert_challenge(
            "Full System Compromise", 
            "Chain multiple vulnerabilities to get root access on the internal VM.", 
            CATEGORY, 5, "flag{root_access_pwned_system}", 
            "This is a simulation. Connect to PwnBox and run the final exploit script.", 500, "Hard"
        )

        conn.commit()
        print("\n🎉 Web Curriculum added successfully!")
        cursor.close()
        conn.close()

    except Exception as e:
        print(f"❌ Error adding challenges: {e}")

if __name__ == "__main__":
    add_web_curriculum()
