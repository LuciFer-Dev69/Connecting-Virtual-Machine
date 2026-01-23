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
            difficulty ENUM('Easy', 'Medium', 'Hard', 'Insane'),
            flag VARCHAR(255),
            hint TEXT,
            points INT DEFAULT 10,
            image_url VARCHAR(255),
            is_locked BOOLEAN DEFAULT FALSE
        )
        """)

        # Update challenges table schema
        try:
            cursor.execute("ALTER TABLE challenges MODIFY COLUMN difficulty ENUM('Easy', 'Medium', 'Hard', 'Insane')")
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

        cursor.execute("INSERT INTO roadmaps (name, type) VALUES (%s, %s)", ("Red Team (Tool-Only)", "Red Team"))
        roadmap_id = cursor.lastrowid
        
        cursor.execute("INSERT INTO roadmaps (name, type) VALUES (%s, %s)", ("Blue Team Roadmap", "Blue Team"))
        blue_roadmap_id = cursor.lastrowid
        
        print(f"🚩 Roadmaps initialized. Red Roadmap ID: {roadmap_id}")

        tool_challenges = [
            # Easy Challenges
            ("Service Enumeration", "Skill: Recon\nObjective: Identify open ports and running services on the target system.", "nmap", "Easy", 100, "FLAG{SERVICE_ENUM_NMAP}", "Use nmap -sV -p-", "/images/challenges/nmap_recon.png"),
            ("Version Detection", "Skill: Enumeration\nObjective: Discover service versions and identify outdated software.", "nmap", "Easy", 100, "FLAG{VERSION_DETECT_LAB}", "Check the -sV flag.", "/images/challenges/version_detect.png"),
            ("Robots.txt Information Leak", "Skill: Passive Recon\nObjective: Find hidden or sensitive paths exposed via robots.txt.", "recon", "Easy", 100, "FLAG{ROBOTS_TXT_LEAK}", "Look for /robots.txt on the server.", "/images/challenges/robots_leak.png"),
            ("Hidden Directory Discovery", "Skill: Web Recon\nObjective: Enumerate hidden directories such as /admin, /backup, or /test.", "gobuster", "Easy", 100, "FLAG{DIR_DISCO_GOBUSTER}", "Use a common directory wordlist.", "/images/challenges/dir_disco.png"),
            ("Default Credentials Abuse", "Skill: Authentication\nObjective: Gain access using weak or default login credentials.", "auth", "Easy", 100, "FLAG{DEFAULT_CREDS_PWNED}", "Try admin:admin or admin:password.", "/images/challenges/default_creds.png"),
            ("Basic Reflected XSS", "Skill: Client-Side Exploitation\nObjective: Inject a simple JavaScript payload to confirm XSS.", "xss", "Easy", 100, "FLAG{REFLECTED_XSS_SUCCESS}", "Try <script>alert(1)</script>.", "/images/challenges/xss_payload.png"),
            ("File Upload Misconfiguration", "Skill: Filter Bypass\nObjective: Upload a restricted file using a basic extension bypass.", "upload", "Easy", 100, "FLAG{FILE_UPLOAD_BYPASS}", "Try .phtml or .php5 extensions.", "https://images.unsplash.com/photo-1563986768609-322da13575f3?q=80&w=400&auto=format&fit=crop"),
            ("Local File Inclusion (LFI)", "Skill: Input Validation\nObjective: Read sensitive local files from the server.", "lfi", "Easy", 100, "FLAG{LFI_ETC_PASSWD}", "Try ../../../../etc/passwd.", "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?q=80&w=400&auto=format&fit=crop"),
            ("Weak Password Cracking", "Skill: Password Attacks\nObjective: Crack a weak password hash using a small wordlist.", "john", "Easy", 100, "FLAG{PW_CRACK_HASH}", "Use rockyou.txt wordlist.", "https://images.unsplash.com/photo-1633265487748-dfe65582f348?q=80&w=400&auto=format&fit=crop"),
            ("Business Logic Abuse", "Skill: Logic Flaws\nObjective: Manipulate application logic to gain unauthorized advantage.", "logic", "Easy", 100, "FLAG{LOGIC_ABUSE_VULN}", "Check if you can change item quantities in the cart.", "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=400&auto=format&fit=crop"),
            
            # Medium Challenges (Frontend-Focused)
            ("DOM-Based XSS", "Skill: Client-Side Exploitation\nObjective: Find a sink that executes user-controlled data.", "xss", "Medium", 250, "FLAG{DOM_XSS_DETECTED}", "Look for innerHTML or eval() in the source code.", "https://images.unsplash.com/photo-1510511459019-5dda7724fd87?q=80&w=400&auto=format&fit=crop"),
            ("Stored XSS via Client Storage", "Skill: Client-Side Exploitation\nObjective: Store a malicious payload in LocalStorage that triggers on load.", "xss", "Medium", 250, "FLAG{STORED_CLIENT_XSS}", "Check how the app retrieves data from LocalStorage.", "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=400&auto=format&fit=crop"),
            ("Client-Side Authentication Bypass", "Skill: Authentication\nObjective: Manipulate frontend logic to access a restricted page.", "auth", "Medium", 250, "FLAG{CLIENT_AUTH_BYPASS}", "Look for isAdmin checks in the source code.", "https://images.unsplash.com/photo-1509822929063-6b6cfc9b42f2?q=80&w=400&auto=format&fit=crop"),
            ("LocalStorage Token Manipulation", "Skill: Session Management\nObjective: Modify a JWT or session token in LocalStorage to escalate privileges.", "auth", "Medium", 250, "FLAG{JWT_MANIPULATION_PWN}", "Decode the token at jwt.io and see what you can change.", "https://images.unsplash.com/photo-1614064641938-3bbee52942c7?q=80&w=400&auto=format&fit=crop"),
            ("Hidden Admin UI Exposure", "Skill: Enumeration\nObjective: Identify and access hidden UI elements meant only for administrators.", "recon", "Medium", 250, "FLAG{HIDDEN_ADMIN_UI_FOUND}", "Check CSS classes like display: none or hidden routes.", "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=400&auto=format&fit=crop"),
            ("JavaScript Source Code Disclosure", "Skill: Information Gathering\nObjective: Extract sensitive information like API keys from JS bundles.", "recon", "Medium", 250, "FLAG{JS_SOURCE_LEAK}", "Use browser dev tools to prettify the JS bundle.", "https://images.unsplash.com/photo-1516116216624-53e697fedbea?q=80&w=400&auto=format&fit=crop"),
            ("Frontend Parameter Tampering", "Skill: Input Validation\nObjective: Manipulate frontend parameters for unauthorized advantage.", "logic", "Medium", 250, "FLAG{FRONTEND_PARAM_TAMPER}", "Check hidden input fields or JS variables used in requests.", "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=400&auto=format&fit=crop"),
            ("Weak Client-Side Validation Bypass", "Skill: Input Validation\nObjective: Bypass length or regex checks on the client side.", "upload", "Medium", 250, "FLAG{VALIDATION_BYPASS_SUCCESS}", "Disable JavaScript or use Interceptor tools to modify the request.", "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=400&auto=format&fit=crop"),
            ("Clickjacking UI Abuse", "Skill: Client-Side Exploitation\nObjective: Use transparent overlays to trick users into action.", "xss", "Medium", 250, "FLAG{CLICKJACKING_UI_EXPLOIT}", "Check for X-Frame-Options headers.", "https://images.unsplash.com/photo-1563986768609-322da13575f3?q=80&w=400&auto=format&fit=crop"),
            ("Open Redirect via JavaScript Logic", "Skill: Client-Side Exploitation\nObjective: Manipulate a callback URL to redirect to an external site.", "xss", "Medium", 250, "FLAG{OPEN_REDIRECT_JS}", "Look for window.location being set from a URL parameter.", "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?q=80&w=400&auto=format&fit=crop"),
            
            # Hard Challenges (Advanced Frontend)
            ("Advanced DOM XSS Chain", "Skill: Client-Side Exploitation\nObjective: Chain multiple DOM sinks (location.hash -> innerHTML -> setTimeout) to execute complex JS payloads.", "xss", "Hard", 500, "FLAG{COMPLEX_DOM_CHAIN_XSS}", "Follow the data flow through the utility functions in the source.", "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?q=80&w=400&auto=format&fit=crop"),
            ("JavaScript Prototype Pollution", "Skill: Object Manipulation\nObjective: Exploit insecure object merges to pollute the global Object prototype and achieve frontend impact.", "logic", "Hard", 500, "FLAG{PROTOTYPE_POLLUTION_PWNED}", "Check how nested JSON properties are handled during object merges.", "https://images.unsplash.com/photo-1516116216624-53e697fedbea?q=80&w=400&auto=format&fit=crop"),
            ("Client-Side Role Escalation", "Skill: State Manipulation\nObjective: Manipulate the client-side state machine to gain administrative access without server verification.", "auth", "Hard", 500, "FLAG{FRONTEND_ADMIN_ACCESS}", "Inspect the global state object or Redux store in the developer console.", "https://images.unsplash.com/photo-1633265486232-442488821f52?q=80&w=400&auto=format&fit=crop"),
            ("OAuth Token Leakage (Frontend Flow)", "Skill: OAuth Security\nObjective: Identify improper OAuth response handling that leaks tokens via Referer headers or URL fragments.", "auth", "Hard", 500, "FLAG{OAUTH_TOKEN_LEAKED}", "Monitor outbound requests and URL fragments after a login simulation.", "https://images.unsplash.com/photo-1614064641938-3bbee52942c7?q=80&w=400&auto=format&fit=crop"),
            ("CSP Bypass via Script Gadgets", "Skill: CSP Exploitation\nObjective: Use allowed third-party libraries (e.g., old jQuery/Angular) to bypass strict CSP policies via gadgets.", "xss", "Hard", 500, "FLAG{CSP_BYPASS_GADGET}", "Search for libraries in the bundle known to have script execution 'gadget' patterns.", "https://images.unsplash.com/photo-1558489080-7e6a47321e25?q=80&w=400&auto=format&fit=crop"),
            ("Web Cache Poisoning (Client-Side Impact)", "Skill: Cache Exploitation\nObjective: Manipulate unkeyed inputs to force the CDN to cache malicious responses impacting the frontend.", "logic", "Hard", 500, "FLAG{CACHE_POISONED_FRONTEND}", "Look for headers like X-Forwarded-Host that are reflected in the HTML source.", "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=400&auto=format&fit=crop"),
            ("Single-Page App Route Abuse", "Skill: SPA Recon\nObjective: Access hidden routes and lazy-loaded components by manually triggering internal navigation.", "recon", "Hard", 500, "FLAG{HIDDEN_ROUTE_DISCOVERED}", "Reverse engineer the JS router bundle or check the manifest.json file.", "https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?q=80&w=400&auto=format&fit=crop"),
            ("Cross-Window Messaging Exploit (postMessage)", "Skill: Cross-Origin Attacks\nObjective: Send malicious payloads to windows or iframes that insecurely listen for events without origin validation.", "xss", "Hard", 500, "FLAG{POSTMESSAGE_EXPLOIT_P1}", "Try window.postMessage() from the console to jump between origin contexts.", "https://images.unsplash.com/photo-1510511459019-5dda7724fd87?q=80&w=400&auto=format&fit=crop"),
            ("Supply Chain Injection (Third-Party Script Abuse)", "Skill: Supply Chain Security\nObjective: Identify and exploit a compromised third-party script to exfiltrate sensitive frontend data.", "logic", "Hard", 500, "FLAG{THIRD_PARTY_INJECTION}", "Scan for scripts sending input field data to external unknown domains.", "https://images.unsplash.com/photo-1551033406-611cf9a28f67?q=80&w=400&auto=format&fit=crop"),
            ("Race Condition in Client-Side Logic", "Skill: Async Exploitation\nObjective: Exploit timing issues in asynchronous JS calls to bypass business logic or double-submit.", "logic", "Hard", 500, "FLAG{RACE_CONDITION_WINNER}", "Use a script to fire multiple concurrent requests to a state-changing function.", "https://images.unsplash.com/photo-1543286386-713bcd53b371?q=80&w=400&auto=format&fit=crop")
        ]

        for idx, (title, desc, cat, diff, pts, flag, hint, img) in enumerate(tool_challenges):
            cursor.execute(
                "INSERT INTO challenges (title, description, difficulty, category, points, flag, hint, image_url) VALUES (%s, %s, %s, %s, %s, %s, %s, %s)",
                (title, desc, diff, cat, pts, flag, hint, img)
            )
            challenge_id = cursor.lastrowid
            
            # Map to roadmap
            cursor.execute(
                "INSERT INTO roadmap_challenges (roadmap_id, challenge_id, order_index) VALUES (%s, %s, %s)",
                (roadmap_id, challenge_id, idx)
            )

        conn.commit()
        conn.close()
        print("Tables initialized/updated successfully.")

    except Exception as e:
        print(f"Error initializing tables: {e}")

if __name__ == "__main__":
    init_db()
