import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { API_BASE } from "../config";
import {
    Search, Terminal, Database, Shield, Lock,
    Globe, Activity, Zap, FileSearch
} from "lucide-react";

export default function RealLifeChallenges() {
    const [challenges, setChallenges] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    const fetchChallenges = async () => {
        setLoading(true);
        try {
            const res = await fetch(`${API_BASE}/real-life-challenges`);
            const data = await res.json();
            setChallenges(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error("Error fetching real-life challenges:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchChallenges();
    }, []);

    const getImageForChallenge = (title) => {
        const t = title?.toLowerCase() || "";
        if (t.includes("nmap") || t.includes("recon")) return "/images/challenges/nmap_recon.png";
        if (t.includes("directory") || t.includes("discovery")) return "/images/challenges/dir_disco.png";
        if (t.includes("version")) return "/images/challenges/version_detect.png";
        if (t.includes("credentials") || t.includes("login")) return "/images/challenges/default_creds.png";
        if (t.includes("robots")) return "/images/challenges/robots_leak.png";
        if (t.includes("xss")) return "/images/challenges/xss_payload.png";
        return "/images/challenges/nmap_recon.png"; // fallback
    };

    const getIconForCategory = (category) => {
        const cat = category?.toLowerCase() || "";
        if (cat.includes("recon")) return Search;
        if (cat.includes("web")) return Globe;
        if (cat.includes("auth")) return Lock;
        if (cat.includes("sql")) return Database;
        return Shield;
    };

    const filteredChallenges = challenges.filter(c =>
        (c.title || "").toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) return (
        <div style={{ background: "var(--bg)", minHeight: "100vh" }}>
            <Navbar />
            <div style={{ display: "flex" }}>
                <Sidebar active="real-life-challenges" />
                <div style={{ flex: 1, display: "flex", justifyContent: "center", alignItems: "center", color: "var(--cyan)" }}>
                    Loading real-world operations...
                </div>
            </div>
        </div>
    );

    return (
        <div style={{ background: "var(--bg)", minHeight: "100vh" }}>
            <Navbar />
            <div style={{ display: "flex" }}>
                <Sidebar active="real-life-challenges" />
                <main style={{ flex: 1, padding: "40px" }}>
                    <div style={{ maxWidth: "1200px", margin: "0 auto" }}>

                        <div style={{ marginBottom: "40px", borderBottom: "1px solid var(--card-border)", paddingBottom: "20px" }}>
                            <h1 style={{ fontSize: "32px", fontWeight: "800", color: "var(--text)", margin: 0 }}>Real-Life Web Challenges</h1>
                            <p style={{ color: "var(--muted)", marginTop: "10px" }}>Compromise enterprise targets and practice real-world attack vectors.</p>
                        </div>

                        {/* Search Bar */}
                        <div style={{ marginBottom: "30px" }}>
                            <input
                                type="text"
                                placeholder="Search challenges..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                style={{
                                    width: "100%",
                                    padding: "15px 20px",
                                    background: "var(--card-bg)",
                                    border: "1px solid var(--card-border)",
                                    borderRadius: "12px",
                                    color: "var(--text)",
                                    fontSize: "16px",
                                    outline: "none"
                                }}
                            />
                        </div>

                        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "30px" }}>
                            {filteredChallenges.map((challenge) => {
                                const Icon = getIconForCategory(challenge.category);
                                return (
                                    <div
                                        key={challenge.id}
                                        onClick={() => window.location.hash = `#/real-life-challenges/${challenge.id}`}
                                        style={{
                                            background: "var(--card-bg)",
                                            border: "1px solid var(--card-border)",
                                            borderRadius: "16px",
                                            overflow: "hidden",
                                            cursor: "pointer",
                                            transition: "all 0.3s ease"
                                        }}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.transform = "translateY(-5px)";
                                            e.currentTarget.style.borderColor = "var(--red)";
                                            e.currentTarget.style.boxShadow = "0 10px 30px rgba(0,0,0,0.5)";
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.transform = "translateY(0)";
                                            e.currentTarget.style.borderColor = "var(--card-border)";
                                            e.currentTarget.style.boxShadow = "none";
                                        }}
                                    >
                                        <div style={{ height: "180px", overflow: "hidden" }}>
                                            <img
                                                src={getImageForChallenge(challenge.title)}
                                                alt={challenge.title}
                                                style={{ width: "100%", height: "100%", objectFit: "cover" }}
                                            />
                                        </div>
                                        <div style={{ padding: "24px" }}>
                                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "15px" }}>
                                                <h3 style={{ margin: 0, fontSize: "18px", fontWeight: "700" }}>{challenge.title}</h3>
                                                <Icon size={18} color="var(--red)" />
                                            </div>
                                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                                <span style={{
                                                    fontSize: "12px",
                                                    fontWeight: "800",
                                                    color: challenge.difficulty === "Easy" ? "var(--green)" : "orange",
                                                    textTransform: "uppercase"
                                                }}>
                                                    {challenge.difficulty}
                                                </span>
                                                <span style={{ fontSize: "14px", fontWeight: "700", color: "var(--cyan)" }}>
                                                    {challenge.points} XP
                                                </span>
                                            </div>
                                            <button style={{
                                                width: "100%",
                                                marginTop: "20px",
                                                padding: "10px",
                                                background: "rgba(255, 0, 68, 0.1)",
                                                border: "1px solid var(--red)",
                                                color: "var(--red)",
                                                borderRadius: "8px",
                                                fontWeight: "700",
                                                cursor: "pointer"
                                            }}>
                                                START OPERATION
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}

