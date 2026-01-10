import mysql.connector
from mysql.connector import pooling
import os
from dotenv import load_dotenv

load_dotenv()

db_config = {
    "host": os.getenv("DB_HOST", "localhost"),
    "user": os.getenv("DB_USER", "root"),
    "password": os.getenv("DB_PASSWORD", ""),
    "database": os.getenv("DB_NAME", "chakraDB")
}

def add_missing_challenges():
    try:
        conn = mysql.connector.connect(**db_config)
        cursor = conn.cursor()

        print("Adding missing challenges to database...")

        # --- CRYPTOGRAPHY LEVEL 1 ---
        print("Adding Cryptography Level 1...")
        cursor.execute("""
            INSERT INTO challenges (title, description, category, level, flag, hint, points)
            VALUES (
                'The Caesar Shift',
                'The Roman emperor left a message. It seems to be shifted by 13 characters. Encrypted message: synt{ebg13_znfgre}',
                'Cryptography',
                1,
                'flag{rot13_master}',
                'Try a ROT13 decoder.',
                100
            )
            ON DUPLICATE KEY UPDATE
                title = VALUES(title),
                description = VALUES(description),
                flag = VALUES(flag),
                hint = VALUES(hint)
        """)

        # --- FORENSICS LEVEL 1 ---
        print("Adding Forensics Level 1...")
        cursor.execute("""
            INSERT INTO challenges (title, description, category, level, flag, hint, points)
            VALUES (
                'Metadata Inspector',
                'This photo was taken at a secret location. Can you find the hidden metadata? The flag is hidden in the EXIF data.',
                'Forensics',
                1,
                'flag{exif_data_revealed}',
                'Look for EXIF data or image properties. Tools like exiftool can help.',
                100
            )
            ON DUPLICATE KEY UPDATE
                title = VALUES(title),
                description = VALUES(description),
                flag = VALUES(flag),
                hint = VALUES(hint)
        """)

        # --- REVERSE ENGINEERING LEVEL 1 ---
        print("Adding Reverse Engineering Level 1...")
        cursor.execute("""
            INSERT INTO challenges (title, description, category, level, flag, hint, points)
            VALUES (
                'Hardcoded Secrets',
                'This login form checks the password directly in the browser. Can you find it?',
                'Reverse Engineering',
                1,
                'flag{simple_js_check}',
                'Inspect the JavaScript source code.',
                100
            )
            ON DUPLICATE KEY UPDATE
                title = VALUES(title),
                description = VALUES(description),
                category = 'Reverse Engineering',
                flag = VALUES(flag),
                hint = VALUES(hint)
        """)

        # --- REVERSE ENGINEERING LEVEL 2 ---
        print("Adding Reverse Engineering Level 2...")
        cursor.execute("""
            INSERT INTO challenges (title, description, category, level, flag, hint, points)
            VALUES (
                'String Assembly',
                'The secret string is built at runtime. Analyze the logic to find the flag.',
                'Reverse Engineering',
                2,
                'flag{string_assembly_master}',
                'Trace the string concatenation logic.',
                200
            )
            ON DUPLICATE KEY UPDATE
                title = VALUES(title),
                description = VALUES(description),
                category = 'Reverse Engineering',
                flag = VALUES(flag),
                hint = VALUES(hint)
        """)

        # Update existing Reverse category challenges to use "Reverse Engineering"
        print("Updating existing Reverse challenges to Reverse Engineering...")
        cursor.execute("""
            UPDATE challenges 
            SET category = 'Reverse Engineering'
            WHERE category = 'Reverse'
        """)

        # --- MISC/GENERAL CHALLENGES ---
        print("Adding Misc/General challenges...")
        
        # Level 1: OSINT Basics
        cursor.execute("""
            INSERT INTO challenges (title, description, category, level, flag, hint, points)
            VALUES (
                'OSINT Basics',
                'Find information about the user "chakra_master_2024" on social media. The flag is their favorite security tool.',
                'Misc',
                1,
                'flag{osint_detective}',
                'Search for the username across social media platforms. The answer is in their bio.',
                100
            )
            ON DUPLICATE KEY UPDATE
                title = VALUES(title),
                description = VALUES(description),
                flag = VALUES(flag),
                hint = VALUES(hint)
        """)

        # Level 2: Social Engineering
        cursor.execute("""
            INSERT INTO challenges (title, description, category, level, flag, hint, points)
            VALUES (
                'Phishing Detection',
                'Analyze this email: "From: support@g00gle.com - Your account will be suspended unless you verify your credentials at http://verify-g00gle.com". What is the main red flag?',
                'Misc',
                2,
                'flag{phishing_expert}',
                'Check the sender email address carefully. Notice the zeros instead of O letters.',
                200
            )
            ON DUPLICATE KEY UPDATE
                title = VALUES(title),
                description = VALUES(description),
                flag = VALUES(flag),
                hint = VALUES(hint)
        """)

        # Level 3: Password Cracking
        cursor.execute("""
            INSERT INTO challenges (title, description, category, level, flag, hint, points)
            VALUES (
                'Weak Hash Cracker',
                'Crack this MD5 hash: 5f4dcc3b5aa765d61d8327deb882cf99. The password is a common word.',
                'Misc',
                3,
                'flag{password_cracker}',
                'Try a dictionary attack with common passwords. Or use an online MD5 decoder.',
                300
            )
            ON DUPLICATE KEY UPDATE
                title = VALUES(title),
                description = VALUES(description),
                flag = VALUES(flag),
                hint = VALUES(hint)
        """)

        # Level 4: Network Analysis
        cursor.execute("""
            INSERT INTO challenges (title, description, category, level, flag, hint, points)
            VALUES (
                'Suspicious Traffic',
                'Network logs show traffic on port 31337. This port is commonly used by which type of malware?',
                'Misc',
                4,
                'flag{network_analyst}',
                'Research common backdoor and trojan ports. Port 31337 is historically significant.',
                400
            )
            ON DUPLICATE KEY UPDATE
                title = VALUES(title),
                description = VALUES(description),
                flag = VALUES(flag),
                hint = VALUES(hint)
        """)

        # Level 5: Security Trivia
        cursor.execute("""
            INSERT INTO challenges (title, description, category, level, flag, hint, points)
            VALUES (
                'Security Master',
                'What does CVE stand for in cybersecurity? Format: flag{word1_word2_word3}',
                'Misc',
                5,
                'flag{common_vulnerabilities_exposures}',
                'CVE is a database maintained by MITRE. Research what the acronym means.',
                500
            )
            ON DUPLICATE KEY UPDATE
                title = VALUES(title),
                description = VALUES(description),
                flag = VALUES(flag),
                hint = VALUES(hint)
        """)

        conn.commit()

        # --- LINUX CHALLENGES ---
        # print("Adding Linux challenges...")
        # REMOVED: Using add_linux_curriculum.py instead to avoid conflicts and ensure a proper Bandit-style progression.
        
        conn.commit()

        print("✅ All missing challenges added successfully!")

        # Display summary
        cursor.execute("SELECT category, COUNT(*) as count FROM challenges GROUP BY category ORDER BY category")
        results = cursor.fetchall()
        print("\n📊 Challenge Summary:")
        for row in results:
            print(f"  {row[0]}: {row[1]} challenges")

        cursor.close()
        conn.close()

    except Exception as e:
        print(f"❌ Error adding challenges: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    add_missing_challenges()
