from db import get_db_connection

def remove_challenges():
    conn = get_db_connection()
    cursor = conn.cursor()
    
    # IDs to remove based on previous list
    # Easy: 6, 7, 8, 9, 10
    # Medium: 17, 18, 19, 20, 21
    # Hard: 27, 28, 29, 30, 31
    ids_to_remove = [6, 7, 8, 9, 10, 17, 18, 19, 20, 21, 27, 28, 29, 30, 31]
    
    print(f"Removing {len(ids_to_remove)} challenges...")
    
    # We need to handle foreign key constraints if any (submissions, roadmap_challenges, user_progress)
    # But those tables are probably empty or we can delete cascadingly because of the schema in init_db.py (ON DELETE CASCADE)
    
    format_strings = ','.join(['%s'] * len(ids_to_remove))
    cursor.execute(f"DELETE FROM challenges WHERE id IN ({format_strings})", tuple(ids_to_remove))
    
    print(f"Deleted {cursor.rowcount} challenges.")
    
    conn.commit()
    cursor.close()
    conn.close()

if __name__ == "__main__":
    remove_challenges()
