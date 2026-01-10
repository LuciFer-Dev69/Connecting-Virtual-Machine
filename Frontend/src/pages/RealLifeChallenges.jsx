import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { API_BASE } from "../config";
import { Target, Shield, Zap, Search, ChevronRight, FileUp, ShoppingCart } from "lucide-react";

export default function RealLifeChallenges() {
    const categories = [
        {
            name: "Phantom Login - Reflected XSS",
            key: "XSS",
            icon: Target,
            description: "A vulnerable login system is running locally. The username field is reflected back in the welcome message without any sanitization. Inject a JavaScript payload to execute in the browser and retrieve the flag.",
            learn: "XSS, SQL Injection, Terminal Tools",
            color: "#00d4ff",
            difficulty: "Easy",
            points: 100,
            path: "#/xss-challenge"
        },
        {
            name: "Phantom Profile - File Upload",
            key: "File Upload",
            icon: FileUp,
            description: "Bypass profile avatar restrictions to demonstrate file upload misconfigurations and achieve remote execution.",
            learn: "Extension Filtering, RCE, Misconfiguration",
            color: "#00d4ff",
            difficulty: "Easy",
            points: 100,
            path: "#/upload-challenge"
        },
        {
            name: "Phantom Login - SQL Injection",
            key: "SQL Injection",
            icon: Shield,
            description: "Inject SQL payloads to bypass authentication and gain unauthorized administrative access.",
            learn: "Auth Bypass, SQL syntax, Sanitization",
            color: "#ff8c00",
            difficulty: "Medium",
            points: 200,
            path: "#/sqli-challenge"
        },
        {
            name: "Zero-Dollar Checkout",
            key: "Business Logic",
            icon: ShoppingCart,
            description: "Manipulate transactional logic to purchase high-value items for $0 and exploit price trust.",
            learn: "Pricing Logic, Transaction Integrity, OWASP A04",
            color: "#ff4444",
            difficulty: "Hardest",
            points: 350,
            path: "#/logic-challenge"
        }
    ];

    return (
        <div>
            <Navbar />
            <div style={{ display: "flex" }}>
                <Sidebar />
                <main style={{
                    flex: 1,
                    padding: "40px",
                    background: "var(--bg)",
                    minHeight: "100vh",
                    color: "var(--text)"
                }}>
                    <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
                        <div style={{ marginBottom: "40px" }}>
                            <h1 style={{ fontSize: "36px", fontWeight: "800", marginBottom: "12px", background: "linear-gradient(90deg, #fff, var(--muted))", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                                Real-Life Security Challenges
                            </h1>
                            <p style={{ color: "var(--muted)", fontSize: "16px", maxWidth: "700px" }}>
                                Professional cyber-lab experience inspired by real-world vulnerabilities. Exploit targets directly from your PawnBox terminal.
                            </p>
                        </div>

                        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(380px, 1fr))", gap: "25px" }}>
                            {categories.map((category) => (
                                <a
                                    key={category.key}
                                    href={category.path}
                                    style={{ textDecoration: "none" }}
                                >
                                    <div style={{
                                        background: "var(--card-bg)",
                                        border: "1px solid var(--card-border)",
                                        borderRadius: "16px",
                                        padding: "24px",
                                        position: "relative",
                                        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                                        cursor: "pointer",
                                        overflow: "hidden"
                                    }}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.transform = "translateY(-5px)";
                                            e.currentTarget.style.borderColor = category.color;
                                            e.currentTarget.style.boxShadow = `0 10px 30px -10px ${category.color}40`;
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.transform = "translateY(0)";
                                            e.currentTarget.style.borderColor = "var(--card-border)";
                                            e.currentTarget.style.boxShadow = "none";
                                        }}
                                    >
                                        {/* Status Header */}
                                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "20px" }}>
                                            <span style={{
                                                background: `${category.color}15`,
                                                color: category.color,
                                                padding: "6px 12px",
                                                borderRadius: "6px",
                                                fontSize: "12px",
                                                fontWeight: "700",
                                                textTransform: "uppercase"
                                            }}>
                                                {category.difficulty}
                                            </span>
                                            <span style={{ color: "var(--cyan)", fontSize: "14px", fontWeight: "700", fontFamily: "monospace" }}>
                                                {category.points} PTS
                                            </span>
                                        </div>

                                        {/* Icon & Title */}
                                        <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "16px" }}>
                                            <div style={{
                                                background: `${category.color}20`,
                                                padding: "12px",
                                                borderRadius: "12px",
                                                color: category.color
                                            }}>
                                                <category.icon size={28} />
                                            </div>
                                            <h3 style={{ fontSize: "22px", fontWeight: "700", margin: 0, color: "#fff" }}>
                                                {category.name}
                                            </h3>
                                        </div>

                                        {/* Description */}
                                        <p style={{ color: "var(--muted)", fontSize: "14px", lineHeight: "1.6", marginBottom: "24px", height: "65px", overflow: "hidden" }}>
                                            {category.description}
                                        </p>

                                        {/* Footer */}
                                        <div style={{
                                            display: "flex",
                                            justifyContent: "space-between",
                                            alignItems: "center",
                                            paddingTop: "20px",
                                            borderTop: "1px solid var(--card-border)"
                                        }}>
                                            <div style={{ display: "flex", gap: "8px" }}>
                                                <span style={{ background: "#1a1a1a", border: "1px solid #333", padding: "4px 8px", borderRadius: "4px", fontSize: "11px", color: "#888" }}>
                                                    {category.key}
                                                </span>
                                            </div>
                                            <div style={{
                                                background: "var(--cyan)",
                                                color: "#000",
                                                padding: "8px 16px",
                                                borderRadius: "8px",
                                                fontSize: "14px",
                                                fontWeight: "700",
                                                display: "flex",
                                                alignItems: "center",
                                                gap: "8px"
                                            }}>
                                                Launch <ChevronRight size={16} />
                                            </div>
                                        </div>
                                    </div>
                                </a>
                            ))}
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}
