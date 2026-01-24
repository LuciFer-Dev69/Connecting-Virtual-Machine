import React from "react";
import Navbar from "../components/Navbar";

// Placeholder data for sliders
const SPONSORS = [
  "https://upload.wikimedia.org/wikipedia/commons/thumb/5/51/IBM_logo.svg/2560px-IBM_logo.svg.png",
  "https://upload.wikimedia.org/wikipedia/commons/thumb/9/93/Amazon_Web_Services_Logo.svg/1024px-Amazon_Web_Services_Logo.svg.png",
  "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/Google_2015_logo.svg/2560px-Google_2015_logo.svg.png",
  "https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/Microsoft_logo.svg/2048px-Microsoft_logo.svg.png",
  "https://upload.wikimedia.org/wikipedia/commons/thumb/0/08/Cisco_logo_blue_2016.svg/1200px-Cisco_logo_blue_2016.svg.png",
];

const CATEGORIES = [
  { name: "Web Exploitation", icon: "🌐", desc: "Master web vulnerabilities" },
  { name: "Cryptography", icon: "🔐", desc: "Crack codes and ciphers" },
  { name: "Forensics", icon: "🔍", desc: "Analyze digital evidence" },
  { name: "Reverse Engineering", icon: "⚙️", desc: "Decompile and debug" },
  { name: "AI Security", icon: "🤖", desc: "Hack future intelligence" },
];

