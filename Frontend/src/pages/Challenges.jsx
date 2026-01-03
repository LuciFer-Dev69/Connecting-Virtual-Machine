import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { API_BASE } from "../config";
import {
  Globe,
  Lock,
  Search,
  Cpu,
  Bot,
  Box,
  Trophy,
  Target,
  Terminal
} from "lucide-react";

const categories = [
  {
    name: "Web Exploitation",
    key: "Web",
    icon: Globe,
    description: "Discover and exploit vulnerabilities in web applications.",
    learn: "SQL Injection, XSS, CSRF, IDOR",
    color: "#00d4ff",
    difficulty: "Beginner"
  },
  {
    name: "Cryptography",
    key: "Cryptography",
    icon: Lock,
    description: "Analyze and break encryption schemes to reveal secrets.",
    learn: "Ciphers, Hashing, RSA, Encoding",
    color: "#ff6b6b",
    difficulty: "Beginner"
  },
  {
    name: "Forensics",
    key: "Forensics",
    icon: Search,
    description: "Investigate digital evidence and recover hidden data.",
    learn: "File Analysis, Steganography, Metadata",
    color: "#51cf66",
    difficulty: "Intermediate"
  },
  {
    name: "Reverse Engineering",
    key: "Reverse Engineering",
    icon: Cpu,
    description: "Decompile and analyze binary programs to understand logic.",
    learn: "Assembly, Debugging, Decompilation",
    color: "#ffd43b",
    difficulty: "Intermediate"
  },
  {
    name: "AI / Prompt Injection",
    key: "AI",
    icon: Bot,
    description: "Manipulate AI models to bypass safety controls.",
    learn: "Prompt Injection, Jailbreaking, LLM Attacks",
    color: "#a78bfa",
    difficulty: "Advanced"
  },
  {
    name: "Linux / Bandit",
    key: "Linux",
    icon: Terminal,
    description: "Master the Linux command line. Essential skills for any hacker.",
    learn: "Bash, Permissions, Pipes, SSH",
    color: "#e8590c",
    difficulty: "Beginner"
  },
  {
    name: "Misc / General",
    key: "Misc",
    icon: Box,
    description: "Solve unique puzzles and test general security knowledge.",
    learn: "OSINT, Scripting, Logic Puzzles",
    color: "#ff922b",
    difficulty: "Advanced"
  }
];

export default function Challenges() {
  const [stats, setStats] = useState({
    challengesCompleted: 0,
    points: 0,
    streak: 0
  });
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  useEffect(() => {
    if (user.user_id) {
      fetchUserStats();
    }
  }, []);

  const fetchUserStats = async () => {
    try {
      const statsRes = await fetch(`${API_BASE}/user/${user.user_id}/stats`);
      const statsData = await statsRes.json();

      setStats({
        challengesCompleted: statsData.total_challenges || 0,
        points: statsData.progress || 0,
        streak: 0
      });
    } catch (err) {
      console.error("Error fetching stats:", err);
    }
  };

  return (
    <div style={{ background: "var(--bg)", minHeight: "100vh", color: "var(--text)", fontFamily: "sans-serif" }}>
      <Navbar />
      <div style={{ display: "flex" }}>
        <Sidebar active="challenges" />
        <main style={{ flex: 1, padding: "40px" }}>
          <div style={{ maxWidth: "1000px", margin: "0 auto" }}>

            {/* Header & Stats */}
            <div style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "40px",
              marginBottom: "40px",
              borderBottom: "1px solid var(--card-border)",
              paddingBottom: "20px"
            }}>
              <h1 style={{ fontSize: "32px", fontWeight: "bold", color: "var(--text)", margin: 0 }}>Challenges</h1>

              <div style={{ display: "flex", gap: "30px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <Target size={20} color="#888" />
                  <div>
                    <span style={{ display: "block", fontSize: "12px", color: "var(--muted)" }}>Completed</span>
                    <span style={{ fontSize: "18px", fontWeight: "bold", color: "var(--text)" }}>{stats.challengesCompleted}</span>
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <Trophy size={20} color="#ffd43b" />
                  <div>
                    <span style={{ display: "block", fontSize: "12px", color: "var(--muted)" }}>Points</span>
                    <span style={{ fontSize: "18px", fontWeight: "bold", color: "var(--cyan)" }}>{stats.points}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* List Layout */}
            <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
              {categories.map((category) => (
                <a
                  key={category.key}
                  href={`#/challenges/${encodeURIComponent(category.key)}`}
                  style={{ textDecoration: "none", color: "inherit" }}
                >
                  <div style={{
                    background: "var(--card-bg)",
                    borderRadius: "8px",
                    padding: "20px",
                    border: "1px solid var(--card-border)",
                    transition: "transform 0.2s, border-color 0.2s, background 0.2s",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "20px"
                  }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = "translateX(5px)";
                      e.currentTarget.style.borderColor = category.color;
                      e.currentTarget.style.background = "var(--input-bg)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "translateX(0)";
                      e.currentTarget.style.borderColor = "var(--card-border)";
                      e.currentTarget.style.background = "var(--card-bg)";
                    }}
                  >
                    {/* Icon */}
                    <div style={{
                      background: `${category.color}20`,
                      padding: "12px",
                      borderRadius: "8px",
                      color: category.color,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center"
                    }}>
                      <category.icon size={24} />
                    </div>

                    {/* Content */}
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "5px" }}>
                        <h3 style={{ fontSize: "18px", fontWeight: "600", color: "var(--text)", margin: 0 }}>
                          {category.name}
                        </h3>
                        <span style={{
                          fontSize: "11px",
                          color: "var(--muted)",
                          background: "var(--input-bg)",
                          padding: "2px 8px",
                          borderRadius: "12px",
                          border: "1px solid var(--card-border)"
                        }}>
                          {category.difficulty}
                        </span>
                      </div>
                      <p style={{ fontSize: "14px", color: "var(--muted)", margin: "0 0 8px 0" }}>
                        {category.description}
                      </p>
                      <div style={{ fontSize: "12px", color: "var(--muted)", display: "flex", alignItems: "center", gap: "6px" }}>
                        <span style={{ color: category.color, fontWeight: "600" }}>Learn:</span>
                        <span style={{ color: "var(--muted)" }}>{category.learn}</span>
                      </div>
                    </div>

                    {/* Arrow */}
                    <div style={{ color: "#444" }}>
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="9 18 15 12 9 6"></polyline>
                      </svg>
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