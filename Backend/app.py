from gevent import monkey
monkey.patch_all()

import os
import time
from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_socketio import SocketIO, emit
from dotenv import load_dotenv
from mysql.connector import pooling

# Load environment variables
load_dotenv()

import pwnbox_manager
import ssh_manager

# Initialize App
app = Flask(__name__)
socketio = SocketIO(app, cors_allowed_origins="*")
CORS(app, resources={r"/api/*": {"origins": "*"}}, allow_headers=["Content-Type", "Authorization"])

# ==================== DATABASE CONFIG ====================
import db

def get_db_connection():
    return db.get_db_connection()


# ==================== SYSTEM ROUTES ====================
@app.route('/api/health')
def health_check():
    try:
        conn = get_db_connection()
        conn.close()
        return jsonify({"status": "healthy", "database": "connected"}), 200
    except Exception as e:
        return jsonify({"status": "unhealthy", "error": str(e)}), 500

@app.route('/api/status')
def system_status():
    return jsonify({
        "version": "2.1.0",
        "platform": "Chakra View Pro",
        "engine": "Founder Mode Active"
    }), 200

# ==================== BLUEPRINTS ====================
from routes.auth import auth_bp
from routes.challenges import challenges_bp
from routes.user import user_bp
from routes.admin import admin_bp
from routes.real_life_challenges import real_life_bp
from routes.ai_system import ai_bp
from routes.vulnerabilities import vuln_bp

app.register_blueprint(auth_bp, url_prefix='/api/auth')
app.register_blueprint(challenges_bp, url_prefix='/api/challenges')
app.register_blueprint(user_bp, url_prefix='/api/user')
app.register_blueprint(admin_bp, url_prefix='/api/admin')
app.register_blueprint(real_life_bp, url_prefix='/api/real-life')
app.register_blueprint(ai_bp, url_prefix='/api/ai')
app.register_blueprint(vuln_bp, url_prefix='/api/vuln')

# ==================== PWNBOX SPWNING ====================
@app.route('/api/pwnbox/spawn', methods=['POST'])
def spawn_pwnbox():
    data = request.get_json()
    user_id = data.get('user_id')
    if not user_id: return jsonify({"error": "User ID required"}), 400
    try:
        info = pwnbox_manager.spawn_pwnbox(user_id)
        return jsonify(info), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/pwnbox/stop', methods=['POST'])
def stop_pwnbox():
    data = request.get_json()
    user_id = data.get('user_id')
    success = pwnbox_manager.stop_pwnbox(user_id)
    return jsonify({"success": success}), 200 if success else 404

@app.route('/api/pwnbox/restart', methods=['POST'])
def restart_pwnbox():
    """Atomic restart: stop current PwnBox and spawn a new one"""
    data = request.get_json()
    user_id = data.get('user_id')
    if not user_id: 
        return jsonify({"error": "User ID required"}), 400
    
    try:
        info = pwnbox_manager.restart_pwnbox(user_id)
        return jsonify(info), 200
    except Exception as e:
        print(f"❌ Restart failed for user {user_id}: {e}")
        return jsonify({"error": str(e)}), 500

@app.route('/api/pwnbox/status', methods=['POST'])
def pwnbox_status():
    """Check PwnBox container status and SSH readiness"""
    data = request.get_json()
    user_id = data.get('user_id')
    if not user_id:
        return jsonify({"error": "User ID required"}), 400
    
    try:
        status_info = pwnbox_manager.get_pwnbox_status(user_id)
        return jsonify(status_info), 200
    except Exception as e:
        return jsonify({"error": str(e), "running": False}), 200

# ==================== WEBTERMINAL SOCKETS ====================
@socketio.on('ssh_connect')
def handle_ssh_connect(data):
    # Retrieve connection info from data
    host = data.get("host", os.getenv("SSH_HOST", "localhost"))
    port = int(data.get("port", 22))
    username = data.get("username", "chakra")
    password = data.get("password", "user")
    
    print(f"📡 Neural Uplink: {username}@{host}:{port}")
    success = ssh_manager.create_session(socketio, request.sid, host, username, password, port)
    
    if success is True:
        emit('ssh_output', f"\r\n\033[1;32m[+] Neural Uplink Established: {username}@chakraview\033[0m\r\n")
    else:
        emit('ssh_error', f"Uplink Failure: {success}")

@socketio.on('ssh_input')
def handle_ssh_input(data):
    session = ssh_manager.get_session(request.sid)
    if session: session.write(data)

@socketio.on('disconnect')
def handle_disconnect():
    ssh_manager.close_session(request.sid)

if __name__ == '__main__':
    # Initial reconciliation of PwnBoxes
    pwnbox_manager.reconcile_pwnboxes()
    socketio.run(app, host='0.0.0.0', port=5000, debug=True, use_reloader=False)
