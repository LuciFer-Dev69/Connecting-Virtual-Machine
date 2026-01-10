from flask import Flask, request, render_template_string, jsonify
import random

app = Flask(__name__)

# Simulating a database of user profiles
users = {
    101: {"name": "Test User", "role": "user", "bio": "Just a normal user.", "secret": "No secrets here."},
    102: {"name": "John Doe", "role": "user", "bio": "I love security.", "secret": "My password is password123"},
    105: {"name": "Admin", "role": "admin", "bio": "System Administrator", "secret": "FLAG{IDOR_Pr0f1l3_Peeking_Succ3ss}"}
}

@app.route('/')
def index():
    return render_template_string('''
    <!doctype html>
    <html>
    <head><title>User Directory</title>
    <style>body { font-family: sans-serif; padding: 40px; background: #f4f4f4; }</style>
    </head>
    <body>
        <h1>Employee Directory</h1>
        <p>Welcome! View your own profile below.</p>
        <p><a href="/profile?id=101">View My Profile (ID: 101)</a></p>
    </body>
    </html>
    ''')

@app.route('/profile')
def profile():
    user_id = request.args.get('id')
    
    if not user_id:
        return "Missing ID parameter", 400
    
    try:
        uid = int(user_id)
        user = users.get(uid)
        
        if not user:
            return "User not found", 404
            
        # VULNERABLE: No authorization check! if (current_user.id != uid) ...
        
        return render_template_string('''
        <!doctype html>
        <html>
        <head><title>Profile: {{ user.name }}</title>
        <style>
            body { font-family: sans-serif; padding: 40px; background: #eee; }
            .card { background: white; padding: 30px; border-radius: 10px; max-width: 500px; margin: 0 auto; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
            h2 { margin-top: 0; color: #333; }
            .role { display: inline-block; padding: 4px 8px; background: #ddd; border-radius: 4px; font-size: 0.8em; }
            .secret { background: #ffebee; border: 1px solid #ffcdd2; color: #c62828; padding: 10px; margin-top: 20px; border-radius: 4px; }
        </style>
        </head>
        <body>
            <div class="card">
                <h2>{{ user.name }} <span class="role">{{ user.role }}</span></h2>
                <p><strong>Bio:</strong> {{ user.bio }}</p>
                <p><strong>User ID:</strong> {{ uid }}</p>
                
                <div class="secret">
                    <strong>CONFIDENTIAL:</strong> {{ user.secret }}
                </div>
            </div>
            <p style="text-align: center;"><a href="/">Back</a></p>
        </body>
        </html>
        ''', user=user, uid=uid)
        
    except ValueError:
        return "Invalid ID", 400

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=80)
