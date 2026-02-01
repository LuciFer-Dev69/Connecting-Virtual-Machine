from flask import Flask, abort, render_template_string

app = Flask(__name__)

STYLE = """
<style>
    body { background: #121212; color: #e0e0e0; font-family: 'Courier New', Courier, monospace; margin: 0; display: flex; }
    .sidebar { width: 250px; background: #1a1a1a; padding: 20px; border-right: 1px solid #333; height: 100vh; }
    .main { flex: 1; padding: 40px; }
    .tag { color: #ffab00; border: 1px solid #ffab0040; padding: 2px 8px; font-size: 11px; border-radius: 4px; }
    h1 { color: #fff; border-bottom: 2px solid #333; padding-bottom: 10px; }
    .folder { color: #64b5f6; margin-bottom: 10px; cursor: pointer; }
    .folder:hover { text-decoration: underline; }
</style>
"""

HTML = f"""
<html>
    <head>{STYLE}</head>
    <body>
        <div class="sidebar">
            <h3>Explorer</h3>
            <div class="folder">📁 src/</div>
            <div class="folder">📁 public/</div>
            <div class="folder">📁 tests/</div>
            <div class="folder" style="color:#555">📁 config/ <span class="tag">SECURE</span></div>
        </div>
        <div class="main">
            <h1>Developer Sandbox v2.0-beta</h1>
            <p>Running in <b>Debug Mode</b>. Deployment logs are being streamed to /dev-api (Forbidden).</p>
            <div style="background:#1e1e1e; padding:20px; border-radius:8px; border:1px solid #333;">
                <p style="color:#888">// Initialize production environment</p>
                <p>const APP_ENV = 'production';</p>
                <p>const ENABLE_LOGGING = true;</p>
            </div>
        </div>
    </body>
</html>
"""

@app.route('/')
def index():
    return render_template_string(HTML)

@app.route('/backup/config.bak')
@app.route('/.env')
@app.route('/config.php.bak')
def backup():
    return "FLAG{G0BUSTER_DIR_HUNT_SUCCESS}"

@app.route('/backup')
@app.route('/backup/')
@app.route('/config')
def backup_dir():
    return "Forbidden", 403

@app.route('/dev-api')
def dev_api():
    return "API logs: [INFO] Connection established... [ERROR] Unauthorized access attempt from 10.0.0.5", 200

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5104)
