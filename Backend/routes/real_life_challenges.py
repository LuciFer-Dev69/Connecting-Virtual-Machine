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
        
        # Mapping titles to Lab IDs (1-5) for consistency between tables
        lab_title_map = {
            "Service Enumeration": 1,
            "Version Detection": 2,
            "Robots.txt Information Leak": 3,
            "Hidden Directory Discovery": 4,
            "Default Credentials Abuse": 5
        }

        if not challenge:
            # Check main challenges table as fallback (for IDs like 48, 49, 53, etc.)
            cursor.execute("SELECT id, title, description, difficulty, category, points, flag FROM challenges WHERE id = %s", (id,))
            chal_data = cursor.fetchone()
            if chal_data:
                # Map to a lab if it matches by title
                mapped_lab_id = lab_title_map.get(chal_data['title'])
                if mapped_lab_id and mapped_lab_id != id:
                    # Redirect or just load the lab data instead
                    cursor.execute("SELECT id, title, description, difficulty, category, points, hints, is_locked FROM real_life_challenges WHERE id = %s", (mapped_lab_id,))
                    challenge = cursor.fetchone()
                else:
                    # Generic Red Team challenge
                    challenge = {
                        "id": chal_data["id"],
                        "title": chal_data["title"],
                        "description": chal_data["description"],
                        "difficulty": chal_data["difficulty"],
                        "category": chal_data["category"],
                        "points": chal_data["points"],
                        "hints": "[]", # Default empty hints
                        "is_locked": 0
                    }
            
        if not challenge:
            conn.close()
            return jsonify({"error": "Challenge not found"}), 404
            
        # Determine the canonical ID for session lookup
        canonical_id = challenge['id']
            
        # Parse hints JSON
        if challenge['hints']:
            challenge['hints'] = json.loads(challenge['hints'])
            
        # Check active session
        user_id = request.args.get('user_id')
        session = None
        if user_id:
            cursor.execute("SELECT * FROM real_life_challenge_sessions WHERE user_id = %s AND challenge_id = %s AND status = 'active'", (user_id, canonical_id))
            session = cursor.fetchone()
            
            if session:
                # Add target_url based on challenge ID
                if 1 <= int(canonical_id) <= 5:
                    port_map = {1: 5101, 2: 5102, 3: 5103, 4: 5104, 5: 5105}
                    session['target_url'] = f"http://localhost:{port_map[int(canonical_id)]}"
                    session['assigned_port'] = port_map[int(canonical_id)]
                elif session['assigned_port']:
                    session['target_url'] = f"http://localhost:{session['assigned_port']}"
        
        conn.close()
        return jsonify({"challenge": challenge, "session": session}), 200
    except Exception as e:
        print(f"Error in get_challenge_details: {e}")
        return jsonify({"error": str(e)}), 500

