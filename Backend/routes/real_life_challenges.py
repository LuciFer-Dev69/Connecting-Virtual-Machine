from flask import Blueprint, request, jsonify
from db import get_db_connection

real_life_bp = Blueprint('real_life', __name__)

@real_life_bp.route('/real-life-challenges', methods=['GET'])
def get_challenges():
    try:
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)
        # Fetch all challenges, even locked ones for now since we want to manage them
        cursor.execute("SELECT * FROM real_life_challenges")
        challenges = cursor.fetchall()
        conn.close()
        return jsonify(challenges), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@real_life_bp.route('/real-life-challenges', methods=['POST'])
def add_challenge():
    try:
        data = request.get_json()
        
        # Basic validation
        required_fields = ['title', 'description', 'flag']
        for field in required_fields:
            if field not in data:
                return jsonify({"error": f"Missing required field: {field}"}), 400

        title = data.get('title')
        description = data.get('description')
        difficulty = data.get('difficulty', 'Medium')
        category = data.get('category', 'Real Life')
        points = data.get('points', 10)
        flag = data.get('flag')
        docker_image = data.get('docker_image', '')
        port = data.get('port', 0)
        hints = data.get('hints', '[]') # JSON string expected
        
        conn = get_db_connection()
        cursor = conn.cursor()
        
        query = """
            INSERT INTO real_life_challenges 
            (title, description, difficulty, category, points, flag, docker_image, port, hints) 
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
        """
        cursor.execute(query, (title, description, difficulty, category, points, flag, docker_image, port, hints))
        conn.commit()
        new_id = cursor.lastrowid
        conn.close()
        
        return jsonify({"message": "Challenge added successfully", "id": new_id}), 201
    except Exception as e:
        print(f"Error adding challenge: {e}")
        return jsonify({"error": str(e)}), 500

@real_life_bp.route('/real-life-challenges/<int:id>', methods=['DELETE'])
def delete_challenge(id):
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        # Check if exists
        cursor.execute("SELECT id FROM real_life_challenges WHERE id = %s", (id,))
        if not cursor.fetchone():
            conn.close()
            return jsonify({"error": "Challenge not found"}), 404
            
        cursor.execute("DELETE FROM real_life_challenges WHERE id = %s", (id,))
        conn.commit()
        conn.close()
        
        return jsonify({"message": "Challenge deleted successfully"}), 200
    except Exception as e:
        print(f"Error deleting challenge: {e}")
        return jsonify({"error": str(e)}), 500
