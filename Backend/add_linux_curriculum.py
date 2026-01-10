
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
        print("🐧 Adding Linux System Challenges (Bandit Style)...")

        def upsert(title, desc, cat, lvl, flag, hint, pts, diff="Easy"):
            cursor.execute("""
                INSERT INTO challenges (title, description, category, difficulty, level, flag, hint, points)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
                ON DUPLICATE KEY UPDATE
                    description = VALUES(description),
                    difficulty = VALUES(difficulty),
                    flag = VALUES(flag),
                    hint = VALUES(hint),
                    points = VALUES(points)
            """, (title, desc, cat, diff, lvl, flag, hint, pts))
            print(f"✅ [{cat}] L{lvl}: {title}")

        C = "Linux"

        # Level 1
        upsert("Readme", "The password for the next level is stored in a file called readme located in the home directory.", C, 1, "flag{linux_readme_done}", "Use the 'cat' command.", 100, "Easy")
        
        # Level 2
        upsert("Dashed Filename", "The password is in a file located in the home directory named - (dash).", C, 2, "flag{dash_filename_redirection}", "Use ./- or cat < -", 100, "Easy")

        # Level 3
        upsert("Spaces in Name", "The password is in a file called 'spaces in this filename' located in the home directory.", C, 3, "flag{spaces_are_tricky}", "Use quotes or backslash escape.", 200, "Easy")

        # Level 4
        upsert("Hidden File", "The password is in a hidden file in the 'inhere' directory.", C, 4, "flag{hidden_dot_files}", "ls -la is your friend.", 200, "Easy")

        # Level 5
        upsert("Human Readable", "The password is in the 'inhere' directory, but only in the only human-readable file.", C, 5, "flag{file_type_human_readable}", "Use 'file *' command.", 300, "Medium")

        # Level 6
        upsert("Find by Size", "The password is in 'inhere' directory, size is exactly 1033 bytes.", C, 6, "flag{find_size_1033}", "find . -size 1033c", 300, "Medium")

        # Level 7
        upsert("Find by Owner", "The file is somewhere on the system, owned by user 'bandit7' and group 'bandit6', size 33 bytes.", C, 7, "flag{find_user_group_size}", "find / -user bandit7 -group bandit6", 400, "Hard")

        # Level 8
        upsert("Grep Master", "The password is in 'data.txt' next to the word 'millionth'.", C, 8, "flag{grep_is_powerful_tool}", "grep 'millionth' data.txt", 500, "Hard")

        # Level 9
        upsert("Base64 Decode", "The password in 'data.txt' is encoded multiple times to avoid detection.", C, 9, "flag{base64_multistep_decode}", "base64 -d", 500, "Hard")

        conn.commit()
        print("\n🎉 Linux Curriculum added successfully!")
        cursor.close()
        conn.close()

    except Exception as e:
        print(f"❌ Error adding challenges: {e}")

if __name__ == "__main__":
    add_linux_challenges()
