from flask import Flask, request, render_template_string

app = Flask(__name__)

LOGIN_PAGE = """
<html>
    <head><title>Admin Login</title></head>
    <body style="font-family: sans-serif; display: flex; justify-content: center; align-items: center; height: 100vh; background: #1a1a1a; color: #eee;">
        <div style="background: #333; padding: 40px; border-radius: 8px; box-shadow: 0 4px 15px rgba(0,0,0,0.5);">
            <h2 style="margin-top: 0;">Restricted Management Panel</h2>
            <form method="POST">
                <div style="margin-bottom: 15px;">
                    <label>Username:</label><br>
                    <input type="text" name="username" style="width: 100%; padding: 8px; margin-top: 5px;">
                </div>
                <div style="margin-bottom: 20px;">
                    <label>Password:</label><br>
                    <input type="password" name="password" style="width: 100%; padding: 8px; margin-top: 5px;">
                </div>
                <button type="submit" style="width: 100%; padding: 10px; background: #ff0044; color: white; border: none; cursor: pointer; border-radius: 4px; font-weight: bold;">LOGIN</button>
            </form>
            {% if error %}
                <p style="color: #ff4444; margin-top: 15px;">{{ error }}</p>
            {% endif %}
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
            return "<h1>ADMIN PANEL</h1><p>Welcome. Your flag is: <b>FLAG{ADMIN_ADMIN_AUTH_BYPASS}</b></p>"
        else:
            return render_template_string(LOGIN_PAGE, error="Invalid credentials. Check user manual (v1.0 default: admin/admin)")
    return render_template_string(LOGIN_PAGE)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5105)