@real_life_bp.route('/api/real-life-challenges/<int:id>/start', methods=['POST'])
def start_challenge(id):
    try:
        data = request.get_json()
        user_id = data.get('user_id')
        
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)
        
        # Get challenge info
        cursor.execute("SELECT id, title, category, docker_image, is_locked FROM real_life_challenges WHERE id = %s", (id,))
        challenge = cursor.fetchone()
        
        # Fallback mapping
        lab_title_map = {
            "Service Enumeration": 1,
            "Version Detection": 2,
            "Robots.txt Information Leak": 3,
            "Hidden Directory Discovery": 4,
            "Default Credentials Abuse": 5
        }

        if not challenge:
            cursor.execute("SELECT id, title, category FROM challenges WHERE id = %s", (id,))
            chal_data = cursor.fetchone()
            if chal_data:
                mapped_lab_id = lab_title_map.get(chal_data['title'])
                if mapped_lab_id:
                    id = mapped_lab_id
                    cursor.execute("SELECT id, title, category, docker_image, is_locked FROM real_life_challenges WHERE id = %s", (id,))
                    challenge = cursor.fetchone()

        if not challenge:
            conn.close()
            return jsonify({"error": "Challenge not found"}), 404
            
        # Check existing session for THIS specific challenge
        cursor.execute("SELECT * FROM real_life_challenge_sessions WHERE user_id = %s AND challenge_id = %s AND status = 'active'", (user_id, id))
        existing = cursor.fetchone()
        
        if existing:
            # Re-use existing session info
            port_map = {1: 5101, 2: 5102, 3: 5103, 4: 5104, 5: 5105}
            url = f"http://localhost:{port_map[id]}" if 1 <= id <= 5 else f"http://localhost:{existing['assigned_port']}"
            return jsonify({"container_id": existing['container_id'], "port": existing['assigned_port'], "url": url}), 200

        # Stop ANY other active sessions for this user to keep environment clean
        cursor.execute("SELECT * FROM real_life_challenge_sessions WHERE user_id = %s AND status = 'active'", (user_id,))
        other_sessions = cursor.fetchall()
        for s in other_sessions:
            if s['container_id'] and s['container_id'] != 'pwnbox':
                 real_life_challenge_manager.stop_challenge(s['container_id'])
            cursor.execute("UPDATE real_life_challenge_sessions SET status = 'stopped', completed_at = NOW() WHERE id = %s", (s['id'],))
        
        conn.commit()

        # Provisioning logic
        if 1 <= int(id) <= 5:
            port_map = {1: 5101, 2: 5102, 3: 5103, 4: 5104, 5: 5105}
            spawn_info = {
                "container_id": "pwnbox",
                "port": port_map[int(id)],
                "url": f"http://localhost:{port_map[int(id)]}"
            }
        else:
            cat_raw = challenge.get('category', '').lower()
            short_cat = "xss" if "xss" in cat_raw else "sqli" if "sql" in cat_raw else "auth"
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
        
        if not session:
            # Fallback mapping check for stop
            cursor.execute("SELECT title FROM challenges WHERE id = %s", (id,))
            chal = cursor.fetchone()
            if chal:
                lab_title_map = {"Service Enumeration": 1, "Version Detection": 2, "Robots.txt Information Leak": 3, "Hidden Directory Discovery": 4, "Default Credentials Abuse": 5}
                mapped_id = lab_title_map.get(chal['title'])
                if mapped_id:
                    cursor.execute("SELECT * FROM real_life_challenge_sessions WHERE user_id = %s AND challenge_id = %s AND status = 'active'", (user_id, mapped_id))
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
        
        cursor.execute("SELECT id, title, flag, points FROM real_life_challenges WHERE id = %s", (id,))
        challenge = cursor.fetchone()
        
        lab_title_map = {
            "Service Enumeration": 1,
            "Version Detection": 2,
            "Robots.txt Information Leak": 3,
            "Hidden Directory Discovery": 4,
            "Default Credentials Abuse": 5
        }

        if not challenge:
            cursor.execute("SELECT id, title, flag, points FROM challenges WHERE id = %s", (id,))
            chal_data = cursor.fetchone()
            if chal_data:
                mapped_lab_id = lab_title_map.get(chal_data['title'])
                if mapped_lab_id:
                   cursor.execute("SELECT id, title, flag, points FROM real_life_challenges WHERE id = %s", (mapped_lab_id,))
                   challenge = cursor.fetchone()
                else:
                    challenge = chal_data
            
        if not challenge:
            conn.close()
            return jsonify({"error": "Challenge not found"}), 404
            
        if flag.strip() == challenge['flag'].strip():
            # Canonical ID for points and completion
            canonical_id = challenge['id']
            
            # Check if already completed
            cursor.execute("SELECT * FROM real_life_challenge_sessions WHERE user_id = %s AND challenge_id = %s AND status = 'completed'", (user_id, canonical_id))
            
            cursor.execute("UPDATE users SET progress = progress + %s WHERE user_id = %s", (challenge['points'], user_id))
            
            # Close session
            cursor.execute("SELECT id FROM real_life_challenge_sessions WHERE user_id = %s AND challenge_id = %s AND status = 'active'", (user_id, canonical_id))
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
