import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { API_BASE } from "../config";
import { Check, Lock } from "lucide-react";

export default function CategoryChallenges({ category }) {
  const [chals, setChals] = useState([]);
  const [completedLevels, setCompletedLevels] = useState(new Set());
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  useEffect(() => {
    fetchChallenges();
    fetchCompletedLevels();
  }, [category]);

  // Refetch when returning to page
  useEffect(() => {
    const handleHashChange = () => {
      if (window.location.hash.includes('/challenges/')) {
        fetchChallenges();
        fetchCompletedLevels();
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [category]);

  const fetchChallenges = () => {
    fetch(`${API_BASE}/challenges`)
      .then(r => r.json())
      .then(data => {
        const unique = [];
        const seen = new Set();
        data.forEach(c => {
          if (c.category === category && !seen.has(c.id)) {
            unique.push(c);
            seen.add(c.id);
          }
        });
        setChals(unique);
      })
      .catch(err => console.error("Fetch challenges error:", err));
  };

  const fetchCompletedLevels = async () => {
    try {
      const res = await fetch(`${API_BASE}/user/${user.user_id}/completed/${category}`);
      if (res.ok) {
        const data = await res.json();
        console.log("Completed challenges:", data);

        // Get unique levels that have at least one completed challenge
        const levelsCompleted = new Set(data.map(c => c.level));
        console.log("Completed levels:", Array.from(levelsCompleted));
        setCompletedLevels(levelsCompleted);
      }
    } catch (err) {
      console.error("Could not fetch completed challenges:", err);
    }
  };

  const levels = {
    1: "Level 1 - Tutorials",
    2: "Level 2 - Easy",
    3: "Level 3 - Medium",
    4: "Level 4 - Hard",
    5: "Level 5 - Insane"
  };

  const grouped = {};
  chals.forEach(c => {
    if (!grouped[c.level]) grouped[c.level] = c; // Store only first challenge per level
  });

  // ✅ IMPROVED LOGIC: Level unlocks if previous level has completed challenges
  const isLevelUnlocked = (level) => {
    return true; // Unlocked for testing purposes as requested
    /* 
    if (level === 1) return true; // Level 1 always unlocked

    // Check if previous level is completed
    const prevLevel = level - 1;
    const isPrevLevelComplete = completedLevels.has(prevLevel);

    console.log(`Level ${level}: previous level (${prevLevel}) completed:`, isPrevLevelComplete);
    return isPrevLevelComplete;
    */
  };

  return (
    <div>
      <Navbar />
      <div style={{ display: "flex" }}>
        <Sidebar />
        <main className="container" style={{
          background: "var(--bg)",
          minHeight: "100vh",
          position: "relative",
          overflow: "hidden"
        }}>
          {/* Background Effect */}
          <div style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "radial-gradient(circle at 50% 50%, rgba(0, 212, 255, 0.05) 0%, transparent 70%)",
            pointerEvents: "none",
            zIndex: 0
          }} />

          <div style={{ position: "relative", zIndex: 1, paddingBottom: "50px" }}>
            <div style={{ textAlign: "center", marginBottom: "50px" }}>
              <h1 style={{
                color: "var(--cyan)",
                fontSize: "3rem",
                marginBottom: "10px",
                textShadow: "0 0 20px rgba(0, 212, 255, 0.3)"
              }}>
                {category === 'AI' ? 'AI Learning Path' : `${category} Challenges`}
              </h1>
              <p style={{ color: "var(--muted)", fontSize: "1.2rem" }}>
                Master the art of {category} security through our progressive curriculum.
              </p>
            </div>

            <div style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              position: "relative",
              maxWidth: "800px",
              margin: "0 auto"
            }}>
              {/* Central Line */}
              <div style={{
                position: "absolute",
                top: "20px",
                bottom: "20px",
                width: "4px",
                background: "linear-gradient(to bottom, var(--cyan), var(--card-border))",
                zIndex: 0,
                borderRadius: "2px"
              }} />

              {Object.keys(levels).sort((a, b) => Number(a) - Number(b)).map((lvl, index) => {
                const levelNum = Number(lvl);
                const locked = !isLevelUnlocked(levelNum);
                const isLevelComplete = completedLevels.has(levelNum);
                const isNext = !locked && !isLevelComplete && isLevelUnlocked(levelNum);

                return (
                  <div key={lvl} style={{
                    width: "100%",
                    display: "flex",
                    justifyContent: index % 2 === 0 ? "flex-start" : "flex-end",
                    marginBottom: "60px",
                    position: "relative"
                  }}>
                    {/* Level Node on Line */}
                    <div style={{
                      position: "absolute",
                      left: "50%",
                      top: "50%",
                      transform: "translate(-50%, -50%)",
                      width: "40px",
                      height: "40px",
                      background: isLevelComplete ? "#51cf66" : locked ? "var(--card-border)" : "var(--cyan)",
                      borderRadius: "50%",
                      border: "4px solid var(--bg)",
                      zIndex: 2,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      boxShadow: isNext ? "0 0 20px var(--cyan)" : "none"
                    }}>
                      {isLevelComplete ? <Check size={20} color="#fff" /> : locked ? <Lock size={18} color="var(--muted)" /> : levelNum}
                    </div>

                    {/* Content Card */}
                    <div style={{
                      width: "45%",
                      padding: "0 20px",
                      textAlign: index % 2 === 0 ? "right" : "left"
                    }}>
                      <div style={{
                        background: locked ? "var(--input-bg)" : "var(--card-bg)",
                        border: `1px solid ${isLevelComplete ? "#51cf66" : locked ? "var(--card-border)" : "var(--cyan)"}`,
                        borderRadius: "15px",
                        padding: "20px",
                        opacity: locked ? 0.7 : 1,
                        transform: isNext ? "scale(1.05)" : "scale(1)",
                        transition: "all 0.3s ease",
                        boxShadow: isNext ? "0 0 30px rgba(0, 212, 255, 0.1)" : "none",
                        position: "relative"
                      }}>
                        <h2 style={{
                          color: isLevelComplete ? "#51cf66" : locked ? "var(--muted)" : "var(--text)",
                          fontSize: "1.5rem",
                          marginBottom: "10px"
                        }}>
                          {levels[lvl]}
                        </h2>

                        {grouped[lvl] ? (
                          <div style={{ marginTop: "10px" }}>
                            <p style={{ color: "var(--muted)", marginBottom: "15px" }}>{grouped[lvl].description}</p>

                            {locked ? (
                              <button disabled style={{
                                padding: "10px 20px",
                                background: "var(--card-border)",
                                color: "var(--muted)",
                                border: "none",
                                borderRadius: "8px",
                                cursor: "not-allowed"
                              }}>
                                Locked
                              </button>
                            ) : (
                              <a
                                href={
                                  grouped[lvl].category === 'AI' ? `#/ai-challenge/${grouped[lvl].level}` :
                                    grouped[lvl].category === 'Web' ? `#/web-challenge/${grouped[lvl].level}` :
                                      grouped[lvl].category === 'Cryptography' ? `#/crypto-challenge/${grouped[lvl].level}` :
                                        grouped[lvl].category === 'Forensics' ? `#/forensics-challenge/${grouped[lvl].level}` :
                                          grouped[lvl].category === 'Reverse Engineering' ? `#/reverse-challenge/${grouped[lvl].level}` :
                                            grouped[lvl].category === 'Misc' ? `#/misc-challenge/${grouped[lvl].level}` :
                                              grouped[lvl].category === 'Linux' ? `#/linux-challenge/${grouped[lvl].level}` :
                                                `#/challenge/${grouped[lvl].id}`
                                }
                                style={{
                                  display: "inline-block",
                                  padding: "10px 25px",
                                  background: isLevelComplete ? "rgba(81, 207, 102, 0.2)" : "var(--cyan)",
                                  color: isLevelComplete ? "#51cf66" : "#000",
                                  textDecoration: "none",
                                  borderRadius: "8px",
                                  fontWeight: "bold",
                                  border: isLevelComplete ? "1px solid #51cf66" : "none"
                                }}
                              >
                                {isLevelComplete ? "Replay Level" : "Start Challenge"}
                              </a>
                            )}
                          </div>
                        ) : null}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}