
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

def audit_challenges():
    try:
        conn = mysql.connector.connect(**db_config)
        cursor = conn.cursor()
        
        categories = ['Web', 'Cryptography', 'Forensics', 'Reverse Engineering', 'AI', 'Linux', 'Misc']
        levels = [1, 2, 3, 4, 5]
        
        print("🔍 Auditing Chakra CTF Challenges...\n")
        
        all_ok = True
        for cat in categories:
            print(f"--- Category: {cat} ---")
            for lvl in levels:
                cursor.execute("SELECT COUNT(*) FROM challenges WHERE category = %s AND level = %s", (cat, lvl))
                count = cursor.fetchone()[0]
                status = "✅" if count > 0 else "❌ EMPTY"
                if count == 0: all_ok = False
                print(f"Level {lvl}: {count} challenges {status}")
            print()
            
        if all_ok:
            print("🚀 Everything looks good! No empty levels found.")
        else:
            print("⚠️ Some levels are missing challenges. Action required.")
            
        cursor.close()
        conn.close()
    except Exception as e:
        print(f"❌ Error: {e}")

if __name__ == "__main__":
    audit_challenges()
