import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { API_BASE } from "../config";
import ChallengeHint from "../components/ChallengeHint";

export default function ReverseChallenge({ level }) {
    const [currentLevel, setCurrentLevel] = useState(level || 1);
    const [flag, setFlag] = useState("");
    const [manualFlag, setManualFlag] = useState("");
    const [message, setMessage] = useState("");
    const [submitted, setSubmitted] = useState(false);
    const [challengeId, setChallengeId] = useState(null);
    const user = JSON.parse(localStorage.getItem("user") || "{}");

    // Tutorial state for Level 1
    const [currentStep, setCurrentStep] = useState(0);
    const [completedSteps, setCompletedSteps] = useState([]);

    // Level 1 State (Password)
    const [password, setPassword] = useState("");

    // Level 2 State (Assembly)
    const [assemblyInput, setAssemblyInput] = useState("");

    // Level 3 State (Keygen)
    const [licenseKey, setLicenseKey] = useState("");

    useEffect(() => {
        fetchChallenge(currentLevel);
        setCurrentStep(0);
        setCompletedSteps([]);
    }, [currentLevel]);

    const fetchChallenge = async (lvl) => {
        try {
            const res = await fetch(`${API_BASE}/challenges`);
            const data = await res.json();
            const challenges = data.filter(c => c.category === 'Reverse Engineering');
            const challenge = challenges.find(c => c.level === lvl);

            if (challenge) {
                setChallengeId(challenge.id);
            }
        } catch (err) {
            console.error(err);
        }
    };

    // Tutorial steps for Level 1
    const tutorialSteps = [
        {
            title: "Understanding Client-Side Code",
            content: "When you visit a website, your browser downloads and runs JavaScript code. This code is visible to anyone who knows how to look. Developers sometimes accidentally leave sensitive information like passwords, API keys, or logic flaws in this code.",
            task: "Learn that JavaScript code running in the browser can be inspected by anyone"
        },
        {
            title: "Opening Browser DevTools",
            content: "Press F12 to open your browser's Developer Tools. Navigate to the 'Sources' tab (Chrome) or 'Debugger' tab (Firefox) to see all the JavaScript files loaded by the page. You can also right-click and select 'View Page Source'.",
            task: "Open DevTools (F12) and go to the Sources/Debugger tab"
        },
        {
            title: "Finding the Password Check",
            content: "Look at the JavaScript code for this challenge. Search for the function 'checkPassword'. You'll see a line that checks if the password equals a specific value. This is a hardcoded password - a major security flaw!",
            task: "Find the line: if (password === 'admin123')"
        },
        {
            title: "Using the Discovered Password",
            content: "Now that you know the password is 'admin123' from reading the source code, enter it in the password field below and click Login. This demonstrates why sensitive checks should NEVER be done client-side!",
            task: "Enter 'admin123' as the password and click Login"
        }
    ];

    // Level 1: Simple Password
    const checkPassword = () => {
        // Simple JS check
        if (password === "admin123") {
            setFlag("flag{simple_js_check}");
            setMessage("🎉 Correct! You found the hardcoded password.");
            if (!completedSteps.includes(3)) {
                setCompletedSteps([...completedSteps, 3]);
            }
        } else {
            setMessage("❌ Incorrect password.");
        }
    };

    // Level 2: Obfuscated String
    const checkAssembly = () => {
        // Logic: 'r' + 'e' + 'v' + 'e' + 'r' + 's' + 'e'
        if (assemblyInput === "reverse") {
            setFlag("flag{string_assembly_master}");
            setMessage("🎉 Correct! You reassembled the string.");
        } else {
            setMessage("❌ Incorrect. Analyze the logic again.");
        }
    };

    // Level 3: Keygen
    const checkKeygen = () => {
        // Algorithm: Sum of char codes must be 300
        let sum = 0;
        for (let i = 0; i < licenseKey.length; i++) {
            sum += licenseKey.charCodeAt(i);
        }

        if (sum === 300 && licenseKey.length === 3) {
            setFlag("flag{keygen_algorithm_cracked}");
            setMessage("🎉 Valid Key! You reversed the algorithm.");
        } else {
            setMessage(`❌ Invalid Key. Checksum: ${sum} (Target: 300, Length: 3 chars)`);
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
            setAssemblyInput("");
            setLicenseKey("");
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
                    padding: "40px",
                    background: "#121212",
                    minHeight: "100vh",
                    color: "#fff"
                }}>
                    <h1 style={{ color: "var(--cyan)", marginBottom: "20px" }}>
                        Reverse Engineering - Level {currentLevel}
                        {currentLevel === 1 && <span style={{ fontSize: "0.6em", color: "#ffd43b", marginLeft: "15px" }}>📚 TUTORIAL</span>}
                    </h1>

                    <div style={{
                        background: "#1f1f1f",
                        padding: "30px",
                        borderRadius: "15px",
                        maxWidth: "900px",
                        border: "1px solid #333"
                    }}>

                        {/* Level 1 - TUTORIAL MODE */}
                        {currentLevel === 1 && (
                            <div>
                                <h2 style={{ marginBottom: "20px" }}>🕵️ Hardcoded Secrets - Interactive Tutorial</h2>

                                {/* Tutorial Steps */}
                                <div style={{ marginBottom: "30px" }}>
                                    {tutorialSteps.map((step, index) => (
                                        <div key={index} style={{
                                            background: currentStep === index ? "#2a2a2a" : "#1a1a1a",
                                            border: `2px solid ${completedSteps.includes(index) ? "#51cf66" : currentStep === index ? "var(--cyan)" : "#333"}`,
                                            borderRadius: "10px",
                                            padding: "20px",
                                            marginBottom: "15px",
                                            opacity: currentStep < index ? 0.5 : 1,
                                            transition: "all 0.3s ease"
                                        }}>
                                            <div style={{ display: "flex", alignItems: "center", marginBottom: "10px" }}>
                                                <div style={{
                                                    width: "30px",
                                                    height: "30px",
                                                    borderRadius: "50%",
                                                    background: completedSteps.includes(index) ? "#51cf66" : currentStep === index ? "var(--cyan)" : "#555",
                                                    display: "flex",
                                                    alignItems: "center",
                                                    justifyContent: "center",
                                                    marginRight: "15px",
                                                    fontWeight: "bold",
                                                    color: "#000"
                                                }}>
                                                    {completedSteps.includes(index) ? "✓" : index + 1}
                                                </div>
                                                <h3 style={{ margin: 0, color: completedSteps.includes(index) ? "#51cf66" : "#fff" }}>
                                                    {step.title}
                                                </h3>
                                            </div>

                                            {(currentStep >= index || completedSteps.includes(index)) && (
                                                <>
                                                    <p style={{ color: "#aaa", marginLeft: "45px", marginBottom: "10px" }}>
                                                        {step.content}
                                                    </p>
                                                    <div style={{
                                                        background: "#111",
                                                        padding: "10px 15px",
                                                        borderRadius: "5px",
                                                        marginLeft: "45px",
                                                        borderLeft: "3px solid var(--cyan)"
                                                    }}>
                                                        <strong style={{ color: "var(--cyan)" }}>Your Task:</strong>
                                                        <p style={{ margin: "5px 0 0 0", color: "#ccc" }}>{step.task}</p>
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
                                <div style={{ padding: "20px", background: "#2a2a2a", borderRadius: "10px" }}>
                                    <h3 style={{ marginBottom: "15px" }}>🎯 Your Challenge</h3>
                                    <p style={{ color: "#888", marginBottom: "15px" }}>
                                        This login form checks the password directly in the browser. Can you find it?
                                    </p>
                                    <div style={{ marginBottom: "15px" }}>
                                        <label style={{ display: "block", marginBottom: "5px" }}>Enter Password:</label>
                                        <input
                                            type="password"
                                            className="input"
                                            value={password}
                                            onChange={e => setPassword(e.target.value)}
                                            style={{ width: "100%", marginBottom: "10px" }}
                                        />
                                    </div>
                                    <button onClick={checkPassword} className="btn btn-cyan">Login</button>
                                </div>

                                {/* Hints for Level 1 */}
                                <details style={{ marginTop: "20px", cursor: "pointer" }}>
                                    <summary style={{ color: "#ffd43b", padding: "10px", background: "#2a2a2a", borderRadius: "5px" }}>
                                        💡 Need Help? Click for Hints
                                    </summary>
                                    <div style={{ padding: "15px", background: "#1a1a1a", marginTop: "10px", borderRadius: "5px" }}>
                                        <details style={{ marginBottom: "10px" }}>
                                            <summary style={{ color: "var(--cyan)", cursor: "pointer", padding: "8px" }}>Hint 1: Where is the code?</summary>
                                            <p style={{ color: "#aaa", marginTop: "10px", paddingLeft: "15px" }}>
                                                JavaScript code in the browser can be inspected using DevTools (F12). Look in the Sources tab or view the page source.
                                            </p>
                                        </details>
                                        <details style={{ marginBottom: "10px" }}>
                                            <summary style={{ color: "var(--cyan)", cursor: "pointer", padding: "8px" }}>Hint 2: What to search for?</summary>
                                            <p style={{ color: "#aaa", marginTop: "10px", paddingLeft: "15px" }}>
                                                Search for the function <code>checkPassword</code> in the JavaScript code. You'll see the password comparison logic.
                                            </p>
                                        </details>
                                        <details>
                                            <summary style={{ color: "#51cf66", cursor: "pointer", padding: "8px" }}>Solution</summary>
                                            <p style={{ color: "#51cf66", marginTop: "10px", paddingLeft: "15px", fontWeight: "bold" }}>
                                                The password is hardcoded in the JavaScript: <code>admin123</code>
                                            </p>
                                        </details>
                                    </div>
                                </details>
                            </div>
                        )}

                        {/* Level 2 - CHALLENGE MODE */}
                        {currentLevel === 2 && (
                            <div>
                                <h2>🧩 String Assembly</h2>
                                <p style={{ color: "#888", marginBottom: "20px" }}>
                                    The secret string is built at runtime. Analyze the logic below.
                                </p>
                                <div style={{ padding: "20px", background: "#2a2a2a", borderRadius: "10px" }}>
                                    <pre style={{ background: "#111", padding: "15px", borderRadius: "5px", color: "#ccc", overflowX: "auto" }}>
                                        {`
function getSecret() {
  var p1 = 'r';
  var p2 = 'e';
  var p3 = 'v';
  return p1 + p2 + p3 + p2 + p1 + 's' + p2;
}
                                        `}
                                    </pre>
                                    <div style={{ marginTop: "15px" }}>
                                        <label style={{ display: "block", marginBottom: "5px" }}>What does getSecret() return?</label>
                                        <input
                                            className="input"
                                            value={assemblyInput}
                                            onChange={e => setAssemblyInput(e.target.value)}
                                            style={{ width: "100%" }}
                                        />
                                    </div>
                                    <button onClick={checkAssembly} className="btn btn-cyan" style={{ marginTop: "15px" }}>Check Answer</button>
                                </div>
                            </div>
                        )}

                        {/* Level 3 - CHALLENGE MODE */}
                        {currentLevel === 3 && (
                            <div>
                                <h2>💿 Keygen Me</h2>
                                <p style={{ color: "#888", marginBottom: "20px" }}>
                                    Reverse the license verification algorithm to generate a valid key.
                                </p>
                                <div style={{ padding: "20px", background: "#2a2a2a", borderRadius: "10px" }}>
                                    <p style={{ marginBottom: "10px" }}>Algorithm Hint: 3 characters. Sum of ASCII codes must be exactly 300.</p>
                                    <div style={{ marginBottom: "15px" }}>
                                        <label style={{ display: "block", marginBottom: "5px" }}>Enter License Key:</label>
                                        <input
                                            className="input"
                                            value={licenseKey}
                                            onChange={e => setLicenseKey(e.target.value)}
                                            maxLength={3}
                                            style={{ width: "100%", letterSpacing: "5px", textAlign: "center", fontSize: "1.2em" }}
                                        />
                                    </div>
                                    <button onClick={checkKeygen} className="btn btn-cyan">Verify Key</button>
                                </div>
                            </div>
                        )}

                        {/* Hints for Level > 1 */}
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
                                background: "#1f1f1f",
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
                                <p style={{ color: "#fff", marginBottom: "30px" }}>
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
