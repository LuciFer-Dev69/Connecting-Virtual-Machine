import React from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

const lessonModules = [
  {
    id: 1,
    title: "CTF Fundamentals",
    level: "Beginner",
    lessons: 10,
    icon: "🎯",
    color: "#00d9ff"
  },
  {
    id: 2,
    title: "Web Security Mastery",
    level: "Intermediate",
    lessons: 15,
    icon: "🛡️",
    color: "#a78bfa"
  },
  {
    id: 3,
    title: "Advanced Cryptography",
    level: "Advanced",
    lessons: 12,
    icon: "🔒",
    color: "#f59e0b"
  },
  {
    id: 4,
    title: "Binary Exploitation",
    level: "Intermediate",
    lessons: 20,
    icon: "⚙️",
    color: "#ffd43b"
  },
  {
    id: 5,
    title: "Digital Forensics",
    level: "Intermediate",
    lessons: 10,
    icon: "🔍",
    color: "#51cf66"
  },
  {
    id: 6,
    title: "Linux Fundamentals",
    level: "Beginner",
    lessons: 8,
    icon: "🐧",
    color: "#e8590c"
  },
  {
    id: 7,
    title: "AI Security",
    level: "Advanced",
    lessons: 10,
    icon: "🤖",
    color: "#a78bfa"
  },
];

export default function Lessons() {
  return (
    <div>
      <Navbar />
      <div style={{ display: "flex" }}>
        <Sidebar active="lessons" />
        <main style={{
          flex: 1,
          padding: "60px 80px",
          background: "var(--bg)",
          minHeight: "100vh",
          position: "relative"
        }}>
          <div style={{ position: "relative", zIndex: 1 }}>
            {/* Header */}
            <div style={{ textAlign: "center", marginBottom: "60px" }}>
              <h1 style={{
                color: "var(--text)",
                fontSize: "48px",
                marginBottom: "15px",
                fontWeight: "800",
                letterSpacing: "2px"
              }}>
                Learning Modules
              </h1>
              <p style={{
                color: "var(--muted)",
                fontSize: "16px",
                maxWidth: "600px",
                margin: "0 auto"
              }}>
                Complete structured learning paths from beginner to advanced level
              </p>
            </div>

            {/* Lesson modules grid */}
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))",
              gap: "25px",
              maxWidth: "1100px",
              margin: "0 auto"
            }}>
              {lessonModules.map((module) => (
                <a
                  key={module.id}
                  href={'#/lesson/' + module.id}
                  style={{
                    textDecoration: "none",
                    color: "inherit",
                    padding: "35px 30px",
                    background: "var(--card-bg)",
                    borderRadius: "16px",
                    transition: "all 0.3s ease",
                    border: "1px solid var(--card-border)",
                    backdropFilter: "blur(10px)"
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-5px)";
                    e.currentTarget.style.borderColor = module.color;
                    e.currentTarget.style.boxShadow = `0 10px 30px ${module.color}40`;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.borderColor = "var(--card-border)";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                >
                  {/* Icon */}
                  <div style={{
                    fontSize: "48px",
                    marginBottom: "20px"
                  }}>
                    {module.icon}
                  </div>

                  {/* Title */}
                  <h3 style={{
                    color: "var(--text)",
                    marginBottom: "12px",
                    fontSize: "22px",
                    fontWeight: "700"
                  }}>
                    {module.title}
                  </h3>

                  {/* Level badge */}
                  <div style={{
                    display: "inline-block",
                    padding: "5px 12px",
                    background: `${module.color}20`,
                    borderRadius: "6px",
                    marginBottom: "15px",
                    fontSize: "12px",
                    fontWeight: "600",
                    color: module.color,
                    textTransform: "uppercase"
                  }}>
                    {module.level}
                  </div>

                  {/* Lessons count */}
                  <p style={{
                    color: "var(--muted)",
                    fontSize: "15px",
                    margin: 0
                  }}>
                    {module.lessons} Lessons
                  </p>
                </a>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}