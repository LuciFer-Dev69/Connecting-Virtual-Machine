"""
Script to delete all Red Team challenges
"""
import mysql.connector
import os
from dotenv import load_dotenv

load_dotenv()

# Database connection (matching db.py)
db_config = {
    'host': os.getenv('DB_HOST', 'localhost'),
    'user': os.getenv('DB_USER', 'user'),
    'password': os.getenv('DB_PASSWORD', 'userpassword'),
    'database': os.getenv('DB_NAME', 'chakraDB')
}

def delete_red_team_challenges():
    print("🚀 Starting Red Team Challenge Deletion...")
    
    try:
        conn = mysql.connector.connect(**db_config)
        cursor = conn.cursor()
        
        # Disable foreign key checks to ensure clean deletion
        cursor.execute("SET FOREIGN_KEY_CHECKS=0;")
        
        # 1. Identify Red Team Roadmap
        cursor.execute("SELECT id FROM roadmaps WHERE name LIKE '%Red Team%'")
        roadmaps = cursor.fetchall()
        roadmap_ids = [r[0] for r in roadmaps]
        
        if not roadmap_ids:
            print("ℹ️ No Red Team roadmaps found.")
        else:
            print(f"📋 Found Red Team Roadmap IDs: {roadmap_ids}")
            
            # 2. Find challenges associated with these roadmaps
            placeholders = ', '.join(['%s'] * len(roadmap_ids))
            query = f"SELECT challenge_id FROM roadmap_challenges WHERE roadmap_id IN ({placeholders})"
            cursor.execute(query, roadmap_ids)
            challenges = cursor.fetchall()
            challenge_ids = [c[0] for c in challenges]
            
            if challenge_ids:
                print(f"🗑️ Deleting {len(challenge_ids)} challenges from roadmaps...")
                
                # Delete from roadmap_challenges mapping
                cursor.execute(f"DELETE FROM roadmap_challenges WHERE roadmap_id IN ({placeholders})", roadmap_ids)
                
                # Delete from challenges table
                c_placeholders = ', '.join(['%s'] * len(challenge_ids))
                cursor.execute(f"DELETE FROM challenges WHERE id IN ({c_placeholders})", challenge_ids)
                
                # Also delete associated user progress/submissions
                cursor.execute(f"DELETE FROM user_progress WHERE challenge_id IN ({c_placeholders})", challenge_ids)
                cursor.execute(f"DELETE FROM submissions WHERE challenge_id IN ({c_placeholders})", challenge_ids)
                
                print(f"✅ Successfully deleted {len(challenge_ids)} challenges.")
            else:
                print("ℹ️ No challenges found in Red Team roadmaps.")

        # 3. Re-enable foreign key checks
        cursor.execute("SET FOREIGN_KEY_CHECKS=1;")
        
        conn.commit()
        conn.close()
        print("\n✨ Red Team Deletion Finished!")
        
    except Exception as e:
        print(f"❌ Database error: {e}")

if __name__ == "__main__":
    delete_red_team_challenges()
