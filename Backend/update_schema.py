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

def update_schema():
    try:
        conn = mysql.connector.connect(**db_config)
        cursor = conn.cursor()

        print("Updating database schema...")

        # Alter the category ENUM to include 'Reverse Engineering' and 'Misc'
        print("Adding 'Reverse Engineering' and 'Misc' to category ENUM...")
        cursor.execute("""
            ALTER TABLE challenges 
            MODIFY COLUMN category ENUM('Web', 'Cryptography', 'Forensics', 'Reverse', 'Reverse Engineering', 'AI', 'Misc', 'Linux')
        """)

        conn.commit()
        print("Schema updated successfully!")

        cursor.close()
        conn.close()

    except Exception as e:
        print(f"Error updating schema: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    update_schema()
