from flask import Flask, request, jsonify, render_template_string
import sqlite3
import os

app = Flask(__name__)

# Initialize database
def init_db():
    conn = sqlite3.connect('phantom.db')
    c = conn.cursor()
    c.execute('DROP TABLE IF EXISTS users')
    c.execute('CREATE TABLE users (id INTEGER PRIMARY KEY, username TEXT, password TEXT, role TEXT)')
    c.execute("INSERT INTO users VALUES (1, 'admin', 'Sup3rS3cr3t!', 'admin')")
    c.execute("INSERT INTO users VALUES (2, 'guest', 'guest123', 'user')")
    c.execute("INSERT INTO users VALUES (3, 'phantom', 'FLAG{phantom_sqli_bypass_2024}', 'admin')")
    conn.commit()
    conn.close()

if not os.path.exists('phantom.db'):
    init_db()

HTML = '''
<!DOCTYPE html>
<html>
<head>
    <title>Phantom Shop - Login</title>
    <style>
        body { font-family: monospace; background: #0a0a0a; color: #00ff00; padding: 50px; }
        .container { max-width: 400px; margin: 0 auto; border: 2px solid #00ff00; padding: 30px; }
        h1 { color: #ff0066; text-shadow: 0 0 10px #ff0066; }
        input { width: 100%; padding: 10px; margin: 10px 0; background: #1a1a1a; border: 1px solid #00ff00; color: #00ff00; }
        button { width: 100%; padding: 10px; background: #00ff00; color: #000; border: none; font-weight: bold; cursor: pointer; }
        .error { color: #ff0066; margin-top: 10px; }
        .success { color: #00ff00; margin-top: 10px; }
    </style>
</head>
<body>
    <div class="container">
        <h1>⚡ PHANTOM SHOP</h1>
        <p>Secure Login Portal v1.0</p>
        <form method="POST" action="/login">
            <input type="text" name="username" placeholder="Username" required>
            <input type="password" name="password" placeholder="Password" required>
            <button type="submit">LOGIN</button>
        </form>
        {% if error %}
        <div class="error">{{ error }}</div>
        {% endif %}
    </div>
</body>
</html>
'''

@app.route('/')
def index():
    return render_template_string(HTML)

@app.route('/login', methods=['POST'])
def login():
    username = request.form.get('username', '')
    password = request.form.get('password', '')
    
    conn = sqlite3.connect('phantom.db')
    c = conn.cursor()
    
    # VULNERABLE: SQL Injection
    query = f"SELECT * FROM users WHERE username = '{username}' AND password = '{password}'"
    print(f"[DEBUG] Query: {query}")
    
    try:
        c.execute(query)
        user = c.fetchone()
        
        if user:
            if user[3] == 'admin':
                return jsonify({
                    "success": True,
                    "message": "Admin access granted!",
                    "flag": user[2],
                    "hint": "The password field contains the flag"
                })
            else:
                return jsonify({"success": True, "message": f"Welcome {user[1]}!"})
        else:
            return render_template_string(HTML, error="Invalid credentials")
    except Exception as e:
        return render_template_string(HTML, error=f"Database error: {str(e)}")

@app.route('/api/users')
def api_users():
    # Hidden endpoint for enumeration
    return jsonify({"hint": "Try SQL injection on the login form"})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=3000, debug=False)
