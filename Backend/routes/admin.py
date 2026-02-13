from flask import Blueprint, request, jsonify
from db import get_db_connection
from utils.auth import admin_required, log_admin_action

admin_bp = Blueprint('admin', __name__)

@admin_bp.route('/users', methods=['GET'])
@admin_required
def get_admin_users(current_user_id, current_role):
    try:
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT user_id, name, email, role, progress, created_at, is_suspended FROM users ORDER BY created_at DESC")
        users = cursor.fetchall()
        cursor.close()
        conn.close()
        return jsonify(users), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@admin_bp.route('/stats', methods=['GET'])
@admin_required
def get_admin_stats(current_user_id, current_role):
    try:
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT COUNT(*) as total_users FROM users WHERE role = 'user'")
        users_count = cursor.fetchone()['total_users']
        cursor.execute("SELECT COUNT(*) as total_challenges FROM challenges")
        challenges_count = cursor.fetchone()['total_challenges']
        cursor.close()
        conn.close()
        return jsonify({"users": users_count, "challenges": challenges_count}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@admin_bp.route('/challenges', methods=['GET'])
@admin_required
def get_admin_challenges(current_user_id, current_role):
    try:
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT * FROM challenges ORDER BY level, category")
        challenges = cursor.fetchall()
        cursor.close()
        conn.close()
        return jsonify(challenges), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@admin_bp.route('/challenges/lock', methods=['POST'])
@admin_required
def toggle_challenge_lock(current_user_id, current_role):
    data = request.get_json()
    cid, lock_state = data.get('id'), data.get('is_locked')
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("UPDATE challenges SET is_locked = %s WHERE id = %s", (lock_state, cid))
    conn.commit()
    log_admin_action(current_user_id, "TOGGLE_LOCK", "CHALLENGE", cid, not lock_state, lock_state)
    cursor.close()
    conn.close()
    return jsonify({"success": True}), 200

@admin_bp.route('/users/suspend', methods=['POST'])
@admin_required
def toggle_user_suspension(current_user_id, current_role):
    data = request.get_json()
    uid, suspend_state = data.get('user_id'), data.get('is_suspended')
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("UPDATE users SET is_suspended = %s WHERE user_id = %s", (suspend_state, uid))
    conn.commit()
    log_admin_action(current_user_id, "SUSPEND_USER", "USER", uid, not suspend_state, suspend_state)
    cursor.close()
    conn.close()
    return jsonify({"success": True}), 200
