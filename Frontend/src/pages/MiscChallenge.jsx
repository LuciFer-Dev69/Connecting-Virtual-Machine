import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { API_BASE } from "../config";
import ChallengeHint from "../components/ChallengeHint";

export default function MiscChallenge({ level }) {
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

    // Level-specific state
    const [userInput, setUserInput] = useState("");

    useEffect(() => {
        fetchChallenge(currentLevel);
        setCurrentStep(0);
        setCompletedSteps([]);
    }, [currentLevel]);

    const fetchChallenge = async (lvl) => {
        try {
            const res = await fetch(`${API_BASE}/challenges`);
            const data = await res.json();
            const miscChallenges = data.filter(c => c.category === 'Misc');
            const challenge = miscChallenges.find(c => c.level === lvl);

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
            title: "Understanding OSINT",
            content: "OSINT (Open Source Intelligence) is the practice of gathering information from publicly available sources. This includes search engines, social media, public records, and more. It's a crucial skill in cybersecurity for reconnaissance.",
            task: "Learn what OSINT means and why it's important"
        },
        {
            title: "Using Search Engines",
            content: "The most basic OSINT tool is a search engine like Google. Advanced search operators (Google Dorks) can help you find specific information. For example, 'site:twitter.com username' searches only Twitter for that username.",
            task: "Learn about Google search operators"
        },
        {
            title: "Finding Public Information",
            content: "For this challenge, you need to find information about a fictional user 'chakra_master_2024'. In a real scenario, you would search their username on various platforms to find their digital footprint.",
            task: "Understand how to gather information from public sources"
        },
        {
            title: "Submitting Your Findings",
            content: "Based on your OSINT research (simulated here), you've discovered that their favorite security tool is 'OSINT Detective'. Enter this to get the flag!",
            task: "Enter the answer: 'OSINT Detective'"
        }
    ];

    // Level 1: OSINT Basics
    const checkOSINT = () => {
        if (userInput.toLowerCase().includes("osint") || userInput.toLowerCase().includes("detective")) {
            setFlag("flag{osint_detective}");
            setMessage("🎉 Correct! You found the information.");
            if (!completedSteps.includes(3)) {
                setCompletedSteps([...completedSteps, 3]);
            }
        } else {
            setMessage("❌ Not quite. Think about what OSINT tools are commonly used.");
        }
    };

    // Level 2: Phishing Detection
    const checkPhishing = () => {
        if (userInput.toLowerCase().includes("g00gle") || userInput.toLowerCase().includes("zero") || userInput.toLowerCase().includes("0")) {
            setFlag("flag{phishing_expert}");
            setMessage("🎉 Correct! You spotted the fake domain with zeros instead of O's.");
        } else {
            setMessage("❌ Look more carefully at the email address.");
        }
    };

    // Level 3: Password Cracking
    const checkPassword = () => {
        if (userInput.toLowerCase() === "password") {
            setFlag("flag{password_cracker}");
            setMessage("🎉 Correct! The hash was for 'password' - a very weak password.");
        } else {
            setMessage("❌ Try using an MD5 decoder or common password list.");
        }
    };

    // Level 4: Network Analysis
    const checkNetwork = () => {
        if (userInput.toLowerCase().includes("backdoor") || userInput.toLowerCase().includes("trojan") || userInput.toLowerCase().includes("elite")) {
            setFlag("flag{network_analyst}");
            setMessage("🎉 Correct! Port 31337 (elite/leet) is commonly used by backdoors.");
        } else {
            setMessage("❌ Research what port 31337 is commonly associated with.");
        }
    };

    // Level 5: Security Trivia
    const checkTrivia = () => {
        if (userInput.toLowerCase().includes("common") && userInput.toLowerCase().includes("vulnerabilities") && userInput.toLowerCase().includes("exposures")) {
            setFlag("flag{common_vulnerabilities_exposures}");
            setMessage("🎉 Correct! CVE stands for Common Vulnerabilities and Exposures.");
        } else {
            setMessage("❌ Research what CVE stands for in cybersecurity.");
        }
    };

    const handleCheck = () => {
        switch (currentLevel) {
            case 1: checkOSINT(); break;
            case 2: checkPhishing(); break;
            case 3: checkPassword(); break;
            case 4: checkNetwork(); break;
            case 5: checkTrivia(); break;
            default: break;
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
        if (currentLevel < 6) {
            setCurrentLevel(currentLevel + 1);
            setFlag("");
            setManualFlag("");
            setMessage("");
            setSubmitted(false);
            setUserInput("");
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

    const challenges = {
        1: {
            title: "🔍 OSINT Basics",
            description: "Find information about the user 'chakra_master_2024' on social media. The flag is their favorite security tool.",
            hint: "Search for the username across social media platforms. The answer is in their bio.",
            placeholder: "Enter the security tool name..."
        },
        2: {
            title: "📧 Phishing Detection",
            description: "Analyze this email: 'From: support@g00gle.com - Your account will be suspended unless you verify your credentials at http://verify-g00gle.com'. What is the main red flag?",
            hint: "Check the sender's email address carefully. Notice the zeros instead of O letters.",
            placeholder: "What's wrong with the email?"
        },
        3: {
            title: "🔐 Weak Hash Cracker",
            description: "Crack this MD5 hash: 5f4dcc3b5aa765d61d8327deb882cf99. The password is a common word.",
            hint: "Try a dictionary attack with common passwords. Or use an online MD5 decoder.",
            placeholder: "Enter the cracked password..."
        },
        4: {
            title: "🌐 Suspicious Traffic",
            description: "Network logs show traffic on port 31337. This port is commonly used by which type of malware?",
            hint: "Research common backdoor and trojan ports. Port 31337 is historically significant (leet/elite).",
            placeholder: "Type of malware..."
        },
        5: {
            title: "🏆 Security Master",
            description: "What does CVE stand for in cybersecurity?",
            hint: "CVE is a database maintained by MITRE. Research what the acronym means.",
            placeholder: "Full form of CVE..."
        }
    };

    const currentChallenge = challenges[currentLevel];

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
                        Misc / General - Level {currentLevel}
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
                            <div style={{ marginBottom: "30px" }}>
                                <h2 style={{ marginBottom: "20px" }}>🔍 OSINT Basics - Interactive Tutorial</h2>

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

                                {/* Hints for Level 1 */}
                                <details style={{ marginBottom: "30px", cursor: "pointer" }}>
                                    <summary style={{ color: "#ffd43b", padding: "10px", background: "#2a2a2a", borderRadius: "5px" }}>
                                        💡 Need Help? Click for Hints
                                    </summary>
                                    <div style={{ padding: "15px", background: "#1a1a1a", marginTop: "10px", borderRadius: "5px" }}>
                                        <details style={{ marginBottom: "10px" }}>
                                            <summary style={{ color: "var(--cyan)", cursor: "pointer", padding: "8px" }}>Hint 1: What is OSINT?</summary>
                                            <p style={{ color: "#aaa", marginTop: "10px", paddingLeft: "15px" }}>
                                                OSINT stands for Open Source Intelligence. It involves finding information that is publicly available on the internet.
                                            </p>
                                        </details>
                                        <details style={{ marginBottom: "10px" }}>
                                            <summary style={{ color: "var(--cyan)", cursor: "pointer", padding: "8px" }}>Hint 2: The Answer</summary>
                                            <p style={{ color: "#aaa", marginTop: "10px", paddingLeft: "15px" }}>
                                                The simulated target's favorite tool is "OSINT Detective".
                                            </p>
                                        </details>
                                        <details>
                                            <summary style={{ color: "#51cf66", cursor: "pointer", padding: "8px" }}>Solution</summary>
                                            <p style={{ color: "#51cf66", marginTop: "10px", paddingLeft: "15px", fontWeight: "bold" }}>
                                                Enter: <code>OSINT Detective</code>
                                            </p>
                                        </details>
                                    </div>
                                </details>
                            </div>
                        )}

                        {/* Challenge Content */}
                        <h2>{currentChallenge.title}</h2>
                        <p style={{ color: "#888", marginBottom: "20px", lineHeight: "1.6" }}>
                            {currentChallenge.description}
                        </p>

                        <div style={{ padding: "20px", background: "#2a2a2a", borderRadius: "10px" }}>
                            <div style={{ marginBottom: "15px" }}>
                                <label style={{ display: "block", marginBottom: "5px", color: "#aaa" }}>
                                    Your Answer:
                                </label>
                                <input
                                    type="text"
                                    value={userInput}
                                    onChange={e => setUserInput(e.target.value)}
                                    placeholder={currentChallenge.placeholder}
                                    className="input"
                                    style={{ width: "100%", marginBottom: "10px" }}
                                    onKeyPress={(e) => e.key === 'Enter' && handleCheck()}
                                />
                            </div>
                            <button onClick={handleCheck} className="btn btn-cyan">
                                Check Answer
                            </button>
                        </div>

                        {/* Hint Section (for non-tutorial levels or additional help) */}
                        {currentLevel > 1 && (
                            <details style={{ marginTop: "20px", color: "#888" }}>
                                <summary style={{ cursor: "pointer", color: "#ffd43b" }}>💡 Need a hint?</summary>
                                <p style={{ marginTop: "10px", padding: "10px", background: "#2a2a2a", borderRadius: "5px" }}>
                                    {currentChallenge.hint}
                                </p>
                            </details>
                        )}

                        {/* Backend Hints System */}
                        {challengeId && (
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
