import mysql.connector
import os
import json
from dotenv import load_dotenv

load_dotenv()

db_config = {
    "host": os.getenv("DB_HOST", "localhost"),
    "user": os.getenv("DB_USER", "root"),
    "password": os.getenv("DB_PASSWORD", ""),
    "database": os.getenv("DB_NAME", "chakraDB")
}

def update_and_seed():
    try:
        conn = mysql.connector.connect(**db_config)
        cursor = conn.cursor()

        print("🔧 Updating Database Schema...")
        
        # 1. Update ENUM to include 'Insane'
        try:
            cursor.execute("ALTER TABLE real_life_challenges MODIFY COLUMN difficulty ENUM('Easy', 'Medium', 'Hard', 'Insane')")
            print("✅ Difficulty ENUM updated.")
        except Exception as e:
            print(f"⚠️ ENUM update info: {e}")

        # 2. Add 'walkthrough' column
        try:
            cursor.execute("ALTER TABLE real_life_challenges ADD COLUMN walkthrough TEXT")
            print("✅ 'walkthrough' column added.")
        except Exception as e:
            print(f"⚠️ Column match info: {e}")

        # 3. Clear existing Real Life challenges to ensure clean slate for these 4 specific ones
        cursor.execute("SET FOREIGN_KEY_CHECKS = 0")
        cursor.execute("TRUNCATE TABLE real_life_challenges")
        cursor.execute("SET FOREIGN_KEY_CHECKS = 1")
        print("🧹 Cleared old scenarios.")

        # 4. Define the 4 Insane Scenarios
        challenges = [
            {
                "title": "Operation Blackout",
                "description": "A state-backed APT has infiltrated the national power grid's SCADA controller. You must reverse-engineer the Modbus TCP packets and stabilize the grid.",
                "difficulty": "Insane",
                "category": "Critical Infrastructure",
                "points": 500,
                "flag": "SIGNATURE{grid_restart_0x77}",
                "walkthrough": """## Operation Blackout: Tactical Grid Restoration

### Step 1: Network Reconnaissance
Deploy the Field Terminal (PwnBox) and scan for target services.
`nmap -sV -p 502 target.local`
*Note: Modbus TCP (Port 502) is identified as the primary vector.*

### Step 2: System Intelligence
Identify the mapping of PLC registers used by the attacker.
`cd /home/chakra/scada`
`cat plc_map.txt`

### Step 3: Web-Terminal Correlation
Open the **Access Industrial Console** (Web View). Observe the reactor temperatures and grid load. The `plc_map.txt` identifies Register `0x10` as the override.

### Step 4: Neutralizing Attacker Loop
Send a custom Modbus payload to write Register `0x10` with the stabilization value `0x77`.
`python3 -c "from pymodbus.client import ModbusTcpClient; c = ModbusTcpClient('target.local'); c.write_register(16, 119)"`

### Step 5: Verification
The PLC registers will update, revealing the encrypted signature in the terminal logs.
Look for: `SIGNATURE{grid_restart_0x77}`
"""
            },
            {
                "title": "The Heist",
                "description": "Azure Bank's SWIFT gateway has a logic flaw. You must bypass the 3-person authorization requirement by exploiting a race condition.",
                "difficulty": "Insane",
                "category": "Financial Fraud",
                "points": 500,
                "flag": "SIGNATURE{swift_race_bypass_vault}",
                "walkthrough": """## The Heist
**OPERATIVE_PROTOCOL: REAL-LIFE-2 // NEURAL_LINK: STABLE // SECTOR: Financial Fraud**

### Tactical Steps:

**Step 1: Intercept Configuration**
Open the **Access Industrial Console** and locate the **Wire Transfer Authorization** panel.
Configure your local Burp Suite proxy to intercept traffic.

**Step 2: Request Interception**
Click **AUTHORIZE & SIGN** on the web view.
In Burp Suite, catch the `POST /api/v1/swift/approve` request.

**Step 3: Exploiting the Race Condition**
Send the intercepted request to **Turbo Intruder**.
Use the following Python snippet to send 3 simultaneous requests:

```python
def queueRequests(target, wordlists):
    engine = RequestEngine(endpoint=target.endpoint, concurrentConnections=10)
    for i in range(3):
        engine.queue(target.req, i)
```
*Goal: Force the counter to increment from 0 to 3 before the database locks the entry.*

**Step 4: Terminal Verification**
Access the workstation's local database logs to confirm the vault bypass was successful.
`cd /home/chakra/banking`
`cat vault_keys.db`

**Step 5: Submit Signature**
Copy the signature revealed in the DB: `SIGNATURE{swift_race_bypass_vault}`
"""
            },
            {
                "title": "Chain Reaction",
                "description": "Poison the build artifact of a flagship application to include a backdoor by bypassing SonarQube analysis.",
                "difficulty": "Insane",
                "category": "Supply Chain",
                "points": 500,
                "flag": "SIGNATURE{jenkins_poison_pipeline}",
                "walkthrough": """## Chain Reaction: Pipeline Poisoning Tactical Guide

### Step 1: Infrastructure Analysis
Connect to the CI/CD controller via terminal.
`cd /home/chakra/global-tech`
`ls -la`

### Step 2: Identifying Pre-Build Hooks
The `jenkins.config.xml` file specifies pre-compilation scripts. 
`cat jenkins.config.xml`
Identify `install_shell.sh` as the target for injection.

### Step 3: Web Visualization
Open the **Access Industrial Console**. View the live Jenkins build pipeline. Note the "Unknown hook detected" warning in the logs.

### Step 4: Shellcode Injection
Execute the poisoning script locally to simulate the backdoor injection into the production binary.
`./install_shell.sh --inject-backdoor --target build_server`

### Step 5: Flag Retrieval
Check the post-build logs in the terminal for the injection signature.
`cat /var/log/jenkins/build_output.log | grep SIGNATURE`
Submit: `SIGNATURE{jenkins_poison_pipeline}`
"""
            },
            {
                "title": "Patient Zero",
                "description": "St. Mary's Hospital database has been encrypted. Reverse engineer the encryption key to decrypt the records.",
                "difficulty": "Insane",
                "category": "Malware Analysis",
                "points": 500,
                "flag": "SIGNATURE{ransomware_reversal_key_01}",
                "walkthrough": """## Patient Zero: Ransomware Reversal Guide

### Step 1: Evidence Collection
Navigate to the infected workstation's logs.
`cd /home/chakra/st-marys`
`cat encryption_log.txt`

### Step 2: Ghidra Analysis (Simulated)
The log reveals the encryption ID is `DARK_SIDE_2.0`. 
Based on the Ghidra reverse engineering analysis (Step Id: 133), identify that the keygen uses `System.currentTimeMillis()` as a seed.

### Step 3: Web-Portal Interaction
Open the **Access Industrial Console** to view the ransomware lockout portal. Note the BTC Address and Countdown Timer.

### Step 4: Bruteforce Decryption
Run the tactical key-reversal script in the terminal using the timestamp from `encryption_log.txt`.
`python3 /usr/bin/ransomware-reversal --log encryption_log.txt --force`

### Step 5: Final Handover
The script will output the recovery signature: `SIGNATURE{ransomware_reversal_key_01}`. 
Submit this signature to restore the hospital operations.
"""
            }
        ]

        # 5. Insert Challenges
        print("🌱 Seeding 4 Insane Scenarios...")
        sql = """
            INSERT INTO real_life_challenges 
            (title, description, difficulty, category, points, flag, walkthrough, hints) 
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
        """
        
        for ch in challenges:
            cursor.execute(sql, (
                ch['title'], 
                ch['description'], 
                ch['difficulty'], 
                ch['category'], 
                ch['points'], 
                ch['flag'], 
                ch['walkthrough'],
                json.dumps(["Classified Information", "Clearance Level Required"]) # Placeholder hints
            ))
            print(f"   > Added: {ch['title']}")

        conn.commit()
        conn.close()
        print("✨ Database update complete.")

    except Exception as e:
        print(f"❌ Error: {e}")

if __name__ == "__main__":
    update_and_seed()
