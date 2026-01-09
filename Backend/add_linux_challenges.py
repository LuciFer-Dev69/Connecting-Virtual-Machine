
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

def add_linux_challenges():
    try:
        conn = mysql.connector.connect(**db_config)
        cursor = conn.cursor()
        print("🐧 Adding Linux Challenges to Database...")

        # Helper function to insert/update challenge
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

        # Linux Category (Using 'Linux' after schema update)
        CATEGORY = "Linux"

        # Level 1: Hidden Files
        upsert_challenge(
            "Linux - Hidden Files",
            "There is a hidden file in the home directory. Find it and cat it.",
            CATEGORY, 1, "flag{linux_hidden_files_found}", "Use 'ls -la' to see hidden files starting with dot.", 100, "Easy"
        )

        # Level 2: Grep Master
        upsert_challenge(
            "Linux - Grep Master",
            "A flag is buried deep inside 'server_logs.txt'. Find the line containing 'CRITICAL'.",
            CATEGORY, 2, "flag{grep_is_your_friend_123}", "Use grep to search for patterns: 'grep CRITICAL filename'", 150, "Medium"
        )

        # Level 3: Base64
        upsert_challenge(
            "Linux - Encoding",
            "Decrypt the content of 'secrets.b64'. It is encoded in Base64.",
            CATEGORY, 3, "flag{base64_encoding_is_not_encryption}", "Use the 'base64 -d' command.", 200, "Medium"
        )

        # Level 4: Sudo
        upsert_challenge(
            "Linux - Root Privilege",
            "Read the content of 'root_only.txt'. It requires root privileges.",
            CATEGORY, 4, "flag{sudo_make_me_a_sandwich}", "Use 'sudo cat filename'. Checking sudo -l might help.", 300, "Hard"
        )
        
        conn.commit()
        print("\n🎉 Linux challenges added successfully!")
        
        cursor.close()
        conn.close()

    except Exception as e:
        print(f"❌ Error adding challenges: {e}")

if __name__ == "__main__":
    add_linux_challenges()
