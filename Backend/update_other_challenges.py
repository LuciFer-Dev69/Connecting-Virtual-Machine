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

        # --- CRYPTOGRAPHY ---
        print("Updating Cryptography...")
        # Level 1
        cursor.execute("""
            UPDATE challenges 
            SET title = 'The Caesar Shift', 
                description = 'The Roman emperor left a message. It seems to be shifted by 13 characters.', 
                flag = 'flag{rot13_master}',
                hint = 'Try a ROT13 decoder.'
            WHERE category = 'Cryptography' AND level = 1
        """)
        # Level 2
        cursor.execute("""
            UPDATE challenges 
            SET title = 'Base64 Basics', 
                description = 'This string looks like random characters, but it ends with an equals sign. What could it be?', 
                flag = 'flag{base64_encoding_is_easy}',
                hint = 'The string ends with =. This is characteristic of Base64.'
            WHERE category = 'Cryptography' AND level = 2
        """)
        # Level 3
        cursor.execute("""
            UPDATE challenges 
            SET title = 'The Vigenère Cipher', 
                description = 'A polyalphabetic substitution. You found a note saying the key is CHAKRA.', 
                flag = 'flag{v1g3n3r3_c1ph3r}',
                hint = 'Use an online Vigenère decoder with the key CHAKRA.'
            WHERE category = 'Cryptography' AND level = 3
        """)

        # --- FORENSICS ---
        print("Updating Forensics...")
        # Level 1
        cursor.execute("""
            UPDATE challenges 
            SET title = 'Metadata Inspector', 
                description = 'This photo was taken at a secret location. Can you find the hidden metadata?', 
                flag = 'flag{exif_data_revealed}',
                hint = 'Look for EXIF data or image properties.'
            WHERE category = 'Forensics' AND level = 1
        """)
        # Level 2
        cursor.execute("""
            UPDATE challenges 
            SET title = 'Hex Viewer', 
                description = 'A file is more than just its extension. Look at the raw bytes.', 
                flag = 'flag{hidden_in_bytes}',
                hint = 'Inspect the file content in a Hex Editor.'
            WHERE category = 'Forensics' AND level = 2
        """)
        # Level 3
        cursor.execute("""
            UPDATE challenges 
            SET title = 'Corrupted Header', 
                description = "This PNG file won't open. The magic bytes are missing!", 
                flag = 'flag{magic_bytes_restored}',
                hint = 'PNG files start with 89 50 4E 47.'
            WHERE category = 'Forensics' AND level = 3
        """)

        # --- REVERSE ENGINEERING ---
        print("Updating Reverse Engineering...")
        # Level 1
        cursor.execute("""
            UPDATE challenges 
            SET title = 'Hardcoded Secrets', 
                description = 'This login form checks the password directly in the browser. Can you find it?', 
                flag = 'flag{simple_js_check}',
                hint = 'Inspect the JavaScript source code.',
                category = 'Reverse Engineering'
            WHERE (category = 'Reverse' OR category = 'Reverse Engineering') AND level = 1
        """)
        # Level 2
        cursor.execute("""
            UPDATE challenges 
            SET title = 'String Assembly', 
                description = 'The secret string is built at runtime. Analyze the logic.', 
                flag = 'flag{string_assembly_master}',
                hint = 'Trace the string concatenation logic.',
                category = 'Reverse Engineering'
            WHERE (category = 'Reverse' OR category = 'Reverse Engineering') AND level = 2
        """)
        # Level 3
        cursor.execute("""
            UPDATE challenges 
            SET title = 'Keygen Me', 
                description = 'Reverse the license verification algorithm to generate a valid key.', 
                flag = 'flag{keygen_algorithm_cracked}',
                hint = 'The sum of ASCII values must equal 300.',
                category = 'Reverse Engineering'
            WHERE (category = 'Reverse' OR category = 'Reverse Engineering') AND level = 3
        """)

        conn.commit()
        print("✅ All challenges updated successfully!")

        cursor.close()
        conn.close()

    except Exception as e:
        print(f"❌ Error updating challenges: {e}")

if __name__ == "__main__":
    update_challenges()
