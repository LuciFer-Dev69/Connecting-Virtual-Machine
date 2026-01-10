import sqlite3
import os
from flask import Flask, request, render_template_string, redirect, url_for

app = Flask(__name__)
DB_PATH = 'sqli_lab.db'

def init_db():
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    c.execute('DROP TABLE IF EXISTS users')
    c.execute('CREATE TABLE users (id INTEGER PRIMARY KEY, username TEXT, password TEXT, role TEXT)')
    c.execute("INSERT INTO users (username, password, role) VALUES ('admin', 'P@ssw0rd123_Complex_99', 'administrator')")
    c.execute("INSERT INTO users (username, password, role) VALUES ('guest', 'guest123', 'user')")
    conn.commit()
    conn.close()

if not os.path.exists(DB_PATH):
    init_db()

HTML_TEMPLATE = """
<!DOCTYPE html>
<html>
<head>
    <title>Phantom Login - SQL Injection Lab</title>
    <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: #0a0a0a; color: #e0e0e0; display: flex; justify-content: center; align-items: center; height: 100vh; margin: 0; }
        .container { background: #111; padding: 40px; border-radius: 12px; border: 1px solid #333; box-shadow: 0 10px 30px rgba(0,0,0,0.5); width: 400px; text-align: center; }
        h2 { color: #00ff00; margin-bottom: 30px; font-weight: 800; letter-spacing: 1px; }
        .input-group { margin-bottom: 20px; text-align: left; }
        label { display: block; margin-bottom: 8px; font-size: 14px; color: #888; }
        input { width: 100%; padding: 12px; background: #1a1a1a; border: 1px solid #333; border-radius: 6px; color: #fff; box-sizing: border-box; }
        input:focus { border-color: #00ff00; outline: none; }
        button { background: #00ff00; color: #000; border: none; padding: 14px; border-radius: 6px; font-weight: bold; cursor: pointer; width: 100%; font-size: 16px; margin-top: 10px; transition: 0.2s; }
        button:hover { background: #00cc00; transform: translateY(-2px); }
        .error { margin-top: 20px; padding: 12px; border-radius: 6px; background: #441010; color: #ff6b6b; border: 1px solid #661010; font-size: 14px; }
        .success-box { background: #0a1a0a; border: 2px solid #00ff00; padding: 30px; border-radius: 12px; }
        .flag { color: #ff0066; font-size: 20px; font-weight: bold; margin-top: 20px; font-family: monospace; }
        .debug-query { margin-top: 30px; font-size: 11px; color: #444; text-align: left; background: #050505; padding: 10px; border-left: 3px solid #333; }
    </style>
</head>
<body>
    <div class="container">
        {% if logged_in %}
            <div class="success-box">
                <h2 style="color: #00ff00;">ACCESS GRANTED</h2>
                <p>Welcome back, <b>{{ user[1] }}</b>!</p>
                <p>Your Role: <span style="color: #00d4ff;">{{ user[3] }}</span></p>
                <div class="flag">🚩 FLAG{sql_injection_login_bypass}</div>
                <button onclick="window.location.href='/'" style="background: #333; color: #fff; margin-top: 30px;">Logout</button>
            </div>
        {% else %}
            <h2>PHANTOM SECURE LOGIN</h2>
            <form method="post">
                <div class="input-group">
                    <label>Username</label>
                    <input type="text" name="username" placeholder="Enter username" required>
                </div>
                <div class="input-group">
                    <label>Password</label>
                    <input type="password" name="password" placeholder="Enter password" required>
                </div>
                <button type="submit">LOGIN</button>
            </form>
            {% if error %}
                <div class="error">{{ error }}</div>
            {% endif %}
            
            {% if query %}
                <div class="debug-query">
                    <strong>Backend SQL Query:</strong><br>
                    <code>{{ query }}</code>
                </div>
            {% endif %}
        {% endif %}
    </div>
</body>
</html>
"""

@app.route('/', methods=['GET', 'POST'])
def login():
    error = None
    query = None
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']
        
        # INTENTIONAL VULNERABILITY: String formatting for SQL query
        query = f"SELECT * FROM users WHERE username = '{username}' AND password = '{password}';"
        
        try:
            conn = sqlite3.connect(DB_PATH)
            c = conn.cursor()
            c.execute(query)
            user = c.fetchone()
            conn.close()
            
            if user:
                return render_template_string(HTML_TEMPLATE, logged_in=True, user=user, query=query)
            else:
                error = "Invalid username or password."
        except Exception as e:
            error = f"Database Error: {str(e)}"
            
    return render_template_string(HTML_TEMPLATE, logged_in=False, error=error, query=query)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=7071)
