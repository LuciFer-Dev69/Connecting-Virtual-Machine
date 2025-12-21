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

    const fetchChallenge = async (lvl) => {
        try {
            const res = await fetch(`${API_BASE}/challenges`);
            const data = await res.json();
            const challenges = data.filter(c => c.category === 'Cryptography');
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
                        Cryptography - Level {currentLevel}
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

                        {/* Level 2 - CHALLENGE MODE with Hints */}
                        {currentLevel === 2 && (
                            <div>
                                <h2>📦 Base64 Basics</h2>
                                <p style={{ color: "#888", marginBottom: "20px" }}>
                                    This string looks like random characters, but it ends with an equals sign. What could it be?
                                </p>
                                <div style={{ padding: "20px", background: "#2a2a2a", borderRadius: "10px" }}>
                                    <p style={{ fontFamily: "monospace", fontSize: "1.2em", background: "#111", padding: "10px", borderRadius: "5px", wordBreak: "break-all" }}>
                                        ZmxhZ3tiYXNlNjRfZW5jb2RpbmdfaXNfZWFzeX0=
                                    </p>
                                    <div style={{ marginTop: "15px" }}>
                                        <label style={{ display: "block", marginBottom: "5px" }}>Decoded Flag:</label>
                                        <input
                                            className="input"
                                            value={base64Input}
                                            onChange={e => setBase64Input(e.target.value)}
                                            placeholder="Enter the decoded flag..."
                                            style={{ width: "100%" }}
                                        />
                                    </div>
                                    <button onClick={checkBase64} className="btn btn-cyan" style={{ marginTop: "15px" }}>Check Answer</button>
                                </div>

                                {/* Progressive Hints */}
                                <details style={{ marginTop: "20px", cursor: "pointer" }}>
                                    <summary style={{ color: "#ffd43b", padding: "10px", background: "#2a2a2a", borderRadius: "5px" }}>
                                        💡 Hints Available
                                    </summary>
                                    <div style={{ padding: "15px", background: "#1a1a1a", marginTop: "10px", borderRadius: "5px" }}>
                                        <details style={{ marginBottom: "10px" }}>
                                            <summary style={{ color: "var(--cyan)", cursor: "pointer", padding: "8px" }}>Hint 1: Encoding Type</summary>
                                            <p style={{ color: "#aaa", marginTop: "10px", paddingLeft: "15px" }}>
                                                The equals sign (=) at the end is a characteristic of Base64 encoding. This is a common encoding method used to represent binary data in ASCII format.
                                            </p>
                                        </details>
                                        <details style={{ marginBottom: "10px" }}>
                                            <summary style={{ color: "var(--cyan)", cursor: "pointer", padding: "8px" }}>Hint 2: Decoding Tool</summary>
                                            <p style={{ color: "#aaa", marginTop: "10px", paddingLeft: "15px" }}>
                                                Use an online Base64 decoder like <code>base64decode.org</code> or CyberChef. You can also use the browser console: <code>atob("ZmxhZ3tiYXNlNjRfZW5jb2RpbmdfaXNfZWFzeX0=")</code>
                                            </p>
                                        </details>
                                        <details>
                                            <summary style={{ color: "#51cf66", cursor: "pointer", padding: "8px" }}>Solution</summary>
                                            <p style={{ color: "#51cf66", marginTop: "10px", paddingLeft: "15px", fontWeight: "bold" }}>
                                                The decoded flag is: <code>flag{"{"}base64_encoding_is_easy{"}"}</code>
                                            </p>
                                        </details>
                                    </div>
                                </details>
                            </div>
                        )}

                        {/* Level 3 - CHALLENGE MODE with Hints */}
                        {currentLevel === 3 && (
                            <div>
                                <h2>🔑 The Vigenère Cipher</h2>
                                <p style={{ color: "#888", marginBottom: "20px" }}>
                                    A polyalphabetic substitution. You found a note saying the key is <b>CHAKRA</b>.
                                </p>
                                <div style={{ padding: "20px", background: "#2a2a2a", borderRadius: "10px" }}>
                                    <p style={{ fontFamily: "monospace", fontSize: "1.2em", background: "#111", padding: "10px", borderRadius: "5px" }}>
                                        hrhg{"{"}c1t3u3r3_c1c43r{"}"}
                                    </p>
                                    <div style={{ marginTop: "15px" }}>
                                        <label style={{ display: "block", marginBottom: "5px" }}>Decoded Flag:</label>
                                        <input
                                            className="input"
                                            value={vigenereInput}
                                            onChange={e => setVigenereInput(e.target.value)}
                                            placeholder="Enter the decrypted flag..."
                                            style={{ width: "100%" }}
                                        />
                                    </div>
                                    <button onClick={checkVigenere} className="btn btn-cyan" style={{ marginTop: "15px" }}>Check Flag</button>
                                </div>

                                {/* Progressive Hints */}
                                <details style={{ marginTop: "20px", cursor: "pointer" }}>
                                    <summary style={{ color: "#ffd43b", padding: "10px", background: "#2a2a2a", borderRadius: "5px" }}>
                                        💡 Hints Available
                                    </summary>
                                    <div style={{ padding: "15px", background: "#1a1a1a", marginTop: "10px", borderRadius: "5px" }}>
                                        <details style={{ marginBottom: "10px" }}>
                                            <summary style={{ color: "var(--cyan)", cursor: "pointer", padding: "8px" }}>Hint 1: About Vigenère</summary>
                                            <p style={{ color: "#aaa", marginTop: "10px", paddingLeft: "15px" }}>
                                                The Vigenère cipher uses a keyword to encrypt text. Each letter of the keyword determines how much to shift each corresponding letter of the plaintext.
                                            </p>
                                        </details>
                                        <details style={{ marginBottom: "10px" }}>
                                            <summary style={{ color: "var(--cyan)", cursor: "pointer", padding: "8px" }}>Hint 2: Decoding Tool</summary>
                                            <p style={{ color: "#aaa", marginTop: "10px", paddingLeft: "15px" }}>
                                                Use an online Vigenère decoder like <code>dcode.fr/vigenere-cipher</code> or CyberChef. Enter the encrypted text and use the key <code>CHAKRA</code>.
                                            </p>
                                        </details>
                                        <details>
                                            <summary style={{ color: "#51cf66", cursor: "pointer", padding: "8px" }}>Solution</summary>
                                            <p style={{ color: "#51cf66", marginTop: "10px", paddingLeft: "15px", fontWeight: "bold" }}>
                                                The decoded flag is: <code>flag{"{"}v1g3n3r3_c1ph3r{"}"}</code>
                                            </p>
                                        </details>
                                    </div>
                                </details>
                            </div>
                        )}

                        {/* Hints for Levels */}
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
