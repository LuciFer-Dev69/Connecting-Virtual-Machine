from gevent import monkey
monkey.patch_all()

from flask import Flask, request, jsonify
from flask_cors import CORS
import mysql.connector
from mysql.connector import pooling
import bcrypt
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

import ai_service
import pwnbox_manager
import ssh_manager
from flask_socketio import SocketIO, emit

app = Flask(__name__)
# Initialize SocketIO with CORS allowed
socketio = SocketIO(app, cors_allowed_origins="*")
CORS(app)

# Database connection pool
db_config = {
    "host": os.getenv("DB_HOST", "localhost"),
    "user": os.getenv("DB_USER", "root"),
    "password": os.getenv("DB_PASSWORD", ""),
    "database": os.getenv("DB_NAME", "chakraDB"),
    "pool_name": "mypool",
    "pool_size": 5
}

try:
    connection_pool = pooling.MySQLConnectionPool(**db_config)
    print("Database connection pool created successfully")
except mysql.connector.Error as err:
    print(f"Database connection failed: {err}")

def get_db_connection():
    """Get a connection from the pool"""
    return connection_pool.get_connection()

# ==================== AUTH ROUTES ====================

@app.route('/api/auth/signup', methods=['POST'])
def signup():
    try:
        data = request.get_json()
        name = data.get('name')
        email = data.get('email')
        password = data.get('password')

        if not name or not email or not password:
            return jsonify({"error": "All fields are required"}), 400

        # Validate password strength
        if len(password) < 8:
            return jsonify({"error": "Password must be at least 8 characters"}), 400
        
        if not any(c.isupper() for c in password):
            return jsonify({"error": "Password must contain uppercase letter"}), 400
        
        if not any(c.isdigit() for c in password):
            return jsonify({"error": "Password must contain a number"}), 400
        
        if not any(c in '!@#$%^&*(),.?":{}|<>' for c in password):
            return jsonify({"error": "Password must contain special character"}), 400

        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)

        # Check if email exists
        cursor.execute("SELECT user_id FROM users WHERE email = %s", (email,))
        if cursor.fetchone():
            cursor.close()
            conn.close()
            return jsonify({"error": "Email already registered"}), 409

        # Hash password
        hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())

        # Insert user
        cursor.execute(
            "INSERT INTO users (name, email, password, role, progress) VALUES (%s, %s, %s, %s, %s)",
            (name, email, hashed_password, 'user', 0)
        )
        conn.commit()
        user_id = cursor.lastrowid

        # Create user stats entry
        cursor.execute(
            "INSERT INTO user_stats (user_id, beginner, intermediate, advanced, total_challenges) VALUES (%s, 0, 0, 0, 0)",
            (user_id,)
        )
        conn.commit()

        cursor.close()
        conn.close()

        user = {
            "user_id": user_id,
            "name": name,
            "email": email,
            "role": "user",
            "progress": 0,
            "profilePic": None
        }

        return jsonify({"user": user}), 201

    except Exception as e:
        print(f"Signup error: {e}")
        return jsonify({"error": "Server error during signup"}), 500


@app.route('/api/auth/login', methods=['POST'])
def login():
    try:
        data = request.get_json()
        email = data.get('email')
        password = data.get('password')

        if not email or not password:
            return jsonify({"error": "Email and password required"}), 400

        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)

        # Find user
        cursor.execute(
            "SELECT user_id, name, email, password, role, progress, profilePic FROM users WHERE email = %s",
            (email,)
        )
        user = cursor.fetchone()

        cursor.close()
        conn.close()

        if not user:
            return jsonify({"error": "Invalid credentials"}), 401

        # Verify password
        if not bcrypt.checkpw(password.encode('utf-8'), user['password'].encode('utf-8')):
            return jsonify({"error": "Invalid credentials"}), 401

        # Remove password from response
        del user['password']

        return jsonify({"user": user}), 200

    except Exception as e:
        print(f"Login error: {e}")
        return jsonify({"error": "Server error during login"}), 500


