from flask import Flask, request, render_template_string, redirect, url_for, session
import sqlite3
import os

app = Flask(__name__)
app.secret_key = 'super_secret_key_sqli'

def get_db():
    conn = sqlite3.connect('database.db')
    conn.row_factory = sqlite3.Row
    return conn

@app.route('/', methods=['GET', 'POST'])
def login():
    error = None
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']
        
        conn = get_db()
        cursor = conn.cursor()
        
        # VULNERABLE: Direct string concatenation
        query = f"SELECT * FROM users WHERE username = '{username}' AND password = '{password}'"
        print(f"Executing: {query}")
        
        try:
            cursor.execute(query)
            user = cursor.fetchone()
            
            if user:
                session['user_id'] = user['id']
                session['username'] = user['username']
                return redirect(url_for('dashboard'))
            else:
                error = "Invalid Credentials"
        except Exception as e:
            error = f"Database Error: {e}"
            
    return render_template_string('''
    <!doctype html>
    <html>
    <head><title>Login</title>
    <style>
        body { font-family: sans-serif; padding: 50px; background: #222; color: #fff; }
        .box { background: #333; padding: 20px; border-radius: 8px; max-width: 400px; margin: 0 auto; }
        input { width: 100%; padding: 10px; margin: 10px 0; background: #444; border: 1px solid #555; color: white; }
        button { width: 100%; padding: 10px; background: #00bcd4; border: none; font-weight: bold; cursor: pointer; }
        .error { color: #ff6b6b; margin-bottom: 10px; }
    </style>
    </head>
    <body>
        <div class="box">
            <h2>Secure Login v1.0</h2>
            {% if error %}<div class="error">{{ error }}</div>{% endif %}
            <form method="post">
                <input type="text" name="username" placeholder="Username">
                <input type="password" name="password" placeholder="Password">
                <button type="submit">Login</button>
            </form>
            <!-- Hint: usage of single quotes might be interesting -->
        </div>
    </body>
    </html>
    ''', error=error)

@app.route('/dashboard')
def dashboard():
    if 'user_id' not in session:
        return redirect(url_for('login'))
    
    conn = get_db()
    cursor = conn.cursor()
    # If they are admin, give them the flag
    # But wait, the objective is to extract the flag from the database via Union injection
    # or just login as admin.
    
    flag = "Welcome! You are logged in."
    if session['username'] == 'admin':
        flag = "FLAG{SQL_Inj3ct10n_Byp4ss_M4st3r}"
    
    return render_template_string('''
    <!doctype html>
    <html>
    <head><title>Dashboard</title>
    <style>body { font-family: sans-serif; padding: 50px; background: #222; color: #fff; text-align: center; }</style>
    </head>
    <body>
        <h1>Dashboard</h1>
        <p>Logged in as: <strong>{{ session['username'] }}</strong></p>
        <div style="background: #333; padding: 20px; display: inline-block; border-radius: 8px; margin-top: 20px;">
            {{ flag }}
        </div>
        <p><a href="/" style="color: #00bcd4;">Logout</a></p>
    </body>
    </html>
    ''', session=session, flag=flag)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=80)
