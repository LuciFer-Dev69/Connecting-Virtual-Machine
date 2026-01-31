from db import get_db_connection

def list_compact():
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT id, title, difficulty FROM challenges WHERE difficulty IN ('Easy', 'Medium', 'Hard') ORDER BY difficulty, id")
    for r in cursor.fetchall():
        print(f"{r['difficulty']}: {r['id']} - {r['title']}")
    cursor.close()
    conn.close()

if __name__ == "__main__":
    list_compact()