# ==================== CHALLENGE ROUTES ====================

@app.route('/api/challenges', methods=['GET'])
def get_challenges():
    try:
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)

        cursor.execute(
            "SELECT id, title, description, category, difficulty, level FROM challenges ORDER BY level, category"
        )
        challenges = cursor.fetchall()

        cursor.close()
        conn.close()

        return jsonify(challenges), 200

    except Exception as e:
        print(f"Get challenges error: {e}")
        return jsonify({"error": "Failed to fetch challenges"}), 500


@app.route('/api/challenges/<int:challenge_id>', methods=['GET'])
def get_challenge(challenge_id):
    try:
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)

        cursor.execute(
            "SELECT id, title, description, category, difficulty, level FROM challenges WHERE id = %s",
            (challenge_id,)
        )
        challenge = cursor.fetchone()

        cursor.close()
        conn.close()

        if not challenge:
            return jsonify({"error": "Challenge not found"}), 404

        return jsonify(challenge), 200

    except Exception as e:
        print(f"Get challenge error: {e}")
        return jsonify({"error": "Failed to fetch challenge"}), 500


@app.route('/api/submit', methods=['POST'])
def submit_flag():
    try:
        data = request.get_json()
        user_id = data.get('user_id')
        challenge_id = data.get('id')
        flag = data.get('flag')

        print(f"Submit request - User: {user_id}, Challenge: {challenge_id}, Flag: {flag}")

        if not user_id or not challenge_id or not flag:
            return jsonify({"error": "Missing required fields"}), 400

        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)

        # Get challenge
        cursor.execute("SELECT flag, points, level FROM challenges WHERE id = %s", (challenge_id,))
        challenge = cursor.fetchone()

        if not challenge:
            cursor.close()
            conn.close()
            return jsonify({"error": "Challenge not found"}), 404

        is_correct = flag.strip() == challenge['flag'].strip()
        print(f"Flag comparison - Submitted: '{flag.strip()}', Expected: '{challenge['flag'].strip()}', Correct: {is_correct}")

        # Check if already completed
        cursor.execute(
            "SELECT submission_id FROM submissions WHERE user_id = %s AND challenge_id = %s AND is_correct = TRUE",
            (user_id, challenge_id)
        )
        if cursor.fetchone():
            cursor.close()
            conn.close()
            return jsonify({"result": "Already completed this challenge!"}), 200

        # Insert submission
        cursor.execute(
            "INSERT INTO submissions (user_id, challenge_id, submitted_flag, is_correct) VALUES (%s, %s, %s, %s)",
            (user_id, challenge_id, flag, is_correct)
        )
        conn.commit()

        if is_correct:
            # Update user progress
            cursor.execute("UPDATE users SET progress = progress + 5 WHERE user_id = %s", (user_id,))
            conn.commit()
            print(f"Updated progress for user {user_id}")

            # Update user stats
            stat_field = 'beginner'
            if challenge['level'] >= 4:
                stat_field = 'advanced'
            elif challenge['level'] == 3:
                stat_field = 'intermediate'

            cursor.execute(
                f"""INSERT INTO user_stats (user_id, {stat_field}, total_challenges) 
                VALUES (%s, 1, 1) 
                ON DUPLICATE KEY UPDATE {stat_field} = {stat_field} + 1, total_challenges = total_challenges + 1""",
                (user_id,)
            )
            conn.commit()

            cursor.close()
            conn.close()
            return jsonify({"result": "🎉 Correct! Well done!"}), 200
        else:
            cursor.close()
            conn.close()
            return jsonify({"result": "❌ Incorrect flag. Try again!"}), 200

    except Exception as e:
        print(f"Submit error: {e}")
        return jsonify({"error": "Failed to submit flag"}), 500


