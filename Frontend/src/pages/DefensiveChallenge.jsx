import React, { useState } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import WebTerminal from "../components/WebTerminal";
import {
    Terminal, X, Award, Lightbulb, Activity,
    ShieldCheck, CheckCircle2, Info, Eye, FileSearch
} from "lucide-react";

export default function DefensiveChallenge({ id }) {
    const [flag, setFlag] = useState("");
    const [message, setMessage] = useState("");
    const [submitted, setSubmitted] = useState(false);

    const challenges = {
        1: { name: "Service Monitoring", goal: "Identify the suspicious IP address scanning your system.", tool: "netstat / ss", logic: "Detection" },
        2: { name: "Web Log Analysis", goal: "Find the XSS payload hidden in the access logs.", tool: "grep / tail", logic: "Analysis" },
        3: { name: "Malicious Upload Detection", goal: "Locate the PHP webshell uploaded to /tmp.", tool: "find / ls -la", logic: "Detection" },
        4: { name: "SQL Injection Detection", goal: "Identify the table name targeted by the SQLi attack.", tool: "tail / awk", logic: "Log Review" },
        5: { name: "Logic Abuse Detection", goal: "Detect the checkout discrepancy in the transaction logs.", tool: "diff / sort", logic: "Audit" }
    };

    const challenge = challenges[id] || challenges[1];

    const submitFlag = (e) => {
        e.preventDefault();
        // Placeholder validation
        if (flag.toLowerCase().includes("flag")) {
            setMessage("🎉 Defensive objective secured!");
            setSubmitted(true);
        } else {
            setMessage("❌ Incorrect finding. Analyze the logs more carefully.");
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
                                Blue Team Roadmap → Challenge {id}
                            </div>
                            <h1 style={{ fontSize: "28px", fontWeight: "700", margin: 0 }}>
                                {challenge.name} – {challenge.logic}
                            </h1>
                        </div>
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "450px 1fr", gap: "20px" }}>
                        {/* Left Panel */}
                        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                            <div style={{ background: "var(--card-bg)", border: "1px solid var(--card-border)", borderRadius: "12px", padding: "20px" }}>
                                <h3 style={{ fontSize: "14px", fontWeight: "700", color: "#00d4ff", marginBottom: "12px", textTransform: "uppercase" }}>Defensive Goal</h3>
                                <p style={{ fontSize: "14px", color: "var(--muted)", lineHeight: "1.6" }}>{challenge.goal}</p>
                            </div>

                            <div style={{ background: "var(--card-bg)", border: "1px solid var(--card-border)", borderRadius: "12px", padding: "20px" }}>
                                <h3 style={{ fontSize: "14px", fontWeight: "700", color: "#00d4ff", marginBottom: "12px", textTransform: "uppercase" }}>🛠 Suggested CLI Tools</h3>
                                <code style={{ color: "var(--cyan)", background: "rgba(0,0,0,0.3)", padding: "10px", borderRadius: "8px", display: "block" }}>
                                    {challenge.tool}
                                </code>
                            </div>

                            <div style={{ background: "var(--card-bg)", border: "1px solid var(--card-border)", borderRadius: "12px", padding: "20px" }}>
                                <h3 style={{ fontSize: "14px", fontWeight: "700", color: "#00d4ff", marginBottom: "12px", textTransform: "uppercase" }}>🚩 Submit Finding</h3>
                                <form onSubmit={submitFlag}>
                                    <input
                                        type="text"
                                        placeholder="Enter the detected value or flag..."
                                        value={flag}
                                        onChange={(e) => setFlag(e.target.value)}
                                        style={{ width: "100%", padding: "12px", background: "var(--input-bg)", border: "1px solid var(--card-border)", borderRadius: "8px", color: "var(--text)", marginBottom: "12px" }}
                                    />
                                    <button type="submit" style={{ width: "100%", padding: "12px", background: "#00d4ff", color: "#000", border: "none", borderRadius: "8px", fontWeight: "700", cursor: "pointer" }}>
                                        {submitted ? "✓ VERIFIED" : "SUBMIT ANALYSIS"}
                                    </button>
                                </form>
                                {message && <div style={{ marginTop: "10px", color: "#00d4ff", fontSize: "13px" }}>{message}</div>}
                            </div>
                        </div>

                        {/* Right Panel - Terminal */}
                        <div style={{ background: "#000", borderRadius: "12px", border: "1px solid var(--card-border)", overflow: "hidden", height: "calc(100vh - 180px)" }}>
                            <div style={{ background: "var(--input-bg)", padding: "10px 20px", borderBottom: "1px solid var(--card-border)", fontSize: "12px", color: "var(--muted)" }}>
                                <Activity size={14} style={{ marginRight: "8px", verticalAlign: "middle" }} />
                                PAWNBOX LOG ANALYSIS TERMINAL
                            </div>
                            <WebTerminal />
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}
