import React from "react";
import { User } from "lucide-react";

export default function Navbar() {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const currentHash = window.location.hash;

  return (
    <nav className="nav" style={{
      background: "rgba(11,15,20,0.9)",
      backdropFilter: "blur(10px)",
      borderBottom: "1px solid var(--card-border)",
      padding: "0 40px",
      height: "70px"
    }}>
      <a href="#/" style={{ fontWeight: "bold", color: "var(--red)", display: "flex", alignItems: "center", gap: "10px", textDecoration: "none" }}>
        <img src="/logo.png" alt="ChakraView Logo" style={{ height: "80px", transform: "scale(2)", transformOrigin: "left center", marginLeft: "10px" }} />
      </a>

      <div style={{ display: "flex", gap: "30px", alignItems: "center", height: "100%" }}>
        {[
          { name: "Dashboard", path: "#/dashboard" },
          { name: "Attack Paths", path: "#/challenges" }, // Roadmaps
          { name: "Ops", path: "#/real-life-challenges" }, // Challenges/Ops
          { name: "Operator Terminal", path: "#/pwnbox" }, // PawnBox
          { name: "Mission Log", path: "#/progress" } // Progress
        ].map((item) => {
          const isActive = currentHash === item.path;
          return (
            <a
              key={item.name}
              href={item.path}
              style={{
                color: isActive ? "var(--red)" : "var(--text)",
                textDecoration: "none",
                fontWeight: "500",
                fontSize: "14px",
                height: "100%",
                display: "flex",
                alignItems: "center",
                borderBottom: isActive ? "2px solid var(--red)" : "2px solid transparent",
                transition: "all 0.2s ease"
              }}
              onMouseEnter={(e) => {
                if (!isActive) e.target.style.color = "var(--red)";
              }}
              onMouseLeave={(e) => {
                if (!isActive) e.target.style.color = "var(--text)";
              }}
            >
              {item.name}
            </a>
          );
        })}
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
        {user?.user_id ? (
          <a href="#/profile" style={{ display: "flex", alignItems: "center", gap: "10px", textDecoration: "none", color: "inherit" }}>
            <div style={{
              width: "32px",
              height: "32px",
              background: "var(--bg-secondary)",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              border: "1px solid var(--card-border)"
            }}>
              {user?.profilePic ? (
                <img src={user.profilePic} alt="Profile" style={{ width: "100%", height: "100%", borderRadius: "50%", objectFit: "cover" }} />
              ) : (
                <User size={16} color="var(--muted)" />
              )}
            </div>
            <span style={{ color: "var(--text)", fontWeight: "500", fontSize: "14px" }}>{user?.name}</span>
          </a>
        ) : (
          <>
            <a href="#/login" className="btn-ghost" style={{ textDecoration: "none", padding: "8px 20px", borderRadius: "8px", fontSize: "14px" }}>Login</a>
            <a href="#/signup" style={{
              color: "#fff",
              fontWeight: "600",
              background: "linear-gradient(135deg, var(--red), var(--red-hover))",
              padding: "8px 20px",
              borderRadius: "8px",
              textDecoration: "none",
              fontSize: "14px",
              boxShadow: "0 0 15px rgba(255,0,68,0.3)"
            }}>Sign Up</a>
          </>
        )}
      </div>
    </nav>
  );
}