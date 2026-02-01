from flask import Flask, request, render_template_string

app = Flask(__name__)

STYLE = """
<style>
    body { background: #0f1218; color: #fff; font-family: 'Inter', system-ui, sans-serif; display: flex; justify-content: center; align-items: center; height: 100vh; margin: 0; }
    .login-card { background: #1a1f26; padding: 40px; border-radius: 12px; border: 1px solid #30363d; width: 100%; max-width: 400px; box-shadow: 0 8px 24px rgba(0,0,0,0.5); }
    h2 { margin: 0 0 24px; font-weight: 600; font-size: 24px; text-align: center; }
    label { display: block; margin-bottom: 8px; font-size: 14px; color: #8b949e; }
    input { width: 100%; padding: 12px; background: #0d1117; border: 1px solid #30363d; border-radius: 6px; color: #fff; margin-bottom: 20px; box-sizing: border-box; }
    input:focus { border-color: #58a6ff; outline: none; box-shadow: 0 0 0 3px rgba(88,166,255,0.1); }
    button { width: 100%; padding: 12px; background: #238636; color: #fff; border: none; border-radius: 6px; font-weight: 600; cursor: pointer; transition: background 0.2s; }
    button:hover { background: #2ea043; }
    .error { color: #f85149; background: rgba(248,81,73,0.1); padding: 12px; border-radius: 6px; font-size: 14px; margin-bottom: 20px; text-align: center; border: 1px solid rgba(248,81,73,0.4); }
</style>
"""

LOGIN_PAGE = """
<html>
    <head>{STYLE}</head>
    <body>
        <div class="login-card">
            <h2>Management Console</h2>
            {% if error %}
                <div class="error">{{ error }}</div>
            {% endif %}
            <form method="POST">
                <label>Username</label>
                <input type="text" name="username" placeholder="Enter username" autocomplete="off" required>
                <label>Password</label>
                <input type="password" name="password" placeholder="Enter password" autocomplete="off" required>
                <button type="submit">Authentication Required</button>
            </form>
            <p style="text-align:center; font-size:12px; color:#484f58; margin-top:20px;">
                Secured by PhanCorp Shield. <br>Documentation v1.0 available on intranet.
            </p>
        </div>
    </body>
</html>
"""

@app.route('/', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        username = request.form.get('username')
        password = request.form.get('password')
        if username == 'admin' and password == 'admin':
            return '<div style="background:#0a0c10;color:#58a6ff;padding:50px;font-family:monospace;height:100vh;text-align:center;">' \
                   '<h1 style="color:#238636">SYSTEMS UNLOCKED</h1>' \
                   '<p>Root access granted. Administrative privileges active.</p>' \
                   '<div style="background:#161b22;padding:20px;border-radius:8px;border:1px solid #30363d;display:inline-block;margin-top:20px;">' \
                   'KEY_DECODED: FLAG{ADMIN_ADMIN_AUTH_BYPASS}</div></div>'
        else:
            return render_template_string(LOGIN_PAGE, error="Authentication failure: Invalid credentials.")
    return render_template_string(LOGIN_PAGE)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5105)
