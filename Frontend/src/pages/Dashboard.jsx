import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { API_BASE } from "../config";

export default function Dashboard() {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const [leaderboard, setLeaderboard] = useState([]);
  const [challenges, setChallenges] = useState({ beginner: 0, intermediate: 0, advanced: 0 });
  const [achievements, setAchievements] = useState([]);

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

    // Calculate achievements based on progress
    calculateAchievements();
  }, [user.user_id]);

  const calculateAchievements = () => {
    const progress = user?.progress || 0;
    const userAchievements = [];

    // Achievement definitions
    const achievementList = [
      {
        id: 1,
        name: "First Steps",
        description: "Complete your first challenge",
        icon: "🎯",
        unlocked: progress >= 5,
        progress: Math.min(progress, 5),
        required: 5
      },
      {
        id: 2,
        name: "Getting Started",
        description: "Reach 10% progress",
        icon: "🌟",
        unlocked: progress >= 10,
        progress: Math.min(progress, 10),
        required: 10
      },
      {
        id: 3,
        name: "Quick Learner",
        description: "Reach 25% progress",
        icon: "⚡",
        unlocked: progress >= 25,
        progress: Math.min(progress, 25),
        required: 25
      },
      {
        id: 4,
        name: "Dedicated Student",
        description: "Reach 50% progress",
        icon: "🏅",
        unlocked: progress >= 50,
        progress: Math.min(progress, 50),
        required: 50
      },
      {
        id: 5,
        name: "Security Expert",
        description: "Reach 75% progress",
        icon: "🔒",
        unlocked: progress >= 75,
        progress: Math.min(progress, 75),
        required: 75
      },
      {
        id: 6,
        name: "Master Hacker",
        description: "Complete all challenges (100%)",
        icon: "🏆",
        unlocked: progress >= 100,
        progress: Math.min(progress, 100),
        required: 100
      }
    ];

    setAchievements(achievementList);
  };

  const progress = user?.progress || 0;
  const level = Math.floor(progress / 10) + 1;

  return (
    <div>
      <Navbar />
      <div style={{ display: "flex" }}>
        <Sidebar active="dashboard" />
        <main style={{ flex: 1, padding: "40px", background: "var(--bg)", minHeight: "100vh", color: "var(--text)" }}>
          <h1 style={{ color: "var(--cyan)", fontSize: "36px", marginBottom: "30px" }}>Dashboard</h1>

          <div style={{ display: "flex", gap: "30px" }}>
            {/* Left Section */}
            <div style={{ flex: 2 }}>
              {/* User Info Card */}
              <div style={{ background: "var(--card-bg)", padding: "30px", borderRadius: "10px", marginBottom: "30px", border: "1px solid var(--card-border)" }}>
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
                    {user?.profilePic ? (
                      <img src={user.profilePic} alt="Profile" style={{ width: "100%", height: "100%", borderRadius: "50%", objectFit: "cover" }} />
                    ) : (
                      "👤"
                    )}
                  </div>
                  <div>
                    <h2 style={{ color: "var(--text)", margin: 0, fontSize: "28px" }}>{user?.name || "Guest"}</h2>
                    <p style={{ margin: "5px 0 0 0", color: "var(--muted)" }}>Lv. {level}</p>
                  </div>
                </div>

                {/* Progress Bar */}
                <div style={{ marginTop: "20px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                    <span style={{ color: "var(--muted)" }}>Progress</span>
                    <span style={{ color: "var(--text)", fontWeight: "bold" }}>{progress}%</span>
                  </div>
                  <div style={{
                    width: "100%",
                    height: "12px",
                    background: "var(--card-border)",
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
              <div style={{ background: "var(--card-bg)", padding: "30px", borderRadius: "10px", marginBottom: "30px", border: "1px solid var(--card-border)" }}>
                <h3 style={{ color: "var(--text)", marginBottom: "20px", fontSize: "22px" }}>Challenges</h3>
                <div style={{ display: "flex", gap: "20px" }}>
                  <div style={{ flex: 1, textAlign: "center" }}>
                    <p style={{ color: "var(--muted)", margin: "0 0 5px 0" }}>Beginner</p>
                    <p style={{ color: "var(--text)", fontSize: "32px", fontWeight: "bold", margin: 0 }}>{challenges.beginner}</p>
                  </div>
                  <div style={{ flex: 1, textAlign: "center" }}>
                    <p style={{ color: "var(--muted)", margin: "0 0 5px 0" }}>Intermediate</p>
                    <p style={{ color: "var(--text)", fontSize: "32px", fontWeight: "bold", margin: 0 }}>{challenges.intermediate}</p>
                  </div>
                  <div style={{ flex: 1, textAlign: "center" }}>
                    <p style={{ color: "var(--muted)", margin: "0 0 5px 0" }}>Advanced</p>
                    <p style={{ color: "var(--text)", fontSize: "32px", fontWeight: "bold", margin: 0 }}>{challenges.advanced}</p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: "flex", gap: "15px" }}>
                <a href="#/challenges" className="btn btn-green" style={{ flex: 1, textAlign: "center", padding: "15px", textDecoration: "none" }}>
                  Start Challenge
                </a>
                <a href="#/hints" className="btn btn-cyan" style={{ flex: 1, textAlign: "center", padding: "15px", textDecoration: "none" }}>
                  View Hints
                </a>
                <a href="#/tutorials" className="btn btn-ghost" style={{ flex: 1, textAlign: "center", padding: "15px", textDecoration: "none" }}>
                  Tutorials
                </a>
              </div>
            </div>

            {/* Right Section - Leaderboard & Achievements */}
            <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "30px" }}>
              {/* Leaderboard */}
              <div style={{ background: "var(--card-bg)", padding: "25px", borderRadius: "10px", border: "1px solid var(--card-border)" }}>
                <h3 style={{ color: "var(--text)", marginBottom: "20px", fontSize: "22px" }}>Leaderboard</h3>
                {leaderboard.length === 0 ? (
                  <p style={{ color: "var(--muted)" }}>No users yet.</p>
                ) : (
                  <div>
                    {leaderboard.map((u, i) => (
                      <div key={i} style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        padding: "12px 0",
                        borderBottom: i < leaderboard.length - 1 ? "1px solid var(--card-border)" : "none"
                      }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
                          <span style={{ color: i < 3 ? "#00d4ff" : "var(--muted)", fontWeight: "bold", fontSize: "18px" }}>
                            {i + 1}.
                          </span>
                          <span style={{ color: "var(--text)" }}>{u.name}</span>
                        </div>
                        <span style={{ color: "#00ff88", fontWeight: "bold" }}>{u.progress}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Achievements */}
              <div style={{ background: "var(--card-bg)", padding: "25px", borderRadius: "10px", border: "1px solid var(--card-border)" }}>
                <h3 style={{ color: "var(--text)", marginBottom: "20px", fontSize: "22px" }}>Achievements</h3>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "15px" }}>
                  {achievements.map((achievement) => (
                    <div
                      key={achievement.id}
                      style={{
                        position: "relative",
                        width: "100%",
                        paddingTop: "100%",
                        background: achievement.unlocked ? "var(--card-border)" : "var(--input-bg)",
                        borderRadius: "10px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        cursor: "pointer",
                        border: achievement.unlocked ? "2px solid #00d4ff" : "2px solid #444",
                        transition: "all 0.3s ease",
                        overflow: "hidden"
                      }}
                      title={`${achievement.name}: ${achievement.description} (${achievement.progress}/${achievement.required}%)`}
                    >
                      <div style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center"
                      }}>
                        <div style={{
                          fontSize: "32px",
                          opacity: achievement.unlocked ? 1 : 0.3,
                          filter: achievement.unlocked ? "none" : "grayscale(100%)"
                        }}>
                          {achievement.icon}
                        </div>
                        {!achievement.unlocked && (
                          <div style={{
                            position: "absolute",
                            bottom: "5px",
                            fontSize: "10px",
                            color: "#666",
                            fontWeight: "bold"
                          }}>
                            {achievement.progress}/{achievement.required}%
                          </div>
                        )}
                        {achievement.unlocked && (
                          <div style={{
                            position: "absolute",
                            top: "5px",
                            right: "5px",
                            fontSize: "12px"
                          }}>
                            ✅
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Achievement Progress Info */}
                <div style={{ marginTop: "20px", padding: "15px", background: "var(--input-bg)", borderRadius: "8px" }}>
                  <p style={{ color: "#888", fontSize: "12px", margin: 0 }}>
                    <strong style={{ color: "#00d4ff" }}>{achievements.filter(a => a.unlocked).length}</strong> of <strong>{achievements.length}</strong> achievements unlocked
                  </p>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}