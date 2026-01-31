from db import get_db_connection

def list_red_team_challenges():
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    
    # Get all Red Team challenges
    cursor.execute("""
        SELECT id, title, category, difficulty, points 
        FROM challenges 
        WHERE category LIKE '%Red%' OR category LIKE '%Attack%'
        ORDER BY difficulty, title
    """)
    
    challenges = cursor.fetchall()
    
    print("\n=== RED TEAM CHALLENGES ===\n")
    
    easy = [c for c in challenges if c['difficulty'] == 'Easy']
    medium = [c for c in challenges if c['difficulty'] == 'Medium']
    hard = [c for c in challenges if c['difficulty'] == 'Hard']
    
    print(f"EASY ({len(easy)} challenges):")
    for c in easy:
        print(f"  ID: {c['id']:3d} | {c['title']:40s} | {c['category']:30s} | {c['points']} pts")
    
    print(f"\nMEDIUM ({len(medium)} challenges):")
    for c in medium:
        print(f"  ID: {c['id']:3d} | {c['title']:40s} | {c['category']:30s} | {c['points']} pts")
    
    print(f"\nHARD ({len(hard)} challenges):")
    for c in hard:
        print(f"  ID: {c['id']:3d} | {c['title']:40s} | {c['category']:30s} | {c['points']} pts")
    
    cursor.close()
    conn.close()

if __name__ == "__main__":
    list_red_team_challenges()
