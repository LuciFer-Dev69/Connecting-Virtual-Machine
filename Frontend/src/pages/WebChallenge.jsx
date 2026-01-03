import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { API_BASE } from "../config";
import ChallengeHint from "../components/ChallengeHint";
import WebTerminal from "../components/WebTerminal";
import { Terminal as TerminalIcon, Award, ChevronRight } from "lucide-react";

export default function WebChallenge({ level }) {
    const [currentLevel, setCurrentLevel] = useState(level || 1);
    const [flag, setFlag] = useState("");
    const [manualFlag, setManualFlag] = useState("");
    const [message, setMessage] = useState("");
    const [submitted, setSubmitted] = useState(false);
    const [challengeId, setChallengeId] = useState(null);
    const [challenge, setChallenge] = useState(null);
    const [showTerminal, setShowTerminal] = useState(false);
    const user = JSON.parse(localStorage.getItem("user") || "{}");

    // Tutorial state for Level 1
    const [currentStep, setCurrentStep] = useState(0);
    const [completedSteps, setCompletedSteps] = useState([]);

    // Level 2 State
    const [password, setPassword] = useState("");

    useEffect(() => {
        fetchChallenge(currentLevel);
        setCurrentStep(0);
        setCompletedSteps([]);

        // Level 1: Set Cookie
        if (currentLevel === 1) {
            document.cookie = "user_role=guest; path=/";
        }
    }, [currentLevel]);

    const fetchChallenge = async (lvl) => {
        try {
            const res = await fetch(`${API_BASE}/challenges`);
            const data = await res.json();
            const webChallenges = data.filter(c => c.category === 'Web');
            const challenge = webChallenges.find(c => c.level === lvl);

            if (challenge) {
                setChallengeId(challenge.id);
                setChallenge(challenge);
            }
        } catch (err) {
            console.error(err);
        }
    };

    // Tutorial steps for Level 1
    const tutorialSteps = [
        {
            title: "Understanding HTTP Cookies",
            content: "HTTP cookies are small pieces of data stored in your browser. Websites use them to remember information about you, like login status or preferences. Sometimes, developers store sensitive data in cookies that can be manipulated.",
            task: "Learn about how cookies work and how they're stored in your browser"
        },
        {
            title: "Opening Browser DevTools",
            content: "Modern browsers have built-in developer tools that let you inspect and modify cookies. Press F12 or right-click and select 'Inspect' to open DevTools.",
            task: "Open your browser's Developer Tools (Press F12)"
        },
        {
            title: "Finding the Cookie",
            content: "In DevTools, go to the 'Application' tab (Chrome) or 'Storage' tab (Firefox). Look for 'Cookies' in the left sidebar. You'll see a cookie named 'user_role' with value 'guest'.",
            task: "Navigate to Application/Storage → Cookies and find the 'user_role' cookie"
        },
        {
            title: "Modifying the Cookie",
            content: "Double-click on the cookie value to edit it. Change 'guest' to 'admin' and press Enter. Then click the 'Check Access' button to see if you gained admin access!",
            task: "Change the user_role cookie from 'guest' to 'admin' and check access"
        }
    ];

    // Level 1 Logic
    const checkCookie = () => {
        if (document.cookie.includes("user_role=admin")) {
            setFlag("flag{cookie_monster_admin}");
            setMessage("🎉 Access Granted! You are an admin.");
            if (!completedSteps.includes(3)) {
                setCompletedSteps([...completedSteps, 3]);
            }
        } else {
            setMessage("❌ Access Denied. You are just a guest.");
        }
    };

    // Level 2 Logic
    const checkPassword = (e) => {
        e.preventDefault();
        // Password is in HTML comment
        if (password === "dev_secret_2024") {
            setFlag("flag{hidden_in_comments}");
            setMessage("🎉 Correct! You found the password in the HTML comments.");
        } else {
            setMessage("❌ Incorrect password. Look harder!");
        }
    };

    const submitChallenge = async () => {
        if (!challengeId) return;

        try {
            const res = await fetch(`${API_BASE}/submit`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    user_id: user.user_id,
                    id: challengeId,
                    flag: manualFlag
                })
            });
            const data = await res.json();

            if (data.result && data.result.includes("Correct")) {
                setSubmitted(true);
            } else {
                alert(data.result || "Incorrect flag");
            }
        } catch (err) {
            console.error(err);
            alert("Error submitting challenge");
        }
    };

    const nextLevel = () => {
        if (currentLevel < 5) {
            setCurrentLevel(currentLevel + 1);
            setFlag("");
            setManualFlag("");
            setMessage("");
            setSubmitted(false);
            setPassword("");
            setShowTerminal(false);
        } else {
            window.location.hash = "#/challenges";
        }
    };

    const markStepComplete = (stepIndex) => {
        if (!completedSteps.includes(stepIndex)) {
            setCompletedSteps([...completedSteps, stepIndex]);
        }
        if (stepIndex < tutorialSteps.length - 1) {
            setCurrentStep(stepIndex + 1);
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
                    color: "var(--text)"
                }}>
                    <div style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: "20px"
                    }}>
                        <h1 style={{ color: "var(--cyan)", margin: 0 }}>
                            Web Exploitation - Level {currentLevel}
                            {currentLevel === 1 && <span style={{ fontSize: "0.6em", color: "#ffd43b", marginLeft: "15px" }}>📚 TUTORIAL</span>}
                        </h1>

                        {currentLevel >= 4 && (
                            <button
                                onClick={() => setShowTerminal(!showTerminal)}
                                style={{
                                    background: showTerminal ? "var(--danger)" : "var(--green)",
                                    color: "#000",
                                    border: "none",
                                    padding: "8px 16px",
                                    borderRadius: "8px",
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "8px",
                                    fontWeight: "bold",
                                    cursor: "pointer",
                                    boxShadow: "0 0 10px rgba(0,0,0,0.3)"
                                }}
                            >
                                <TerminalIcon size={18} />
                                {showTerminal ? "Terminate PwnBox" : "Spawn PwnBox"}
                            </button>
                        )}
                    </div>

                    <div style={{
                        background: "var(--card-bg)",
                        padding: "20px",
                        borderRadius: "15px",
                        maxWidth: "900px",
                        border: "1px solid var(--card-border)"
                    }}>

                        {/* Level 1 - TUTORIAL MODE */}
                        {currentLevel === 1 && (
                            <div>
                                <h2 style={{ marginBottom: "20px" }}>🍪 The Cookie Monster - Interactive Tutorial</h2>

                                {/* Tutorial Steps */}
                                <div style={{ marginBottom: "30px" }}>
                                    {tutorialSteps.map((step, index) => (
                                        <div key={index} style={{
                                            background: currentStep === index ? "var(--input-bg)" : "var(--bg)",
                                            border: `2px solid ${completedSteps.includes(index) ? "#51cf66" : currentStep === index ? "var(--cyan)" : "var(--card-border)"}`,
                                            borderRadius: "10px",
                                            padding: "15px",
                                            marginBottom: "10px",
                                            opacity: currentStep < index ? 0.5 : 1,
                                            transition: "all 0.3s ease"
                                        }}>
                                            <div style={{ display: "flex", alignItems: "center", marginBottom: "10px" }}>
                                                <div style={{
                                                    width: "30px",
                                                    height: "30px",
                                                    borderRadius: "50%",
                                                    background: completedSteps.includes(index) ? "#51cf66" : currentStep === index ? "var(--cyan)" : "var(--card-border)",
                                                    display: "flex",
                                                    alignItems: "center",
                                                    justifyContent: "center",
                                                    marginRight: "15px",
                                                    fontWeight: "bold",
                                                    color: completedSteps.includes(index) || currentStep === index ? "#000" : "var(--muted)"
                                                }}>
                                                    {completedSteps.includes(index) ? "✓" : index + 1}
                                                </div>
                                                <h3 style={{ margin: 0, color: completedSteps.includes(index) ? "#51cf66" : "var(--text)" }}>
                                                    {step.title}
                                                </h3>
                                            </div>

                                            {(currentStep >= index || completedSteps.includes(index)) && (
                                                <>
                                                    <p style={{ color: "var(--muted)", marginLeft: "45px", marginBottom: "10px" }}>
                                                        {step.content}
                                                    </p>
                                                    <div style={{
                                                        background: "var(--bg)",
                                                        padding: "10px 15px",
                                                        borderRadius: "5px",
                                                        marginLeft: "45px",
                                                        borderLeft: "3px solid var(--cyan)"
                                                    }}>
                                                        <strong style={{ color: "var(--cyan)" }}>Your Task:</strong>
                                                        <p style={{ margin: "5px 0 0 0", color: "var(--text)" }}>{step.task}</p>
                                                    </div>

                                                    {currentStep === index && !completedSteps.includes(index) && index < tutorialSteps.length - 1 && (
                                                        <button
                                                            onClick={() => markStepComplete(index)}
                                                            className="btn btn-cyan"
                                                            style={{ marginLeft: "45px", marginTop: "15px" }}
                                                        >
                                                            Mark as Complete & Continue
                                                        </button>
                                                    )}
                                                </>
                                            )}
                                        </div>
                                    ))}
                                </div>

                                {/* Challenge Section */}
                                <div style={{ padding: "20px", background: "var(--input-bg)", borderRadius: "10px" }}>
                                    <h3 style={{ marginBottom: "15px" }}>🎯 Your Challenge</h3>
                                    <div style={{ padding: "20px", background: "var(--bg)", borderRadius: "10px", marginBottom: "15px" }}>
                                        <h4 style={{ color: "var(--cyan)" }}>Vault Status: Locked 🔒</h4>
                                        <p style={{ color: "var(--muted)" }}>This secure vault is only for admins. Are you an admin?</p>
                                    </div>
                                    <button
                                        onClick={checkCookie}
                                        className="btn btn-cyan"
                                    >
                                        Check Access
                                    </button>
                                </div>

                                {/* Hints for Level 1 */}
                                <details style={{ marginTop: "20px", cursor: "pointer" }}>
                                    <summary style={{ color: "#ffd43b", padding: "10px", background: "var(--input-bg)", borderRadius: "5px" }}>
                                        💡 Need Help? Click for Hints
                                    </summary>
                                    <div style={{ padding: "15px", background: "var(--bg)", marginTop: "10px", borderRadius: "5px" }}>
                                        <details style={{ marginBottom: "10px" }}>
                                            <summary style={{ color: "var(--cyan)", cursor: "pointer", padding: "8px" }}>Hint 1: Where are cookies stored?</summary>
                                            <p style={{ color: "var(--muted)", marginTop: "10px", paddingLeft: "15px" }}>
                                                Cookies are stored in your browser. You can view and edit them using Developer Tools (F12). Look in the Application tab (Chrome) or Storage tab (Firefox).
                                            </p>
                                        </details>
                                        <details style={{ marginBottom: "10px" }}>
                                            <summary style={{ color: "var(--cyan)", cursor: "pointer", padding: "8px" }}>Hint 2: What cookie to modify?</summary>
                                            <p style={{ color: "var(--muted)", marginTop: "10px", paddingLeft: "15px" }}>
                                                Look for a cookie named <code>user_role</code>. It's currently set to <code>guest</code>. What would happen if you changed it to <code>admin</code>?
                                            </p>
                                        </details>
                                        <details>
                                            <summary style={{ color: "#51cf66", cursor: "pointer", padding: "8px" }}>Solution: Step-by-Step</summary>
                                            <p style={{ color: "#51cf66", marginTop: "10px", paddingLeft: "15px", fontWeight: "bold" }}>
                                                1. Press F12 to open DevTools<br />
                                                2. Go to Application tab → Cookies<br />
                                                3. Find <code>user_role</code> cookie<br />
                                                4. Double-click the value and change <code>guest</code> to <code>admin</code><br />
                                                5. Click "Check Access" button
                                            </p>
                                        </details>
                                    </div>
                                </details>
                            </div>
                        )}

                        {/* Level 2 - CHALLENGE MODE */}
                        {currentLevel === 2 && (
                            <div>
                                <h2>🕵️ Hidden in Plain Sight</h2>
                                <p style={{ color: "#888", marginBottom: "20px" }}>
                                    Login to the developer portal. The password was left somewhere safe... or was it?
                                </p>
                                {/* HTML Comment: Password is dev_secret_2024 */}
                                <form onSubmit={checkPassword} style={{ padding: "20px", background: "var(--input-bg)", borderRadius: "10px" }}>
                                    <div style={{ marginBottom: "15px" }}>
                                        <label style={{ display: "block", marginBottom: "5px" }}>Username</label>
                                        <input type="text" value="admin" disabled className="input" style={{ width: "100%" }} />
                                    </div>
                                    <div style={{ marginBottom: "15px" }}>
                                        <label style={{ display: "block", marginBottom: "5px" }}>Password</label>
                                        <input
                                            type="password"
                                            value={password}
                                            onChange={e => setPassword(e.target.value)}
                                            className="input"
                                            style={{ width: "100%" }}
                                        />
                                    </div>
                                    <button className="btn btn-cyan">Login</button>
                                </form>
                            </div>
                        )}

                        {/* Level 4/5 - INTERACTIVE LAB MODE */}
                        {currentLevel >= 4 && challenge && (
                            <div style={{ display: "grid", gridTemplateColumns: showTerminal ? "400px 1fr" : "1fr", gap: "20px", transition: "all 0.3s ease", marginTop: "20px" }}>
                                <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                                    <div style={{ background: "rgba(0, 212, 255, 0.05)", padding: "20px", borderRadius: "10px", border: "1px solid rgba(0, 212, 255, 0.2)" }}>
                                        <h3 style={{ color: "var(--cyan)", marginTop: 0, display: "flex", alignItems: "center", gap: "10px" }}>
                                            <Award size={20} /> Level Objective
                                        </h3>
                                        <p style={{ lineHeight: "1.6", color: "var(--text)" }}>
                                            {challenge.description}
                                        </p>
                                    </div>

                                    <div style={{ background: "var(--input-bg)", padding: "15px", borderRadius: "10px" }}>
                                        <h4 style={{ color: "var(--muted)", marginTop: 0, marginBottom: "10px" }}>Lab Targets</h4>
                                        <code style={{ display: "block", padding: "10px", background: "#000", color: "#51cf66", borderRadius: "5px", fontSize: "0.9rem" }}>
                                            API Base: http://backend:5000<br />
                                            Internal Info: /api/vuln/ping
                                        </code>
                                    </div>

                                    <div style={{ marginTop: "10px" }}>
                                        <h3 style={{ marginBottom: "15px" }}>Submit Flag</h3>
                                        <div style={{ display: "flex", gap: "10px" }}>
                                            <input
                                                className="input"
                                                placeholder="flag{...}"
                                                value={manualFlag}
                                                onChange={(e) => setManualFlag(e.target.value)}
                                                style={{ flex: 1, margin: 0 }}
                                            />
                                            <button className="btn btn-green" onClick={submitChallenge} style={{ margin: 0 }}>Submit</button>
                                        </div>
                                    </div>

                                    <ChallengeHint challengeId={challengeId} user={user} />
                                </div>

                                {showTerminal && (
                                    <div style={{
                                        background: "#000",
                                        borderRadius: "12px",
                                        border: "1px solid #333",
                                        overflow: "hidden",
                                        height: "550px",
                                        display: "flex",
                                        flexDirection: "column",
                                        boxShadow: "0 10px 30px rgba(0,0,0,0.5)"
                                    }}>
                                        <div style={{
                                            background: "#1e1e1e",
                                            padding: "8px 12px",
                                            display: "flex",
                                            justifyContent: "space-between",
                                            alignItems: "center",
                                            borderBottom: "1px solid #333"
                                        }}>
                                            <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                                                <TerminalIcon size={14} color="var(--green)" />
                                                <span style={{ fontSize: "0.75rem", color: "#888", fontWeight: "bold" }}>chakra@pwnbox:~ (Web-Lab)</span>
                                            </div>
                                        </div>
                                        <div style={{ flex: 1, position: "relative" }}>
                                            <WebTerminal host="pwnbox" user={user} />
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Standard Hints */}
                        {currentLevel > 1 && challengeId && (
                            <ChallengeHint challengeId={challengeId} user={user} />
                        )}

                        {/* Result Message */}
                        {message && (
                            <div style={{
                                marginTop: "20px",
                                padding: "15px",
                                background: message.includes("🎉") ? "rgba(81, 207, 102, 0.2)" : "rgba(255, 107, 107, 0.2)",
                                borderRadius: "8px",
                                color: message.includes("🎉") ? "#51cf66" : "#ff6b6b"
                            }}>
                                {message}
                            </div>
                        )}

                        {/* Flag Display */}
                        {flag && (
                            <div style={{ marginTop: "20px" }}>
                                <p style={{ color: "#51cf66", fontWeight: "bold" }}>Flag Found: {flag}</p>
                                <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
                                    <input
                                        className="input"
                                        value={manualFlag}
                                        onChange={e => setManualFlag(e.target.value)}
                                        placeholder="Paste flag here..."
                                        style={{ flex: 1 }}
                                    />
                                    <button onClick={submitChallenge} className="btn btn-green">Submit</button>
                                </div>
                            </div>
                        )}

                    </div>

                    {/* Success Modal */}
                    {submitted && (
                        <div style={{
                            position: "fixed",
                            top: 0,
                            left: 0,
                            width: "100%",
                            height: "100%",
                            background: "rgba(0, 0, 0, 0.8)",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            zIndex: 1000
                        }}>
                            <div style={{
                                background: "var(--card-bg)",
                                padding: "40px",
                                borderRadius: "20px",
                                textAlign: "center",
                                maxWidth: "500px",
                                width: "90%",
                                border: "2px solid var(--cyan)",
                                boxShadow: "0 0 30px rgba(0, 212, 255, 0.2)"
                            }}>
                                <div style={{ fontSize: "60px", marginBottom: "20px" }}>🎉</div>
                                <h2 style={{ color: "var(--cyan)", marginBottom: "15px" }}>Congratulations!</h2>
                                <p style={{ color: "var(--text)", marginBottom: "30px" }}>
                                    You completed Level {currentLevel}!
                                </p>
                                <button
                                    onClick={nextLevel}
                                    className="btn btn-cyan"
                                    style={{ fontSize: "18px", padding: "12px 30px" }}
                                >
                                    {currentLevel < 5 ? "Next Level ➡️" : "Finish 🏆"}
                                </button>
                            </div>
                        </div>
                    )}

                </main>
            </div>
        </div>
    );
}
