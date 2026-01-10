import mysql.connector
import os
import json
from dotenv import load_dotenv

load_dotenv()

db_config = {
    "host": os.getenv("DB_HOST", "localhost"),
    "user": os.getenv("DB_USER", "root"),
    "password": os.getenv("DB_PASSWORD", ""),
    "database": os.getenv("DB_NAME", "chakraDB")
}

def add_challenges():
    try:
        conn = mysql.connector.connect(**db_config)
        cursor = conn.cursor()

        challenges = [
            {
                "title": "Cookie Monster XSS",
                "description": "A vulnerable blog allows you to post comments. The application fails to sanitize user input, leading to a Reflected XSS vulnerability. Your goal is to find the flag hidden in the Admin's session cookie.",
                "difficulty": "Easy",
                "category": "XSS",
                "points": 100,
                "flag": "FLAG{XSS_Refl3ct3d_C00k13_St34l3r}",
                "docker_image": "chakra_xss_challenge",
                "port": 80,
                "hints": json.dumps([
                    {"text": "The search bar and comment section reflect your input directly.", "cost": 10},
                    {"text": "Try injecting a standard payload like <script>alert(1)</script>", "cost": 20},
                    {"text": "The flag is in document.cookie. Try alert(document.cookie)", "cost": 30}
                ])
            },
            {
                "title": "SQLi Login Bypass",
                "description": "The login form is vulnerable to SQL Injection. You can either bypass the authentication to log in as any user, or login specifically as the 'admin' to retrieve the flag.",
                "difficulty": "Medium",
                "category": "SQL Injection",
                "points": 150,
                "flag": "FLAG{SQL_Inj3ct10n_Byp4ss_M4st3r}",
                "docker_image": "chakra_sqli_challenge",
                "port": 80,
                "hints": json.dumps([
                    {"text": "The query uses string concatenation: WHERE username = '$user'", "cost": 10},
                    {"text": "Try to manipulate the query logic using ' OR 1=1 --", "cost": 20}
                ])
            },
            {
                "title": "IDOR Profile Peeking",
                "description": "The application allows users to view profiles via an ID parameter. However, it fails to verify if the requesting user is authorized to view other profiles. Find the Admin's profile (ID 105) to get the flag.",
                "difficulty": "Easy",
                "category": "Authorization",
                "points": 100,
                "flag": "FLAG{IDOR_Pr0f1l3_Peeking_Succ3ss}",
                "docker_image": "chakra_auth_challenge",
                "port": 80,
                "hints": json.dumps([
                    {"text": "Look at the URL query parameters (e.g., ?id=101)", "cost": 10},
                    {"text": "The admin user usually has a predictable ID or is mentioned in the code.", "cost": 20},
                    {"text": "Try changing the ID to 105", "cost": 30}
                ])
            }
        ]

        print("Adding Real-Life Challenges...")
        
        for ch in challenges:
            cursor.execute("""
                INSERT INTO real_life_challenges (title, description, difficulty, category, points, flag, docker_image, port, hints)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
            """, (ch['title'], ch['description'], ch['difficulty'], ch['category'], ch['points'], ch['flag'], ch['docker_image'], ch['port'], ch['hints']))
            print(f"✅ Added: {ch['title']}")

        conn.commit()
        conn.close()
        print("Done!")

    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    add_challenges()