export default function Landing() {
  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", color: "var(--text)", overflowX: "hidden" }}>
      <Navbar />

      {/* Hero Section */}
      <div style={{
        position: "relative",
        minHeight: "85vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-start", // Left align
        overflow: "hidden",
        padding: "0 5%" // Add some side padding
      }}>
        {/* Background Video - Right Aligned */}
        <div style={{
          position: "absolute",
          top: 0,
          right: 0,
          width: "60%", // Occupy right side
          height: "100%",
          overflow: "hidden",
          zIndex: 0
        }}>
          <video
            autoPlay
            loop
            muted
            playsInline
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              opacity: 0.6
            }}
          >
            <source src="/hero-bg.mp4" type="video/mp4" />
          </video>
          {/* Gradient Overlay to fade into black on the left */}
          <div style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background: "linear-gradient(to right, var(--bg) 0%, transparent 50%, transparent 100%)"
          }} />
        </div>

        {/* Hero Content - Left Aligned */}
        <div style={{ position: "relative", zIndex: 1, maxWidth: "650px", textAlign: "left" }}>
          <h1 style={{
            fontSize: "4.5rem",
            fontWeight: "900",
            lineHeight: "1.1",
            marginBottom: "30px",
            color: "#fff"
          }}>
            Think Like a Hacker. <br />
            <span style={{ color: "var(--cyan)" }}>Defend Like a Pro.</span> <br />
            Secure the Future.
          </h1>
          <p style={{ fontSize: "1.25rem", color: "#ccc", marginBottom: "50px", lineHeight: "1.6", maxWidth: "500px" }}>
            Join the elite community of ethical hackers. Master cybersecurity through hands-on challenges and real-world simulations.
          </p>
          <div style={{ display: "flex", gap: "20px" }}>
            <a href="#/signup" className="btn" style={{
              padding: "15px 40px",
              fontSize: "1.1rem",
              fontWeight: "bold",
              background: "var(--cyan)", // Keep original Cyan
              color: "#000",
              border: "none",
              borderRadius: "5px",
              textDecoration: "none"
            }}>
              Get Started
            </a>
            <a href="#/about" className="btn btn-ghost" style={{
              padding: "15px 40px",
              fontSize: "1.1rem",
              color: "#fff",
              border: "1px solid #333",
              borderRadius: "5px",
              textDecoration: "none"
            }}>
              Read More
            </a>
          </div>
        </div>
      </div>

      {/* Sponsors Slider (Simulated Ticker) */}
      <div style={{ padding: "40px 0", background: "var(--card-bg)", borderTop: "1px solid var(--card-border)", borderBottom: "1px solid var(--card-border)" }}>
        <p style={{ textAlign: "center", color: "#555", marginBottom: "30px", fontSize: "0.9rem", textTransform: "uppercase", letterSpacing: "2px" }}>Trusted By Industry Leaders</p>
        <div style={{ overflow: "hidden", whiteSpace: "nowrap", position: "relative" }}>
          <div style={{ display: "inline-block", animation: "scroll 20s linear infinite" }}>
            {[...SPONSORS, ...SPONSORS].map((src, i) => (
              <img key={i} src={src} alt="Sponsor" style={{ height: "40px", margin: "0 50px", opacity: 0.5, filter: "grayscale(100%)" }} />
            ))}
          </div>
        </div>
      </div>

      {/* Challenge Categories Slider */}
      <div style={{ padding: "80px 20px", textAlign: "center", background: "var(--bg)" }}>
        <h2 style={{ fontSize: "2.5rem", marginBottom: "50px" }}>Explore Challenges</h2>
        <div style={{
          display: "flex",
          gap: "30px",
          overflowX: "auto",
          padding: "20px",
          scrollbarWidth: "none",
          justifyContent: "center",
          flexWrap: "wrap"
        }}>
          {CATEGORIES.map((cat, i) => (
            <div key={i} style={{
              background: "var(--card-bg)",
              border: "1px solid var(--card-border)",
              borderRadius: "20px",
              padding: "40px",
              minWidth: "250px",
              textAlign: "center",
              transition: "transform 0.3s ease, border-color 0.3s ease",
              cursor: "pointer"
            }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-10px)"; e.currentTarget.style.borderColor = "var(--cyan)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"; }}
            >
              <div style={{ fontSize: "3rem", marginBottom: "20px" }}>{cat.icon}</div>
              <h3 style={{ marginBottom: "10px", color: "var(--cyan)" }}>{cat.name}</h3>
              <p style={{ color: "#888" }}>{cat.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Events Section */}
      <div style={{ padding: "80px 20px", background: "var(--card-bg)", textAlign: "center" }}>
        <h2 style={{ fontSize: "2.5rem", marginBottom: "50px" }}>Upcoming CTF Events</h2>
        <div style={{ maxWidth: "800px", margin: "0 auto", textAlign: "left" }}>
          <div style={{ display: "flex", gap: "20px", alignItems: "center", marginBottom: "30px", background: "#1a1a1a", padding: "20px", borderRadius: "10px" }}>
            <div style={{ background: "var(--cyan)", color: "#000", padding: "10px 20px", borderRadius: "8px", fontWeight: "bold", textAlign: "center" }}>
              <div style={{ fontSize: "1.5rem" }}>15</div>
              <div>AUG</div>
            </div>
            <div>
              <h3 style={{ marginBottom: "5px" }}>Chakra CTF 2024 Qualifiers</h3>
              <p style={{ color: "#888", marginBottom: "0" }}>Online • 48 Hours • Teams of 4</p>
            </div>
            <div style={{ marginLeft: "auto" }}>
              <button className="btn btn-ghost" style={{ color: "var(--cyan)", border: "1px solid var(--cyan)" }}>Register</button>
            </div>
          </div>

          <div style={{ display: "flex", gap: "20px", alignItems: "center", background: "#1a1a1a", padding: "20px", borderRadius: "10px" }}>
            <div style={{ background: "#444", color: "#fff", padding: "10px 20px", borderRadius: "8px", fontWeight: "bold", textAlign: "center" }}>
              <div style={{ fontSize: "1.5rem" }}>01</div>
              <div>OCT</div>
            </div>
            <div>
              <h3 style={{ marginBottom: "5px" }}>Cyber Defense Summit</h3>
              <p style={{ color: "#888", marginBottom: "0" }}>Workshop • Hybrid</p>
            </div>
            <div style={{ marginLeft: "auto" }}>
              <button className="btn btn-ghost" disabled>Coming Soon</button>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer style={{ padding: "80px 20px", borderTop: "1px solid var(--card-border)", background: "var(--bg)", textAlign: "center", color: "var(--muted)" }}>
        <div style={{ marginBottom: "20px" }}>
          <img src="/logo.png" alt="Logo" style={{ height: "100px", marginBottom: "20px" }} />
          <p>&copy; 2024 ChakraView CTF Platform. All rights reserved.</p>
        </div>
        <div style={{ display: "flex", gap: "30px", justifyContent: "center", marginBottom: "30px" }}>
          <a href="#" style={{ color: "#888", textDecoration: "none" }}>Terms</a>
          <a href="#" style={{ color: "#888", textDecoration: "none" }}>Privacy</a>
          <a href="#" style={{ color: "#888", textDecoration: "none" }}>Contact</a>
        </div>
        <div>
          <p style={{ fontSize: "0.8rem" }}>Built for the community, by the community.</p>
        </div>
      </footer>

      {/* CSS for Ticker Animation */}
      <style>{`
        @keyframes scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
}