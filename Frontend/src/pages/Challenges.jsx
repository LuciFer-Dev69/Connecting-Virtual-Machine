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
          background: "#fff", width: "100%",
          maxWidth: "550px", borderRadius: "24px", padding: "40px", position: "relative",
          boxShadow: "0 20px 50px rgba(0,0,0,0.3)", color: "#111"
        }}>
          <button
            onClick={() => setSelectedChallenge(null)}
            style={{ position: "absolute", top: "25px", right: "25px", background: "#f8f9fa", border: "none", color: "#666", cursor: "pointer", width: "32px", height: "32px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", transition: "0.2s" }}
            onMouseEnter={(e) => e.target.style.background = "#eee"}
            onMouseLeave={(e) => e.target.style.background = "#f8f9fa"}
          >
            ✕
          </button>

          <div style={{ display: "flex", alignItems: "center", gap: "10px", color: color, marginBottom: "15px", fontWeight: "800", fontSize: "12px", letterSpacing: "1px" }}>
            <Activity size={14} /> ACTIVE LABORATORY
          </div>

          <h2 style={{ fontSize: "24px", fontWeight: "800", color: "#111", marginBottom: "10px" }}>{selectedChallenge.title}</h2>
          <div style={{ display: "flex", gap: "15px", marginBottom: "25px" }}>
            <span style={{ fontSize: "12px", color: "#666", background: "#f1f3f5", padding: "4px 12px", borderRadius: "20px", fontWeight: "600" }}>{selectedChallenge.difficulty}</span>
            <span style={{ fontSize: "12px", color: "#666", background: "#f1f3f5", padding: "4px 12px", borderRadius: "20px", fontWeight: "600" }}>{selectedChallenge.points} Points</span>
          </div>

          <p style={{ color: "#444", fontSize: "15px", lineHeight: "1.6", margin: "0 0 30px 0" }}>
            {selectedChallenge.description}
          </p>

          <div style={{ marginBottom: "25px" }}>
            <div style={{ display: "flex", gap: "10px" }}>
              <input
                value={flagInput}
                onChange={(e) => setFlagInput(e.target.value)}
                placeholder="Enter capture flag format: FLAG{...}"
                style={{
                  flex: 1, background: "#f8f9fa", border: "2px solid #eee", color: "#111",
                  padding: "14px 18px", borderRadius: "12px", outline: "none", fontFamily: "monospace",
                  fontSize: "14px", transition: "0.2s"
                }}
                onFocus={(e) => e.target.style.borderColor = color}
                onBlur={(e) => e.target.style.borderColor = "#eee"}
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
              style={{ background: "none", border: "none", color: "#666", cursor: "pointer", fontSize: "13px", fontWeight: "600", display: "flex", alignItems: "center", gap: "6px" }}
            >
              <Zap size={14} /> Need a hint?
            </button>
            <a href="#/pwnbox" style={{ background: "#111", color: "#fff", textDecoration: "none", padding: "10px 20px", borderRadius: "10px", fontSize: "13px", fontWeight: "600", display: "flex", alignItems: "center", gap: "8px" }}>
              <Terminal size={14} /> Open PwnBox
            </a>
          </div>

          {hint && (
            <div style={{ marginTop: "20px", padding: "15px", background: "#f8f9fa", border: "1px solid #eee", borderRadius: "12px", color: "#666", fontSize: "13px", fontFamily: "monospace" }}>
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

  const RoadmapScreen = ({ type }) => {
    const isRed = type === "red";
    const baseChallenges = isRed ? redChallenges : blueChallenges;
    const color = isRed ? "#ff0044" : "#00d4ff";

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
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", color: "#fff", background: "#000" }}>
          <div style={{ fontFamily: "monospace", textAlign: "center" }}>
            <div className="spinner" style={{ marginBottom: "20px" }}></div>
            // INITIALIZING_OFFENSIVE_LABS...
          </div>
        </div>
      );
    }

    return (
      <div style={{ padding: "40px", maxWidth: "1200px", margin: "0 auto", animation: "fadeIn 0.5s ease" }}>
        {/* Header Controls */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "40px", flexWrap: "wrap", gap: "20px" }}>
          <div>
            <button
              onClick={() => {
                window.location.hash = "#/challenges";
                setView("selection");
              }}
              style={{
                background: "none", border: "1px solid rgba(255,255,255,0.1)", color: "var(--muted)",
                padding: "8px 16px", borderRadius: "8px", cursor: "pointer",
                display: "flex", alignItems: "center", gap: "8px",
                fontSize: "13px", fontWeight: "600", transition: "0.2s"
              }}
              onMouseEnter={(e) => e.target.style.background = "rgba(255,255,255,0.05)"}
              onMouseLeave={(e) => e.target.style.background = "none"}
            >
              <ArrowLeft size={14} /> BACK
            </button>
            <h1 style={{ fontSize: "32px", fontWeight: "900", color: "#fff", margin: "15px 0 5px 0" }}>
              {isRed ? "Red Team Labs" : "Blue Team Labs"}
            </h1>
            <p style={{ color: "var(--muted)", fontSize: "14px", margin: 0 }}>
              Guided labs and lessons teaching you specific cyber topics.
            </p>
          </div>

          <div style={{ textAlign: "right" }}>
            <span style={{ fontSize: "24px", fontWeight: "900", color: color }}>{stats.points} <span style={{ fontSize: "14px", color: "var(--muted)" }}>PTS</span></span>
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
            background: "rgba(255,255,255,0.03)",
            padding: "24px",
            borderRadius: "16px",
            border: "1px solid rgba(255,255,255,0.1)",
            alignItems: "center"
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
            <Search style={{ position: "absolute", left: "16px", top: "50%", transform: "translateY(-50%)", color: "#666" }} size={18} />
            <input
              placeholder="Search challenges..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: "100%", background: "#111", border: "1px solid #333", borderRadius: "12px",
                padding: "14px 15px 14px 48px", color: "#fff", outline: "none", fontSize: "14px",
                transition: "all 0.2s ease",
                boxSizing: "border-box"
              }}
              onFocus={(e) => e.target.style.borderColor = color}
              onBlur={(e) => e.target.style.borderColor = "#333"}
            />
          </div>

          <select
            value={filterDifficulty}
            onChange={(e) => setFilterDifficulty(e.target.value)}
            className="custom-select"
            style={{
              background: "#111", border: "1px solid #333", borderRadius: "12px",
              padding: "14px", color: "#fff", cursor: "pointer",
              outline: "none", fontSize: "14px", width: "100%",
              boxSizing: "border-box"
            }}
          >
            <option value="All">Difficulty</option>
            <option>Easy</option>
            <option>Medium</option>
            <option>Hard</option>
            <option>Insane</option>
          </select>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="custom-select"
            style={{
              background: "#111", border: "1px solid #333", borderRadius: "12px",
              padding: "14px", color: "#fff", cursor: "pointer",
              outline: "none", fontSize: "14px", width: "100%",
              boxSizing: "border-box"
            }}
          >
            <option value="All">Status</option>
            <option value="unlocked">Available</option>
            <option value="completed">Completed</option>
            <option value="locked">Locked</option>
          </select>
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
                  background: "#fff",
                  borderRadius: "16px",
                  padding: "24px",
                  position: "relative",
                  cursor: isLocked ? "not-allowed" : "pointer",
                  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                  border: "1px solid #eee",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
                  display: "flex",
                  flexDirection: "column",
                  minHeight: "200px",
                  opacity: isLocked ? 0.7 : 1,
                  transform: isLocked ? "none" : "translateY(0)"
                }}
                onMouseEnter={(e) => {
                  if (!isLocked) {
                    e.currentTarget.style.transform = "translateY(-6px)";
                    e.currentTarget.style.boxShadow = "0 12px 24px rgba(0,0,0,0.1)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isLocked) {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.05)";
                  }
                }}
              >
                {/* Challenge Image */}
                <div style={{
                  height: "140px",
                  width: "calc(100% + 48px)",
                  margin: "-24px -24px 20px -24px",
                  backgroundImage: `url(${challenge.image_url || 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=400&auto=format&fit=crop'})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  borderRadius: "15px 15px 0 0",
                  position: "relative",
                  overflow: "hidden"
                }}>
                  <div style={{
                    position: "absolute",
                    top: 0, left: 0, width: "100%", height: "100%",
                    background: "linear-gradient(to bottom, transparent, rgba(0,0,0,0.4))"
                  }} />
                  {isLocked && (
                    <div style={{
                      position: "absolute",
                      top: 0, left: 0, width: "100%", height: "100%",
                      background: "rgba(0,0,0,0.6)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      color: "#fff", backdropFilter: "blur(2px)"
                    }}>
                      <Lock size={32} opacity={0.5} />
                    </div>
                  )}
                </div>

                {/* Top Row: Title & Icon */}
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "15px", alignItems: "flex-start" }}>
                  <h3 style={{
                    fontSize: "18px", fontWeight: "800", color: "#111", margin: 0,
                    maxWidth: "75%", lineHeight: "1.2", letterSpacing: "-0.5px"
                  }}>
                    {challenge.title || challenge.name}
                  </h3>
                  <div style={{
                    width: "36px", height: "36px", background: "#f8f9fa", borderRadius: "10px",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    border: "1px solid #eee"
                  }}>
                    <Icon size={18} color={isLocked ? "#ccc" : (isRed ? "#ff0044" : "#00d4ff")} />
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
                            (challenge.difficulty === 'Insane' && i <= 3)) ? diffColor : "#eee"
                        }} />
                      ))}
                    </div>
                    <span style={{ fontSize: "12px", fontWeight: "700", color: diffColor }}>{challenge.difficulty}</span>
                    <span style={{ fontSize: "12px", color: "#adb5bd", display: "flex", alignItems: "center", gap: "4px" }}>
                      <Activity size={12} /> {challenge.points} pts
                    </span>
                  </div>

                  {isCompleted ? (
                    <CheckCircle2 size={18} color="#51cf66" />
                  ) : (
                    <div style={{ color: "#adb5bd", transition: "0.2s" }} onMouseEnter={(e) => e.target.style.color = "#ff0044"}>
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