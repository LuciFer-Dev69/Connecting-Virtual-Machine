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

def update_challenges():
    try:
        conn = mysql.connector.connect(**db_config)
        cursor = conn.cursor()

        # Level 1: Cookie Monster
        print("Updating Level 1...")
        cursor.execute("""
            UPDATE challenges 
            SET title = 'The Cookie Monster', 
                description = 'This secure vault is only for admins. Are you an admin?', 
                flag = 'flag{cookie_monster_admin}',
                hint = 'Check your cookies. Is there a role you can change?'
            WHERE category = 'Web' AND level = 1
        """)

        # Level 2: Hidden in Plain Sight
        print("Updating Level 2...")
        cursor.execute("""
            UPDATE challenges 
            SET title = 'Hidden in Plain Sight', 
                description = 'Login to the developer portal. The password was left somewhere safe... or was it?', 
                flag = 'flag{source_code_detective}',
                hint = 'Inspect the source code of the page.'
            WHERE category = 'Web' AND level = 2
        """)

        # Level 3: Disabled Button
        print("Updating Level 3...")
        cursor.execute("""
            UPDATE challenges 
            SET title = 'The Disabled Button', 
                description = 'The download button is disabled because you are not premium. Can you click it anyway?', 
                flag = 'flag{html_hacker_pro}',
                hint = 'You can modify the HTML of the page using Developer Tools.'
            WHERE category = 'Web' AND level = 3
        """)

        conn.commit()
        print("✅ Web challenges updated successfully!")

        cursor.close()
        conn.close()

    except Exception as e:
        print(f"❌ Error updating challenges: {e}")

if __name__ == "__main__":
    update_challenges()
