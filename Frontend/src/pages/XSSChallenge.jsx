import React, { useState } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import WebTerminal from "../components/WebTerminal";
import { API_BASE } from "../config";
import { Terminal, X, Award, Lightbulb, Globe, Code, ShieldCheck, CheckCircle2 } from "lucide-react";

export default function XSSChallenge() {
    const [flag, setFlag] = useState("");
    const [message, setMessage] = useState("");
    const [showTerminal, setShowTerminal] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [activeTab, setActiveTab] = useState("terminal"); // "terminal" or "web"
    const user = JSON.parse(localStorage.getItem("user") || "{}");

    const submitFlag = async (e) => {
        e.preventDefault();
        const correctFlag = "FLAG{phantom_sqli_bypass_2024}";

        if (flag.trim() === correctFlag) {
            setMessage("🎉 Correct Flag! Well done.");
            setSubmitted(true);

            try {
                await fetch(`${API_BASE}/submit`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        user_id: user.user_id,
                        id: 999,
                        flag: flag
                    })
                });
            } catch (err) {
                console.error(err);
            }
        } else {
            setMessage("❌ Incorrect flag. Try again!");
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
                                Real-Life Web → Level 1
                            </div>
                            <h1 style={{ fontSize: "28px", fontWeight: "700", margin: 0 }}>
                                Phantom Login – Reflected XSS
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
                                <h3 style={{ fontSize: "14px", fontWeight: "700", color: "var(--cyan)", marginBottom: "12px", textTransform: "uppercase" }}>Level Goal</h3>
                                <div style={{ fontSize: "14px", lineHeight: "1.6", color: "var(--muted)" }}>
                                    <p style={{ margin: "0 0 10px 0" }}>A deliberately vulnerable login system is running on the local machine.</p>
                                    <p style={{ margin: "0 0 10px 0" }}>The username input is reflected directly into the welcome page without any input validation or sanitization.</p>
                                    <p style={{ margin: "0 0 10px 0" }}>Your task is to inject a JavaScript payload into the username field and demonstrate that it executes in the browser.</p>
                                    <p style={{ margin: "0 0 10px 0" }}>This confirms the presence of a Reflected Cross-Site Scripting (XSS) vulnerability.</p>
                                    <p style={{ margin: 0, color: "var(--cyan)", fontWeight: "600" }}>Successfully exploiting this vulnerability will reveal the flag.</p>
                                </div>
                            </div>

                            {/* Target Information Card */}
                            <div style={{ background: "var(--card-bg)", border: "1px solid var(--card-border)", borderRadius: "12px", padding: "20px" }}>
                                <h3 style={{ fontSize: "14px", fontWeight: "700", color: "var(--cyan)", marginBottom: "12px", textTransform: "uppercase" }}>🎯 Target Information</h3>
                                <div style={{ fontSize: "13px", color: "var(--muted)", lineHeight: "1.8" }}>
                                    <div style={{ marginBottom: "8px" }}>
                                        <strong style={{ color: "var(--text)" }}>Service URL:</strong> <code style={{ background: "var(--input-bg)", padding: "2px 6px", borderRadius: "4px", color: "var(--cyan)" }}>http://localhost:5050</code>
                                    </div>
                                    <div style={{ marginBottom: "8px" }}>
                                        <strong style={{ color: "var(--text)" }}>Vulnerability Type:</strong> Reflected Cross-Site Scripting (XSS)
                                    </div>
                                    <div style={{ marginBottom: "8px" }}>
                                        <strong style={{ color: "var(--text)" }}>Access Method:</strong> Open the application using the <strong style={{ color: "var(--cyan)" }}>Web View</strong> tab on the right side of the interface.
                                    </div>
                                </div>
                            </div>

                            {/* Helpful Commands Card */}
                            <div style={{ background: "var(--card-bg)", border: "1px solid var(--card-border)", borderRadius: "12px", padding: "20px" }}>
                                <h3 style={{ fontSize: "14px", fontWeight: "700", color: "var(--cyan)", marginBottom: "12px", textTransform: "uppercase", display: "flex", alignItems: "center", gap: "8px" }}>
                                    <Lightbulb size={16} /> 🛠 Helpful Commands
                                </h3>
                                <p style={{ fontSize: "12px", color: "var(--muted)", marginBottom: "12px" }}>These tools can be used to interact with the vulnerable web application:</p>
                                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                                    {[
                                        { cmd: "curl", desc: "Send crafted HTTP requests" },
                                        { cmd: "wget", desc: "Fetch web responses" },
                                        { cmd: "firefox", desc: "Browser-based testing" },
                                        { cmd: "chromium", desc: "Browser-based testing" }
                                    ].map(item => (
                                        <div key={item.cmd} style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                                            <code style={{ background: "var(--input-bg)", color: "var(--cyan)", padding: "4px 8px", borderRadius: "4px", fontSize: "12px", fontFamily: "monospace", minWidth: "70px", textAlign: "center" }}>{item.cmd}</code>
                                            <span style={{ fontSize: "12px", color: "var(--muted)" }}>– {item.desc}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Submit Flag Card */}
                            <div style={{ background: "var(--card-bg)", border: "1px solid var(--card-border)", borderRadius: "12px", padding: "20px" }}>
                                <h3 style={{ fontSize: "14px", fontWeight: "700", color: "var(--cyan)", marginBottom: "12px", textTransform: "uppercase", display: "flex", alignItems: "center", gap: "8px" }}>
                                    <Award size={16} /> 🚩 Submit Flag
                                </h3>
                                <p style={{ fontSize: "12px", color: "var(--muted)", marginBottom: "12px" }}>Enter the flag obtained after successfully triggering the XSS payload.</p>
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

                            {/* Exploitation Guide Card */}
                            <div style={{
                                background: "var(--card-bg)",
                                border: "1px solid var(--card-border)",
                                borderRadius: "12px",
                                padding: "20px"
                            }}>
                                <h3 style={{ fontSize: "14px", fontWeight: "700", color: "#ff0066", marginBottom: "12px", textTransform: "uppercase", display: "flex", alignItems: "center", gap: "8px" }}>
                                    <Code size={16} /> 🧪 Exploitation Guide (Demonstration)
                                </h3>
                                <div style={{ fontSize: "13px", color: "var(--muted)", lineHeight: "1.6" }}>
                                    <p style={{ marginBottom: "15px" }}>To demonstrate this vulnerability clearly to your teacher, follow the steps below.</p>

                                    <div style={{ marginBottom: "15px" }}>
                                        <strong style={{ color: "var(--text)", display: "block" }}>Step 1: Understand the Flaw</strong>
                                        <p style={{ margin: "5px 0" }}>The application displays the username directly on the welcome page like this:</p>
                                        <code style={{ background: "var(--input-bg)", padding: "2px 6px", borderRadius: "4px" }}>Welcome, &lt;username&gt;</code>
                                        <p style={{ margin: "5px 0" }}>Because the input is not sanitized, any JavaScript code entered as the username will be executed by the browser.</p>
                                    </div>

                                    <div style={{ marginBottom: "15px" }}>
                                        <strong style={{ color: "var(--text)", display: "block" }}>Step 2: Exploit Using Terminal (Proof of Concept)</strong>
                                        <p style={{ margin: "5px 0" }}>Run the following command in the PawnBox terminal:</p>
                                        <code style={{
                                            display: "block",
                                            background: "var(--input-bg)",
                                            padding: "10px",
                                            borderRadius: "6px",
                                            color: "var(--cyan)",
                                            fontSize: "11px",
                                            wordBreak: "break-all",
                                            fontFamily: "monospace"
                                        }}>
                                            curl -X POST http://localhost:5050/login \<br />
                                            -d "username=&lt;script&gt;alert('XSS_SUCCESS')&lt;/script&gt;&password=any"
                                        </code>
                                    </div>

                                    <div style={{ marginBottom: "15px" }}>
                                        <strong style={{ color: "var(--text)", display: "block" }}>Step 3: What Happens</strong>
                                        <ul style={{ margin: "5px 0", paddingLeft: "18px" }}>
                                            <li>The server reflects the username back in the response</li>
                                            <li>The browser interprets the injected <code style={{ color: "var(--cyan)" }}>&lt;script&gt;</code> tag</li>
                                            <li>A JavaScript alert box appears with the message: <code style={{ color: "var(--cyan)" }}>XSS_SUCCESS</code></li>
                                        </ul>
                                        <p style={{ margin: "5px 0", fontStyle: "italic" }}>This confirms successful JavaScript execution, proving a Reflected XSS vulnerability.</p>
                                    </div>

                                    <div style={{ marginBottom: "15px" }}>
                                        <strong style={{ color: "var(--text)", display: "block" }}>Step 4: Real Browser Demonstration (Recommended for Viva)</strong>
                                        <p style={{ margin: "5px 0" }}>For a clearer demonstration:</p>
                                        <ul style={{ margin: "5px 0", paddingLeft: "18px" }}>
                                            <li>Open the site in the <strong>Web View</strong> tab</li>
                                            <li>Enter the following into the username field: <code style={{ color: "var(--cyan)" }}>&lt;script&gt;alert('XSS_SUCCESS')&lt;/script&gt;</code></li>
                                            <li>Submit the form</li>
                                            <li>Observe the alert popup</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>

                            {/* Security Issue Details Card */}
                            <div style={{ background: "var(--card-bg)", border: "1px solid var(--card-border)", borderRadius: "12px", padding: "20px" }}>
                                <h3 style={{ fontSize: "14px", fontWeight: "700", color: "#ffa500", marginBottom: "12px", textTransform: "uppercase", display: "flex", alignItems: "center", gap: "8px" }}>
                                    <ShieldCheck size={16} /> 🧠 Why This Is a Security Issue (For Examiner)
                                </h3>
                                <div style={{ fontSize: "13px", color: "var(--muted)", lineHeight: "1.6" }}>
                                    <p>Attackers can execute arbitrary JavaScript in a victim’s browser. This can lead to:</p>
                                    <ul style={{ margin: "5px 0", paddingLeft: "18px" }}>
                                        <li>Session hijacking</li>
                                        <li>Credential theft</li>
                                        <li>Phishing attacks</li>
                                    </ul>
                                    <p style={{ marginTop: "10px", fontWeight: "600", color: "#ffa500" }}>This vulnerability maps directly to:<br />OWASP Top 10 – A03: Injection</p>
                                </div>
                            </div>

                            {/* Learning Outcome Card */}
                            <div style={{ background: "var(--card-bg)", border: "1px solid var(--card-border)", borderRadius: "12px", padding: "20px", marginBottom: "20px" }}>
                                <h3 style={{ fontSize: "14px", fontWeight: "700", color: "#00ff00", marginBottom: "12px", textTransform: "uppercase", display: "flex", alignItems: "center", gap: "8px" }}>
                                    <CheckCircle2 size={16} /> ✅ Learning Outcome
                                </h3>
                                <div style={{ fontSize: "13px", color: "var(--muted)", lineHeight: "1.6" }}>
                                    <p>By completing this challenge, the student learns:</p>
                                    <ul style={{ margin: "5px 0", paddingLeft: "18px" }}>
                                        <li>What Reflected XSS is</li>
                                        <li>How unsanitized user input leads to vulnerabilities</li>
                                        <li>How attackers exploit XSS in real-world web applications</li>
                                        <li>Why input validation and output encoding are critical</li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        {/* Right Panel - Terminal & Web View Tabs */}
                        {showTerminal ? (
                            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                                {/* Tabs Header */}
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
                                            display: "flex",
                                            alignItems: "center",
                                            gap: "8px"
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
                                            display: "flex",
                                            alignItems: "center",
                                            gap: "8px"
                                        }}
                                    >
                                        <Globe size={16} /> Web View
                                    </button>
                                </div>

                                {/* Content Area */}
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
                                                <div style={{ background: "#eee", padding: "4px 12px", borderRadius: "15px", flex: 1, border: "1px solid #ccc" }}>http://localhost:5050</div>
                                                <button onClick={() => { const f = document.getElementById('xss-frame'); f.src = f.src; }} style={{ border: "none", background: "none", cursor: "pointer", color: "#666" }}>Refresh</button>
                                            </div>
                                            <iframe
                                                id="xss-frame"
                                                src="http://localhost:5050"
                                                style={{ width: "100%", height: "calc(100% - 35px)", border: "none" }}
                                                title="XSS Lab View"
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>
                        ) : (
                            <div style={{ background: "var(--card-bg)", border: "1px solid var(--card-border)", borderRadius: "12px", padding: "80px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", minHeight: "600px" }}>
                                <div style={{ width: "100px", height: "100px", background: "var(--cyan)20", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "24px" }}><Terminal size={50} style={{ color: "var(--cyan)" }} /></div>
                                <h2 style={{ fontSize: "28px", fontWeight: "700", marginBottom: "16px" }}>Launch Environment</h2>
                                <p style={{ color: "var(--muted)", marginBottom: "32px", maxWidth: "500px", lineHeight: "1.6", fontSize: "16px" }}>Start the interactive cyber-lab to access the vulnerable Phantom Login application and the PwnBox terminal.</p>
                                <button onClick={() => setShowTerminal(true)} style={{ background: "var(--cyan)", color: "#000", border: "none", padding: "16px 48px", borderRadius: "12px", fontWeight: "700", fontSize: "17px", cursor: "pointer", display: "flex", alignItems: "center", gap: "12px", transition: "all 0.2s" }} onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.05)"} onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}>
                                    <Terminal size={24} /> Launch PawnBox
                                </button>
                            </div>
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
}
