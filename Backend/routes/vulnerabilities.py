from flask import Blueprint, request, jsonify
import subprocess
from db import get_db_connection

vuln_bp = Blueprint('vulnerabilities', __name__)

@vuln_bp.route('/robots.txt')
def robots_txt():
    return "User-agent: *\nDisallow: /api/vuln/hidden_admin_panel\n", 200, {'Content-Type': 'text/plain'}

@vuln_bp.route('/hidden_admin_panel')
def hidden_admin_panel():
    return jsonify({
        "message": "Welcome to the hidden admin panel!",
        "flag": "flag{robots_txt_revealed_admin}"
    }), 200

@vuln_bp.route('/sqli_login', methods=['POST'])
def sqli_login():
    data = request.get_json()
    username, password = data.get('username'), data.get('password')
    query = f"SELECT * FROM users WHERE name = '{username}' AND password = '{password}'"
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    try:
        cursor.execute(query)
        user = cursor.fetchone()
        if user:
            return jsonify({"message": "Login Successful", "flag": "flag{sqli_login_bypass_admin}"}), 200
        return jsonify({"error": "Invalid credentials"}), 401
    except Exception as e:
        return jsonify({"error": str(e)}), 400
    finally:
        cursor.close()
        conn.close()

@vuln_bp.route('/ping', methods=['POST'])
def vuln_ping():
    data = request.get_json()
    ip = data.get('ip')
    if not ip: return jsonify({"error": "Missing IP"}), 400
    cmd = f"ping -c 1 {ip}"
    try:
        output = subprocess.check_output(cmd, shell=True, stderr=subprocess.STDOUT)
        return jsonify({"output": output.decode()}), 200
    except subprocess.CalledProcessError as e:
        return jsonify({"output": e.output.decode(), "error": "Command failed"}), 200