@app.route('/api/hint', methods=['POST'])
def get_hint():
    try:
        data = request.get_json()
        user_id = data.get('user_id')
        challenge_id = data.get('id')

        print(f"Hint request - User: {user_id}, Challenge: {challenge_id}")

        if not user_id or not challenge_id:
            return jsonify({"error": "Missing required fields"}), 400

        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)

        # Check if hint already used
        cursor.execute(
            "SELECT hint_id FROM hint_usage WHERE user_id = %s AND challenge_id = %s",
            (user_id, challenge_id)
        )
        if cursor.fetchone():
            # Already used, just return hint
            cursor.execute("SELECT hint FROM challenges WHERE id = %s", (challenge_id,))
            result = cursor.fetchone()
            cursor.close()
            conn.close()
            print(f"Hint already used, returning: {result['hint']}")
            return jsonify({"hint": result['hint']}), 200

        # Get hint
        cursor.execute("SELECT hint FROM challenges WHERE id = %s", (challenge_id,))
        challenge = cursor.fetchone()

        if not challenge:
            cursor.close()
            conn.close()
            return jsonify({"error": "Challenge not found"}), 404

        # Record hint usage
        cursor.execute(
            "INSERT INTO hint_usage (user_id, challenge_id) VALUES (%s, %s)",
            (user_id, challenge_id)
        )
        conn.commit()

        cursor.close()
        conn.close()

        print(f"New hint requested: {challenge['hint']}")
        return jsonify({"hint": challenge['hint']}), 200

    except Exception as e:
        print(f"Hint error: {e}")
        return jsonify({"error": "Failed to get hint"}), 500


@app.route('/api/ai_chat', methods=['POST'])
def ai_chat():
    try:
        data = request.get_json()
        user_id = data.get('user_id')
        level = data.get('level')
        message = data.get('message')

        if not level or not message:
            return jsonify({"error": "Missing level or message"}), 400

        print(f"AI Chat request - User: {user_id}, Level: {level}, Message: {message}")

        response = ai_service.get_llm_response(level, message)
        return jsonify({"response": response}), 200

    except Exception as e:
        print(f"AI Chat error: {e}")
        return jsonify({"error": "Failed to get AI response"}), 500


# ==================== PWNBOX ROUTES ====================

@app.route('/api/pwnbox/spawn', methods=['POST'])
def spawn_pwnbox_route():
    try:
        data = request.get_json()
        user_id = data.get('user_id')
        if not user_id:
            return jsonify({"error": "User ID required"}), 400

        # Build image if needed (this is blocking, ideally async but simplified here)
        pwnbox_manager.build_image()
        
        info = pwnbox_manager.spawn_pwnbox(user_id)
        return jsonify(info), 200
    except Exception as e:
        print(f"PwnBox spawn error: {e}")
        return jsonify({"error": str(e)}), 500

@app.route('/api/pwnbox/stop', methods=['POST'])
def stop_pwnbox_route():
    try:
        data = request.get_json()
        user_id = data.get('user_id')
        if not user_id:
            return jsonify({"error": "User ID required"}), 400

        success = pwnbox_manager.stop_pwnbox(user_id)
        if success:
            return jsonify({"message": "PwnBox stopped"}), 200
        else:
            return jsonify({"error": "Failed to stop or not found"}), 404
    except Exception as e:
        print(f"PwnBox stop error: {e}")
        return jsonify({"error": str(e)}), 500


# ==================== USER ROUTES ====================

@app.route('/api/leaderboard', methods=['GET'])
def get_leaderboard():
    try:
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)

        cursor.execute(
            'SELECT name, progress FROM users WHERE role = "user" ORDER BY progress DESC LIMIT 50'
        )
        users = cursor.fetchall()

        cursor.close()
        conn.close()

        return jsonify(users), 200

    except Exception as e:
        print(f"Leaderboard error: {e}")
        return jsonify({"error": "Failed to fetch leaderboard"}), 500


