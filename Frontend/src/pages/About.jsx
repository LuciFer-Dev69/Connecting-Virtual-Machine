import React from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { Shield, Users, Target, Code, Globe } from "lucide-react";

export default function About() {
    return (
        <div style={{ background: "#121212", minHeight: "100vh", color: "#e0e0e0", fontFamily: "sans-serif" }}>
            <Navbar />
            <div style={{ display: "flex" }}>
                <Sidebar active="about" />
                <main style={{ flex: 1, padding: "40px" }}>
                    <div style={{ maxWidth: "1000px", margin: "0 auto" }}>

                        {/* Header */}
                        <div style={{
                            marginBottom: "40px",
                            borderBottom: "1px solid #333",
                            paddingBottom: "20px"
                        }}>
                            <h1 style={{ fontSize: "32px", fontWeight: "bold", color: "#fff", margin: "0 0 10px 0" }}>About Us</h1>
                            <p style={{ color: "#888", fontSize: "16px" }}>The mission behind ChakraView.</p>
                        </div>

                        {/* Mission Section */}
                        <div style={{ marginBottom: "50px" }}>
                            <div style={{
                                background: "#1e1e1e",
                                borderRadius: "12px",
                                padding: "30px",
                                border: "1px solid #333",
                                display: "flex",
                                gap: "30px",
                                alignItems: "center"
                            }}>
                                <div style={{ flex: 1 }}>
                                    <h2 style={{ color: "var(--cyan)", fontSize: "24px", marginBottom: "15px" }}>Our Mission</h2>
                                    <p style={{ lineHeight: "1.6", color: "#ccc", fontSize: "16px" }}>
                                        ChakraView is designed to democratize cybersecurity education. We believe that learning to defend systems should be accessible, engaging, and practical.
                                        Our platform provides a safe, legal environment for students, developers, and security enthusiasts to practice ethical hacking skills through hands-on challenges.
                                    </p>
                                </div>
                                <div style={{
                                    background: "rgba(0, 212, 255, 0.1)",
                                    padding: "20px",
                                    borderRadius: "50%",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center"
                                }}>
                                    <Shield size={64} color="var(--cyan)" />
                                </div>
                            </div>
                        </div>

                        {/* Features Grid */}
                        <h2 style={{ color: "#fff", fontSize: "24px", marginBottom: "25px" }}>Why ChakraView?</h2>
                        <div style={{
                            display: "grid",
                            gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
                            gap: "20px"
                        }}>
                            <FeatureCard
                                icon={Target}
                                title="Hands-On Practice"
                                desc="Real-world scenarios ranging from web exploitation to reverse engineering."
                                color="#ff6b6b"
                            />
                            <FeatureCard
                                icon={Code}
                                title="Skill Development"
                                desc="Learn by doing. Write code, analyze binaries, and break encryption."
                                color="#ffd43b"
                            />
                            <FeatureCard
                                icon={Globe}
                                title="Community Driven"
                                desc="Join a growing community of ethical hackers and security researchers."
                                color="#51cf66"
                            />
                            <FeatureCard
                                icon={Users}
                                title="For Everyone"
                                desc="From beginners writing their first script to experts hunting zero-days."
                                color="#a78bfa"
                            />
                        </div>

                        {/* Team/Footer */}
                        <div style={{ marginTop: "60px", textAlign: "center", color: "#666", fontSize: "14px" }}>
                            <p>&copy; {new Date().getFullYear()} ChakraView Platform. Built for the cyber community.</p>
                        </div>

                    </div>
                </main>
            </div>
        </div>
    );
}

function FeatureCard({ icon: Icon, title, desc, color }) {
    return (
        <div style={{
            background: "#1e1e1e",
            padding: "25px",
            borderRadius: "12px",
            border: "1px solid #333",
            transition: "transform 0.2s",
            cursor: "default"
        }}
            onMouseEnter={(e) => e.currentTarget.style.transform = "translateY(-5px)"}
            onMouseLeave={(e) => e.currentTarget.style.transform = "translateY(0)"}
        >
            <div style={{
                background: `${color}20`,
                width: "fit-content",
                padding: "10px",
                borderRadius: "8px",
                marginBottom: "15px",
                color: color
            }}>
                <Icon size={24} />
            </div>
            <h3 style={{ color: "#fff", fontSize: "18px", marginBottom: "10px" }}>{title}</h3>
            <p style={{ color: "#aaa", fontSize: "14px", lineHeight: "1.5" }}>{desc}</p>
        </div>
    );
}
