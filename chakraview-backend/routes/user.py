from flask import Blueprint, jsonify
from db import get_db_connection

user_bp = Blueprint('user', __name__)

@user_bp.route('/leaderboard', methods=['GET'])
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


@user_bp.route('/<int:user_id>/stats', methods=['GET'])
def get_user_stats(user_id):
    try:
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)

        cursor.execute(
            "SELECT beginner, intermediate, advanced, total_challenges FROM user_stats WHERE user_id = %s",
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
            stats = {"beginner": 0, "intermediate": 0, "advanced": 0, "total_challenges": 0}

        cursor.close()
        conn.close()

        return jsonify(stats), 200

    except Exception as e:
        print(f"User stats error: {e}")
        return jsonify({"error": "Failed to fetch user stats"}), 500


@user_bp.route('/<int:user_id>/completed', methods=['GET'])
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
