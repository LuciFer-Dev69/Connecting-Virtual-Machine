import mysql.connector
import bcrypt
import os
from dotenv import load_dotenv

load_dotenv()

# Database connection
db_config = {
    "host": os.getenv("DB_HOST", "localhost"),
    "user": os.getenv("DB_USER", "root"),
    "password": os.getenv("DB_PASSWORD", ""),
    "database": os.getenv("DB_NAME", "chakraDB")
}

try:
    conn = mysql.connector.connect(**db_config)
    cursor = conn.cursor()

    email = "admin@chakraview.com"
    password = "Admin@12345"
    name = "Admin User"
    
    # Hash password
    hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())

    # Check if admin exists
    cursor.execute("SELECT user_id FROM users WHERE email = %s", (email,))
    if cursor.fetchone():
        print("Admin user already exists. Updating password...")
        cursor.execute(
            "UPDATE users SET password = %s, role = 'admin' WHERE email = %s",
            (hashed_password, email)
        )
    else:
        print("Creating new admin user...")
        cursor.execute(
            "INSERT INTO users (name, email, password, role, progress) VALUES (%s, %s, %s, 'admin', 0)",
            (name, email, hashed_password)
        )

    conn.commit()
    print(f"Admin user configured successfully.\nEmail: {email}\nPassword: {password}")

    cursor.close()
    conn.close()

except Exception as e:
    print(f"Error: {e}")
