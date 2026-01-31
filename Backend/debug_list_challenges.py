from db import get_db_connection

def find_red_team_to_remove():
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    
    difficulties = ['Easy', 'Medium', 'Hard']
    for diff in difficulties:
        cursor.execute("SELECT id, title FROM challenges WHERE difficulty = %s", (diff,))
        results = cursor.fetchall()
        print(f"\n{diff} Challenges ({len(results)} total):")
        for r in results:
            print(f"  ID: {r['id']} - {r['title']}")
            
    cursor.close()
    conn.close()

if __name__ == "__main__":
    find_red_team_to_remove()
