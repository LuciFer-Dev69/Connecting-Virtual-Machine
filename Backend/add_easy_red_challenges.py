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

def add_easy_challenges():
    try:
        conn = mysql.connector.connect(**db_config)
        cursor = conn.cursor()

        challenges = [
            {
                "title": "Service Enumeration",
                "description": "A target system is running multiple services, some on non-standard ports. Your goal is to identify all open ports and specific running services.",
                "difficulty": "Easy",
                "category": "Recon",
                "points": 100,
                "flag": "FLAG{SYSTEM_EN_101_DISCOVERED}",
                "docker_image": "chakra_pwnbox", # Runs inside pwnbox
                "port": 5101,
                "hints": json.dumps([
                    {"text": "Try a full port scan using nmap -p-", "cost": 10},
                    {"text": "Check port 5120 for interesting data.", "cost": 20}
                ])
            },
            {
                "title": "Version Detection",
                "description": "Discover service versions to identify outdated software. The target web server is running a legacy version.",
                "difficulty": "Easy",
                "category": "Enumeration",
                "points": 100,
                "flag": "FLAG{VERSION_42_DETECTED_0x41}",
                "docker_image": "chakra_pwnbox",
                "port": 5102,
                "hints": json.dumps([
                    {"text": "Use nmap with service version detection (-sV).", "cost": 10},
                    {"text": "Look at the HTTP 'Server' header using curl -I", "cost": 20}
                ])
            },
            {
                "title": "Robots.txt Information Leak",
                "description": "Find sensitive paths exposed via robots.txt. Many sites accidentally leak admin paths in their crawl-delay settings.",
                "difficulty": "Easy",
                "category": "Web Recon",
                "points": 100,
                "flag": "FLAG{ROBOTS_TXT_LEAK_CONFIRMED}",
                "docker_image": "chakra_pwnbox",
                "port": 5103,
                "hints": json.dumps([
                    {"text": "Visit /robots.txt on the target server.", "cost": 10},
                    {"text": "Follow the disallowed paths revealed in robots.txt", "cost": 20}
                ])
            },
            {
                "title": "Hidden Directory Discovery",
                "description": "Enumerate hidden directories like /admin or /backup using brute-force tools.",
                "difficulty": "Easy",
                "category": "Web Recon",
                "points": 100,
                "flag": "FLAG{G0BUSTER_DIR_HUNT_SUCCESS}",
                "docker_image": "chakra_pwnbox",
                "port": 5104,
                "hints": json.dumps([
                    {"text": "Use gobuster or dirsearch with a common wordlist.", "cost": 10},
                    {"text": "Look for .bak or .old files in discovered directories.", "cost": 20}
                ])
            },
            {
                "title": "Default Credentials Abuse",
                "description": "Gain access using weak or common login credentials. The administrator left the default settings unchanged.",
                "difficulty": "Easy",
                "category": "Authentication",
                "points": 100,
                "flag": "FLAG{ADMIN_ADMIN_AUTH_BYPASS}",
                "docker_image": "chakra_pwnbox",
                "port": 5105,
                "hints": json.dumps([
                    {"text": "Try common combinations like admin/admin or admin/password.", "cost": 10},
                    {"text": "Check the login page source or hints for hints about default creds.", "cost": 20}
                ])
            }
        ]

        print("Adding Easy Red Team Challenges (Real-Life Format)...")
        
        for ch in challenges:
            # Check if challenge exists
            cursor.execute("SELECT id FROM real_life_challenges WHERE title = %s", (ch['title'],))
            exists = cursor.fetchone()
            if exists:
                cursor.execute("""
                    UPDATE real_life_challenges 
                    SET description = %s, difficulty = %s, category = %s, points = %s, flag = %s, port = %s, hints = %s
                    WHERE id = %s
                """, (ch['description'], ch['difficulty'], ch['category'], ch['points'], ch['flag'], ch['port'], ch['hints'], exists[0]))
                print(f"🔄 Updated: {ch['title']}")
            else:
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
    add_easy_challenges()
