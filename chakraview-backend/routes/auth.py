from flask import Blueprint, request, jsonify
import bcrypt
from db import get_db_connection

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/signup', methods=['POST'])
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


@auth_bp.route('/login', methods=['POST'])
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
