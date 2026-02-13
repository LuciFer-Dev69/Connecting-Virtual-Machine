import React, { useState, useEffect } from "react";
import WebTerminal from "../components/WebTerminal";
import PageTemplate from "../components/templates/PageTemplate";
import { Terminal as TerminalIcon, Shield, Cpu, Zap, Activity } from "lucide-react";
import { API_BASE } from "../config";

export default function ChakraTerminal() {
    const [level, setLevel] = useState(1);
    const [solved, setSolved] = useState(false);
    const [flag, setFlag] = useState("");
    const [pwnboxInfo, setPwnboxInfo] = useState(null);
    const [loading, setLoading] = useState(true);

    const user = JSON.parse(localStorage.getItem("user") || "{}");

    useEffect(() => {
        const userId = user.user_id || user.id;
        if (!userId) {
            setLoading(false);
            return;
        }

        const spawn = async () => {
            try {
                const res = await fetch(`${API_BASE}/pwnbox/spawn`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ user_id: userId })
                });
                const data = await res.json();
                if (data.error) {
                    console.error("Spawn error returned:", data.error);
                } else {
                    setPwnboxInfo(data);
                }
            } catch (err) {
                console.error("Spawn fetch failure:", err);
            } finally {
                setLoading(false);
            }
        };
        spawn();
    }, [user.user_id, user.id]);

    const handleLevelSolve = (content) => {
        if (content.includes("chakra{dashed_filename_master")) {
            setSolved(true);
            setFlag(content);
        }
    };

    return (
        <div style={{ backgroundColor: "#0B0F19", minHeight: "100%" }}>
            <PageTemplate
                title={`PwnBox - Chakra Level ${level}`}
                subtitle="Execute exploitation protocols in a sandboxed Ubuntu environment."
                fullWidth
            >
                <div style={{ display: "flex", flexDirection: "column", gap: "24px", paddingBottom: "40px" }}>
                    {/* Mission Intelligence Widget */}
                    <div style={{
                        background: "#111827",
                        border: "1px solid rgba(255, 255, 255, 0.05)",
                        borderRadius: "8px",
                        padding: "20px"
                    }}>
                        <div style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "10px",
                            color: "#10B981",
                            fontSize: "12px",
                            fontWeight: "800",
                            textTransform: "uppercase",
                            letterSpacing: "0.1em",
                            marginBottom: "12px"
                        }}>
                            <Shield size={14} /> MISSION BRIEFING
                        </div>
                        <p style={{ color: "#9CA3AF", fontSize: "14px", lineHeight: "1.6" }}>
                            Your current assessment involves analyzing the local filesystem and exploiting known misconfigurations.
                            Locate the hidden flag within the user directory to proceed to Level 2.
                        </p>
                    </div>

                    {/* Terminal Console Card */}
                    <div style={{
                        background: "#111827",
                        border: "1px solid rgba(255, 255, 255, 0.05)",
                        borderRadius: "8px",
                        overflow: "hidden",
                        display: "flex",
                        flexDirection: "column"
                    }}>
                        <div style={{
                            background: "#1F2937",
                            padding: "8px 16px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            borderBottom: "1px solid rgba(255, 255, 255, 0.05)"
                        }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                                <TerminalIcon size={14} color="#10B981" />
                                <span style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "12px", color: "#F9FAFB" }}>
                                    {pwnboxInfo ? `${pwnboxInfo.user}@chakraview:~/ops# [PASS: ${pwnboxInfo.password}]` : 'Establishing neural uplink...'}
                                </span>
                            </div>
                            <div style={{ display: "flex", gap: "6px" }}>
                                <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#ff5f56" }} />
                                <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#ffbd2e" }} />
                                <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#27c93f" }} />
                            </div>
                        </div>

                        <div style={{
                            height: "70vh",
                            minHeight: "450px",
                            maxHeight: "800px",
                            background: "#0D0D0D"
                        }}>
                            <WebTerminal
                                connectionInfo={pwnboxInfo}
                            />
                        </div>
                    </div>

                    {solved && (
                        <div style={{
                            padding: "20px",
                            background: "rgba(16, 185, 129, 0.05)",
                            border: "1px solid #10B981",
                            borderRadius: "8px",
                            animation: "fadeIn 0.5s"
                        }}>
                            <h3 style={{ color: "#10B981", fontSize: "16px", fontWeight: "700", marginBottom: "8px" }}>
                                🎉 Mission Success
                            </h3>
                            <p style={{ color: "#F9FAFB", fontSize: "14px" }}>
                                Decrypted Flag: <code style={{ color: "#10B981", fontWeight: "700" }}>{flag}</code>
                            </p>
                            <button
                                className="btn-submit"
                                style={{ marginTop: "16px", padding: "8px 16px", fontSize: "12px" }}
                            >
                                Advance to Level 2
                            </button>
                        </div>
                    )}

                    {/* Stats/Status Row */}
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px" }}>
                        <div style={{ padding: "16px", background: "#111827", border: "1px solid rgba(255, 255, 255, 0.05)", borderRadius: "8px" }}>
                            <div style={{ fontSize: "10px", color: "#6B7280", textTransform: "uppercase", fontWeight: "800", marginBottom: "4px" }}>Latency</div>
                            <div style={{ fontSize: "18px", color: "#F9FAFB", fontWeight: "700", fontFamily: "JetBrains Mono" }}>24ms</div>
                        </div>
                        <div style={{ padding: "16px", background: "#111827", border: "1px solid rgba(255, 255, 255, 0.05)", borderRadius: "8px" }}>
                            <div style={{ fontSize: "10px", color: "#6B7280", textTransform: "uppercase", fontWeight: "800", marginBottom: "4px" }}>CPU Load</div>
                            <div style={{ fontSize: "18px", color: "#10B981", fontWeight: "700", fontFamily: "JetBrains Mono" }}>12.4%</div>
                        </div>
                        <div style={{ padding: "16px", background: "#111827", border: "1px solid rgba(255, 255, 255, 0.05)", borderRadius: "8px" }}>
                            <div style={{ fontSize: "10px", color: "#6B7280", textTransform: "uppercase", fontWeight: "800", marginBottom: "4px" }}>Memory</div>
                            <div style={{ fontSize: "18px", color: "#F9FAFB", fontWeight: "700", fontFamily: "JetBrains Mono" }}>4.2 GB</div>
                        </div>
                    </div>
                </div>
            </PageTemplate>
        </div>
    );
}
