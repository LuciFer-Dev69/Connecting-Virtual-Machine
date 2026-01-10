import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { API_BASE } from "../config";
import {
  Target, Shield, Zap, Search, ChevronRight, FileUp,
  ShoppingCart, Eye, Activity, FileSearch, ShieldAlert,
  Terminal, Lock, CheckCircle2, ArrowLeft, Trophy
} from "lucide-react";

export default function Challenges() {
  const [view, setView] = useState("selection"); // "selection", "red-roadmap", "blue-roadmap"
  const [hoveredSide, setHoveredSide] = useState(null); // "red", "blue"
  const [stats, setStats] = useState({ challengesCompleted: 0, points: 0 });

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  useEffect(() => {
    if (user.user_id) fetchUserStats();
  }, []);

  const fetchUserStats = async () => {
    try {
      const statsRes = await fetch(`${API_BASE}/user/${user.user_id}/stats`);
      const statsData = await statsRes.json();
      setStats({
        challengesCompleted: statsData.total_challenges || 0,
        points: statsData.progress || 0
      });
    } catch (err) {
      console.error("Error fetching stats:", err);
    }
  };

  const redChallenges = [
    { id: 1, name: "Service Enumeration", desc: "Scan the PawnBox network to identify live services and entry points.", icon: Search, points: 50, locked: false },
    { id: 2, name: "Authentication Logic Abuse", desc: "Exploit reflected XSS in the login system to hijack sessions.", icon: Target, points: 100, locked: false },
    { id: 3, name: "File Upload Misconfiguration", desc: "Bypass extension filters to achieve remote code execution (RCE).", icon: FileUp, points: 150, locked: false },
    { id: 4, name: "SQL Injection", desc: "Bypass authentication using unsanitized SQL queries.", icon: Shield, points: 200, locked: false },
    { id: 5, name: "Business Logic Abuse", desc: "Manipulate checkout prices to buy premium hardware for $1.", icon: ShoppingCart, points: 350, locked: false }
  ];

  const blueChallenges = [
    { id: 1, name: "Service Monitoring", desc: "Use PawnBox to monitor active network connections and detect scans.", icon: Activity, points: 50, locked: false },
    { id: 2, name: "Web Log Analysis", desc: "Analyze access logs to identify suspicious XSS injection patterns.", icon: FileSearch, points: 100, locked: false },
    { id: 3, name: "Malicious Upload Detection", desc: "Locate and identify rogue web shells uploaded to the server.", icon: ShieldAlert, points: 150, locked: false },
    { id: 4, name: "SQL Injection Detection", desc: "Review database logs for SQL injection attempts.", icon: Search, points: 200, locked: false },
    { id: 5, name: "Logic Abuse Detection", desc: "Identify price tampering by comparing logs with database reality.", icon: Eye, points: 350, locked: false }
  ];

  const getPath = (challenge, type) => {
    if (type === "red") {
      if (challenge.id === 2) return "#/xss-challenge";
      if (challenge.id === 3) return "#/upload-challenge";
      if (challenge.id === 4) return "#/sqli-challenge";
      if (challenge.id === 5) return "#/logic-challenge";
    } else {
      return `#/defensive-challenge/${challenge.id}`;
    }
    return "#/real-life";
  };

  const SelectionScreen = () => (
    <div style={{
      height: "calc(100vh - 80px)",
      display: "flex",
      position: "relative",
      background: "#000",
      overflow: "hidden"
    }}>
      <div style={{
        position: "absolute",
        top: 0, left: 0, width: "100%", height: "100%",
        backgroundImage: "url('/choice.webp')",
        backgroundSize: "contain",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        opacity: 0.3,
        zIndex: 1
      }} />

      <div style={{
        position: "absolute",
        top: 0, left: 0, width: "50%", height: "100%",
        background: "radial-gradient(circle, rgba(0,212,255,0.15) 0%, transparent 70%)",
        opacity: hoveredSide === "blue" ? 1 : 0,
        transition: "0.5s",
        zIndex: 2
      }} />

      <div style={{
        position: "absolute",
        top: 0, right: 0, width: "50%", height: "100%",
        background: "radial-gradient(circle, rgba(255,0,68,0.15) 0%, transparent 70%)",
        opacity: hoveredSide === "red" ? 1 : 0,
        transition: "0.5s",
        zIndex: 2
      }} />

      <div
        style={{
          flex: 1, zIndex: 10, display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center", cursor: "pointer",
          borderRight: "1px solid rgba(255,255,255,0.05)"
        }}
        onMouseEnter={() => setHoveredSide("blue")}
        onMouseLeave={() => setHoveredSide(null)}
        onClick={() => setView("blue-roadmap")}
      >
        <div style={{
          fontSize: "48px", fontWeight: "900", color: hoveredSide === "blue" ? "#00d4ff" : "#444",
          textShadow: hoveredSide === "blue" ? "0 0 20px #00d4ff" : "none",
          transition: "0.3s", transform: hoveredSide === "blue" ? "scale(1.1)" : "scale(1)"
        }}>
          BLUE TEAM
        </div>
        <div style={{
          marginTop: "20px", color: "#00d4ff", border: "1px solid #00d4ff",
          padding: "10px 30px", borderRadius: "4px", fontWeight: "700",
          opacity: hoveredSide === "blue" ? 1 : 0, transition: "0.3s",
          fontFamily: "monospace", letterSpacing: "2px"
        }}>
          "DEFEND THE SYSTEM"
        </div>
      </div>

      <div
        style={{
          flex: 1, zIndex: 10, display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center", cursor: "pointer"
        }}
        onMouseEnter={() => setHoveredSide("red")}
        onMouseLeave={() => setHoveredSide(null)}
        onClick={() => setView("red-roadmap")}
      >
        <div style={{
          fontSize: "48px", fontWeight: "900", color: hoveredSide === "red" ? "#ff0044" : "#444",
          textShadow: hoveredSide === "red" ? "0 0 20px #ff0044" : "none",
          transition: "0.3s", transform: hoveredSide === "red" ? "scale(1.1)" : "scale(1)"
        }}>
          RED TEAM
        </div>
        <div style={{
          marginTop: "20px", color: "#ff0044", border: "1px solid #ff0044",
          padding: "10px 30px", borderRadius: "4px", fontWeight: "700",
          opacity: hoveredSide === "red" ? 1 : 0, transition: "0.3s",
          fontFamily: "monospace", letterSpacing: "2px"
        }}>
          "BREAK THE SYSTEM"
        </div>
      </div>

      <div style={{
        position: "absolute", bottom: "40px", width: "100%", textAlign: "center",
        zIndex: 10, color: "rgba(255,255,255,0.2)", fontSize: "12px", fontWeight: "600",
        textTransform: "uppercase", letterSpacing: "3px"
      }}>
        CHOOSE YOUR SIDE. ATTACK LIKE A RED TEAM. DEFEND LIKE A BLUE TEAM.
      </div>
    </div>
  );

  const RoadmapScreen = ({ type }) => {
    const isRed = type === "red";
    const challenges = isRed ? redChallenges : blueChallenges;
    const color = isRed ? "#ff0044" : "#00d4ff";

    return (
      <div style={{ padding: "40px", maxWidth: "900px", margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "40px" }}>
          <button
            onClick={() => setView("selection")}
            style={{
              background: "none", border: "1px solid rgba(255,255,255,0.1)", color: "var(--muted)",
              padding: "8px 16px", borderRadius: "6px", cursor: "pointer",
              display: "flex", alignItems: "center", gap: "8px",
              fontSize: "13px", fontWeight: "600"
            }}
          >
            <ArrowLeft size={14} /> SWITCH ROLE
          </button>
          <div style={{ display: "flex", gap: "20px" }}>
            <div style={{ textAlign: "right" }}>
              <span style={{ display: "block", fontSize: "10px", color: "var(--muted)", textTransform: "uppercase" }}>Ranked Score</span>
              <span style={{ fontSize: "18px", fontWeight: "900", color: "#fff" }}>{stats.points} <span style={{ color: color }}>PTS</span></span>
            </div>
          </div>
        </div>

        <div style={{ marginBottom: "60px" }}>
          <h1 style={{
            fontSize: "42px", fontWeight: "900", margin: "0 0 10px 0",
            color: "#fff", textShadow: `0 0 30px ${color}40`, letterSpacing: "-1px"
          }}>
            {isRed ? "RED TEAM OPS" : "BLUE TEAM OPS"}
          </h1>
          <p style={{ color: "var(--muted)", fontSize: "16px", margin: 0, fontFamily: "monospace" }}>
                        // {isRed ? "OFFENSIVE_SECURITY_ROADMAP_LOADED" : "DEFENSIVE_MONITORING_SUITE_READY"}
          </p>
        </div>

        <div style={{ position: "relative", paddingLeft: "40px" }}>
          <div style={{
            position: "absolute", left: "15px", top: 0, bottom: 0, width: "2px",
            background: `linear-gradient(to bottom, ${color}, rgba(255,255,255,0.02))`
          }} />

          {challenges.map((challenge) => (
            <div key={challenge.id} style={{ marginBottom: "30px", position: "relative" }}>
              <div style={{
                position: "absolute", left: "-32px", top: "4px", width: "16px", height: "16px",
                borderRadius: "50%", background: challenge.locked ? "#222" : color,
                boxShadow: challenge.locked ? "none" : `0 0 15px ${color}`,
                border: "4px solid var(--bg)", zIndex: 2
              }} />

              <a href={getPath(challenge, type)} style={{ textDecoration: "none" }}>
                <div
                  style={{
                    background: "var(--card-bg)", border: "1px solid var(--card-border)",
                    padding: "24px", borderRadius: "12px", transition: "0.3s",
                    opacity: challenge.locked ? 0.4 : 1,
                    cursor: challenge.locked ? "not-allowed" : "pointer"
                  }}
                  onMouseEnter={(e) => {
                    if (!challenge.locked) {
                      e.currentTarget.style.borderColor = color;
                      e.currentTarget.style.background = `${color}05`;
                    }
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = "var(--card-border)";
                    e.currentTarget.style.background = "var(--card-bg)";
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "12px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                      <div style={{ color: color }}>
                        <challenge.icon size={22} />
                      </div>
                      <span style={{ fontSize: "18px", fontWeight: "700", color: "#fff", letterSpacing: "-0.5px" }}>
                        {challenge.name}
                      </span>
                    </div>
                    <div style={{ fontWeight: "900", color: color, fontSize: "16px", fontFamily: "monospace" }}>
                      {challenge.points}
                    </div>
                  </div>
                  <p style={{ color: "var(--muted)", margin: "0 0 20px 0", fontSize: "14px", lineHeight: "1.6" }}>
                    {challenge.desc}
                  </p>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div style={{ display: "flex", gap: "6px" }}>
                      <span style={{ background: "#000", padding: "4px 10px", borderRadius: "4px", fontSize: "10px", color: color, border: `1px solid ${color}40`, fontWeight: "800", textTransform: "uppercase" }}>
                        PAWNBOX
                      </span>
                    </div>
                    <div style={{ color: challenge.locked ? "var(--muted)" : color, fontSize: "12px", fontWeight: "900", display: "flex", alignItems: "center", gap: "6px", fontFamily: "monospace" }}>
                      {challenge.locked ? <><Lock size={12} /> LOCKED</> : <><Zap size={12} /> INITIATE_BREACH</>}
                    </div>
                  </div>
                </div>
              </a>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div style={{ background: "#000", minHeight: "100vh" }}>
      <Navbar />
      <div style={{ display: "flex" }}>
        <Sidebar active="challenges" />
        <main style={{ flex: 1, minHeight: "100vh" }}>
          {view === "selection" && <SelectionScreen />}
          {view === "red-roadmap" && <RoadmapScreen type="red" />}
          {view === "blue-roadmap" && <RoadmapScreen type="blue" />}
        </main>
      </div>
    </div>
  );
}