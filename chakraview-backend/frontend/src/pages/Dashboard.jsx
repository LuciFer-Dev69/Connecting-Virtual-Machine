import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { API_BASE } from "../config";

export default function Dashboard() {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const [leaderboard, setLeaderboard] = useState([]);
  const [challenges, setChallenges] = useState({ beginner: 0, intermediate: 0, advanced: 0 });

  useEffect(() => {
    // Fetch leaderboard
    fetch(`${API_BASE}/leaderboard`)
      .then(r => r.json())
      .then(data => setLeaderboard(data.slice(0, 5)))
      .catch(err => console.error(err));

    // Fetch user's challenge stats
    fetch(`${API_BASE}/user/${user.user_id}/stats`)
      .then(r => r.json())
      .then(data => {
        setChallenges({
          beginner: data.beginner || 0,
          intermediate: data.intermediate || 0,
          advanced: data.advanced || 0
        });
      })
      .catch(err => console.error(err));
  }, [user.user_id]);

  const progress = user?.progress || 0;
  const level = Math.floor(progress / 10) + 1;

  return (
    <div>
      <Navbar />
      <div style={{ display: "flex" }}>
        <Sidebar active="dashboard" />
        <main style={{ flex: 1, padding: "40px", background: "#121212", minHeight: "100vh", color: "#ccc" }}>
          <h1 style={{ color: "var(--cyan)", fontSize: "36px", marginBottom: "30px" }}>Dashboard</h1>

          <div style={{ display: "flex", gap: "30px" }}>
            {/* Left Section */}
            <div style={{ flex: 2 }}>
              {/* User Info Card */}
              <div style={{ background: "#1f1f1f", padding: "30px", borderRadius: "10px", marginBottom: "30px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "20px", marginBottom: "20px" }}>
                  <div style={{
                    width: "60px",
                    height: "60px",
                    background: "#333",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "24px"
                  }}>
                    👤
                  </div>
                  <div>
                    <h2 style={{ color: "#fff", margin: 0, fontSize: "28px" }}>{user?.name || "Guest"}</h2>
                    <p style={{ margin: "5px 0 0 0", color: "#888" }}>Lv. {level}</p>
                  </div>
                </div>

                {/* Progress Bar */}
                <div style={{ marginTop: "20px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                    <span style={{ color: "#ccc" }}>Progress</span>
                    <span style={{ color: "#fff", fontWeight: "bold" }}>{progress}%</span>
                  </div>
                  <div style={{
                    width: "100%",
                    height: "12px",
                    background: "#2a2a2a",
                    borderRadius: "10px",
                    overflow: "hidden"
                  }}>
                    <div style={{
                      width: `${progress}%`,
                      height: "100%",
                      background: "linear-gradient(90deg, #00d4ff, #00ff88)",
                      transition: "width 0.3s ease"
                    }} />
                  </div>
                </div>
              </div>

              {/* Challenges Section */}
              <div style={{ background: "#1f1f1f", padding: "30px", borderRadius: "10px", marginBottom: "30px" }}>
                <h3 style={{ color: "#fff", marginBottom: "20px", fontSize: "22px" }}>Challenges</h3>
                <div style={{ display: "flex", gap: "20px" }}>
                  <div style={{ flex: 1, textAlign: "center" }}>
                    <p style={{ color: "#888", margin: "0 0 5px 0" }}>Beginner</p>
                    <p style={{ color: "#fff", fontSize: "32px", fontWeight: "bold", margin: 0 }}>{challenges.beginner}</p>
                  </div>
                  <div style={{ flex: 1, textAlign: "center" }}>
                    <p style={{ color: "#888", margin: "0 0 5px 0" }}>Intermediate</p>
                    <p style={{ color: "#fff", fontSize: "32px", fontWeight: "bold", margin: 0 }}>{challenges.intermediate}</p>
                  </div>
                  <div style={{ flex: 1, textAlign: "center" }}>
                    <p style={{ color: "#888", margin: "0 0 5px 0" }}>Advanced</p>
                    <p style={{ color: "#fff", fontSize: "32px", fontWeight: "bold", margin: 0 }}>{challenges.advanced}</p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: "flex", gap: "15px" }}>
                <a href="#/challenges" className="btn btn-green" style={{ flex: 1, textAlign: "center", padding: "15px" }}>
                  Start Challenge
                </a>
                <a href="#/hints" className="btn btn-cyan" style={{ flex: 1, textAlign: "center", padding: "15px" }}>
                  View Hints
                </a>
                <a href="#/tutorials" className="btn btn-ghost" style={{ flex: 1, textAlign: "center", padding: "15px" }}>
                  Tutorials
                </a>
              </div>
            </div>

            {/* Right Section - Leaderboard & Achievements */}
            <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "30px" }}>
              {/* Leaderboard */}
              <div style={{ background: "#1f1f1f", padding: "25px", borderRadius: "10px" }}>
                <h3 style={{ color: "#fff", marginBottom: "20px", fontSize: "22px" }}>Leaderboard</h3>
                {leaderboard.length === 0 ? (
                  <p style={{ color: "#888" }}>No users yet.</p>
                ) : (
                  <div>
                    {leaderboard.map((u, i) => (
                      <div key={i} style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        padding: "12px 0",
                        borderBottom: i < leaderboard.length - 1 ? "1px solid #333" : "none"
                      }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
                          <span style={{ color: i < 3 ? "#00d4ff" : "#888", fontWeight: "bold", fontSize: "18px" }}>
                            {i + 1}.
                          </span>
                          <span style={{ color: "#fff" }}>{u.name}</span>
                        </div>
                        <span style={{ color: "#00ff88", fontWeight: "bold" }}>{u.progress}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Achievements */}
              <div style={{ background: "#1f1f1f", padding: "25px", borderRadius: "10px" }}>
                <h3 style={{ color: "#fff", marginBottom: "20px", fontSize: "22px" }}>Achievements</h3>
                <div style={{ display: "flex", gap: "15px", justifyContent: "center" }}>
                  <div style={{
                    width: "60px",
                    height: "60px",
                    background: "#333",
                    borderRadius: "10px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "30px"
                  }}>
                    🏅
                  </div>
                  <div style={{
                    width: "60px",
                    height: "60px",
                    background: "#333",
                    borderRadius: "10px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "30px"
                  }}>
                    🏆
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}