from flask import Blueprint, request, jsonify
from db import get_db_connection

challenges_bp = Blueprint('challenges', __name__)

@challenges_bp.route('/', methods=['GET'])
def get_challenges():
    try:
        category = request.args.get('category')
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)

        if category:
            cursor.execute(
                "SELECT id, title, description, category, difficulty, level, points, image_url FROM challenges WHERE category = %s ORDER BY level",
                (category,)
            )
        else:
            cursor.execute(
                "SELECT id, title, description, category, difficulty, level, points, image_url FROM challenges ORDER BY level, category"
            )
        challenges = cursor.fetchall()

        cursor.close()
        conn.close()

        return jsonify(challenges), 200

    except Exception as e:
        print(f"Get challenges error: {e}")
        return jsonify({"error": "Failed to fetch challenges"}), 500


@challenges_bp.route('/<int:challenge_id>', methods=['GET'])
def get_challenge(challenge_id):
    try:
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)

        cursor.execute(
            "SELECT id, title, description, category, difficulty, level, points, image_url FROM challenges WHERE id = %s",
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


@challenges_bp.route('/submit', methods=['POST'])
def submit_flag():
    try:
        data = request.get_json()
        user_id = data.get('user_id')
        challenge_id = data.get('challenge_id') or data.get('id')  # Support both
        flag = data.get('flag')

        if not user_id or not challenge_id or not flag:
            return jsonify({
                "status": "error",
                "message": "Missing required fields"
            }), 400

        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)

        # Get challenge
        cursor.execute("SELECT flag, points, level FROM challenges WHERE id = %s", (challenge_id,))
        challenge = cursor.fetchone()

        if not challenge:
            cursor.close()
            conn.close()
            return jsonify({
                "status": "error", 
                "message": "Challenge not found"
            }), 404

        is_correct = flag.strip().lower() == challenge['flag'].strip().lower()

        # Check if already completed
        cursor.execute(
            "SELECT submission_id FROM submissions WHERE user_id = %s AND challenge_id = %s AND is_correct = TRUE",
            (user_id, challenge_id)
        )
        if cursor.fetchone():
            cursor.close()
            conn.close()
            return jsonify({
                "status": "correct",
                "message": "Already completed this challenge!"
            }), 200

        # Insert submission
        cursor.execute(
            "INSERT INTO submissions (user_id, challenge_id, submitted_flag, is_correct) VALUES (%s, %s, %s, %s)",
            (user_id, challenge_id, flag, is_correct)
        )
        conn.commit()

        if is_correct:
            # Update user progress
            cursor.execute("UPDATE users SET progress = progress + %s WHERE user_id = %s", (challenge['points'], user_id))
            conn.commit()

            # Update user stats
            stat_field = 'beginner'
            level_val = challenge.get('level', 1) or 1
            if level_val >= 4:
                stat_field = 'advanced'
            elif level_val == 3:
                stat_field = 'intermediate'

            cursor.execute(
                f"""INSERT INTO user_stats (user_id, {stat_field}, total_challenges) 
                VALUES (%s, 1, 1) 
                ON DUPLICATE KEY UPDATE {stat_field} = {stat_field} + 1, total_challenges = total_challenges + 1""",
                (user_id,)
            )
            conn.commit()

            return jsonify({
                "status": "correct",
                "result": "🎉 Correct! Well done!",
                "message": "🎉 Correct! Well done!",
                "points": challenge['points']
            }), 200
        else:
            cursor.close()
            conn.close()
            return jsonify({
                "status": "incorrect",
                "result": "❌ Incorrect flag. Try again!",
                "message": "❌ Incorrect flag. Try again!"
            }), 200

    except Exception as e:
        print(f"Submit error: {e}")
        return jsonify({"error": "Failed to submit flag"}), 500


@challenges_bp.route('/hint', methods=['POST'])
def get_hint():
    try:
        data = request.get_json()
        user_id = data.get('user_id')
        challenge_id = data.get('id')

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

        return jsonify({"hint": challenge['hint']}), 200

    except Exception as e:
        print(f"Hint error: {e}")
        return jsonify({"error": "Failed to get hint"}), 500
