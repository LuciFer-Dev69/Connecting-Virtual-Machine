import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { API_BASE } from "../config";
import ChallengeHint from "../components/ChallengeHint";

export default function ForensicsChallenge({ level }) {
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

    // Level 1 State (Metadata)
    const [showMetadata, setShowMetadata] = useState(false);

    // Level 2 State (Hex)
    const [hexSearch, setHexSearch] = useState("");

    // Level 3 State (Header)
    const [headerBytes, setHeaderBytes] = useState("00 00 00 00");

    useEffect(() => {
        fetchChallenge(currentLevel);
        setCurrentStep(0);
        setCompletedSteps([]);
    }, [currentLevel]);

    const fetchChallenge = async (lvl) => {
        try {
            const res = await fetch(`${API_BASE}/challenges`);
            const data = await res.json();
            const challenges = data.filter(c => c.category === 'Forensics');
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
            title: "Understanding EXIF Data",
            content: "EXIF (Exchangeable Image File Format) data is metadata embedded in image files. It can contain information like camera settings, GPS coordinates, timestamps, and even hidden messages! This data is automatically added by cameras and phones.",
            task: "Learn what EXIF metadata is and why it's important in digital forensics"
        },
        {
            title: "What Information is Hidden",
            content: "Image metadata can reveal: camera model, date/time taken, GPS location, software used, and custom comments. Forensic investigators use this data to verify authenticity, track locations, and find hidden information.",
            task: "Understand that images contain much more than just pixels"
        },
        {
            title: "Using EXIF Viewer Tools",
            content: "You can view EXIF data using online tools like 'exif.regex.info', 'jimpl.com', or command-line tools like 'exiftool'. For this challenge, we'll simulate viewing the metadata of an image file.",
            task: "Click 'Inspect Properties' to view the image metadata"
        },
        {
            title: "Finding the Flag",
            content: "Look through all the EXIF data fields carefully. The flag is often hidden in fields like 'Comment', 'Description', or 'User Comment'. These fields can contain custom text added by the image creator.",
            task: "Find the flag hidden in the Comment field"
        }
    ];

    // Level 1: Metadata
    const revealMetadata = () => {
        setShowMetadata(true);
        setFlag("flag{exif_data_revealed}");
        if (!completedSteps.includes(3)) {
            setCompletedSteps([...completedSteps, 3]);
        }
    };

    // Level 2: Hex Viewer
    const checkHex = () => {
        if (hexSearch.includes("flag{") || hexSearch.includes("hidden_in_bytes")) {
            setFlag("flag{hidden_in_bytes}");
            setMessage("🎉 Found it! The flag was hidden in the hex dump.");
        } else {
            setMessage("❌ Keep looking through the hex bytes...");
        }
    };

    // Level 3: Corrupted Header
    const fixHeader = () => {
        // PNG Magic Bytes: 89 50 4E 47
        const normalized = headerBytes.toUpperCase().replace(/\s/g, "");
        if (normalized === "89504E47") {
            setFlag("flag{magic_bytes_restored}");
            setMessage("🎉 Header fixed! The image is now visible.");
        } else {
            setMessage("❌ Incorrect magic bytes for PNG.");
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
            setShowMetadata(false);
            setHexSearch("");
            setHeaderBytes("00 00 00 00");
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
                        Forensics - Level {currentLevel}
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
                                <h2 style={{ marginBottom: "20px" }}>📸 Metadata Inspector - Interactive Tutorial</h2>

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
                                        This photo was taken at a secret location. Can you find the hidden metadata?
                                    </p>
                                    <div style={{ display: "flex", gap: "20px", alignItems: "center" }}>
                                        <div style={{ width: "150px", height: "150px", background: "#333", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "10px", fontSize: "2em" }}>
                                            📷
                                        </div>
                                        <div style={{ flex: 1 }}>
                                            <p style={{ fontFamily: "monospace", color: "#aaa", marginBottom: "15px" }}>IMAGE.JPG</p>
                                            <button onClick={revealMetadata} className="btn btn-cyan">Inspect Properties</button>
                                            {showMetadata && (
                                                <div style={{ marginTop: "15px", fontFamily: "monospace", fontSize: "0.9em", color: "#ccc", background: "#111", padding: "15px", borderRadius: "5px" }}>
                                                    <p>Filename: image.jpg</p>
                                                    <p>Size: 2.4 MB</p>
                                                    <p>Camera: Canon EOS 5D</p>
                                                    <p>Date: 2024-01-15 14:30:22</p>
                                                    <p>Location: 34.2, -118.4</p>
                                                    <p style={{ color: "#51cf66", fontWeight: "bold" }}>Comment: flag{"{"}exif_data_revealed{"}"}</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Hints for Level 1 */}
                                <details style={{ marginTop: "20px", cursor: "pointer" }}>
                                    <summary style={{ color: "#ffd43b", padding: "10px", background: "#2a2a2a", borderRadius: "5px" }}>
                                        💡 Need Help? Click for Hints
                                    </summary>
                                    <div style={{ padding: "15px", background: "#1a1a1a", marginTop: "10px", borderRadius: "5px" }}>
                                        <details style={{ marginBottom: "10px" }}>
                                            <summary style={{ color: "var(--cyan)", cursor: "pointer", padding: "8px" }}>Hint 1: What is EXIF data?</summary>
                                            <p style={{ color: "#aaa", marginTop: "10px", paddingLeft: "15px" }}>
                                                EXIF data contains metadata about an image - camera settings, location, date, and custom comments. It's embedded in the image file itself.
                                            </p>
                                        </details>
                                        <details style={{ marginBottom: "10px" }}>
                                            <summary style={{ color: "var(--cyan)", cursor: "pointer", padding: "8px" }}>Hint 2: How to view metadata</summary>
                                            <p style={{ color: "#aaa", marginTop: "10px", paddingLeft: "15px" }}>
                                                Click the "Inspect Properties" button to view all the metadata fields. Look carefully at each field for anything unusual.
                                            </p>
                                        </details>
                                        <details>
                                            <summary style={{ color: "#51cf66", cursor: "pointer", padding: "8px" }}>Solution</summary>
                                            <p style={{ color: "#51cf66", marginTop: "10px", paddingLeft: "15px", fontWeight: "bold" }}>
                                                The flag is hidden in the "Comment" field of the EXIF data: <code>flag{"{"}exif_data_revealed{"}"}</code>
                                            </p>
                                        </details>
                                    </div>
                                </details>
                            </div>
                        )}

                        {/* Level 2 - CHALLENGE MODE */}
                        {currentLevel === 2 && (
                            <div>
                                <h2>🔢 Hex Viewer</h2>
                                <p style={{ color: "#888", marginBottom: "20px" }}>
                                    A file is more than just its extension. Look at the raw bytes.
                                </p>
                                <div style={{ padding: "20px", background: "#2a2a2a", borderRadius: "10px" }}>
                                    <div style={{ background: "#111", padding: "10px", fontFamily: "monospace", height: "150px", overflowY: "auto", marginBottom: "15px", color: "#aaa" }}>
                                        00000000: 89 50 4E 47 0D 0A 1A 0A 00 00 00 0D 49 48 44 52  .PNG........IHDR<br />
                                        00000010: 00 00 00 20 00 00 00 20 08 06 00 00 00 73 7A 7A  ... ... .....szz<br />
                                        00000020: 00 00 00 04 67 41 4D 41 00 00 B1 8F 0B FC 61 05  ....gAMA......a.<br />
                                        00000030: 66 6C 61 67 7B 68 69 64 64 65 6E 5F 69 6E 5F 62  flag{"{"}hidden_in_b<br />
                                        00000040: 79 74 65 73 7D 00 00 00 00 00 00 00 00 00 00 00  ytes{"}"}...........<br />
                                        00000050: 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00  ................
                                    </div>
                                    <input
                                        className="input"
                                        value={hexSearch}
                                        onChange={e => setHexSearch(e.target.value)}
                                        placeholder="Search for string in hex dump..."
                                        style={{ width: "100%" }}
                                    />
                                    <button onClick={checkHex} className="btn btn-cyan" style={{ marginTop: "15px" }}>Search</button>
                                </div>
                            </div>
                        )}

                        {/* Level 3 - CHALLENGE MODE */}
                        {currentLevel === 3 && (
                            <div>
                                <h2>🤕 Corrupted Header</h2>
                                <p style={{ color: "#888", marginBottom: "20px" }}>
                                    This PNG file won't open. The magic bytes are missing!
                                </p>
                                <div style={{ padding: "20px", background: "#2a2a2a", borderRadius: "10px" }}>
                                    <p>Current Header Bytes (First 4):</p>
                                    <input
                                        className="input"
                                        value={headerBytes}
                                        onChange={e => setHeaderBytes(e.target.value)}
                                        placeholder="XX XX XX XX"
                                        style={{ fontFamily: "monospace", letterSpacing: "2px", width: "200px" }}
                                    />
                                    <p style={{ fontSize: "0.8em", color: "#888", marginTop: "5px" }}>Hint: PNG files always start with the same 8 bytes. The first 4 are critical.</p>
                                    <button onClick={fixHeader} className="btn btn-cyan" style={{ marginTop: "15px" }}>Fix Header</button>
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
