import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import WebTerminal from "../components/WebTerminal";
import { API_BASE } from "../config";
import { Terminal, X, ChevronRight, ChevronLeft, Award } from "lucide-react";

export default function LinuxChallenge({ level }) {
    const [currentLevel, setCurrentLevel] = useState(level || 1);
    const [challenge, setChallenge] = useState(null);
    const [flag, setFlag] = useState("");
    const [message, setMessage] = useState("");
    const [showTerminal, setShowTerminal] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const user = JSON.parse(localStorage.getItem("user") || "{}");

    useEffect(() => {
        fetchChallenge(currentLevel);
    }, [currentLevel]);

    const fetchChallenge = async (lvl) => {
        try {
            const res = await fetch(`${API_BASE}/challenges`);
            const data = await res.json();
            const linuxChallenges = data.filter(c => c.category === 'Linux');
            const chal = linuxChallenges.find(c => c.level === lvl);
            if (chal) {
                setChallenge(chal);
            }
        } catch (err) {
            console.error("Error fetching linux challenge:", err);
        }
    };

    const submitFlag = async (e) => {
        e.preventDefault();
        if (!challenge) return;

        try {
            const res = await fetch(`${API_BASE}/submit`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    user_id: user.user_id,
                    id: challenge.id,
                    flag: flag
                })
            });
            const data = await res.json();

            if (data.result && data.result.includes("Correct")) {
                setMessage("🎉 Correct Flag! Well done.");
                setSubmitted(true);
            } else {
                setMessage("❌ Incorrect flag. Try again!");
            }
        } catch (err) {
            console.error(err);
            setMessage("Error submitting flag");
        }
    };

    const nextLevel = () => {
        if (currentLevel < 9) {
            setCurrentLevel(currentLevel + 1);
            setFlag("");
            setMessage("");
            setSubmitted(false);
            setShowTerminal(false);
            window.location.hash = `#/linux-challenge/${currentLevel + 1}`;
        } else {
            window.location.hash = "#/challenges";
        }
    };

    if (!challenge) return <div style={{ background: "var(--bg)", minHeight: "100vh", color: "var(--text)", padding: "20px" }}>Loading Linux Challenge...</div>;

    return (
        <div>
            <Navbar />
            <div style={{ display: "flex" }}>
                <Sidebar />
                <main style={{
                    flex: 1,
                    padding: "20px",
                    background: "var(--bg)",
                    minHeight: "100vh",
                    color: "var(--text)",
                    maxWidth: "1200px",
                    margin: "0 auto"
                }}>

                    {/* Header with Navigation */}
                    <div style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: "30px",
                        borderBottom: "1px solid var(--card-border)",
                        paddingBottom: "20px"
                    }}>
                        <div>
                            <div style={{ display: "flex", alignItems: "center", gap: "10px", color: "var(--muted)", fontSize: "0.9rem", marginBottom: "5px" }}>
                                <span>Linux Curriculum</span>
                                <ChevronRight size={14} />
                                <span style={{ color: "var(--cyan)" }}>Level {currentLevel}</span>
                            </div>
                            <h1 style={{ color: "var(--text)", margin: 0, fontSize: "2rem" }}>{challenge.title}</h1>
                        </div>

                        <div style={{ display: "flex", gap: "15px" }}>
                            <button
                                onClick={() => setShowTerminal(!showTerminal)}
                                style={{
                                    background: showTerminal ? "var(--danger)" : "var(--green)",
                                    color: "#000",
                                    border: "none",
                                    padding: "10px 20px",
                                    borderRadius: "8px",
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "8px",
                                    fontWeight: "bold",
                                    cursor: "pointer",
                                    boxShadow: showTerminal ? "0 0 15px rgba(255, 107, 107, 0.3)" : "0 0 15px rgba(32, 201, 151, 0.3)",
                                    transition: "all 0.3s ease"
                                }}
                            >
                                <Terminal size={18} />
                                {showTerminal ? "Terminate PwnBox" : "Spawn PwnBox"}
                            </button>
                        </div>
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: showTerminal ? "400px 1fr" : "1fr", gap: "20px", transition: "all 0.3s ease" }}>

                        {/* Task Information */}
                        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                            <div className="card" style={{ margin: 0 }}>
                                <h3 style={{ color: "var(--cyan)", marginTop: 0, display: "flex", alignItems: "center", gap: "8px" }}>
                                    <Award size={20} /> Level Goal
                                </h3>
                                <p style={{ lineHeight: "1.6", color: "var(--text)" }}>
                                    {challenge.description}
                                </p>
                            </div>

                            <div className="card" style={{ margin: 0 }}>
                                <h4 style={{ color: "var(--muted)", marginTop: 0 }}>Helpful Commands</h4>
                                <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginTop: "10px" }}>
                                    {["ssh", "ls", "cat", "cd", "grep", "find", "base64"].map(cmd => (
                                        <code key={cmd} style={{ background: "var(--input-bg)", padding: "4px 8px", borderRadius: "4px", color: "var(--cyan)", border: "1px solid var(--card-border)" }}>
                                            {cmd}
                                        </code>
                                    ))}
                                </div>
                            </div>

                            {!submitted ? (
                                <div className="card" style={{ margin: 0 }}>
                                    <h3 style={{ marginTop: 0 }}>Submit Flag</h3>
                                    <form onSubmit={submitFlag} style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                                        <input
                                            className="input"
                                            placeholder="flag{...}"
                                            value={flag}
                                            onChange={(e) => setFlag(e.target.value)}
                                            style={{ margin: 0 }}
                                        />
                                        <button className="btn btn-green" type="submit">Check Flag</button>
                                    </form>
                                    {message && (
                                        <p style={{
                                            marginTop: "15px",
                                            padding: "10px",
                                            borderRadius: "6px",
                                            background: message.includes("Correct") ? "rgba(81, 207, 102, 0.1)" : "rgba(255, 107, 107, 0.1)",
                                            color: message.includes("Correct") ? "#51cf66" : "#ff6b6b",
                                            border: `1px solid ${message.includes("Correct") ? "#51cf66" : "#ff6b6b"}`
                                        }}>
                                            {message}
                                        </p>
                                    )}
                                </div>
                            ) : (
                                <div className="card" style={{ margin: 0, background: "rgba(81, 207, 102, 0.1)", border: "1px solid #51cf66", textAlign: "center" }}>
                                    <h3 style={{ color: "#51cf66", marginTop: 0 }}>Level Complete! 🏆</h3>
                                    <p style={{ marginBottom: "20px" }}>You've successfully solved Level {currentLevel}.</p>
                                    <button
                                        onClick={nextLevel}
                                        className="btn btn-green"
                                        style={{ width: "100%" }}
                                    >
                                        Next Level ➡️
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Embedded Terminal Section */}
                        {showTerminal && (
                            <div style={{
                                background: "#000",
                                borderRadius: "12px",
                                border: "1px solid #333",
                                overflow: "hidden",
                                height: "600px",
                                display: "flex",
                                flexDirection: "column",
                                animation: "fadeIn 0.5s ease"
                            }}>
                                <div style={{
                                    background: "#1e1e1e",
                                    padding: "10px 15px",
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                    borderBottom: "1px solid #333"
                                }}>
                                    <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                                        <Terminal size={14} color="var(--green)" />
                                        <span style={{ fontSize: "0.8rem", color: "#888", fontWeight: "bold" }}>root@pwnbox:~ (Bandit-Environment)</span>
                                    </div>
                                    <div style={{ display: "flex", gap: "6px" }}>
                                        <div style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#ff5f56" }}></div>
                                        <div style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#ffbd2e" }}></div>
                                        <div style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#27c93f" }}></div>
                                    </div>
                                </div>
                                <div style={{ flex: 1, position: "relative" }}>
                                    <WebTerminal host="pwnbox" user={user} />
                                </div>
                            </div>
                        )}
                    </div>

                </main>
            </div>

            <style>{`
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `}</style>
        </div>
    );
}