@app.route('/api/user/<int:user_id>/stats', methods=['GET'])
def get_user_stats(user_id):
    try:
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)

        # Fetch stats AND progress from users table
        cursor.execute(
            """SELECT s.beginner, s.intermediate, s.advanced, s.total_challenges, u.progress 
               FROM user_stats s 
               JOIN users u ON s.user_id = u.user_id 
               WHERE s.user_id = %s""",
            (user_id,)
        )
        stats = cursor.fetchone()

        if not stats:
            # Create stats if not exist
            cursor.execute(
                "INSERT INTO user_stats (user_id, beginner, intermediate, advanced, total_challenges) VALUES (%s, 0, 0, 0, 0)",
                (user_id,)
            )
            conn.commit()
            
            # Fetch progress separately if stats didn't exist
            cursor.execute("SELECT progress FROM users WHERE user_id = %s", (user_id,))
            user_data = cursor.fetchone()
            progress = user_data['progress'] if user_data else 0
            
            stats = {
                "beginner": 0, 
                "intermediate": 0, 
                "advanced": 0, 
                "total_challenges": 0,
                "progress": progress
            }

        cursor.close()
        conn.close()

        return jsonify(stats), 200

    except Exception as e:
        print(f"User stats error: {e}")
        return jsonify({"error": "Failed to fetch user stats"}), 500


@app.route('/api/user/<int:user_id>/completed', methods=['GET'])
def get_completed_challenges(user_id):
    try:
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)

        cursor.execute(
            "SELECT DISTINCT challenge_id FROM submissions WHERE user_id = %s AND is_correct = TRUE",
            (user_id,)
        )
        completed = cursor.fetchall()

        cursor.close()
        conn.close()

        return jsonify(completed), 200

    except Exception as e:
        print(f"Get completed challenges error: {e}")
        return jsonify({"error": "Failed to fetch completed challenges"}), 500


@app.route('/api/user/<int:user_id>/completed/<string:category>', methods=['GET'])
def get_completed_challenges_by_category(user_id, category):
    try:
        print(f"Fetching completed challenges for user {user_id} in category {category}")
        
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)

        cursor.execute(
            """SELECT DISTINCT s.challenge_id, c.level 
            FROM submissions s 
            JOIN challenges c ON s.challenge_id = c.id 
            WHERE s.user_id = %s AND s.is_correct = TRUE AND c.category = %s""",
            (user_id, category)
        )
        completed = cursor.fetchall()

        cursor.close()
        conn.close()

        print(f"Found {len(completed)} completed challenges: {completed}")
        return jsonify(completed), 200

    except Exception as e:
        print(f"Get completed challenges by category error: {e}")
        return jsonify({"error": "Failed to fetch completed challenges"}), 500


# ==================== ADMIN ROUTES ====================

@app.route('/api/admin/users', methods=['GET'])
def get_admin_users():
    try:
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)

        cursor.execute(
            "SELECT user_id, name, email, role, progress, created_at FROM users ORDER BY created_at DESC"
        )
        users = cursor.fetchall()

        cursor.close()
        conn.close()

        return jsonify(users), 200

    except Exception as e:
        print(f"Admin users error: {e}")
        return jsonify({"error": "Failed to fetch users"}), 500


@app.route('/api/admin/challenges', methods=['GET'])
def get_admin_challenges():
    try:
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)

        cursor.execute(
            "SELECT id, title, description, category, difficulty, level, flag, hint, points FROM challenges ORDER BY level, category"
        )
        challenges = cursor.fetchall()

        cursor.close()
        conn.close()

        return jsonify(challenges), 200

    except Exception as e:
        print(f"Admin challenges error: {e}")
        return jsonify({"error": "Failed to fetch challenges"}), 500


