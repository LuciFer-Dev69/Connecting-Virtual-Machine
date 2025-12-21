import React from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

const tutorials = [
  { id: 1, title: "AI Hack prompt", description: "Learn how to exploit AI systems", icon: "🤖", color: "#ff6b6b" },
  { id: 2, title: "Web Exploitation", description: "Find vulnerabilities in web apps", icon: "🌐", color: "#4ecdc4" },
  { id: 3, title: "Cryptography Basics", description: "Break simple ciphers", icon: "🔐", color: "#ffe66d" },
  { id: 4, title: "Forensics Analysis", description: "Analyze files and data", icon: "🔍", color: "#a8dadc" },
  { id: 5, title: "Reverse Engineering", description: "Understand binary code", icon: "⚙️", color: "#f4a261" },
];

export default function Tutorials() {
  return (
    <div>
      <Navbar />
      <div style={{ display: "flex" }}>
        <Sidebar active="tutorials" />
        <main style={{
          flex: 1,
          padding: "60px 80px",
          background: "var(--bg)",
          minHeight: "100vh",
          position: "relative",
          overflow: "hidden"
        }}>
          {/* Animated background elements */}
          <div style={{
            position: "absolute",
            top: "10%",
            right: "10%",
            width: "300px",
            height: "300px",
            background: "radial-gradient(circle, var(--cyan) 0%, transparent 70%)",
            borderRadius: "50%",
            filter: "blur(60px)",
            opacity: 0.1,
            animation: "float 6s ease-in-out infinite"
          }} />
          <div style={{
            position: "absolute",
            bottom: "20%",
            left: "5%",
            width: "250px",
            height: "250px",
            background: "radial-gradient(circle, var(--text) 0%, transparent 70%)",
            borderRadius: "50%",
            filter: "blur(60px)",
            opacity: 0.1,
            animation: "float 8s ease-in-out infinite reverse"
          }} />

          <div style={{ position: "relative", zIndex: 1 }}>
            {/* Header with gradient text */}
            <div style={{ textAlign: "center", marginBottom: "60px" }}>
              <h1 style={{
                color: "var(--text)",
                fontSize: "56px",
                marginBottom: "15px",
                fontWeight: "800",
                letterSpacing: "2px"
              }}>
                Tutorials
              </h1>
              <p style={{
                color: "var(--muted)",
                fontSize: "18px",
                maxWidth: "600px",
                margin: "0 auto"
              }}>
                Master cybersecurity through hands-on guided tutorials
              </p>
            </div>

            {/* Tutorial cards grid */}
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
              gap: "25px",
              maxWidth: "1200px",
              margin: "0 auto"
            }}>
              {tutorials.map((tutorial, index) => (
                <a
                  key={tutorial.id}
                  href={'#/tutorial/' + tutorial.id}
                  style={{
                    textDecoration: "none",
                    color: "inherit",
                    padding: "35px 30px",
                    background: "var(--card-bg)",
                    borderRadius: "20px",
                    transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                    border: "1px solid var(--card-border)",
                    backdropFilter: "blur(10px)",
                    position: "relative",
                    overflow: "hidden",
                    transform: "translateY(0)",
                    animationDelay: `${index * 0.1}s`,
                    animation: "slideUp 0.6s ease-out forwards",
                    opacity: 0
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-8px) scale(1.02)";
                    e.currentTarget.style.boxShadow = `0 20px 40px ${tutorial.color}40`;
                    e.currentTarget.style.borderColor = tutorial.color;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0) scale(1)";
                    e.currentTarget.style.boxShadow = "none";
                    e.currentTarget.style.borderColor = "var(--card-border)";
                  }}
                >
                  {/* Gradient overlay on hover */}
                  <div style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    height: "4px",
                    background: `linear-gradient(90deg, ${tutorial.color}, transparent)`,
                    opacity: 0.8
                  }} />

                  {/* Icon with animated background */}
                  <div style={{
                    fontSize: "48px",
                    marginBottom: "20px",
                    display: "inline-block",
                    padding: "15px",
                    background: `${tutorial.color}20`,
                    borderRadius: "15px",
                    border: `2px solid ${tutorial.color}40`
                  }}>
                    {tutorial.icon}
                  </div>

                  <h3 style={{
                    color: "var(--text)",
                    margin: "0 0 12px 0",
                    fontSize: "24px",
                    fontWeight: "700",
                    letterSpacing: "0.5px"
                  }}>
                    {tutorial.title}
                  </h3>
                  <p style={{
                    color: "var(--muted)",
                    margin: 0,
                    fontSize: "15px",
                    lineHeight: "1.6"
                  }}>
                    {tutorial.description}
                  </p>

                  {/* Arrow indicator */}
                  <div style={{
                    marginTop: "20px",
                    color: tutorial.color,
                    fontSize: "20px",
                    fontWeight: "bold",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px"
                  }}>
                    Start Learning
                    <span style={{ transition: "transform 0.3s ease" }}>→</span>
                  </div>
                </a>
              ))}
            </div>
          </div>

          <style>{`
            @keyframes float {
              0%, 100% { transform: translate(0, 0); }
              50% { transform: translate(20px, 20px); }
            }
            @keyframes slideUp {
              from {
                opacity: 0;
                transform: translateY(30px);
              }
              to {
                opacity: 1;
                transform: translateY(0);
              }
            }
          `}</style>
        </main>
      </div>
    </div>
  );
}