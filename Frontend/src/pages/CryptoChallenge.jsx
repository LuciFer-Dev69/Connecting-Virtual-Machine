import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { API_BASE } from "../config";
import ChallengeHint from "../components/ChallengeHint";

export default function CryptoChallenge({ level }) {
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

    // Level 1 State (Caesar)
    const [caesarInput, setCaesarInput] = useState("");

    // Level 2 State (Base64)
    const [base64Input, setBase64Input] = useState("");

    // Level 3 State (Vigenere)
    const [vigenereInput, setVigenereInput] = useState("");

    useEffect(() => {
        fetchChallenge(currentLevel);
        setCurrentStep(0);
        setCompletedSteps([]);
    }, [currentLevel]);

    const [data, setData] = useState([]);

    const fetchChallenge = async (lvl) => {
        try {
            const res = await fetch(`${API_BASE}/challenges`);
            const d = await res.json();
            setData(d);
            const challenges = d.filter(c => c.category === 'Cryptography');
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
            title: "Understanding Caesar Cipher",
            content: "The Caesar cipher is one of the oldest and simplest encryption techniques. It works by shifting each letter in the alphabet by a fixed number of positions. For example, with a shift of 3, 'A' becomes 'D', 'B' becomes 'E', and so on.",
            task: "Read about ROT13, a special case where the shift is exactly 13 positions. This makes it its own inverse - encoding and decoding use the same operation!"
        },
        {
            title: "Identify the Encrypted Message",
            content: "Look at the encrypted message below. Notice it has the structure of a flag but the letters are scrambled. This is because each letter has been shifted by 13 positions.",
            task: "Copy the encrypted text: synt{ebg13_znfgre}"
        },
        {
            title: "Use a ROT13 Decoder",
            content: "You can decode ROT13 using online tools like rot13.com, CyberChef, or even write a simple script. Since ROT13 is its own inverse, you can also encode the text again to decode it!",
            task: "Paste the encrypted text into a ROT13 decoder and decode it"
        },
        {
            title: "Submit the Flag",
            content: "After decoding, you should see a readable flag in the format flag{...}. This is your answer!",
            task: "Type the decoded flag in the input below and click 'Check Answer'"
        }
    ];

    // Level 1: Caesar Cipher
    const caesarCipher = (str, shift) => {
        return str.replace(/[a-zA-Z]/g, (char) => {
            const base = char <= 'Z' ? 65 : 97;
            return String.fromCharCode(((char.charCodeAt(0) - base + shift) % 26) + base);
        });
    };

    const checkCaesar = () => {
        if (caesarInput.toLowerCase() === "flag{rot13_master}") {
            setFlag("flag{rot13_master}");
            setMessage("🎉 Correct! You decoded the ROT13 cipher.");
            if (!completedSteps.includes(3)) {
                setCompletedSteps([...completedSteps, 3]);
            }
        } else {
            setMessage("❌ Incorrect decoding. Make sure you decoded the entire message correctly!");
        }
    };

    // Level 2: Base64
    const checkBase64 = () => {
        if (base64Input === "flag{base64_encoding_is_easy}") {
            setFlag("flag{base64_encoding_is_easy}");
            setMessage("🎉 Correct! Base64 decoded successfully.");
        } else {
            setMessage("❌ Incorrect. Did you decode the Base64 string?");
        }
    };

    // Level 3: Vigenere
    const checkVigenere = () => {
        if (vigenereInput === "flag{v1g3n3r3_c1ph3r}") {
            setFlag("flag{v1g3n3r3_c1ph3r}");
            setMessage("🎉 Correct! You broke the Vigenère cipher.");
        } else {
            setMessage("❌ Incorrect flag. Did you use the key 'CHAKRA'?");
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
            setCaesarInput("");
            setBase64Input("");
            setVigenereInput("");
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
                        {challengeId && data ? data.find(c => c.id === challengeId)?.title : `Cryptography - Level ${currentLevel}`}
                        {currentLevel === 1 && <span style={{ fontSize: "0.6em", color: "#ffd43b", marginLeft: "15px" }}>📚 TUTORIAL</span>}
                    </h1>

                    {/* Dynamic Content for Levels 2-5 */}
                    {currentLevel > 1 && challengeId && (
                        <div style={{
                            background: "#1f1f1f",
                            padding: "30px",
                            borderRadius: "15px",
                            maxWidth: "900px",
                            border: "1px solid #333",
                            marginBottom: "30px",
                            boxShadow: "0 4px 20px rgba(0,0,0,0.3)"
                        }}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                                <div style={{ flex: 1 }}>
                                    <h2 style={{ color: "var(--cyan)", marginTop: 0, display: "flex", alignItems: "center", gap: "10px" }}>
                                        🎯 Level Objective
                                    </h2>
                                    <p style={{ color: "#eee", lineHeight: "1.6", fontSize: "1.1rem", whiteSpace: "pre-wrap" }}>
                                        {data.find(c => c.id === challengeId)?.description}
                                    </p>
                                </div>
                                <div style={{
                                    background: "#2a2a2a",
                                    padding: "10px 15px",
                                    borderRadius: "8px",
                                    border: "1px solid #444",
                                    textAlign: "center"
                                }}>
                                    <span style={{ color: "#888", fontSize: "0.8rem", display: "block", marginBottom: "5px" }}>Difficulty</span>
                                    <span style={{
                                        color: data.find(c => c.id === challengeId)?.difficulty === 'Hard' ? '#ff6b6b' :
                                            data.find(c => c.id === challengeId)?.difficulty === 'Medium' ? '#ffd43b' : '#51cf66',
                                        fontWeight: "bold"
                                    }}>
                                        {data.find(c => c.id === challengeId)?.difficulty}
                                    </span>
                                </div>
                            </div>

                            <div style={{
                                marginTop: "30px",
                                padding: "25px",
                                background: "linear-gradient(145deg, #1a1a1a, #252525)",
                                borderRadius: "12px",
                                border: "1px solid #333",
                                boxShadow: "inset 0 2px 4px rgba(0,0,0,0.2)"
                            }}>
                                <h3 style={{ marginTop: 0, marginBottom: "15px", fontSize: "1rem", color: "var(--cyan)", display: "flex", alignItems: "center", gap: "8px" }}>
                                    🏁 Flag Submission
                                </h3>
                                <div style={{ display: "flex", gap: "12px" }}>
                                    <input
                                        className="input"
                                        placeholder="Enter the flag here (e.g., flag{...})"
                                        value={manualFlag}
                                        onChange={(e) => setManualFlag(e.target.value)}
                                        style={{ flex: 1, margin: 0, height: "45px" }}
                                        onKeyPress={(e) => e.key === 'Enter' && submitChallenge()}
                                    />
                                    <button className="btn btn-green" onClick={submitChallenge} style={{ margin: 0, height: "45px", minWidth: "120px" }}>
                                        Submit Flag
                                    </button>
                                </div>
                            </div>

                            <div style={{ marginTop: "20px" }}>
                                <ChallengeHint challengeId={challengeId} user={user} />
                            </div>
                        </div>
                    )}

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
                                <h2 style={{ marginBottom: "20px" }}>🔄 The Caesar Shift - Interactive Tutorial</h2>

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
                                    <p style={{ fontFamily: "monospace", fontSize: "1.3em", background: "#111", padding: "15px", borderRadius: "5px", color: "#00d4ff" }}>
                                        synt{"{"}ebg13_znfgre{"}"}
                                    </p>
                                    <div style={{ marginTop: "20px" }}>
                                        <label style={{ display: "block", marginBottom: "5px", color: "#aaa" }}>Enter the decoded flag:</label>
                                        <input
                                            className="input"
                                            value={caesarInput}
                                            onChange={e => setCaesarInput(e.target.value)}
                                            placeholder="flag{...}"
                                            style={{ width: "100%", marginBottom: "10px" }}
                                        />
                                        <button onClick={checkCaesar} className="btn btn-cyan">Check Answer</button>
                                    </div>
                                </div>

                                {/* Hints for Level 1 */}
                                <details style={{ marginTop: "20px", cursor: "pointer" }}>
                                    <summary style={{ color: "#ffd43b", padding: "10px", background: "#2a2a2a", borderRadius: "5px" }}>
                                        💡 Need Help? Click for Hints
                                    </summary>
                                    <div style={{ padding: "15px", background: "#1a1a1a", marginTop: "10px", borderRadius: "5px" }}>
                                        <details style={{ marginBottom: "10px" }}>
                                            <summary style={{ color: "var(--cyan)", cursor: "pointer", padding: "8px" }}>Hint 1: What is ROT13?</summary>
                                            <p style={{ color: "#aaa", marginTop: "10px", paddingLeft: "15px" }}>
                                                ROT13 is a Caesar cipher with a shift of 13. You can use online tools like <code>rot13.com</code> or <code>CyberChef</code> to decode it.
                                            </p>
                                        </details>
                                        <details style={{ marginBottom: "10px" }}>
                                            <summary style={{ color: "var(--cyan)", cursor: "pointer", padding: "8px" }}>Hint 2: How to decode</summary>
                                            <p style={{ color: "#aaa", marginTop: "10px", paddingLeft: "15px" }}>
                                                Copy the encrypted text <code>synt{"{"}ebg13_znfgre{"}"}</code> and paste it into a ROT13 decoder. The output will be your flag!
                                            </p>
                                        </details>
                                        <details>
                                            <summary style={{ color: "#51cf66", cursor: "pointer", padding: "8px" }}>Solution: The Answer</summary>
                                            <p style={{ color: "#51cf66", marginTop: "10px", paddingLeft: "15px", fontWeight: "bold" }}>
                                                The decoded flag is: <code>flag{"{"}rot13_master{"}"}</code>
                                            </p>
                                        </details>
                                    </div>
                                </details>
                            </div>
                        )}

                        {/* Hints for Level 1 */}
                        {currentLevel === 1 && challengeId && (
                            <ChallengeHint challengeId={challengeId} user={user} />
                        )}

                        {/* Cryptography Toolbox - Helpful for all levels */}
                        <div style={{ marginTop: "40px", borderTop: "1px solid #333", paddingTop: "30px" }}>
                            <h3 style={{ color: "var(--cyan)", marginBottom: "15px", display: "flex", alignItems: "center", gap: "10px" }}>
                                🛠️ Cryptography Toolbox
                            </h3>
                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
                                <div style={{ background: "#222", padding: "15px", borderRadius: "10px", border: "1px solid #333" }}>
                                    <h4 style={{ margin: "0 0 10px 0", color: "#aaa", fontSize: "0.9rem" }}>Base64 Decoder/Encoder</h4>
                                    <input
                                        className="input"
                                        placeholder="Type text to encode/decode..."
                                        style={{ width: "100%", marginBottom: "10px", fontSize: "0.8rem" }}
                                        onChange={(e) => {
                                            try {
                                                // Simple logic for the toolbox
                                                const val = e.target.value;
                                                if (val) {
                                                    console.log("Toolbox interaction");
                                                }
                                            } catch (e) { }
                                        }}
                                    />
                                    <div style={{ display: "flex", gap: "10px" }}>
                                        <button className="btn btn-cyan" style={{ fontSize: "0.8rem", padding: "5px 10px" }} onClick={() => {
                                            const input = document.querySelector('.toolbox-input');
                                            if (input) {
                                                try { alert("Decoded: " + atob(input.value)); } catch (e) { alert("Invalid Base64"); }
                                            }
                                        }}>Decode</button>
                                        <button className="btn btn-cyan" style={{ fontSize: "0.8rem", padding: "5px 10px" }} onClick={() => {
                                            const input = document.querySelector('.toolbox-input');
                                            if (input) {
                                                alert("Encoded: " + btoa(input.value));
                                            }
                                        }}>Encode</button>
                                    </div>
                                </div>
                                <div style={{ background: "#222", padding: "15px", borderRadius: "10px", border: "1px solid #333" }}>
                                    <h4 style={{ margin: "0 0 10px 0", color: "#aaa", fontSize: "0.9rem" }}>Shift Cipher Tool (ROT)</h4>
                                    <div style={{ display: "flex", gap: "10px" }}>
                                        <input type="number" defaultValue={13} style={{ width: "50px", background: "#333", border: "1px solid #444", color: "#fff", padding: "5px" }} />
                                        <button className="btn btn-cyan" style={{ fontSize: "0.8rem", padding: "5px 10px", flex: 1 }}>Apply Shift</button>
                                    </div>
                                    <p style={{ fontSize: "0.7rem", color: "#666", marginTop: "10px" }}>Use shift 13 for ROT13, 3 for standard Caesar.</p>
                                </div>
                            </div>
                        </div>

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
