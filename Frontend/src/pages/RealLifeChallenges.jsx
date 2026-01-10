import React, { useState } from "react";
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
        <div style={{ background: "var(--bg)", minHeight: "100vh", color: "var(--text)" }}>
            <Navbar />
            <div style={{ display: "flex" }}>
                <Sidebar active="real-life-challenges" />
                <main style={{ flex: 1, padding: "40px" }}>
                    <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
                        <div style={{ marginBottom: "40px", borderBottom: "1px solid var(--card-border)", paddingBottom: "20px" }}>
                            <h1 style={{ fontSize: "32px", fontWeight: "800", margin: 0 }}>Real-Life Web Challenges</h1>
                            <p style={{ color: "var(--muted)", marginTop: "10px" }}>Exploit enterprise-grade vulnerabilities in isolated environments.</p>
                        </div>

                        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(500px, 1fr))", gap: "25px" }}>
                            {categories.map((cat) => (
                                <a key={cat.key} href={cat.path} style={{ textDecoration: "none", color: "inherit" }}>
                                    <div
                                        style={{
                                            background: "var(--card-bg)",
                                            border: "1px solid var(--card-border)",
                                            borderRadius: "16px",
                                            padding: "30px",
                                            transition: "all 0.3s ease",
                                            cursor: "pointer",
                                            display: "flex",
                                            gap: "24px",
                                            position: "relative",
                                            overflow: "hidden"
                                        }}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.transform = "translateY(-5px)";
                                            e.currentTarget.style.borderColor = cat.color;
                                            e.currentTarget.style.boxShadow = `0 10px 40px ${cat.color}20`;
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.transform = "translateY(0)";
                                            e.currentTarget.style.borderColor = "var(--card-border)";
                                            e.currentTarget.style.boxShadow = "none";
                                        }}
                                    >
                                        <div style={{
                                            background: `${cat.color}15`,
                                            padding: "16px",
                                            borderRadius: "12px",
                                            color: cat.color,
                                            height: "fit-content"
                                        }}>
                                            <cat.icon size={32} />
                                        </div>

                                        <div style={{ flex: 1 }}>
                                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                                                <span style={{ fontSize: "11px", fontWeight: "700", color: cat.color, textTransform: "uppercase", letterSpacing: "1px" }}>{cat.difficulty}</span>
                                                <span style={{ fontSize: "14px", fontWeight: "800", color: "var(--cyan)" }}>{cat.points} PTS</span>
                                            </div>
                                            <h3 style={{ fontSize: "22px", fontWeight: "700", marginBottom: "12px", color: "#fff" }}>{cat.name}</h3>
                                            <p style={{ fontSize: "14px", color: "var(--muted)", lineHeight: "1.6", marginBottom: "20px" }}>{cat.description}</p>
                                            <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
                                                <div style={{ fontSize: "12px", color: "var(--muted)" }}>
                                                    <span style={{ color: "var(--text)", fontWeight: "600" }}>Learn: </span>{cat.learn}
                                                </div>
                                            </div>
                                        </div>

                                        <div style={{ position: "absolute", right: "20px", bottom: "20px", color: "rgba(255,255,255,0.1)" }}>
                                            <ChevronRight size={30} />
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
