import React from "react";
import Navbar from "../components/Navbar";

export default function Landing() {
  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 100%)" }}>
      <Navbar />
      <div style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "calc(100vh - 80px)",
        padding: "40px 20px",
        textAlign: "center"
      }}>
        {/* Hero Section */}
        <div style={{ maxWidth: "800px", marginBottom: "50px" }}>
          <h1 style={{
            fontSize: "56px",
            fontWeight: "bold",
            background: "linear-gradient(90deg, #00d4ff, #00ff88)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            marginBottom: "20px"
          }}>
            Welcome to ChakraView
          </h1>
          <p style={{
            fontSize: "20px",
            color: "#b0b0b0",
            lineHeight: "1.6",
            marginBottom: "40px"
          }}>
            Learn cybersecurity by solving real CTF challenges. Master web exploitation, 
            cryptography, forensics, and more through hands-on practice.
          </p>
          <a href="#/signup" style={{
            display: "inline-block",
            padding: "15px 40px",
            background: "linear-gradient(90deg, #00d4ff, #00ff88)",
            color: "#000",
            fontSize: "18px",
            fontWeight: "bold",
            borderRadius: "50px",
            textDecoration: "none",
            transition: "transform 0.3s ease",
            boxShadow: "0 10px 30px rgba(0, 212, 255, 0.3)"
          }}
          onMouseEnter={(e) => e.currentTarget.style.transform = "translateY(-3px)"}
          onMouseLeave={(e) => e.currentTarget.style.transform = "translateY(0)"}
          >
            Get Started Free
          </a>
        </div>

        {/* Features Grid */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
          gap: "30px",
          maxWidth: "1000px",
          width: "100%"
        }}>
          <div style={{
            background: "rgba(255, 255, 255, 0.05)",
            backdropFilter: "blur(10px)",
            padding: "30px",
            borderRadius: "15px",
            border: "1px solid rgba(255, 255, 255, 0.1)"
          }}>
            <div style={{ fontSize: "40px", marginBottom: "15px" }}>🎯</div>
            <h3 style={{ color: "#00d4ff", marginBottom: "10px" }}>Real Challenges</h3>
            <p style={{ color: "#888", fontSize: "14px" }}>Practice with real-world CTF scenarios</p>
          </div>

          <div style={{
            background: "rgba(255, 255, 255, 0.05)",
            backdropFilter: "blur(10px)",
            padding: "30px",
            borderRadius: "15px",
            border: "1px solid rgba(255, 255, 255, 0.1)"
          }}>
            <div style={{ fontSize: "40px", marginBottom: "15px" }}>📚</div>
            <h3 style={{ color: "#00d4ff", marginBottom: "10px" }}>Learn & Grow</h3>
            <p style={{ color: "#888", fontSize: "14px" }}>Step-by-step tutorials and lessons</p>
          </div>

          <div style={{
            background: "rgba(255, 255, 255, 0.05)",
            backdropFilter: "blur(10px)",
            padding: "30px",
            borderRadius: "15px",
            border: "1px solid rgba(255, 255, 255, 0.1)"
          }}>
            <div style={{ fontSize: "40px", marginBottom: "15px" }}>🏆</div>
            <h3 style={{ color: "#00d4ff", marginBottom: "10px" }}>Compete</h3>
            <p style={{ color: "#888", fontSize: "14px" }}>Climb the leaderboard and earn badges</p>
          </div>
        </div>
      </div>
    </div>
  );
}