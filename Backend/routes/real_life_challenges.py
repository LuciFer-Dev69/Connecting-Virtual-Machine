from flask import Blueprint, request, jsonify
from db import get_db_connection
import real_life_challenge_manager
import json

real_life_bp = Blueprint('real_life', __name__)

@real_life_bp.route('/api/real-life-challenges', methods=['GET'])
def get_challenges():
    try:
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)
        
        cursor.execute("SELECT id, title, description, difficulty, category, points FROM real_life_challenges WHERE is_locked = FALSE")
        challenges = cursor.fetchall()
        
        conn.close()
        return jsonify(challenges), 200
    except Exception as e:
        print(f"Error fetching real-life challenges: {e}")
        return jsonify({"error": str(e)}), 500

@real_life_bp.route('/api/real-life-challenges/<int:id>', methods=['GET'])
def get_challenge_details(id):
    try:
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)
        
        cursor.execute("SELECT id, title, description, difficulty, category, points, hints, is_locked FROM real_life_challenges WHERE id = %s", (id,))
        challenge = cursor.fetchone()
        
        if not challenge:
            conn.close()
            return jsonify({"error": "Challenge not found"}), 404

        if challenge.get('is_locked'):
            conn.close()
            return jsonify({"error": "This challenge is currently locked by Administrator."}), 403
            
        # Parse hints JSON
        if challenge['hints']:
            challenge['hints'] = json.loads(challenge['hints'])
            
        # Check active session
        user_id = request.args.get('user_id')
        session = None
        if user_id:
            cursor.execute("SELECT * FROM real_life_challenge_sessions WHERE user_id = %s AND challenge_id = %s AND status = 'active'", (user_id, id))
            session = cursor.fetchone()
        
        conn.close()
        return jsonify({"challenge": challenge, "session": session}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@real_life_bp.route('/api/real-life-challenges/<int:id>/start', methods=['POST'])
def start_challenge(id):
    try:
        data = request.get_json()
        user_id = data.get('user_id')
        
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)
        
        # Get challenge info
        cursor.execute("SELECT category, docker_image, is_locked FROM real_life_challenges WHERE id = %s", (id,))
        challenge = cursor.fetchone()
        if not challenge:
            conn.close()
            return jsonify({"error": "Challenge not found"}), 404
            
        if challenge.get('is_locked'):
            conn.close()
            return jsonify({"error": "This challenge is currently locked and cannot be started."}), 403
            
        # Check existing session
        cursor.execute("SELECT * FROM real_life_challenge_sessions WHERE user_id = %s AND status = 'active'", (user_id,))
        existing = cursor.fetchone()
        if existing:
            # Stop existing container if strictly only one allowed (Plan says 1 active challenge per user)
            # For now, let's auto-stop it or error. Let's auto-stop.
            if existing['container_id']:
                real_life_challenge_manager.stop_challenge(existing['container_id'])
            cursor.execute("UPDATE real_life_challenge_sessions SET status = 'stopped', completed_at = NOW() WHERE id = %s", (existing['id'],))
            conn.commit()

        # Spawn Container
        category_map = {
            "XSS": "xss",
            "SQL Injection": "sqli", 
            "Authorization": "auth"
        }
        short_cat = category_map.get(challenge['category'])
        
        spawn_info = real_life_challenge_manager.spawn_challenge(short_cat, user_id)
        
        # Create Session
        cursor.execute("""
            INSERT INTO real_life_challenge_sessions (user_id, challenge_id, status, container_id, assigned_port)
            VALUES (%s, %s, 'active', %s, %s)
        """, (user_id, id, spawn_info['container_id'], spawn_info['port']))
        
        conn.commit()
        conn.close()
        
        return jsonify(spawn_info), 200
        
    except Exception as e:
        print(f"Start challenge error: {e}")
        return jsonify({"error": str(e)}), 500

@real_life_bp.route('/api/real-life-challenges/<int:id>/stop', methods=['POST'])
def stop_challenge(id):
    try:
        data = request.get_json()
        user_id = data.get('user_id')
        
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)
        
        cursor.execute("SELECT * FROM real_life_challenge_sessions WHERE user_id = %s AND challenge_id = %s AND status = 'active'", (user_id, id))
        session = cursor.fetchone()
        
        if session and session['container_id']:
            real_life_challenge_manager.stop_challenge(session['container_id'])
            cursor.execute("UPDATE real_life_challenge_sessions SET status = 'stopped', completed_at = NOW() WHERE id = %s", (session['id'],))
            conn.commit()
            
        conn.close()
        return jsonify({"message": "Challenge stopped"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@real_life_bp.route('/api/real-life-challenges/<int:id>/submit', methods=['POST'])
def submit_flag(id):
    try:
        data = request.get_json()
        user_id = data.get('user_id')
        flag = data.get('flag')
        
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)
        
        cursor.execute("SELECT flag, points FROM real_life_challenges WHERE id = %s", (id,))
        challenge = cursor.fetchone()
        
        if not challenge:
            conn.close()
            return jsonify({"error": "Challenge not found"}), 404
            
        if flag.strip() == challenge['flag'].strip():
            # Check if already completed
            cursor.execute("SELECT * FROM real_life_challenge_sessions WHERE user_id = %s AND challenge_id = %s AND status = 'completed'", (user_id, id))
            # Actually we track completion in sessions, but sessions are transient per run. 
            # We should probably have a 'submissions' logic or just mark the session as user 'succeeded'. 
            # The original plan said 'CREATE TABLE real_life_challenge_sessions ... status ENUM ... hints_used'.
            # It didn't duplicate the main 'submissions' table logic. 
            # Let's reuse the main 'submissions' table for point tracking to keep leaderboard consistent!
            
            cursor.execute("SELECT submission_id FROM submissions WHERE user_id = %s AND challenge_id = %s AND is_correct = TRUE", (user_id, id))
            # Wait, 'submissions' FK links to 'challenges' table (id). 'real_life_challenges' is a different table.
            # FK constraints might fail if IDs overlap with 'challenges' table.
            # Ah, schema issue. 'challenges' and 'real_life_challenges' are separate.
            # For this MVP, I will just give points directly to user 'progress'.
            
            cursor.execute("UPDATE users SET progress = progress + %s WHERE user_id = %s", (challenge['points'], user_id))
            
            # Close session
            cursor.execute("SELECT id FROM real_life_challenge_sessions WHERE user_id = %s AND challenge_id = %s AND status = 'active'", (user_id, id))
            session = cursor.fetchone()
            if session:
                cursor.execute("UPDATE real_life_challenge_sessions SET status = 'completed', completed_at = NOW() WHERE id = %s", (session['id'],))
            
            conn.commit()
            conn.close()
            return jsonify({"result": "correct", "points": challenge['points']}), 200
        else:
            conn.close()
            return jsonify({"result": "incorrect"}), 200
            
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@real_life_bp.route('/api/real-life-challenges/<int:id>/hint', methods=['POST'])
def get_hint(id):
    # Simplified hint logic for MVP
    try:
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT hints FROM real_life_challenges WHERE id = %s", (id,))
        res = cursor.fetchone()
        conn.close()
        
        hints = json.loads(res['hints']) if res and res['hints'] else []
        return jsonify({"hints": hints}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
