from flask import Blueprint, request, jsonify
import bcrypt
import jwt
import datetime
import os
from db import get_db_connection

auth_bp = Blueprint('auth', __name__)
JWT_SECRET_KEY = os.getenv("JWT_SECRET", "Chakra_Super_Secret_Key_2024")

@auth_bp.route('/signup', methods=['POST'])
def signup():
    try:
        data = request.get_json()
        name = data.get('name')
        email = data.get('email')
        password = data.get('password')

        if not name or not email or not password:
            return jsonify({"error": "All fields are required"}), 400

        if len(password) < 8:
            return jsonify({"error": "Password must be at least 8 characters"}), 400

        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)

        cursor.execute("SELECT user_id FROM users WHERE email = %s", (email,))
        if cursor.fetchone():
            cursor.close()
            conn.close()
            return jsonify({"error": "Email already registered"}), 409

        hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())

        cursor.execute(
            "INSERT INTO users (name, email, password, role, progress) VALUES (%s, %s, %s, %s, %s)",
            (name, email, hashed_password, 'user', 0)
        )
        conn.commit()
        user_id = cursor.lastrowid

        cursor.execute(
            "INSERT INTO user_stats (user_id, beginner, intermediate, advanced, total_challenges) VALUES (%s, 0, 0, 0, 0)",
            (user_id,)
        )
        conn.commit()

        cursor.close()
        conn.close()

        # Auto-login after signup
        token = jwt.encode({
            'user_id': user_id,
            'role': 'user',
            'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=24)
        }, JWT_SECRET_KEY, algorithm="HS256")

        return jsonify({
            "user": {"user_id": user_id, "name": name, "email": email, "role": "user", "progress": 0},
            "token": token
        }), 201

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

        cursor.execute(
            "SELECT user_id, name, email, password, role, progress, profilePic, is_suspended FROM users WHERE email = %s",
            (email,)
        )
        user = cursor.fetchone()

        cursor.close()
        conn.close()

        if not user:
            return jsonify({"error": "Invalid credentials"}), 401
        
        if user.get('is_suspended'):
            return jsonify({"error": "Account suspended"}), 403

        db_password = user['password']
        if isinstance(db_password, str):
            db_password = db_password.encode('utf-8')
        
        if not bcrypt.checkpw(password.encode('utf-8'), db_password):
            return jsonify({"error": "Invalid credentials"}), 401

        token = jwt.encode({
            'user_id': user['user_id'],
            'role': user['role'],
            'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=24)
        }, JWT_SECRET_KEY, algorithm="HS256")

        del user['password']

        return jsonify({"user": user, "token": token}), 200

    except Exception as e:
        print(f"Login error: {e}")
        return jsonify({"error": "Server error during login"}), 500
