import os
import jwt
import datetime
from functools import wraps
from flask import request, jsonify
from db import get_db_connection

JWT_SECRET_KEY = os.getenv("JWT_SECRET", "Chakra_Super_Secret_Key_2024")

def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = request.headers.get('Authorization')
        if not token:
            return jsonify({'error': 'Token is missing'}), 401
        try:
            if token.startswith('Bearer '):
                token = token.split(" ")[1]
            data = jwt.decode(token, JWT_SECRET_KEY, algorithms=["HS256"])
            current_user_id = data['user_id']
            current_role = data['role']
        except:
            return jsonify({'error': 'Token is invalid'}), 401
        return f(current_user_id, current_role, *args, **kwargs)
    return decorated

def admin_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = request.headers.get('Authorization')
        if not token:
            return jsonify({'error': 'Token is missing'}), 401
        try:
            if token.startswith('Bearer '):
                token = token.split(" ")[1]
            data = jwt.decode(token, JWT_SECRET_KEY, algorithms=["HS256"])
            if data['role'] not in ['admin', 'Super Admin']:
                return jsonify({'error': 'Admin privilege required'}), 403
            current_user_id = data['user_id']
            current_role = data['role']
        except Exception as e:
            return jsonify({'error': 'Token is invalid or expired'}), 401
        return f(current_user_id, current_role, *args, **kwargs)
    return decorated

def log_admin_action(admin_id, action, target_type, target_id, old_val=None, new_val=None):
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        ip = request.remote_addr
        cursor.execute(
            "INSERT INTO audit_logs (admin_id, action, target_type, target_id, old_value, new_value, ip_address) VALUES (%s, %s, %s, %s, %s, %s, %s)",
            (admin_id, action, target_type, target_id, str(old_val), str(new_val), ip)
        )
        conn.commit()
        cursor.close()
        conn.close()
    except Exception as e:
        print(f"Logging error: {e}")
