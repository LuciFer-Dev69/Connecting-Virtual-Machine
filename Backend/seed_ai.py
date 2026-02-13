from db import get_db_connection

def seed_ai_challenges():
    challenges = [
        {
            "id": "ai_lab_1",
            "title": "AI Lab Mod 1: Neural Vault (AstraNova)",
            "description": "The AstraNova Secure AI is guarding a confidential flag. Interrogate the neural core to find the authorized override phrase and extract the secret.",
            "category": "AI",
            "difficulty": "Easy",
            "points": 100,
            "flag": "FLAG{prompt_injection_master}",
            "author": "AstraNova"
        },
        {
            "id": "ai_lab_2",
            "title": "AI Lab Mod 2: Neural Drift",
            "description": "Exploit semantic drift via analogies to extract restricted information.",
            "category": "AI",
            "difficulty": "Easy",
            "points": 150,
            "flag": "SIGNATURE{ai_link_02_drift_logic}",
            "author": "SentinelAI"
        },
        {
            "id": "ai_lab_3",
            "title": "AI Lab Mod 3: Role Poisoning",
            "description": "Infect the AI context with an unauthorized role (Auditor/Admin).",
            "category": "AI",
            "difficulty": "Medium",
            "points": 250,
            "flag": "SIGNATURE{ai_link_03_role_poison}",
            "author": "SentinelAI"
        },
        {
            "id": "ai_lab_4",
            "title": "AI Lab Mod 4: Directive Smuggling",
            "description": "Smuggle instructions inside formatted logic blocks to bypass filters.",
            "category": "AI",
            "difficulty": "Hard",
            "points": 400,
            "flag": "SIGNATURE{ai_link_04_smuggle_cmd}",
            "author": "SentinelAI"
        }
    ]

    conn = get_db_connection()
    cursor = conn.cursor()

    for c in challenges:
        # Check if already exists (by title)
        cursor.execute("SELECT id FROM challenges WHERE title = %s", (c['title'],))
        if cursor.fetchone():
            print(f"Skipping {c['title']}, already exists.")
            continue
            
        cursor.execute("""
            INSERT INTO challenges (title, description, category, difficulty, points, flag)
            VALUES (%s, %s, %s, %s, %s, %s)
        """, (c['title'], c['description'], c['category'], c['difficulty'], c['points'], c['flag']))
        print(f"Seeded {c['title']}")

    conn.commit()
    conn.close()
    print("AI Seeding complete.")

if __name__ == "__main__":
    seed_ai_challenges()
