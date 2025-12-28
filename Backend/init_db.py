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

def init_db():
    # Connect w/o database to create it if needed
    try:
        conn = mysql.connector.connect(
            host=db_config["host"],
            user=db_config["user"],
            password=db_config["password"]
        )
        cursor = conn.cursor()
        cursor.execute(f"CREATE DATABASE IF NOT EXISTS {db_config['database']}")
        print(f"Database {db_config['database']} check/creation successful.")
    except Exception as e:
        print(f"Failed to connect/create database: {e}")
        return

    try:
        conn = mysql.connector.connect(**db_config)
        cursor = conn.cursor()

        # Users table
        cursor.execute("""
        CREATE TABLE IF NOT EXISTS users (
            user_id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            email VARCHAR(255) UNIQUE NOT NULL,
            password VARCHAR(255) NOT NULL,
            role ENUM('user', 'admin') DEFAULT 'user',
            progress INT DEFAULT 0,
            profilePic VARCHAR(255),
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
        """)

        # Challenges table
        cursor.execute("""
        CREATE TABLE IF NOT EXISTS challenges (
            id INT AUTO_INCREMENT PRIMARY KEY,
            title VARCHAR(255) NOT NULL,
            description TEXT,
            category ENUM('Web', 'Cryptography', 'Forensics', 'Reverse', 'Reverse Engineering', 'AI', 'Misc'),
            difficulty ENUM('Easy', 'Medium', 'Hard'),
            level INT,
            flag VARCHAR(255),
            hint TEXT,
            points INT DEFAULT 10
        )
        """)

        # Submissions table
        cursor.execute("""
        CREATE TABLE IF NOT EXISTS submissions (
            submission_id INT AUTO_INCREMENT PRIMARY KEY,
            user_id INT,
            challenge_id INT,
            submitted_flag VARCHAR(255),
            is_correct BOOLEAN,
            submission_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(user_id),
            FOREIGN KEY (challenge_id) REFERENCES challenges(id)
        )
        """)

        # User stats table
        cursor.execute("""
        CREATE TABLE IF NOT EXISTS user_stats (
            user_id INT PRIMARY KEY,
            beginner INT DEFAULT 0,
            intermediate INT DEFAULT 0,
            advanced INT DEFAULT 0,
            total_challenges INT DEFAULT 0,
            FOREIGN KEY (user_id) REFERENCES users(user_id)
        )
        """)

        # Hint usage table
        cursor.execute("""
        CREATE TABLE IF NOT EXISTS hint_usage (
            hint_id INT AUTO_INCREMENT PRIMARY KEY,
            user_id INT,
            challenge_id INT,
            used_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(user_id),
            FOREIGN KEY (challenge_id) REFERENCES challenges(id)
        )
        """)
        
        print("Tables initialized.")
        conn.close()

    except Exception as e:
        print(f"Error initializing tables: {e}")

if __name__ == "__main__":
    init_db()
