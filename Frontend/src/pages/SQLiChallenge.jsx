import React, { useState } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import WebTerminal from "../components/WebTerminal";
import { API_BASE } from "../config";
import { Terminal, X, Award, Lightbulb, Globe, Code, ShieldCheck, CheckCircle2, Shield, Info, LogIn } from "lucide-react";

export default function SQLiChallenge() {
    const [flag, setFlag] = useState("");
    const [message, setMessage] = useState("");
    const [showTerminal, setShowTerminal] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [activeTab, setActiveTab] = useState("terminal"); // "terminal" or "web"
    const user = JSON.parse(localStorage.getItem("user") || "{}");

    const submitFlag = async (e) => {
        e.preventDefault();
        const correctFlag = "FLAG{sql_injection_login_bypass}";

        if (flag.trim() === correctFlag) {
            setMessage("🎉 Correct Flag! Authentication bypassed successfully.");
            setSubmitted(true);

            try {
                await fetch(`${API_BASE}/submit`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        user_id: user.user_id,
                        id: 997, // Unique ID for this challenge
                        flag: flag
                    })
                });
            } catch (err) {
                console.error(err);
            }
        } else {
            setMessage("❌ Incorrect flag. Check the admin dashboard!");
        }
    };

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
                    maxWidth: "1400px",
                    margin: "0 auto"
                }}>
                    {/* Header */}
                    <div style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: "30px",
                        borderBottom: "1px solid var(--card-border)",
                        paddingBottom: "20px"
                    }}>
                        <div>
                            <div style={{ fontSize: "14px", color: "var(--muted)", marginBottom: "8px" }}>
                                Real-Life Web → Level 3
                            </div>
                            <h1 style={{ fontSize: "28px", fontWeight: "700", margin: 0 }}>
                                Phantom Login – SQL Injection
                            </h1>
                        </div>
                        {showTerminal && (
                            <button
                                onClick={() => setShowTerminal(false)}
                                style={{
                                    background: "#ff6b6b",
                                    color: "#fff",
                                    border: "none",
                                    padding: "10px 20px",
                                    borderRadius: "8px",
                                    cursor: "pointer",
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "8px",
                                    fontWeight: "600"
                                }}
                            >
                                <X size={18} /> Terminate PawnBox
                            </button>
                        )}
                    </div>

                    {/* Main Content Grid */}
                    <div style={{ display: "grid", gridTemplateColumns: showTerminal ? "450px 1fr" : "1fr", gap: "20px" }}>
                        {/* Left Panel - Challenge Cards (Scrollable) */}
                        <div style={{ display: "flex", flexDirection: "column", gap: "20px", overflowY: "auto", maxHeight: "calc(100vh - 150px)", paddingRight: "10px" }}>

                            {/* Level Goal Card */}
                            <div style={{ background: "var(--card-bg)", border: "1px solid var(--card-border)", borderRadius: "12px", padding: "20px" }}>
                                <h3 style={{ fontSize: "14px", fontWeight: "700", color: "#00ff00", marginBottom: "12px", textTransform: "uppercase" }}>Level Goal</h3>
                                <div style={{ fontSize: "14px", lineHeight: "1.6", color: "var(--muted)" }}>
                                    <p style={{ margin: "0 0 10px 0" }}>A legacy login system is running on the target machine.</p>
                                    <p style={{ margin: "0 0 10px 0" }}>The backend constructs SQL queries by directly concatenating user input, leadings to a critical SQL Injection vulnerability.</p>
                                    <p style={{ margin: "0 0 10px 0" }}>Your task is to bypass the login mechanism and gain access to the <b>admin</b> account to retrieve the secret flag.</p>
                                    <p style={{ margin: 0, color: "#00ff00", fontWeight: "600" }}>Objective: Bypass authentication without knowing the admin password.</p>
                                </div>
                            </div>

                            {/* Target Information Card */}
                            <div style={{ background: "var(--card-bg)", border: "1px solid var(--card-border)", borderRadius: "12px", padding: "20px" }}>
                                <h3 style={{ fontSize: "14px", fontWeight: "700", color: "var(--cyan)", marginBottom: "12px", textTransform: "uppercase" }}>🎯 Target Information</h3>
                                <div style={{ fontSize: "13px", color: "var(--muted)", lineHeight: "1.8" }}>
                                    <div style={{ marginBottom: "8px" }}>
                                        <strong style={{ color: "var(--text)" }}>Service URL:</strong> <code style={{ background: "var(--input-bg)", padding: "2px 6px", borderRadius: "4px", color: "var(--cyan)" }}>http://localhost:7071</code>
                                    </div>
                                    <div style={{ marginBottom: "8px" }}>
                                        <strong style={{ color: "var(--text)" }}>Vulnerability:</strong> SQL Injection (Auth Bypass)
                                    </div>
                                    <div style={{ marginBottom: "8px" }}>
                                        <strong style={{ color: "var(--text)" }}>Target Account:</strong> admin
                                    </div>
                                    <div style={{ marginBottom: "8px" }}>
                                        <strong style={{ color: "var(--text)" }}>Access Method:</strong> Use the <strong style={{ color: "var(--cyan)" }}>Web View</strong> tab or <strong style={{ color: "var(--cyan)" }}>curl</strong>.
                                    </div>
                                </div>
                            </div>

                            {/* Helpful Commands Card */}
                            <div style={{ background: "var(--card-bg)", border: "1px solid var(--card-border)", borderRadius: "12px", padding: "20px" }}>
                                <h3 style={{ fontSize: "14px", fontWeight: "700", color: "var(--cyan)", marginBottom: "12px", textTransform: "uppercase", display: "flex", alignItems: "center", gap: "8px" }}>
                                    <Lightbulb size={16} /> 🛠 Helpful Tools
                                </h3>
                                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
                                    {["curl", "wget", "sqlmap", "firefox"].map(cmd => (
                                        <code key={cmd} style={{ background: "var(--input-bg)", color: "var(--cyan)", padding: "4px", borderRadius: "4px", fontSize: "12px", textAlign: "center", fontFamily: "monospace" }}>{cmd}</code>
                                    ))}
                                </div>
                            </div>

                            {/* Guided Hints */}
                            <div style={{ background: "var(--card-bg)", border: "1px solid var(--card-border)", borderRadius: "12px", padding: "20px" }}>
                                <h3 style={{ fontSize: "14px", fontWeight: "700", color: "var(--cyan)", marginBottom: "12px", textTransform: "uppercase", display: "flex", alignItems: "center", gap: "8px" }}>
                                    <Info size={16} /> 💡 Guided Hints
                                </h3>
                                <div style={{ fontSize: "13px", color: "var(--muted)", lineHeight: "1.5", display: "flex", flexDirection: "column", gap: "12px" }}>
                                    <div>
                                        <strong>Hint 1: Observe Query Logic</strong>
                                        <p style={{ margin: "4px 0" }}>The backend uses: <code>'username' AND 'password'</code>. If you can make the entire condition <b>TRUE</b>, you get in.</p>
                                    </div>
                                    <div>
                                        <strong>Hint 2: Using OR</strong>
                                        <p style={{ margin: "4px 0" }}>The <code>OR</code> operator allows you to satisfy a condition even if the first part is false. Try <code>' OR '1'='1</code>.</p>
                                    </div>
                                    <div>
                                        <strong>Hint 3: Commenting Out</strong>
                                        <p style={{ margin: "4px 0" }}>In SQL, <code>--</code> (dash-dash) starts a comment. Use it to ignore the password check entirely.</p>
                                    </div>
                                </div>
                            </div>

                            {/* Submit Flag Card */}
                            <div style={{ background: "var(--card-bg)", border: "1px solid var(--card-border)", borderRadius: "12px", padding: "20px" }}>
                                <h3 style={{ fontSize: "14px", fontWeight: "700", color: "var(--cyan)", marginBottom: "12px", textTransform: "uppercase", display: "flex", alignItems: "center", gap: "8px" }}>
                                    <Award size={16} /> 🚩 Submit Flag
                                </h3>
                                <form onSubmit={submitFlag}>
                                    <input type="text" placeholder="FLAG{...}" value={flag} onChange={(e) => setFlag(e.target.value)} style={{ width: "100%", padding: "12px", background: "var(--input-bg)", border: "1px solid var(--card-border)", borderRadius: "8px", color: "var(--text)", fontSize: "14px", fontFamily: "monospace", marginBottom: "12px" }} />
                                    <button type="submit" style={{ width: "100%", padding: "12px", background: submitted ? "#51cf66" : "var(--cyan)", color: "#000", border: "none", borderRadius: "8px", fontWeight: "700", cursor: "pointer", fontSize: "14px" }}>
                                        {submitted ? "✓ Submitted" : "Submit Flag"}
                                    </button>
                                </form>
                                {message && (
                                    <div style={{ marginTop: "12px", padding: "12px", borderRadius: "8px", background: message.includes("Correct") ? "#51cf6620" : "#ff6b6b20", border: `1px solid \${message.includes("Correct") ? "#51cf66" : "#ff6b6b"}40`, color: message.includes("Correct") ? "#51cf66" : "#ff6b6b", fontSize: "13px", fontWeight: "600" }}>{message}</div>
                                )}
                            </div>

                            {/* Teacher Demo Card */}
                            <div style={{ background: "var(--card-bg)", border: "1px solid var(--card-border)", borderRadius: "12px", padding: "20px" }}>
                                <h3 style={{ fontSize: "14px", fontWeight: "700", color: "#ff0066", marginBottom: "12px", textTransform: "uppercase", display: "flex", alignItems: "center", gap: "8px" }}>
                                    <LogIn size={16} /> 🧪 Teacher Demonstration
                                </h3>
                                <div style={{ fontSize: "13px", color: "var(--muted)", lineHeight: "1.6" }}>
                                    <p>How to demonstrate Authentication Bypass via SQLi:</p>
                                    <ol style={{ paddingLeft: "20px", margin: "10px 0" }}>
                                        <li>Input <code style={{ color: "var(--cyan)" }}>' OR '1'='1' -- </code> in the username field.</li>
                                        <li>Type anything in the password field.</li>
                                        <li>The system will log you in as the <b>first user</b> in the database (admin).</li>
                                    </ol>
                                    <div style={{ background: "var(--input-bg)", padding: "10px", borderRadius: "8px", border: "1px solid var(--card-border)", marginTop: "10px" }}>
                                        <p style={{ margin: "0 0 5px 0", fontSize: "11px" }}>Terminal command:</p>
                                        <code style={{ fontSize: "11px", color: "var(--cyan)" }}>curl -X POST http://localhost:7071/ -d "username=' OR '1'='1' -- &password=any"</code>
                                    </div>
                                    <p style={{ fontSize: "12px", color: "#ffa500", marginTop: "10px" }}>💡 This maps to OWASP Top 10 – A03: Injection.</p>
                                </div>
                            </div>

                            {/* Learning Outcome Card */}
                            <div style={{ background: "var(--card-bg)", border: "1px solid var(--card-border)", borderRadius: "12px", padding: "20px", marginBottom: "20px" }}>
                                <h3 style={{ fontSize: "14px", fontWeight: "700", color: "#00ff00", marginBottom: "12px", textTransform: "uppercase", display: "flex", alignItems: "center", gap: "8px" }}>
                                    <CheckCircle2 size={16} /> ✅ Learning Outcome
                                </h3>
                                <div style={{ fontSize: "13px", color: "var(--muted)", lineHeight: "1.6" }}>
                                    <p>What the student achieves:</p>
                                    <ul style={{ margin: "5px 0", paddingLeft: "18px" }}>
                                        <li>Understanding how SQL queries are manipulated.</li>
                                        <li>Learning the risk of dynamic string interpolation.</li>
                                        <li>Hands-on experience with bypassing critical security gates.</li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        {/* Right Panel - Terminal & Web View Tabs */}
                        {showTerminal ? (
                            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                                <div style={{ display: "flex", gap: "10px", padding: "0 10px" }}>
                                    <button
                                        onClick={() => setActiveTab("terminal")}
                                        style={{
                                            padding: "10px 20px",
                                            background: activeTab === "terminal" ? "var(--cyan)" : "var(--input-bg)",
                                            color: activeTab === "terminal" ? "#000" : "var(--text)",
                                            border: "none",
                                            borderRadius: "8px 8px 0 0",
                                            cursor: "pointer",
                                            fontWeight: "600",
                                            display: "flex", gap: "8px", alignItems: "center"
                                        }}
                                    >
                                        <Code size={16} /> Terminal
                                    </button>
                                    <button
                                        onClick={() => setActiveTab("web")}
                                        style={{
                                            padding: "10px 20px",
                                            background: activeTab === "web" ? "var(--cyan)" : "var(--input-bg)",
                                            color: activeTab === "web" ? "#000" : "var(--text)",
                                            border: "none",
                                            borderRadius: "8px 8px 0 0",
                                            cursor: "pointer",
                                            fontWeight: "600",
                                            display: "flex", gap: "8px", alignItems: "center"
                                        }}
                                    >
                                        <Globe size={16} /> Web View
                                    </button>
                                </div>

                                <div style={{
                                    background: "var(--card-bg)",
                                    border: "1px solid var(--card-border)",
                                    borderRadius: "12px",
                                    overflow: "hidden",
                                    height: "calc(100vh - 250px)",
                                    position: "relative"
                                }}>
                                    {activeTab === "terminal" ? (
                                        <div style={{ height: "100%" }}>
                                            <div style={{ background: "var(--input-bg)", padding: "8px 16px", borderBottom: "1px solid var(--card-border)", fontSize: "12px", color: "var(--muted)" }}>PawnBox Terminal</div>
                                            <WebTerminal />
                                        </div>
                                    ) : (
                                        <div style={{ height: "100%", background: "#fff" }}>
                                            <div style={{ background: "#f0f0f0", padding: "8px 16px", borderBottom: "1px solid #ddd", fontSize: "12px", color: "#666", display: "flex", alignItems: "center", gap: "10px" }}>
                                                <div style={{ background: "#eee", padding: "4px 12px", borderRadius: "15px", flex: 1, border: "1px solid #ccc", color: "#333" }}>http://localhost:7071</div>
                                                <button onClick={() => { const f = document.getElementById('sqli-frame'); f.src = f.src; }} style={{ border: "none", background: "none", cursor: "pointer", color: "#666" }}>Refresh</button>
                                            </div>
                                            <iframe
                                                id="sqli-frame"
                                                src="http://localhost:7071"
                                                style={{ width: "100%", height: "calc(100% - 35px)", border: "none" }}
                                                title="SQLi Login View"
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>
                        ) : (
                            <div style={{ background: "var(--card-bg)", border: "1px solid var(--card-border)", borderRadius: "12px", padding: "80px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", minHeight: "600px" }}>
                                <div style={{ width: "100px", height: "100px", background: "#00ff0020", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "24px" }}><Shield size={50} style={{ color: "#00ff00" }} /></div>
                                <h2 style={{ fontSize: "28px", fontWeight: "700", marginBottom: "16px" }}>Phantom Login Lab</h2>
                                <p style={{ color: "var(--muted)", marginBottom: "32px", maxWidth: "500px", lineHeight: "1.6", fontSize: "16px" }}>Inject SQL payloads to bypass authentication and gain unauthorized administrative access.</p>
                                <button onClick={() => setShowTerminal(true)} style={{ background: "#00ff00", color: "#000", border: "none", padding: "16px 48px", borderRadius: "12px", fontWeight: "700", fontSize: "17px", cursor: "pointer", display: "flex", alignItems: "center", gap: "12px" }}>
                                    <Terminal size={24} /> Launch Environment
                                </button>
                            </div>
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
}
