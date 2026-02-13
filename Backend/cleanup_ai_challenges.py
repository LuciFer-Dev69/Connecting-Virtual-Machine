from db import get_db_connection

def cleanup_ai_challenges():
    conn = get_db_connection()
    cursor = conn.cursor()
    
    print("🧹 Cleaning up AI challenges...")
    
    # We need to handle foreign keys
    cursor.execute("SET FOREIGN_KEY_CHECKS = 0")
    
    # Delete AI challenges
    cursor.execute("DELETE FROM challenges WHERE category = 'AI'")
    
    cursor.execute("SET FOREIGN_KEY_CHECKS = 1")
    
    conn.commit()
    conn.close()
    print("✅ AI challenges purged.")

if __name__ == "__main__":
    cleanup_ai_challenges()
