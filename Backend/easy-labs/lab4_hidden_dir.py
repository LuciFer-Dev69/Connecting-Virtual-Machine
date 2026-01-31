from flask import Flask, abort

app = Flask(__name__)

@app.route('/')
def index():
    return "<h1>Developer Sandbox</h1><p>Running on production environment (oops).</p>"

@app.route('/backup/config.bak')
def backup():
    return "FLAG{G0BUSTER_DIR_HUNT_SUCCESS}"

@app.route('/backup')
@app.route('/backup/')
def backup_dir():
    return "Forbidden", 403

@app.route('/admin')
@app.route('/admin/')
def admin():
    return "<h1>Under Construction</h1>", 200

@app.route('/dev-api')
def dev_api():
    return "API endpoints are private", 403

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5104)
