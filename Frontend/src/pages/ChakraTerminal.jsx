import React, { useState } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import MockTerminal from "../components/MockTerminal";

export default function ChakraTerminal() {
    const [level, setLevel] = useState(1);
    const [solved, setSolved] = useState(false);
    const [flag, setFlag] = useState("");

    const handleLevelSolve = (content) => {
        // Check if content matches flag format
        if (content.includes("chakra{dashed_filename_master")) {
            setSolved(true);
            setFlag(content);
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
                        🕹️ PwnBox - Chakra Level {level}
                    </h1>

                    <div style={{
                        background: "#1f1f1f",
                        padding: "20px",
                        borderRadius: "10px",
                        marginBottom: "20px",
                        border: "1px solid #333"
                    }}>
                        <h2 style={{ fontSize: "1.2rem", marginBottom: "10px", color: "#ffeb3b" }}>Level Goal</h2>
                        <p style={{ color: "#aaa" }}>
                            The password for the next level is stored in a file called
                            <code style={{ background: "#333", padding: "2px 6px", borderRadius: "4px", margin: "0 5px", color: "#fff" }}>-</code>
                            located in the home directory.
                        </p>
                        <div style={{ marginTop: "15px" }}>
                            <strong style={{ color: "#51cf66" }}>Commands you may need:</strong>
                            <span style={{ marginLeft: "10px", color: "#888", fontFamily: "monospace" }}>ls, cd, cat, file, pwd</span>
                        </div>
                        <div style={{ marginTop: "10px" }}>
                            <strong style={{ color: "#51cf66" }}>Helpful Reading:</strong>
                            <a href="https://www.google.com/search?q=Dashed+filename" target="_blank" rel="noreferrer" style={{ marginLeft: "10px", color: "var(--cyan)" }}>
                                Google Search for "Dashed filename"
                            </a>
                        </div>
                    </div>

                    <MockTerminal onSolved={handleLevelSolve} />

                    {solved && (
                        <div style={{
                            marginTop: "20px",
                            padding: "20px",
                            background: "rgba(81, 207, 102, 0.1)",
                            border: "1px solid #51cf66",
                            borderRadius: "10px",
                            animation: "fadeIn 0.5s"
                        }}>
                            <h3 style={{ color: "#51cf66" }}>🎉 Level Completed!</h3>
                            <p>You found the flag: <strong>{flag}</strong></p>
                            <button className="btn btn-cyan" style={{ marginTop: "10px" }}>Go to Next Level (Coming Soon)</button>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
}
