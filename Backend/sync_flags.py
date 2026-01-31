from db import get_db_connection
import json

def sync_easy_challenges():
    print("Syncing Easy Red Team challenges in main challenges table...")
    conn = get_db_connection()
    cursor = conn.cursor()

    # We update based on title
    updates = [
        ("Service Enumeration", "FLAG{SYSTEM_EN_101_DISCOVERED}"),
        ("Version Detection", "FLAG{VERSION_42_DETECTED_0x41}"),
        ("Robots.txt Information Leak", "FLAG{ROBOTS_TXT_LEAK_CONFIRMED}"),
        ("Hidden Directory Discovery", "FLAG{G0BUSTER_DIR_HUNT_SUCCESS}"),
        ("Default Credentials Abuse", "FLAG{ADMIN_ADMIN_AUTH_BYPASS}")
    ]

    for title, flag in updates:
        cursor.execute("UPDATE challenges SET flag = %s WHERE title = %s", (flag, title))
        print(f"Updated {title} flag.")

    conn.commit()
    conn.close()
    print("Sync complete.")

if __name__ == "__main__":
    sync_easy_challenges()
