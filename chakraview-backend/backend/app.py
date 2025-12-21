import psycopg2
from flask import Flask, request
from flask_cors import CORS
from werkzeug.security import generate_password_hash, check_password_hash

# ---- Database Config ----
DB_HOST = "127.0.0.1"
DB_NAME = "chakraview_db"
DB_USER = "chakraview"
DB_PASS = "StrongPassword123"
DB_PORT = "5432"

def get_conn():
    return psycopg2.connect(
        host=DB_HOST, dbname=DB_NAME, user=DB_USER, password=DB_PASS, port=DB_PORT
    )

# ---- Flask App ----
app = Flask(__name__)
CORS(app)

@app.get("/")
def home():
    return {"status": "ok", "service": "chakraview-api"}

# ========================
# AUTH
# ========================
@app.post("/auth/signup")
def signup():
    data = request.json
    with get_conn() as conn, conn.cursor() as cur:
        cur.execute("SELECT 1 FROM users WHERE email=%s", (data["email"],))
        if cur.fetchone():
            return {"error": "User already exists"}, 400
        pwd_hash = generate_password_hash(data["password"])
        cur.execute(
            """
            INSERT INTO users (name, email, password_hash)
            VALUES (%s,%s,%s)
            RETURNING user_id, role, progress
            """,
            (data["name"], data["email"], pwd_hash),
        )
        uid, role, progress = cur.fetchone()
        return {"message": "Signup successful", "user": {
            "user_id": uid, "name": data["name"], "email": data["email"],
            "role": role, "progress": progress
        }}, 201

@app.post("/auth/login")
def login():
    data = request.json

    # ---- Hardcoded Admin Login ----
    if data["email"] == "admin@gmail.com" and data["password"] == "wuji":
        return {
            "message": "Admin login successful",
            "user": {
                "user_id": 0,
                "name": "Admin",
                "email": "admin@gmail.com",
                "role": "admin",
                "progress": 0
            }
        }

    # ---- Normal user login ----
    with get_conn() as conn, conn.cursor() as cur:
        cur.execute(
            "SELECT user_id, name, password_hash, role, progress FROM users WHERE email=%s",
            (data["email"],),
        )
        row = cur.fetchone()
        if not row:
            return {"error": "Invalid credentials"}, 401
        uid, name, pwd_hash, role, progress = row
        if not check_password_hash(pwd_hash, data["password"]):
            return {"error": "Invalid credentials"}, 401
        return {"message": "Login successful", "user": {
            "user_id": uid, "name": name, "email": data["email"],
            "role": role, "progress": progress
        }}

# ========================
# CHALLENGES (student-safe)
# ========================
@app.get("/challenges")
def challenges():
    # no solutions here (safe for students)
    with get_conn() as conn, conn.cursor() as cur:
        cur.execute("""
            SELECT DISTINCT ON (challenge_id)
                   challenge_id, title, difficulty, category, level
            FROM challenges
            ORDER BY challenge_id
        """)
        return [
            {"id": r[0], "title": r[1], "difficulty": r[2], "category": r[3], "level": r[4]}
            for r in cur.fetchall()
        ]

@app.get("/challenges/<int:cid>")
def challenge(cid):
    # includes description & hint; does NOT include solution
    with get_conn() as conn, conn.cursor() as cur:
        cur.execute("""
            SELECT challenge_id, title, difficulty, category, description, hint, level
            FROM challenges WHERE challenge_id=%s
        """, (cid,))
        r = cur.fetchone()
        if not r:
            return {"error": "Not found"}, 404
        return {
            "id": r[0], "title": r[1], "difficulty": r[2], "category": r[3],
            "description": r[4], "hint": r[5], "level": r[6]
        }

# ========================
# SUBMISSIONS
# ========================
@app.post("/submit")
def submit():
    data = request.json
    with get_conn() as conn, conn.cursor() as cur:
        cur.execute("SELECT solution FROM challenges WHERE challenge_id=%s", (data["id"],))
        row = cur.fetchone()
        if not row:
            return {"error": "Challenge not found"}, 404
        correct_flag = row[0]

        result = "Correct!" if data["flag"] == correct_flag else "Incorrect!"
        cur.execute(
            "INSERT INTO submissions (user_id, challenge_id, flag, result) VALUES (%s,%s,%s,%s)",
            (data["user_id"], data["id"], data["flag"], result),
        )

        score = 100 if result == "Correct!" else 0
        cur.execute(
            "INSERT INTO analytics_logs (user_id, activity, score) VALUES (%s,%s,%s)",
            (data["user_id"], f"submit_challenge_{data['id']}", score),
        )

        if result == "Correct!":
            cur.execute("UPDATE users SET progress = progress + 10 WHERE user_id=%s", (data["user_id"],))

        conn.commit()
        return {"result": result, "score": score}, (200 if result == "Correct!" else 400)

# ========================
# LEADERBOARD (by progress)
# ========================
@app.get("/leaderboard")
def leaderboard():
    with get_conn() as conn, conn.cursor() as cur:
        cur.execute("SELECT name, progress FROM users ORDER BY progress DESC LIMIT 10")
        rows = cur.fetchall()
        return [{"name": r[0], "progress": r[1]} for r in rows]

# ========================
# ADMIN APIs
# ========================
# (No token auth here; keep private in your dev LAN. You can add JWT later.)

@app.get("/admin/challenges_all")
def admin_list_all():
    with get_conn() as conn, conn.cursor() as cur:
        cur.execute("""
            SELECT challenge_id, title, difficulty, category, description, solution, hint, level
            FROM challenges ORDER BY challenge_id
        """)
        return [
            {
                "id": r[0], "title": r[1], "difficulty": r[2], "category": r[3],
                "description": r[4], "solution": r[5], "hint": r[6], "level": r[7]
            }
            for r in cur.fetchall()
        ]

@app.post("/admin/challenges")
def add_challenge():
    data = request.json
    with get_conn() as conn, conn.cursor() as cur:
        cur.execute(
            """
            INSERT INTO challenges (title, difficulty, category, description, solution, hint, level)
            VALUES (%s,%s,%s,%s,%s,%s,%s)
            RETURNING challenge_id
            """,
            (data["title"], data["difficulty"], data["category"],
             data["description"], data["solution"], data["hint"], data["level"])
        )
        cid = cur.fetchone()[0]
        conn.commit()
        return {"message": "Challenge added", "id": cid}, 201

@app.put("/admin/challenges/<int:cid>")
def update_challenge(cid):
    data = request.json
    with get_conn() as conn, conn.cursor() as cur:
        cur.execute(
            """
            UPDATE challenges
               SET title=%s, difficulty=%s, category=%s, description=%s,
                   solution=%s, hint=%s, level=%s
             WHERE challenge_id=%s
            """,
            (data["title"], data["difficulty"], data["category"], data["description"],
             data["solution"], data["hint"], data["level"], cid)
        )
        conn.commit()
        return {"message": "Challenge updated"}

@app.delete("/admin/challenges/<int:cid>")
def delete_challenge(cid):
    with get_conn() as conn, conn.cursor() as cur:
        cur.execute("DELETE FROM challenges WHERE challenge_id=%s", (cid,))
        conn.commit()
        return {"message": "Challenge deleted"}

# ========================
# RUN
# ========================
if __name__ == "__main__":
    app.run(debug=True, port=5000)
    get_conn()
