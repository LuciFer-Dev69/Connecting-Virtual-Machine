
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

def check_challenges():
    try:
        conn = mysql.connector.connect(**db_config)
        cursor = conn.cursor()
        
        cursor.execute("SELECT id, title, category, difficulty, level FROM challenges ORDER BY category, level")
        rows = cursor.fetchall()
        
        print(f"{'ID':<5} | {'Category':<20} | {'Level':<5} | {'Difficulty':<10} | {'Title'}")
        print("-" * 70)
        for row in rows:
             print(f"{row[0]:<5} | {row[2]:<20} | {row[4]:<5} | {row[3]:<10} | {row[1]}")
             
        conn.close()
    except Exception as e:
        print(e)

if __name__ == "__main__":
    check_challenges()
