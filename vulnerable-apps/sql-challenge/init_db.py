import sqlite3

def init_db():
    conn = sqlite3.connect('database.db')
    cursor = conn.cursor()
    
    cursor.execute('DROP TABLE IF EXISTS users')
    cursor.execute('CREATE TABLE users (id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT, password TEXT)')
    
    # Store the flag as the admin's password? Or separate? 
    # Let's put flag in admin's password so if they dump the table they see it.
    # Also if they login as admin they get it.
    cursor.execute("INSERT INTO users (username, password) VALUES ('admin', 'FLAG{SQL_Inj3ct10n_Byp4ss_M4st3r}')")
    cursor.execute("INSERT INTO users (username, password) VALUES ('guest', 'guest')")
    
    conn.commit()
    conn.close()
    print("Database initialized.")

if __name__ == '__main__':
    init_db()
