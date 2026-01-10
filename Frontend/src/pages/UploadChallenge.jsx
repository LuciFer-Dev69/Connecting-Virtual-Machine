import React, { useState } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import WebTerminal from "../components/WebTerminal";
import { API_BASE } from "../config";
import { Terminal, X, Award, Lightbulb, Globe, Code, ShieldCheck, CheckCircle2, FileUp, Info } from "lucide-react";

export default function UploadChallenge() {
    const [flag, setFlag] = useState("");
    const [message, setMessage] = useState("");
    const [showTerminal, setShowTerminal] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [activeTab, setActiveTab] = useState("terminal"); // "terminal" or "web"
    const user = JSON.parse(localStorage.getItem("user") || "{}");

    const submitFlag = async (e) => {
        e.preventDefault();
        const correctFlag = "FLAG{file_upload_misconfig}";

        if (flag.trim() === correctFlag) {
            setMessage("🎉 Correct Flag! Well done.");
            setSubmitted(true);

            try {
                await fetch(`${API_BASE}/submit`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        user_id: user.user_id,
                        id: 998, // Unique ID for this challenge
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
                                Real-Life Web → Level 2
                            </div>
                            <h1 style={{ fontSize: "28px", fontWeight: "700", margin: 0 }}>
                                Phantom Profile – File Upload Misconfiguration
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
                                    <p style={{ margin: "0 0 10px 0" }}>A deliberately vulnerable profile management system is running on the local machine.</p>
                                    <p style={{ margin: "0 0 10px 0" }}>The system allows users to upload profile avatars, but the security validation is flawed.</p>
                                    <p style={{ margin: "0 0 10px 0" }}>Your task is to bypass the extension-based filter, upload a malicious file, and execute it to retrieve the flag.</p>
                                    <p style={{ margin: 0, color: "var(--cyan)", fontWeight: "600" }}>Objective: Upload a disguised script and trigger its execution.</p>
                                </div>
                            </div>

                            {/* Target Information Card */}
                            <div style={{ background: "var(--card-bg)", border: "1px solid var(--card-border)", borderRadius: "12px", padding: "20px" }}>
                                <h3 style={{ fontSize: "14px", fontWeight: "700", color: "var(--cyan)", marginBottom: "12px", textTransform: "uppercase" }}>🎯 Target Information</h3>
                                <div style={{ fontSize: "13px", color: "var(--muted)", lineHeight: "1.8" }}>
                                    <div style={{ marginBottom: "8px" }}>
                                        <strong style={{ color: "var(--text)" }}>Service URL:</strong> <code style={{ background: "var(--input-bg)", padding: "2px 6px", borderRadius: "4px", color: "var(--cyan)" }}>http://localhost:6060</code>
                                    </div>
                                    <div style={{ marginBottom: "8px" }}>
                                        <strong style={{ color: "var(--text)" }}>Vulnerability:</strong> File Upload Misconfiguration
                                    </div>
                                    <div style={{ marginBottom: "8px" }}>
                                        <strong style={{ color: "var(--text)" }}>Access Method:</strong> Use the <strong style={{ color: "var(--cyan)" }}>Web View</strong> tab on the right side.
                                    </div>
                                </div>
                            </div>

                            {/* Helpful Commands Card */}
                            <div style={{ background: "var(--card-bg)", border: "1px solid var(--card-border)", borderRadius: "12px", padding: "20px" }}>
                                <h3 style={{ fontSize: "14px", fontWeight: "700", color: "var(--cyan)", marginBottom: "12px", textTransform: "uppercase", display: "flex", alignItems: "center", gap: "8px" }}>
                                    <Lightbulb size={16} /> 🛠 Helpful Commands
                                </h3>
                                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
                                    {["curl", "wget", "ls", "cat"].map(cmd => (
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
                                        <strong>Hint 1: Observe Validation</strong>
                                        <p style={{ margin: "4px 0" }}>The app only checks extensions (.jpg, .png). It doesn't look at what's inside the file.</p>
                                    </div>
                                    <div>
                                        <strong>Hint 2: Content vs Extension</strong>
                                        <p style={{ margin: "4px 0" }}>An extension like .jpg is just a name. You can rename a different type of file to .jpg.</p>
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

                            <style>{`
                                .xterm-viewport::-webkit-scrollbar {
                                    width: 10px;
                                    height: 10px;
                                }
                                .xterm-viewport::-webkit-scrollbar-track {
                                    background: #0d0d0d;
                                }
                                .xterm-viewport::-webkit-scrollbar-thumb {
                                    background: #333;
                                    border-radius: 5px;
                                    border: 2px solid #0d0d0d;
                                }
                                .xterm-viewport::-webkit-scrollbar-thumb:hover {
                                    background: #444;
                                }
                            `}</style>

                            {/* Teacher Demo Card */}
                            <div style={{ background: "var(--card-bg)", border: "1px solid var(--card-border)", borderRadius: "12px", padding: "20px" }}>
                                <h3 style={{ fontSize: "14px", fontWeight: "700", color: "#ff0066", marginBottom: "12px", textTransform: "uppercase", display: "flex", alignItems: "center", gap: "8px" }}>
                                    <Code size={16} /> 🧪 Teacher Demonstration
                                </h3>
                                <div style={{ fontSize: "13px", color: "var(--muted)", lineHeight: "1.6" }}>
                                    <p>Follow these steps to explain the flaw to your teacher:</p>
                                    <ol style={{ paddingLeft: "20px", margin: "10px 0" }}>
                                        <li>Create a file named <code style={{ color: "var(--cyan)" }}>shell.jpg</code>.</li>
                                        <li>Put a script inside it (e.g., <code style={{ color: "var(--cyan)" }}>&lt;script&gt;alert(1)&lt;/script&gt;</code>).</li>
                                        <li>Upload it. The server accepts it because the extension is <strong>.jpg</strong>.</li>
                                        <li>Access the link provided in the preview.</li>
                                        <li>The browser executes the code because the <strong>/uploads/</strong> directory allows script execution.</li>
                                    </ol>
                                    <p style={{ fontSize: "12px", color: "#ffa500", marginTop: "10px" }}>💡 This confirms File Upload Misconfiguration (OWASP A05).</p>
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
                                        <li>Why extension-only blacklisting is unsafe.</li>
                                        <li>How file execution in upload directories leads to RCE.</li>
                                        <li>How to verify vulnerabilities via direct access testing.</li>
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
                                    height: "calc(100vh - 180px)",
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
                                                <div style={{ background: "#eee", padding: "4px 12px", borderRadius: "15px", flex: 1, border: "1px solid #ccc", color: "#333" }}>http://localhost:6060</div>
                                                <button onClick={() => { const f = document.getElementById('upload-frame'); f.src = f.src; }} style={{ border: "none", background: "none", cursor: "pointer", color: "#666" }}>Refresh</button>
                                            </div>
                                            <iframe
                                                id="upload-frame"
                                                src="http://localhost:6060"
                                                style={{ width: "100%", height: "calc(100% - 35px)", border: "none" }}
                                                title="File Upload View"
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>
                        ) : (
                            <div style={{ background: "var(--card-bg)", border: "1px solid var(--card-border)", borderRadius: "12px", padding: "80px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", minHeight: "600px" }}>
                                <div style={{ width: "100px", height: "100px", background: "var(--cyan)20", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "24px" }}><FileUp size={50} style={{ color: "var(--cyan)" }} /></div>
                                <h2 style={{ fontSize: "28px", fontWeight: "700", marginBottom: "16px" }}>Phantom Profile Lab</h2>
                                <p style={{ color: "var(--muted)", marginBottom: "32px", maxWidth: "500px", lineHeight: "1.6", fontSize: "16px" }}>Bypass profile avatar restrictions to demonstrate file upload misconfigurations and achieve remote execution.</p>
                                <button onClick={() => setShowTerminal(true)} style={{ background: "var(--cyan)", color: "#000", border: "none", padding: "16px 48px", borderRadius: "12px", fontWeight: "700", fontSize: "17px", cursor: "pointer", display: "flex", alignItems: "center", gap: "12px" }}>
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
