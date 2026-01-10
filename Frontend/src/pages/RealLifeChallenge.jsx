import React, { useState, useEffect } from 'react';
import { API_BASE } from '../config';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import { ArrowLeft, Play, Square, ExternalLink, Lightbulb, Flag, Award } from 'lucide-react';

const RealLifeChallenge = ({ id }) => {
    const [challenge, setChallenge] = useState(null);
    const [session, setSession] = useState(null);
    const [loading, setLoading] = useState(true);
    const [spawning, setSpawning] = useState(false);
    const [flag, setFlag] = useState("");
    const [result, setResult] = useState(null);
    const [revealedHints, setRevealedHints] = useState([]);

    const user_id = JSON.parse(localStorage.getItem('user'))?.user_id || 1;

    const fetchDetails = () => {
        fetch(`${API_BASE}/real-life-challenges/${id}?user_id=${user_id}`)
            .then(res => res.json())
            .then(data => {
                setChallenge(data.challenge);
                setSession(data.session);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    };

    useEffect(() => {
        fetchDetails();
    }, [id]);

    const handleStart = () => {
        setSpawning(true);
        fetch(`${API_BASE}/real-life-challenges/${id}/start`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ user_id })
        })
            .then(res => res.json())
            .then(data => {
                setSpawning(false);
                if (data.url) {
                    fetchDetails();
                } else {
                    alert("Failed to spawn: " + data.error);
                }
            })
            .catch(err => {
                setSpawning(false);
                alert("Error spawning challenge");
            });
    };

    const handleStop = () => {
        if (!window.confirm("Stop this challenge? The environment will be destroyed.")) return;

        fetch(`${API_BASE}/real-life-challenges/${id}/stop`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ user_id })
        })
            .then(() => {
                setSession(null);
            });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        fetch(`${API_BASE}/real-life-challenges/${id}/submit`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ user_id, flag })
        })
            .then(res => res.json())
            .then(data => {
                if (data.result === 'correct') {
                    setResult({ type: 'success', msg: `🎉 Correct! +${data.points} Points` });
                } else {
                    setResult({ type: 'error', msg: '❌ Incorrect flag' });
                }
            });
    };

    const revealHint = (index) => {
        if (revealedHints.includes(index)) return;
        if (!window.confirm(`Reveal Hint ${index + 1}?`)) return;
        setRevealedHints([...revealedHints, index]);
    };

    if (loading) return (
        <div style={{ display: "flex", minHeight: "100vh", background: "var(--bg)" }}>
            <Sidebar active="real-life-challenges" />
            <div style={{ flex: 1, marginLeft: "220px" }}>
                <Navbar />
                <div style={{ padding: "40px", textAlign: "center", color: "var(--text)" }}>Loading...</div>
            </div>
        </div>
    );

    if (!challenge) return (
        <div style={{ display: "flex", minHeight: "100vh", background: "var(--bg)" }}>
            <Sidebar active="real-life-challenges" />
            <div style={{ flex: 1, marginLeft: "220px" }}>
                <Navbar />
                <div style={{ padding: "40px", textAlign: "center", color: "var(--text)" }}>Challenge not found</div>
            </div>
        </div>
    );

    return (
        <div style={{ display: "flex", minHeight: "100vh", background: "var(--bg)" }}>
            <Sidebar active="real-life-challenges" />
            <div style={{ flex: 1, marginLeft: "220px", display: "flex", flexDirection: "column" }}>
                <Navbar />

                {/* Header Bar */}
                <div style={{
                    background: "var(--card-bg)",
                    borderBottom: "1px solid var(--card-border)",
                    padding: "20px 40px",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center"
                }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
                        <button
                            onClick={() => window.location.hash = '#/real-life-challenges'}
                            style={{
                                background: "var(--input-bg)",
                                border: "1px solid var(--card-border)",
                                color: "var(--text)",
                                padding: "8px 16px",
                                borderRadius: "8px",
                                cursor: "pointer",
                                display: "flex",
                                alignItems: "center",
                                gap: "8px",
                                fontSize: "14px",
                                fontWeight: "500"
                            }}
                        >
                            <ArrowLeft size={16} /> Back
                        </button>
                        <div>
                            <h1 style={{ fontSize: "24px", fontWeight: "700", color: "var(--text)", margin: 0 }}>
                                {challenge.title}
                            </h1>
                            <div style={{ display: "flex", gap: "12px", marginTop: "8px" }}>
                                <span style={{
                                    fontSize: "12px",
                                    background: "var(--cyan)20",
                                    color: "var(--cyan)",
                                    padding: "4px 10px",
                                    borderRadius: "6px",
                                    fontWeight: "600"
                                }}>
                                    {challenge.category}
                                </span>
                                <span style={{
                                    fontSize: "12px",
                                    background: "var(--input-bg)",
                                    color: "var(--muted)",
                                    padding: "4px 10px",
                                    borderRadius: "6px"
                                }}>
                                    {challenge.difficulty}
                                </span>
                                <span style={{
                                    fontSize: "12px",
                                    background: "var(--input-bg)",
                                    color: "var(--cyan)",
                                    padding: "4px 10px",
                                    borderRadius: "6px",
                                    fontWeight: "600"
                                }}>
                                    {challenge.points} Points
                                </span>
                            </div>
                        </div>
                    </div>

                    {session && session.status === 'active' ? (
                        <div style={{ display: "flex", gap: "12px" }}>
                            <button
                                onClick={() => window.open(`http://localhost:${session.assigned_port}`, '_blank')}
                                style={{
                                    background: "var(--input-bg)",
                                    border: "1px solid var(--card-border)",
                                    color: "var(--text)",
                                    padding: "10px 16px",
                                    borderRadius: "8px",
                                    cursor: "pointer",
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "8px",
                                    fontSize: "14px",
                                    fontWeight: "500"
                                }}
                            >
                                <ExternalLink size={16} /> Open in Tab
                            </button>
                            <button
                                onClick={handleStop}
                                style={{
                                    background: "#ff6b6b",
                                    border: "none",
                                    color: "#fff",
                                    padding: "10px 16px",
                                    borderRadius: "8px",
                                    cursor: "pointer",
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "8px",
                                    fontSize: "14px",
                                    fontWeight: "600"
                                }}
                            >
                                <Square size={16} /> Stop
                            </button>
                        </div>
                    ) : (
                        <button
                            onClick={handleStart}
                            disabled={spawning}
                            style={{
                                background: spawning ? "var(--input-bg)" : "var(--cyan)",
                                border: "none",
                                color: spawning ? "var(--muted)" : "#000",
                                padding: "12px 24px",
                                borderRadius: "8px",
                                cursor: spawning ? "wait" : "pointer",
                                display: "flex",
                                alignItems: "center",
                                gap: "8px",
                                fontSize: "14px",
                                fontWeight: "700"
                            }}
                        >
                            <Play size={16} /> {spawning ? "Launching..." : "Launch Environment"}
                        </button>
                    )}
                </div>

                {/* Main Content Area */}
                <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>
                    {/* Left: Challenge View */}
                    <div style={{ flex: 1, display: "flex", flexDirection: "column", background: "var(--input-bg)" }}>
                        {session && session.status === 'active' ? (
                            <iframe
                                src={`http://localhost:${session.assigned_port}`}
                                title="Vulnerable App"
                                style={{ width: "100%", height: "100%", border: "none" }}
                            />
                        ) : (
                            <div style={{
                                flex: 1,
                                display: "flex",
                                flexDirection: "column",
                                justifyContent: "center",
                                alignItems: "center",
                                padding: "60px",
                                textAlign: "center"
                            }}>
                                <div style={{
                                    width: "80px",
                                    height: "80px",
                                    background: "var(--cyan)20",
                                    borderRadius: "50%",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    marginBottom: "24px"
                                }}>
                                    <Award size={40} style={{ color: "var(--cyan)" }} />
                                </div>
                                <h2 style={{ fontSize: "28px", fontWeight: "700", color: "var(--text)", marginBottom: "16px" }}>
                                    Ready to Hack?
                                </h2>
                                <p style={{ fontSize: "16px", color: "var(--muted)", maxWidth: "500px", lineHeight: "1.6" }}>
                                    {challenge.description}
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Right: Info Panel */}
                    <div style={{
                        width: "400px",
                        background: "var(--card-bg)",
                        borderLeft: "1px solid var(--card-border)",
                        overflowY: "auto",
                        display: "flex",
                        flexDirection: "column"
                    }}>
                        <div style={{ padding: "24px" }}>
                            {/* Objective */}
                            <div style={{ marginBottom: "24px" }}>
                                <h3 style={{
                                    fontSize: "14px",
                                    fontWeight: "700",
                                    color: "var(--text)",
                                    textTransform: "uppercase",
                                    letterSpacing: "0.5px",
                                    marginBottom: "12px"
                                }}>
                                    Mission Objective
                                </h3>
                                <div style={{
                                    background: "var(--input-bg)",
                                    padding: "16px",
                                    borderRadius: "8px",
                                    border: "1px solid var(--card-border)"
                                }}>
                                    <p style={{ fontSize: "14px", color: "var(--muted)", lineHeight: "1.6", margin: 0 }}>
                                        {challenge.description}
                                    </p>
                                </div>
                            </div>

                            {/* Hints */}
                            <div style={{ marginBottom: "24px" }}>
                                <h3 style={{
                                    fontSize: "14px",
                                    fontWeight: "700",
                                    color: "var(--text)",
                                    textTransform: "uppercase",
                                    letterSpacing: "0.5px",
                                    marginBottom: "12px",
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "8px"
                                }}>
                                    <Lightbulb size={16} /> Hints
                                </h3>
                                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                                    {challenge.hints && challenge.hints.map((hint, idx) => (
                                        <div key={idx} style={{
                                            background: revealedHints.includes(idx) ? "var(--input-bg)" : "transparent",
                                            border: "1px solid var(--card-border)",
                                            borderRadius: "8px",
                                            overflow: "hidden"
                                        }}>
                                            {revealedHints.includes(idx) ? (
                                                <div style={{ padding: "12px" }}>
                                                    <div style={{ fontSize: "11px", color: "#ffd43b", fontWeight: "700", marginBottom: "6px" }}>
                                                        HINT #{idx + 1}
                                                    </div>
                                                    <p style={{ fontSize: "13px", color: "var(--text)", margin: 0, lineHeight: "1.5" }}>
                                                        {hint.text}
                                                    </p>
                                                </div>
                                            ) : (
                                                <button
                                                    onClick={() => revealHint(idx)}
                                                    style={{
                                                        width: "100%",
                                                        background: "transparent",
                                                        border: "none",
                                                        padding: "12px",
                                                        cursor: "pointer",
                                                        display: "flex",
                                                        justifyContent: "space-between",
                                                        alignItems: "center",
                                                        color: "var(--muted)",
                                                        fontSize: "13px"
                                                    }}
                                                >
                                                    <span>Unlock Hint #{idx + 1}</span>
                                                    <span style={{
                                                        background: "#ffd43b20",
                                                        color: "#ffd43b",
                                                        padding: "4px 8px",
                                                        borderRadius: "4px",
                                                        fontSize: "11px",
                                                        fontWeight: "600"
                                                    }}>
                                                        -{hint.cost} PTS
                                                    </span>
                                                </button>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Flag Submission */}
                            <div>
                                <h3 style={{
                                    fontSize: "14px",
                                    fontWeight: "700",
                                    color: "var(--text)",
                                    textTransform: "uppercase",
                                    letterSpacing: "0.5px",
                                    marginBottom: "12px",
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "8px"
                                }}>
                                    <Flag size={16} /> Submit Flag
                                </h3>
                                <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                                    <input
                                        type="text"
                                        placeholder="FLAG{...}"
                                        value={flag}
                                        onChange={(e) => setFlag(e.target.value)}
                                        style={{
                                            width: "100%",
                                            background: "var(--input-bg)",
                                            border: "1px solid var(--card-border)",
                                            borderRadius: "8px",
                                            padding: "12px",
                                            color: "var(--text)",
                                            fontSize: "14px",
                                            fontFamily: "monospace",
                                            outline: "none"
                                        }}
                                    />
                                    <button
                                        type="submit"
                                        style={{
                                            width: "100%",
                                            background: "#51cf66",
                                            border: "none",
                                            color: "#000",
                                            padding: "12px",
                                            borderRadius: "8px",
                                            fontWeight: "700",
                                            fontSize: "14px",
                                            cursor: "pointer"
                                        }}
                                    >
                                        Submit Flag
                                    </button>
                                </form>

                                {result && (
                                    <div style={{
                                        marginTop: "12px",
                                        padding: "12px",
                                        borderRadius: "8px",
                                        background: result.type === 'success' ? "#51cf6620" : "#ff6b6b20",
                                        border: `1px solid ${result.type === 'success' ? "#51cf66" : "#ff6b6b"}40`,
                                        color: result.type === 'success' ? "#51cf66" : "#ff6b6b",
                                        fontSize: "13px",
                                        fontWeight: "600",
                                        textAlign: "center"
                                    }}>
                                        {result.msg}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RealLifeChallenge;
