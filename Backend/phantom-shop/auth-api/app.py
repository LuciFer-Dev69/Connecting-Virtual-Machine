from flask import Flask, request, jsonify
import json

app = Flask(__name__)

# Simulated user database
users = {
    "101": {"username": "user1", "role": "user", "email": "user1@phantom.com"},
    "102": {"username": "user2", "role": "user", "email": "user2@phantom.com"},
    "999": {"username": "admin", "role": "admin", "email": "admin@phantom.com", "secret": "FLAG{phantom_idor_auth_2024}"}
}

@app.route('/')
def index():
    return '''
    <html>
    <head>
        <title>Phantom API</title>
        <style>
            body { font-family: monospace; background: #0a0a0a; color: #00ff00; padding: 50px; }
            h1 { color: #ff0066; text-shadow: 0 0 10px #ff0066; }
            code { background: #1a1a1a; padding: 5px; display: block; margin: 10px 0; }
        </style>
    </head>
    <body>
        <h1>⚡ PHANTOM API</h1>
        <p>User Management API v1.0</p>
        <h3>Endpoints:</h3>
        <code>GET /api/user/&lt;id&gt; - Get user profile</code>
        <code>GET /api/users - List all users (admin only)</code>
        <p>Try accessing user profiles!</p>
    </body>
    </html>
    '''

@app.route('/api/user/<user_id>')
def get_user(user_id):
    # VULNERABLE: No authorization check (IDOR)
    user = users.get(user_id)
    
    if user:
        return jsonify(user)
    else:
        return jsonify({"error": "User not found"}), 404

@app.route('/api/users')
def list_users():
    # VULNERABLE: No admin check
    return jsonify({"hint": "Try user IDs: 101, 102, 999"})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=3002, debug=False)
