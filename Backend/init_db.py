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
            role VARCHAR(50) DEFAULT 'user',
            progress INT DEFAULT 0,
            profilePic VARCHAR(255),
            is_suspended BOOLEAN DEFAULT FALSE,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
        """)

        # Roles table
        cursor.execute("""
        CREATE TABLE IF NOT EXISTS roles (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(50) UNIQUE NOT NULL
        )
        """)
        cursor.execute("INSERT IGNORE INTO roles (name) VALUES ('Super Admin'), ('Admin'), ('Moderator')")

        # Update users table to add suspension if missing
        try:
            cursor.execute("ALTER TABLE users ADD COLUMN is_suspended BOOLEAN DEFAULT FALSE")
        except:
            pass # Column might already exist

        # Challenges table
        cursor.execute("""
        CREATE TABLE IF NOT EXISTS challenges (
            id INT AUTO_INCREMENT PRIMARY KEY,
            title VARCHAR(255) NOT NULL,
            description TEXT,
            category VARCHAR(50),
            difficulty ENUM('Easy', 'Medium', 'Hard'),
            level INT,
            flag VARCHAR(255),
            hint TEXT,
            points INT DEFAULT 10,
            is_locked BOOLEAN DEFAULT FALSE
        )
        """)

        # Update challenges table to add lock if missing
        try:
            cursor.execute("ALTER TABLE challenges ADD COLUMN is_locked BOOLEAN DEFAULT FALSE")
        except:
            pass

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

        # Real-Life Web Challenges Table
        cursor.execute("""
        CREATE TABLE IF NOT EXISTS real_life_challenges (
            id INT AUTO_INCREMENT PRIMARY KEY,
            title VARCHAR(255) NOT NULL,
            description TEXT,
            difficulty ENUM('Easy', 'Medium', 'Hard'),
            category VARCHAR(50),
            points INT,
            flag VARCHAR(255),
            docker_image VARCHAR(255),
            port INT,
            hints JSON,
            is_locked BOOLEAN DEFAULT FALSE,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
        """)

        # Real-Life Challenge Sessions Table
        cursor.execute("""
        CREATE TABLE IF NOT EXISTS real_life_challenge_sessions (
            id INT AUTO_INCREMENT PRIMARY KEY,
            user_id INT,
            challenge_id INT,
            status ENUM('active', 'completed', 'stopped') DEFAULT 'active',
            container_id VARCHAR(255),
            assigned_port INT,
            started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            completed_at TIMESTAMP NULL,
            FOREIGN KEY (user_id) REFERENCES users(user_id),
            FOREIGN KEY (challenge_id) REFERENCES real_life_challenges(id)
        )
        """)

        # Update real_life_challenges table to add lock if missing
        try:
            cursor.execute("ALTER TABLE real_life_challenges ADD COLUMN is_locked BOOLEAN DEFAULT FALSE")
        except:
            pass

        # Roadmaps table
        cursor.execute("""
        CREATE TABLE IF NOT EXISTS roadmaps (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            type ENUM('Red Team', 'Blue Team'),
            is_locked BOOLEAN DEFAULT FALSE,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
        """)

        # Roadmap Challenges mapping
        cursor.execute("""
        CREATE TABLE IF NOT EXISTS roadmap_challenges (
            id INT AUTO_INCREMENT PRIMARY KEY,
            roadmap_id INT,
            challenge_id INT,
            order_index INT DEFAULT 0,
            FOREIGN KEY (roadmap_id) REFERENCES roadmaps(id) ON DELETE CASCADE,
            FOREIGN KEY (challenge_id) REFERENCES challenges(id) ON DELETE CASCADE
        )
        """)

        # Audit Logs table
        cursor.execute("""
        CREATE TABLE IF NOT EXISTS audit_logs (
            id INT AUTO_INCREMENT PRIMARY KEY,
            admin_id INT,
            action VARCHAR(255) NOT NULL,
            target_type VARCHAR(50),
            target_id INT,
            old_value TEXT,
            new_value TEXT,
            ip_address VARCHAR(45),
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (admin_id) REFERENCES users(user_id)
        )
        """)

        # Ensure a Super Admin exists for the demo
        import bcrypt
        admin_email = "admin@chakra.com"
        admin_password = "Admin@1234"
        hashed_password = bcrypt.hashpw(admin_password.encode('utf-8'), bcrypt.gensalt())
        
        cursor.execute("SELECT user_id FROM users WHERE email = %s", (admin_email,))
        if not cursor.fetchone():
            cursor.execute(
                "INSERT INTO users (name, email, password, role) VALUES (%s, %s, %s, %s)",
                ("Root Admin", admin_email, hashed_password, "admin")
            )
            print(f"✅ Default Admin Created: {admin_email} / {admin_password}")

        conn.commit()
        conn.close()
        print("Tables initialized/updated successfully.")

    except Exception as e:
        print(f"Error initializing tables: {e}")

if __name__ == "__main__":
    init_db()
