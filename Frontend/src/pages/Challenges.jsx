import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { API_BASE } from "../config";
import {
  Target, Shield, Zap, Search, ChevronRight, FileUp,
  ShoppingCart, Eye, Activity, FileSearch, ShieldAlert,
  Terminal, Lock, CheckCircle2, ArrowLeft, Trophy
} from "lucide-react";

export default function Challenges({ initialView = "selection" }) {
  const [view, setView] = useState(initialView); // "selection", "red-roadmap", "blue-roadmap"
  const [hoveredSide, setHoveredSide] = useState(null); // "red", "blue"
  const [stats, setStats] = useState({ challengesCompleted: 0, points: 0 });
  const [redChallenges, setRedChallenges] = useState([]);
  const [activeRoadmapId, setActiveRoadmapId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDifficulty, setFilterDifficulty] = useState("All");
  const [filterStatus, setFilterStatus] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [operatorMode, setOperatorMode] = useState("training"); // "operator" or "training"
  const CHALLENGES_PER_PAGE = 9;

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  useEffect(() => {
    if (user.user_id) fetchUserStats();
  }, [user.user_id]);

  useEffect(() => {
    if (view === "red-roadmap") {
      setCurrentPage(1);
      fetchRedRoadmap();
    } else if (view === "blue-roadmap") {
      setCurrentPage(1);
    }
  }, [view]);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterDifficulty, filterStatus]);

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

  const fetchRedRoadmap = async () => {
    setLoading(true);
    try {
      // 1. Get the Tool-Only roadmap metadata
      const headers = {};
      const token = localStorage.getItem("token");
      if (token) headers["Authorization"] = `Bearer ${token}`;

      const roadmapRes = await fetch(`${API_BASE}/roadmap/red-tools`, { headers });
      const roadmapData = await roadmapRes.json();

      if (roadmapData.id) {
        setActiveRoadmapId(roadmapData.id);
        // 2. Fetch challenges for this roadmap
        const challengesRes = await fetch(`${API_BASE}/roadmap/challenges/${roadmapData.id}`, { headers });
        const challengesData = await challengesRes.json();
        setRedChallenges(challengesData);
      }
    } catch (err) {
      console.error("Error fetching red roadmap:", err);
    } finally {
      setLoading(false);
    }
  };

  const getToolIcon = (category) => {
    const cat = category?.toLowerCase() || "";
    if (cat.includes("nmap")) return Search;
    if (cat.includes("netcat") || cat.includes("nc")) return Terminal;
    if (cat.includes("gobuster")) return Search;
    if (cat.includes("wfuzz")) return Zap;
    if (cat.includes("hydra") || cat.includes("auth")) return Lock;
    if (cat.includes("sqlmap") || cat.includes("sqli")) return Activity;
    if (cat.includes("john") || cat.includes("crack")) return Shield;
    if (cat.includes("tcpdump")) return Activity;
    if (cat.includes("metasploit")) return Zap;
    if (cat.includes("amass") || cat.includes("recon")) return Search;
    if (cat.includes("xss") || cat.includes("upload") || cat.includes("lfi")) return FileUp;
    if (cat.includes("logic")) return Eye;
    return Target;
  };

  const getDifficultyColor = (diff) => {
    switch (diff) {
      case 'Easy': return '#51cf66';
      case 'Medium': return '#fcc419';
      case 'Hard': return '#ff922b';
      case 'Insane': return '#ff0044';
      default: return '#adb5bd';
    }
  };

  const blueChallenges = [
    { id: 1, name: "Service Monitoring", desc: "Use PawnBox to monitor active network connections and detect scans.", icon: Activity, points: 50, locked: false },
    { id: 2, name: "Web Log Analysis", desc: "Analyze access logs to identify suspicious XSS injection patterns.", icon: FileSearch, points: 100, locked: false },
    { id: 3, name: "Malicious Upload Detection", desc: "Locate and identify rogue web shells uploaded to the server.", icon: ShieldAlert, points: 150, locked: false },
    { id: 4, name: "SQL Injection Detection", desc: "Review database logs for SQL injection attempts.", icon: Search, points: 200, locked: false },
    { id: 5, name: "Logic Abuse Detection", desc: "Identify price tampering by comparing logs with database reality.", icon: Eye, points: 350, locked: false }
  ];

  const [selectedChallenge, setSelectedChallenge] = useState(null);
  const [flagInput, setFlagInput] = useState("");
  const [submissionMsg, setSubmissionMsg] = useState({ text: "", type: "" });
  const [hint, setHint] = useState("");

  const getPath = (challenge, type) => {
    if (type === "red") return null; // We'll open a modal instead
    return `#/defensive-challenge/${challenge.id}`;
  };

  const handleChallengeClick = (e, challenge, type) => {
    if (type === "red") {
      if (challenge.title === "AI Prompt Injection") {
        window.location.hash = "#/ai-prompt-injection";
        return;
      }
      e.preventDefault();
      if (challenge.status !== "locked") {
        setSelectedChallenge(challenge);
        setFlagInput("");
        setSubmissionMsg({ text: "", type: "" });
        setHint("");
      }
    }
  };

  const submitFlag = async () => {
    if (!flagInput) return;
    setSubmissionMsg({ text: "Checking...", type: "neutral" });
    try {
      const res = await fetch(`${API_BASE}/submit-flag`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify({
          challenge_id: selectedChallenge.id,
          roadmap_id: activeRoadmapId,
          flag: flagInput
        })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setSubmissionMsg({ text: data.message, type: "success" });
        // Refresh roadmap to show unlock
        fetchRedRoadmap();
        setTimeout(() => setSelectedChallenge(null), 2000);
      } else {
        setSubmissionMsg({ text: data.message || "Invalid Flag", type: "error" });
      }
    } catch (err) {
      setSubmissionMsg({ text: "Submission failed", type: "error" });
    }
  };

  const fetchHint = async () => {
    try {
      const res = await fetch(`${API_BASE}/hint/${selectedChallenge.id}`, {
        headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }
      });
      const data = await res.json();
      setHint(data.hint || "No hint available.");
    } catch (err) {
      setHint("Could not fetch hint.");
    }
  };

  const ChallengeModal = () => {
    if (!selectedChallenge) return null;
    const isRed = view === "red-roadmap";
    const color = isRed ? "#ff0044" : "#00d4ff";

    return (
      <div style={{
        position: "fixed", top: 0, left: 0, width: "100%", height: "100%",
        background: "rgba(0,0,0,0.85)", display: "flex", alignItems: "center",
        justifyContent: "center", zIndex: 1000, padding: "20px", backdropFilter: "blur(8px)",
        animation: "fadeIn 0.3s ease"
      }}>
        <style>
          {`
            @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
            @keyframes slideUp { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
            .modal-content { animation: slideUp 0.4s cubic-bezier(0.4, 0, 0.2, 1); }
            .spinner {
              width: 30px; height: 30px; border: 3px solid rgba(255,255,255,0.1);
              border-top-color: ${color}; border-radius: 50%;
              animation: spin 1s linear infinite; display: inline-block;
            }
            @keyframes spin { to { transform: rotate(360deg); } }
          `}
        </style>
        <div className="modal-content" style={{
          background: "var(--card-bg)", width: "100%",
          maxWidth: "550px", borderRadius: "24px", padding: "40px", position: "relative",
          boxShadow: isRed ? "var(--red-glow-intense)" : "0 20px 50px rgba(0,0,0,0.5)",
          color: "var(--text)",
          border: `2px solid ${color}`
        }}>
          <button
            onClick={() => setSelectedChallenge(null)}
            style={{ position: "absolute", top: "25px", right: "25px", background: "var(--bg-secondary)", border: "none", color: "var(--muted)", cursor: "pointer", width: "32px", height: "32px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", transition: "0.2s" }}
            onMouseEnter={(e) => e.target.style.background = "var(--card-border)"}
            onMouseLeave={(e) => e.target.style.background = "var(--bg-secondary)"}
          >
            ✕
          </button>

          <div style={{ display: "flex", alignItems: "center", gap: "10px", color: color, marginBottom: "15px", fontWeight: "800", fontSize: "12px", letterSpacing: "1px" }}>
            <Activity size={14} /> ACTIVE LABORATORY
          </div>

          <h2 style={{ fontSize: "24px", fontWeight: "800", color: "var(--text)", marginBottom: "10px" }}>{selectedChallenge.title}</h2>
          <div style={{ display: "flex", gap: "15px", marginBottom: "25px" }}>
            <span style={{ fontSize: "12px", color: "var(--muted)", background: "var(--input-bg)", padding: "4px 12px", borderRadius: "20px", fontWeight: "600" }}>{selectedChallenge.difficulty}</span>
            <span style={{ fontSize: "12px", color: "var(--muted)", background: "var(--input-bg)", padding: "4px 12px", borderRadius: "20px", fontWeight: "600" }}>{selectedChallenge.points} Points</span>
          </div>

          <p style={{ color: "var(--muted)", fontSize: "15px", lineHeight: "1.6", margin: "0 0 30px 0" }}>
            {selectedChallenge.description}
          </p>

          <div style={{ marginBottom: "25px" }}>
            <div style={{ display: "flex", gap: "10px" }}>
              <input
                value={flagInput}
                onChange={(e) => setFlagInput(e.target.value)}
                placeholder="Enter capture flag format: FLAG{...}"
                style={{
                  flex: 1, background: "var(--bg-secondary)", border: `1px solid var(--card-border)`, color: "var(--text)",
                  padding: "14px 18px", borderRadius: "12px", outline: "none",
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: "14px", transition: "0.2s"
                }}
                onFocus={(e) => e.target.style.borderColor = color}
                onBlur={(e) => e.target.style.borderColor = "var(--card-border)"}
              />
              <button
                onClick={user.user_id ? submitFlag : () => setSubmissionMsg({ text: "Please login to submit flags.", type: "error" })}
                style={{ background: color, color: "#fff", border: "none", padding: "0 28px", borderRadius: "12px", fontWeight: "700", cursor: "pointer", transition: "0.2s", boxShadow: `0 4px 12px ${color}40` }}
                onMouseEnter={(e) => e.target.style.transform = "scale(1.02)"}
                onMouseLeave={(e) => e.target.style.transform = "scale(1)"}
              >
                SUBMIT
              </button>
            </div>
            {submissionMsg.text && (
              <div style={{ marginTop: "12px", textAlign: "center", fontWeight: "600", fontSize: "14px", color: submissionMsg.type === "success" ? "#2f9e44" : color }}>
                {submissionMsg.text}
              </div>
            )}
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid #eee", paddingTop: "25px" }}>
            <button
              onClick={fetchHint}
              style={{ background: "none", border: "none", color: "var(--muted)", cursor: "pointer", fontSize: "13px", fontWeight: "600", display: "flex", alignItems: "center", gap: "6px" }}
            >
              <Zap size={14} /> Need a hint?
            </button>
            <a href="#/pwnbox" style={{ background: "var(--button-bg)", color: "var(--text)", textDecoration: "none", padding: "10px 20px", borderRadius: "10px", fontSize: "13px", fontWeight: "600", display: "flex", alignItems: "center", gap: "8px", border: "1px solid var(--card-border)" }}>
              <Terminal size={14} /> Open PwnBox
            </a>
          </div>

          {hint && (
            <div style={{ marginTop: "20px", padding: "15px", background: "var(--input-bg)", border: "1px solid var(--card-border)", borderRadius: "12px", color: "var(--muted)", fontSize: "13px", fontFamily: "monospace" }}>
              💡 {hint}
            </div>
          )}
        </div>
      </div>
    );
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
        onClick={() => {
          window.location.hash = "#/blue-team";
          setView("blue-roadmap");
        }}
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
        onClick={() => {
          window.location.hash = "#/red-team";
          setView("red-roadmap");
        }}
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

  const renderRoadmapScreen = (type) => {
    const isRed = type === "red";
    const baseChallenges = isRed ? redChallenges : blueChallenges;
    const color = isRed ? "var(--red)" : "var(--blue)";
    const glowColor = isRed ? "var(--red-glow-soft)" : "var(--blue-glow-soft)";

    const filteredChallenges = baseChallenges.filter(c => {
      const matchesSearch = (c.title || c.name || "").toLowerCase().includes(searchTerm.toLowerCase());
      const matchesDiff = filterDifficulty === "All" || c.difficulty === filterDifficulty;
      const status = c.status || (c.locked ? "locked" : "unlocked");
      const matchesStatus = filterStatus === "All" || status === filterStatus;
      return matchesSearch && matchesDiff && matchesStatus;
    });

    // Pagination Logic
    const totalPages = Math.ceil(filteredChallenges.length / CHALLENGES_PER_PAGE);
    const paginatedChallenges = filteredChallenges.slice(
      (currentPage - 1) * CHALLENGES_PER_PAGE,
      currentPage * CHALLENGES_PER_PAGE
    );

    if (loading && isRed) {
      return (
        <div style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          color: "var(--red)",
          background: "var(--bg)",
          fontFamily: "'JetBrains Mono', monospace"
        }}>
          <div style={{ textAlign: "left", width: "300px" }}>
            <div className="spinner" style={{ marginBottom: "20px", borderTopColor: "var(--red)" }}></div>
            <div style={{ marginBottom: "5px" }}>[ SYSTEM_BOOT_SEQUENCE: OK ]</div>
            <div style={{ marginBottom: "5px" }}>[ DECRYPTING_LAB_DATA: 84% ]</div>
            <div style={{ marginBottom: "5px" }}>[ BYPASSING_FIREWALLS: OK ]</div>
            <div style={{ color: "var(--text)", marginTop: "10px" }}>// INITIATING_BREACH...</div>
          </div>
        </div>
      );
    }

    return (
      <div style={{
        padding: "40px",
        maxWidth: "1200px",
        margin: "0 auto",
        animation: "fadeIn 0.5s ease",
        position: "relative",
        minHeight: "100vh",
        background: isRed ? `radial-gradient(circle at top right, ${glowColor} 0%, transparent 40%)` : "none"
      }}>
        {isRed && (
          <style>
            {`
              @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;900&display=swap');

              @keyframes cyberpunk-glitch {
                0% { clip-path: inset(40% 0 61% 0); transform: skew(0.58deg); }
                5% { clip-path: inset(92% 0 1% 0); transform: skew(0.58deg); }
                10% { clip-path: inset(43% 0 1% 0); transform: skew(0.58deg); }
                15% { clip-path: inset(25% 0 58% 0); transform: skew(0.58deg); }
                20% { clip-path: inset(75% 0 23% 0); transform: skew(0.58deg); }
                25% { clip-path: inset(10% 0 83% 0); transform: skew(0.58deg); }
                30% { clip-path: inset(58% 0 43% 0); transform: skew(0.58deg); }
                35% { clip-path: inset(10% 0 83% 0); transform: skew(0.58deg); }
                40% { clip-path: inset(100% 0 0 0); transform: skew(0.58deg); }
                45% { clip-path: inset(43% 0 1% 0); transform: skew(0.58deg); }
                50% { clip-path: inset(25% 0 58% 0); transform: skew(0.58deg); }
                55% { clip-path: inset(75% 0 23% 0); transform: skew(0.58deg); }
                60% { clip-path: inset(10% 0 83% 0); transform: skew(0.58deg); }
                65% { clip-path: inset(58% 0 43% 0); transform: skew(0.58deg); }
                70% { clip-path: inset(10% 0 83% 0); transform: skew(0.58deg); }
                75% { clip-path: inset(40% 0 61% 0); transform: skew(0.58deg); }
                80% { clip-path: inset(92% 0 1% 0); transform: skew(0.58deg); }
                85% { clip-path: inset(43% 0 1% 0); transform: skew(0.58deg); }
                90% { clip-path: inset(25% 0 58% 0); transform: skew(0.58deg); }
                95% { clip-path: inset(75% 0 23% 0); transform: skew(0.58deg); }
                100% { clip-path: inset(100% 0 0 0); transform: skew(0.58deg); }
              }

              .cyberpunk-header {
                position: relative;
                color: #fcee0a; /* Cyberpunk Yellow */
                font-family: 'Space Grotesk', 'Inter', sans-serif;
                font-weight: 900;
                text-transform: uppercase;
                letter-spacing: 4px;
                text-shadow: var(--red-glow);
                transform: skew(-10deg);
              }

              .cyberpunk-header::before {
                left: 2px;
                text-shadow: -2px 0 var(--blue);
                clip: rect(44px, 450px, 56px, 0);
                animation: cyberpunk-glitch 2s infinite linear alternate-reverse;
              }

              .cyberpunk-header::after {
                left: -2px;
                text-shadow: -2px 0 var(--red), 2px 2px var(--red);
                animation: cyberpunk-glitch 3s infinite linear alternate-reverse;
              }

              .system-warning-bar {
                background: repeating-linear-gradient(45deg, var(--red), var(--red) 10px, var(--bg) 10px, var(--bg) 20px);
                height: 6px; width: 100%; margin-bottom: 25px; opacity: 0.8;
                box-shadow: 0 0 15px rgba(255,0,68,0.3);
              }
              
              .red-team-bg-pattern {
                position: fixed;
                top: 0; left: 0; width: 100%; height: 100%;
                background-image: 
                  radial-gradient(rgba(255, 0, 68, 0.05) 1px, transparent 0),
                  linear-gradient(rgba(255, 0, 68, 0.03) 1px, transparent 1px);
                background-size: 30px 30px, 100% 10px;
                pointer-events: none;
                z-index: -1;
              }
            `}
          </style>
        )}
        {isRed && <div className="red-team-bg-pattern" />}

        {/* Header Controls */}
        {isRed && <div className="system-warning-bar" />}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "40px", flexWrap: "wrap", gap: "20px" }}>
          <div>
            <button
              onClick={() => {
                window.location.hash = "#/challenges";
                setView("selection");
              }}
              style={{
                background: "none", border: "1px solid var(--card-border)", color: "var(--muted)",
                padding: "6px 12px", borderRadius: "6px", cursor: "pointer",
                display: "flex", alignItems: "center", gap: "6px",
                fontSize: "12px", fontWeight: "600", transition: "0.2s",
                marginBottom: "15px"
              }}
              onMouseEnter={(e) => e.target.style.background = "var(--bg-secondary)"}
              onMouseLeave={(e) => e.target.style.background = "none"}
            >
              <ArrowLeft size={14} /> BACK_TO_SELECTION
            </button>
            <h1
              data-text={isRed ? "SYSTEM COMPROMISED: RED TEAM" : "DEFENSIVE OPERATIONS: BLUE TEAM"}
              className={isRed ? "cyberpunk-header" : ""}
              style={{
                fontSize: "32px",
                fontWeight: "900",
                color: "var(--text)",
                margin: "0 0 10px 0",
              }}
            >
              {isRed ? "SYSTEM COMPROMISED: RED TEAM" : "BLUE TEAM OPERATIONS"}
            </h1>
            <p style={{ color: isRed ? "var(--red)" : "var(--blue)", fontSize: "12px", margin: "0 0 15px 0", fontFamily: "'JetBrains Mono', monospace", fontWeight: "700", opacity: 0.8 }}>
              {isRed ? "OPERATION STATUS: ACTIVE · AUTHORIZED RED TEAM OPERATOR" : "SYSTEM STATUS: SECURE · AUTHORIZED BLUE TEAM ANALYST"}
            </p>

            {/* Progress Bar */}
            <div style={{ width: "300px", marginTop: "15px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "10px", color: "var(--muted)", marginBottom: "5px", fontFamily: "'JetBrains Mono', monospace" }}>
                <span>PROGRESS</span>
                <span>{stats.challengesCompleted} / {isRed ? redChallenges.length : blueChallenges.length} OPS</span>
              </div>
              <div style={{ height: "4px", background: "var(--bg-secondary)", borderRadius: "2px", overflow: "hidden" }}>
                <div style={{
                  height: "100%",
                  width: `${((stats.challengesCompleted / (isRed ? redChallenges.length : blueChallenges.length)) || 0) * 100}%`,
                  background: color,
                  boxShadow: `0 0 10px ${color}`
                }} />
              </div>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
            {/* Mode Toggle */}
            <div style={{
              display: "flex",
              background: "var(--bg-secondary)",
              padding: "4px",
              borderRadius: "8px",
              border: "1px solid var(--card-border)",
              alignSelf: "flex-end"
            }}>
              <button
                onClick={() => setOperatorMode("operator")}
                style={{
                  padding: "6px 12px", border: "none", borderRadius: "6px", cursor: "pointer",
                  fontSize: "10px", fontWeight: "800", letterSpacing: "1.5px",
                  background: operatorMode === "operator" ? color : "transparent",
                  color: operatorMode === "operator" ? "#fff" : "var(--muted)",
                  transition: "0.2s cubic-bezier(0.4, 0, 0.2, 1)"
                }}
              >
                ◉ OPERATOR
              </button>
              <button
                onClick={() => setOperatorMode("training")}
                style={{
                  padding: "6px 12px", border: "none", borderRadius: "6px", cursor: "pointer",
                  fontSize: "10px", fontWeight: "800", letterSpacing: "1.5px",
                  background: operatorMode === "training" ? color : "transparent",
                  color: operatorMode === "training" ? "#fff" : "var(--muted)",
                  transition: "0.2s cubic-bezier(0.4, 0, 0.2, 1)"
                }}
              >
                ○ TRAINING
              </button>
            </div>

            <div style={{
              background: "var(--card-bg)",
              padding: "20px",
              borderRadius: "16px",
              border: "1px solid var(--card-border)",
              minWidth: "200px",
              boxShadow: "0 10px 30px rgba(0,0,0,0.2)"
            }}>
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: "11px", color: "var(--muted)", fontWeight: "600" }}>RANK</span>
                  <span style={{ fontSize: "12px", color: "var(--text)", fontWeight: "800", letterSpacing: "1px" }}>INITIATE</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: "11px", color: "var(--muted)", fontWeight: "600" }}>PTS</span>
                  <span style={{ fontSize: "18px", color: color, fontWeight: "900" }}>{stats.points}</span>
                </div>
                <div style={{ height: "1px", background: "var(--card-border)", margin: "5px 0" }} />
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: "11px", color: "var(--muted)", fontWeight: "600" }}>STREAK</span>
                  <span style={{ fontSize: "12px", color: "var(--success)", fontWeight: "800" }}>0 DAYS</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Filter Bar */}
        <div
          className="filter-bar-container"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "20px",
            marginBottom: "40px",
            background: "var(--card-bg)",
            padding: "24px",
            borderRadius: "16px",
            border: `1px solid var(--card-border)`,
            alignItems: "center",
            boxShadow: isRed ? "0 0 20px rgba(255,0,68,0.1)" : "none"
          }}
        >
          <style>
            {`
              @media (min-width: 950px) {
                .filter-bar-container {
                  grid-template-columns: 2fr 1fr 1fr !important;
                }
              }
              .custom-select {
                appearance: none;
                background-image: url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23666%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E') !important;
                background-repeat: no-repeat !important;
                background-position: right 15px center !important;
                background-size: 12px !important;
                padding-right: 40px !important;
              }
            `}
          </style>

          <div style={{ position: "relative" }}>
            <Search style={{ position: "absolute", left: "16px", top: "50%", transform: "translateY(-50%)", color: "var(--muted)", opacity: 0.5 }} size={18} />
            <input
              placeholder="> locate challenge..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: "100%",
                background: "var(--bg)",
                border: "1px solid var(--card-border)",
                borderRadius: "12px",
                padding: "14px 15px 14px 48px",
                color: "var(--text)",
                outline: "none",
                fontSize: "14px",
                fontFamily: "'JetBrains Mono', monospace",
                transition: "all 0.2s ease",
                boxSizing: "border-box"
              }}
              onFocus={(e) => e.target.style.borderColor = color}
              onBlur={(e) => e.target.style.borderColor = "var(--card-border)"}
            />
          </div>

          <div style={{ position: "relative" }}>
            <select
              value={filterDifficulty}
              onChange={(e) => setFilterDifficulty(e.target.value)}
              className="custom-select"
              style={{
                background: "var(--bg)", border: "1px solid var(--card-border)", borderRadius: "12px",
                padding: "14px", color: "var(--text)", cursor: "pointer",
                outline: "none", fontSize: "14px", width: "100%",
                boxSizing: "border-box", fontWeight: "600",
                fontFamily: "'JetBrains Mono', monospace"
              }}
            >
              <option value="All" style={{ background: "var(--bg)", color: "var(--text)" }}>Difficulty: All</option>
              <option value="Easy" style={{ background: "var(--bg)", color: "#22c55e" }}>Easy (Neon Green)</option>
              <option value="Medium" style={{ background: "var(--bg)", color: "#facc15" }}>Medium (Amber)</option>
              <option value="Hard" style={{ background: "var(--bg)", color: "#ef4444" }}>Hard (Red)</option>
              <option value="Insane" style={{ background: "var(--bg)", color: "var(--red)" }}>Insane (Crimson)</option>
            </select>
          </div>

          <div style={{ position: "relative" }}>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="custom-select"
              style={{
                background: "var(--bg)", border: "1px solid var(--card-border)", borderRadius: "12px",
                padding: "14px", color: "var(--text)", cursor: "pointer",
                outline: "none", fontSize: "14px", width: "100%",
                boxSizing: "border-box", fontWeight: "600",
                fontFamily: "'JetBrains Mono', monospace"
              }}
            >
              <option value="All" style={{ background: "var(--bg)", color: "var(--text)" }}>Status: All</option>
              <option value="unlocked" style={{ background: "var(--bg)", color: "var(--text)" }}>Available</option>
              <option value="completed" style={{ background: "var(--bg)", color: "var(--success)" }}>Completed</option>
              <option value="locked" style={{ background: "var(--bg)", color: "var(--muted)" }}>Locked</option>
            </select>
          </div>
        </div>

        {/* Challenge Grid */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
          gap: "25px",
          marginBottom: "40px"
        }}>
          {paginatedChallenges.map((challenge) => {
            const Icon = isRed ? getToolIcon(challenge.category || "") : challenge.icon;
            const status = challenge.status || (challenge.locked ? "locked" : "unlocked");
            const isLocked = status === "locked";
            const isCompleted = status === "completed";
            const diffColor = getDifficultyColor(challenge.difficulty);

            return (
              <div
                key={challenge.id}
                onClick={(e) => handleChallengeClick(e, challenge, type)}
                style={{
                  background: "var(--card-bg)",
                  borderRadius: "16px",
                  padding: "24px",
                  position: "relative",
                  cursor: isLocked ? "not-allowed" : "pointer",
                  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                  border: `1px solid var(--card-border)`,
                  display: "flex",
                  flexDirection: "column",
                  minHeight: "200px",
                  opacity: isLocked ? 0.7 : 1,
                  transform: isLocked ? "none" : "translateY(0)"
                }}
                onMouseEnter={(e) => {
                  if (!isLocked) {
                    e.currentTarget.style.transform = "translateY(-4px)";
                    e.currentTarget.style.borderColor = color;
                    e.currentTarget.style.boxShadow = isRed ? "var(--red-glow-intense)" : "0 0 25px rgba(59,130,246,0.3)";
                    const btn = e.currentTarget.querySelector('.init-btn');
                    if (btn) btn.style.opacity = '1';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isLocked) {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "none";
                    e.currentTarget.style.borderColor = "var(--card-border)";
                    const btn = e.currentTarget.querySelector('.init-btn');
                    if (btn) btn.style.opacity = '0';
                  }
                }}
              >
                {/* Challenge Image */}
                <div style={{
                  height: "120px",
                  width: "calc(100% + 48px)",
                  margin: "-24px -24px 20px -24px",
                  backgroundImage: `url(${challenge.image_url || 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=400&auto=format&fit=crop'})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  borderRadius: "15px 15px 0 0",
                  position: "relative",
                  overflow: "hidden",
                  borderBottom: `1px solid var(--card-border)`
                }}>
                  <div style={{
                    position: "absolute",
                    top: 0, left: 0, width: "100%", height: "100%",
                    background: "linear-gradient(to bottom, transparent, rgba(0,0,0,0.6))"
                  }} />
                  {isLocked && (
                    <div style={{
                      position: "absolute",
                      top: 0, left: 0, width: "100%", height: "100%",
                      background: "rgba(11,15,20,0.8)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      color: "#fff", backdropFilter: "blur(2px)"
                    }}>
                      <Lock size={32} opacity={0.5} />
                    </div>
                  )}

                  {!isLocked && (
                    <div className="init-btn" style={{
                      position: "absolute",
                      top: "50%", left: "50%", transform: "translate(-50%, -50%)",
                      background: isRed ? "linear-gradient(135deg, var(--red), var(--red-hover))" : "linear-gradient(135deg, var(--blue), #2563eb)",
                      color: "#fff", fontSize: "11px", fontWeight: "800", padding: "8px 16px",
                      borderRadius: "6px", boxShadow: "0 5px 15px rgba(0,0,0,0.3)",
                      opacity: 0, transition: "0.2s cubic-bezier(0.4, 0, 0.2, 1)",
                      letterSpacing: "1px", pointerEvents: "none"
                    }}>
                      [ INITIATE OP ]
                    </div>
                  )}
                </div>

                {/* Top Row: Title & Tool Tags */}
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px", alignItems: "flex-start" }}>
                  <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
                    <h3 style={{
                      fontSize: "15px", fontWeight: "800", color: "var(--text)", margin: 0,
                      maxWidth: "75%", lineHeight: "1.2", letterSpacing: "-0.2px",
                      fontFamily: "var(--font-heading)", textTransform: "uppercase"
                    }}>
                      {challenge.title || challenge.name}
                    </h3>
                    {operatorMode === "training" && (
                      <div style={{ display: "flex", gap: "6px" }}>
                        {(challenge.category?.split(',') || [challenge.category || 'misc']).map(tag => (
                          <span key={tag} style={{ fontSize: "9px", color: color, background: `${color}15`, padding: "2px 6px", borderRadius: "4px", fontWeight: "700", fontFamily: "'JetBrains Mono', monospace" }}>
                            [ {tag.toLowerCase().trim()} ]
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  <div style={{
                    width: "32px", height: "32px",
                    background: "var(--bg-secondary)",
                    borderRadius: "8px",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    border: `1px solid var(--card-border)`,
                  }}>
                    <Icon size={16} color={isLocked ? "var(--muted)" : color} />
                  </div>
                </div>

                {/* Middle: Description (Optional/Compact) */}
                <div style={{ flex: 1 }}>
                  {isLocked && (
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "#adb5bd", fontSize: "12px", fontWeight: "600", marginBottom: "10px" }}>
                      <Lock size={14} /> COMPLETE PREVIOUS LABS
                    </div>
                  )}
                </div>

                {/* Bottom Row: Stats */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "auto" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    {/* Difficulty bars shortcut */}
                    <div style={{ display: "flex", gap: "2px" }}>
                      {[1, 2, 3].map(i => (
                        <div key={i} style={{
                          width: "12px", height: "4px", borderRadius: "2px",
                          background: ((challenge.difficulty === 'Easy' && i === 1) ||
                            (challenge.difficulty === 'Medium' && i <= 2) ||
                            (challenge.difficulty === 'Hard' && i <= 3) ||
                            (challenge.difficulty === 'Insane' && i <= 3)) ? diffColor : "var(--card-border)"
                        }} />
                      ))}
                    </div>
                    <span style={{ fontSize: "12px", fontWeight: "700", color: diffColor }}>{challenge.difficulty}</span>
                    <span style={{ fontSize: "12px", color: "#adb5bd", display: "flex", alignItems: "center", gap: "4px" }}>
                      <Activity size={12} /> {challenge.points} pts
                    </span>
                  </div>

                  {isCompleted ? (
                    <CheckCircle2 size={18} color={isRed ? "#ff0044" : "#51cf66"} />
                  ) : (
                    <div style={{ color: isRed ? "rgba(255,0,68,0.4)" : "#adb5bd", transition: "0.2s" }} onMouseEnter={(e) => e.target.style.color = color}>
                      <Trophy size={16} />
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {filteredChallenges.length === 0 && (
          <div style={{ textAlign: "center", padding: "100px 0", color: "#666" }}>
            <Search size={48} style={{ marginBottom: "20px", opacity: 0.2 }} />
            <p>No labs found matching those filters.</p>
          </div>
        )}

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: "10px",
            marginTop: "20px",
            padding: "20px 0"
          }}>
            <button
              disabled={currentPage === 1}
              onClick={() => {
                setCurrentPage(p => Math.max(1, p - 1));
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              style={{
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.1)",
                color: currentPage === 1 ? "#333" : "#fff",
                padding: "8px 16px",
                borderRadius: "8px",
                cursor: currentPage === 1 ? "not-allowed" : "pointer",
                fontWeight: "600",
                fontSize: "14px",
                transition: "0.2s"
              }}
              onMouseEnter={(e) => { if (currentPage !== 1) e.target.style.background = "rgba(255,255,255,0.1)" }}
              onMouseLeave={(e) => { if (currentPage !== 1) e.target.style.background = "rgba(255,255,255,0.05)" }}
            >
              Prev
            </button>

            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i + 1}
                onClick={() => {
                  setCurrentPage(i + 1);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "8px",
                  border: "1px solid",
                  borderColor: currentPage === i + 1 ? color : "rgba(255,255,255,0.1)",
                  background: currentPage === i + 1 ? `${color}20` : "rgba(255,255,255,0.05)",
                  color: currentPage === i + 1 ? color : "var(--muted)",
                  fontWeight: "700",
                  cursor: "pointer",
                  transition: "0.2s"
                }}
              >
                {i + 1}
              </button>
            ))}

            <button
              disabled={currentPage === totalPages}
              onClick={() => {
                setCurrentPage(p => Math.min(totalPages, p + 1));
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              style={{
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.1)",
                color: currentPage === totalPages ? "#333" : "#fff",
                padding: "8px 16px",
                borderRadius: "8px",
                cursor: currentPage === totalPages ? "not-allowed" : "pointer",
                fontWeight: "600",
                fontSize: "14px",
                transition: "0.2s"
              }}
              onMouseEnter={(e) => { if (currentPage !== totalPages) e.target.style.background = "rgba(255,255,255,0.1)" }}
              onMouseLeave={(e) => { if (currentPage !== totalPages) e.target.style.background = "rgba(255,255,255,0.05)" }}
            >
              Next
            </button>
          </div>
        )}

        <ChallengeModal />
      </div>
    );
  };

  return (
    <div style={{ background: "var(--bg)", minHeight: "100vh" }}>
      <Navbar />
      <div style={{ display: "flex" }}>
        <Sidebar active="challenges" />
        <main style={{ flex: 1, minHeight: "calc(100vh - 80px)", position: "relative" }}>
          {view === "selection" && <SelectionScreen />}
          {view === "red-roadmap" && renderRoadmapScreen("red")}
          {view === "blue-roadmap" && renderRoadmapScreen("blue")}
        </main>
      </div>
    </div>
  );
}