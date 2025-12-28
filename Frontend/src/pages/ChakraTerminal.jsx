import React, { useState } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import WebTerminal from "../components/WebTerminal";

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
                        <h2 style={{ fontSize: "1rem", marginBottom: "10px", color: "#51cf66", fontFamily: "monospace" }}>
                            {`user@${"192.168.81.134"}`}
                        </h2>

                        <div style={{
                            border: "1px solid #333",
                            borderRadius: "8px",
                            overflow: "hidden",
                            boxShadow: "0 4px 20px rgba(0,0,0,0.5)"
                        }}>
                            <WebTerminal
                                host="192.168.81.134"
                                user="ubuntu"
                            />
                        </div>
                    </div>

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
