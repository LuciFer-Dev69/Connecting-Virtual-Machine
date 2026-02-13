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
            level INT DEFAULT 1,
            flag VARCHAR(255),
            hint TEXT,
            points INT DEFAULT 10,
            image_url VARCHAR(255),
            is_locked BOOLEAN DEFAULT FALSE
        )
        """)

        # Update challenges table schema
        try:
            cursor.execute("ALTER TABLE challenges MODIFY COLUMN difficulty ENUM('Easy', 'Medium', 'Hard')")
        except:
            pass

        # Update challenges table to add level if missing
        try:
            cursor.execute("ALTER TABLE challenges ADD COLUMN level INT DEFAULT 1")
        except:
            pass

        # Update challenges table to add image_url if missing
        try:
            cursor.execute("ALTER TABLE challenges ADD COLUMN image_url VARCHAR(255)")
        except:
            pass

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

        # Ensure category is VARCHAR(50) instead of ENUM in challenges
        try:
            cursor.execute("ALTER TABLE challenges MODIFY COLUMN category VARCHAR(50)")
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

        # User Progress table
        cursor.execute("""
        CREATE TABLE IF NOT EXISTS user_progress (
            id INT AUTO_INCREMENT PRIMARY KEY,
            user_id INT,
            roadmap_id INT,
            challenge_id INT,
            status ENUM('locked', 'unlocked', 'completed') DEFAULT 'locked',
            completed_at TIMESTAMP NULL,
            FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
            FOREIGN KEY (roadmap_id) REFERENCES roadmaps(id) ON DELETE CASCADE,
            FOREIGN KEY (challenge_id) REFERENCES challenges(id) ON DELETE CASCADE
        )
        """)

        # Flags table (separate for security)
        cursor.execute("""
        CREATE TABLE IF NOT EXISTS flags (
            id INT AUTO_INCREMENT PRIMARY KEY,
            challenge_id INT,
            flag_hash VARCHAR(255) NOT NULL,
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
        hashed_password = bcrypt.hashpw(admin_password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
        
        cursor.execute("SELECT user_id FROM users WHERE email = %s", (admin_email,))
        if not cursor.fetchone():
            print(f"👤 Creating Super Admin: {admin_email}")
            cursor.execute(
                "INSERT INTO users (name, email, password, role) VALUES (%s, %s, %s, %s)",
                ("Super Admin", admin_email, hashed_password, "Super Admin")
            )
        else:
            print(f"✅ Super Admin {admin_email} already exists. Updating password...")
            cursor.execute(
                "UPDATE users SET password = %s, role = %s WHERE email = %s",
                (hashed_password, "Super Admin", admin_email)
            )

        # Purge existing data to ensure only the requested challenges exist
        print("🧹 Purging old challenges and roadmap data...")
        cursor.execute("SET FOREIGN_KEY_CHECKS = 0")
        cursor.execute("TRUNCATE TABLE roadmap_challenges")
        cursor.execute("TRUNCATE TABLE user_progress")
        cursor.execute("DELETE FROM submissions")
        cursor.execute("DELETE FROM challenges")
        cursor.execute("DELETE FROM roadmaps")
        cursor.execute("SET FOREIGN_KEY_CHECKS = 1")

        # Red Team Roadmap and Challenges
        print("🚩 Initializing Red Team Challenges...")
        cursor.execute("INSERT INTO roadmaps (name, type) VALUES (%s, %s)", ("Red Team Roadmap", "Red Team"))
        red_roadmap_id = cursor.lastrowid
        
        red_challenges = [
            ("Exposed Backup File", "AstraNova Cyber Solutions accidentally exposed a backup file on their web server. Can you find it and retrieve the admin credentials?", "Red Team - Web", "Easy", 1, 5, "FLAG{backup_exposure_mastered}", "Check for common backup extensions like .zip, .bak, or .old on the server root.", "/assets/challenge-icons/backup.png"),
            ("Robots.txt Leak", "The robots.txt file is meant for web crawlers, but sometimes it reveals hidden administrative paths.", "Red Team - Web", "Easy", 1, 5, "FLAG{robots_never_hide_secrets}", "Always check /robots.txt during the initial recon phase.", "/assets/challenge-icons/robots.png"),
            ("SQL Injection Login Bypass", "The admin login panel seems to be concatenating user input directly into a SQL query.", "Red Team - Web", "Medium", 2, 15, "FLAG{classic_sqli_bypass}", "Try using standard SQL injection payloads like ' OR 1=1 -- in the username field.", "/assets/challenge-icons/sqli.png"),
            ("IDOR - Insecure Direct Object Reference", "The invoice system uses sequential IDs. Can you access an invoice that doesn't belong to you?", "Red Team - Web", "Medium", 2, 15, "FLAG{idor_data_exposure}", "Change the ID parameter in the URL and look for an invoice belonging to the admin.", "/assets/challenge-icons/idor.png"),
            ("Stored XSS → Admin Cookie Theft", "The contact form store messages in the database. If an admin views a malicious script, their session might be compromised.", "Red Team - Web", "Hard", 3, 30, "FLAG{persistent_xss_master}", "Inject a script that tries to exfiltrate document.cookie to an external source.", "/assets/challenge-icons/xss.png"),
            ("SSRF → Internal Service Access", "The server allows fetching external URLs. Can it be used to probe internal services on localhost?", "Red Team - Web", "Hard", 4, 30, "FLAG{ssrf_internal_breach}", "Try to fetch services running on 127.0.0.1 or localhost at common internal ports.", "/assets/challenge-icons/ssrf.png")
        ]

        for idx, (title, desc, cat, diff, lvl, pts, flag, hint, img) in enumerate(red_challenges):
            cursor.execute(
                "INSERT INTO challenges (title, description, category, difficulty, level, points, flag, hint, image_url) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)",
                (title, desc, cat, diff, lvl, pts, flag, hint, img)
            )
            challenge_id = cursor.lastrowid
            
            # Map to roadmap
            cursor.execute(
                "INSERT INTO roadmap_challenges (roadmap_id, challenge_id, order_index) VALUES (%s, %s, %s)",
                (red_roadmap_id, challenge_id, idx)
            )

        # Blue Team Roadmap and Challenges
        print("🚩 Initializing Blue Team Challenges...")
        cursor.execute("INSERT INTO roadmaps (name, type) VALUES (%s, %s)", ("Blue Team Roadmap", "Blue Team"))
        blue_roadmap_id = cursor.lastrowid

        blue_challenges = [
            ("Suspicious Log Analysis", "A series of failed login attempts have been reported. Analyze the authentication logs to identify the attacker's IP address.", "Blue Team - Defense", "Easy", 1, 5, "192.168.1.105", "Look for repeated 'Failed password' entries in /var/log/auth.log.", "/assets/challenge-icons/logs.png"),
            ("Unsecured File Permissions", "A sensitive configuration file has been found with public read permissions. Find the file and identify the exposed secret.", "Blue Team - Defense", "Easy", 1, 5, "CHAKRA_DEFENDER{config_permission_tightened}", "Check /etc/shadow or custom config files in /home/chakra/scripts/ with 'ls -l'.", "/assets/challenge-icons/shield.png"),
            ("Malicious Process Hunting", "A user reported slow system performance. Find the suspicious process consuming CPU and kill it to secure the system.", "Blue Team - Defense", "Medium", 2, 15, "CHAKRA_DEFENDER{miner_terminated_successfully}", "Use the 'ps' command to see running processes and find anything that shouldn't be there.", "/assets/challenge-icons/process.png"),
            ("Digital Forensics: Hidden Backdoor", "A hacker left a backdoor script in a temporary folder. Locate the script and retrieve the hidden flag inside it.", "Blue Team - Defense", "Hard", 3, 30, "CHAKRA_DEFENDER{forensics_backdoor_found}", "Attackers often hide scripts in /tmp or /var/tmp. Check for hidden files with 'ls -la'.", "/assets/challenge-icons/forensics.png"),
            ("Incident 47 – The Phantom Beacon", "Suspicious outbound traffic detected. Correlate firewall, proxy, and authentication logs to find the infected node and the C2 server.", "Blue Team - Digital Forensics", "Hard", 4, 30, "FLAG{192.168.1.23_cdn-security-update.com_SECRET_KEY_XOR123}", "The attacker uses a periodic beaconing pattern. Check the timestamps in firewall.log.", "/assets/challenge-icons/forensics.png")
        ]

        for idx, (title, desc, cat, diff, lvl, pts, flag, hint, img) in enumerate(blue_challenges):
            cursor.execute(
                "INSERT INTO challenges (title, description, category, difficulty, level, points, flag, hint, image_url) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)",
                (title, desc, cat, diff, lvl, pts, flag, hint, img)
            )
            challenge_id = cursor.lastrowid
            
            # Map to roadmap
            cursor.execute(
                "INSERT INTO roadmap_challenges (roadmap_id, challenge_id, order_index) VALUES (%s, %s, %s)",
                (blue_roadmap_id, challenge_id, idx)
            )

        # Real-Life Insane Scenario
        print("💀 Re-integrating Stored XSS Scenario...")
        import json
        insane_challenge = ("Stored XSS → Admin Panel → Docker Escape", "Chain a stored XSS in the ticketing system to hijack an admin session and escape to the host host via a privileged container.", "Insane", "Cloud / Container Security", 100, "FLAG{xss_to_docker_escape_privileged_root}", "astranova-ticketing.chakra.local", 5176, json.dumps(["Injection starts in the support ticket content", "The 'Run Diagnostics' feature is vulnerable to command injection"]))
        
        cursor.execute(
            "INSERT INTO real_life_challenges (title, description, difficulty, category, points, flag, docker_image, port, hints) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)",
            insane_challenge
        )


        conn.commit()
        conn.close()
        print("🚩 Red & Blue Roadmaps initialized.")

    except Exception as e:
        print(f"Error initializing tables: {e}")

if __name__ == "__main__":
    init_db()