@app.route('/api/admin/challenges', methods=['POST'])
def create_challenge():
    try:
        data = request.get_json()
        title = data.get('title')
        description = data.get('description')
        category = data.get('category')
        difficulty = data.get('difficulty')
        level = data.get('level')
        flag = data.get('flag')
        hint = data.get('hint')
        points = data.get('points', 10)

        if not all([title, description, category, difficulty, level, flag]):
            return jsonify({"error": "Missing required fields"}), 400

        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)

        cursor.execute(
            "INSERT INTO challenges (title, description, category, difficulty, level, flag, hint, points) VALUES (%s, %s, %s, %s, %s, %s, %s, %s)",
            (title, description, category, difficulty, level, flag, hint, points)
        )
        conn.commit()
        challenge_id = cursor.lastrowid

        cursor.close()
        conn.close()

        return jsonify({"id": challenge_id, "message": "Challenge created successfully"}), 201

    except Exception as e:
        print(f"Create challenge error: {e}")
        return jsonify({"error": "Failed to create challenge"}), 500


@app.route('/api/admin/challenges/<int:challenge_id>', methods=['PUT'])
def update_challenge(challenge_id):
    try:
        data = request.get_json()
        title = data.get('title')
        description = data.get('description')
        category = data.get('category')
        difficulty = data.get('difficulty')
        level = data.get('level')
        flag = data.get('flag')
        hint = data.get('hint')
        points = data.get('points', 10)

        conn = get_db_connection()
        cursor = conn.cursor()

        cursor.execute(
            "UPDATE challenges SET title = %s, description = %s, category = %s, difficulty = %s, level = %s, flag = %s, hint = %s, points = %s WHERE id = %s",
            (title, description, category, difficulty, level, flag, hint, points, challenge_id)
        )
        conn.commit()

        cursor.close()
        conn.close()

        return jsonify({"message": "Challenge updated successfully"}), 200

    except Exception as e:
        print(f"Update challenge error: {e}")
        return jsonify({"error": "Failed to update challenge"}), 500


@app.route('/api/admin/challenges/<int:challenge_id>', methods=['DELETE'])
def delete_challenge(challenge_id):
    try:
        conn = get_db_connection()
        cursor = conn.cursor()

        cursor.execute("DELETE FROM challenges WHERE id = %s", (challenge_id,))
        conn.commit()

        cursor.close()
        conn.close()

        return jsonify({"message": "Challenge deleted successfully"}), 200

    except Exception as e:
        print(f"Delete challenge error: {e}")
        return jsonify({"error": "Failed to delete challenge"}), 500


# ==================== HEALTH CHECK ====================

@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({"status": "ok", "message": "ChakraView API is running"}), 200


# ==================== ERROR HANDLERS ====================

@app.errorhandler(404)
def not_found(error):
    return jsonify({"error": "Endpoint not found"}), 404


@app.errorhandler(500)
def internal_error(error):
    return jsonify({"error": "Internal server error"}), 500


# ==================== WEB SSH EVENTS ====================

@socketio.on('connect')
def handle_connect():
    print('Client connected to WebSocket')

@socketio.on('disconnect')
def handle_disconnect():
    print('Client disconnected')
    ssh_manager.close_session(request.sid)

@socketio.on('ssh_connect')
def handle_ssh_connect(data):
    # Securely load credentials from environment
    host = os.getenv("SSH_HOST", "192.168.81.134")
    port = int(os.getenv("SSH_PORT", 22))
    username = os.getenv("SSH_USER", "ubuntu")
    password = os.getenv("SSH_PASSWORD", "kali")
    
    # Optional: Allow overriding host for specialized scenarios (if secure)
    # host = data.get('host') or host
    
    print(f"SSH Connecting to {username}@{host}:{port}")
    
    success = ssh_manager.create_session(socketio, request.sid, host, username, password, port)
    
    if success is True:
        emit('ssh_output', f"\r\n\033[1;32m[+] Connected to secure lab environment({host}).\033[0m\r\n")
    else:
        emit('ssh_error', f"Connection failed: {success}")

@socketio.on('ssh_input')
def handle_ssh_input(data):
    session = ssh_manager.get_session(request.sid)
    if session:
        session.write(data)

if __name__ == '__main__':
    port = int(os.getenv("PORT", 5000))
    # run with socketio
    socketio.run(app, host='0.0.0.0', port=port, debug=True)