from flask import Blueprint, request, jsonify
from db import get_db_connection

admin_bp = Blueprint('admin', __name__)

@admin_bp.route('/users', methods=['GET'])
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


@admin_bp.route('/challenges', methods=['POST'])
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


@admin_bp.route('/challenges/<int:challenge_id>', methods=['PUT'])
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


@admin_bp.route('/challenges/<int:challenge_id>', methods=['DELETE'])
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
