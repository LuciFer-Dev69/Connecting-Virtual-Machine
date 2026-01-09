import React from "react";
import { User } from "lucide-react";

export default function Navbar() {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const currentHash = window.location.hash;

  return (
    <nav className="nav">
      <a href="#/" style={{ fontWeight: "bold", color: "var(--cyan)", display: "flex", alignItems: "center", gap: "10px", textDecoration: "none" }}>
        <img src="/logo.png" alt="ChakraView Logo" style={{ height: "80px", transform: "scale(2)", transformOrigin: "left center", marginLeft: "10px" }} />
      </a>
      <div style={{ display: "flex", gap: "30px", alignItems: "center" }}>
        <a href="#/challenges" style={{ color: "#fff", textDecoration: "none", fontWeight: "500" }}>Challenges</a>
        <a href="#/tutorials" style={{ color: "#fff", textDecoration: "none", fontWeight: "500" }}>Learn</a>
        <a href="#/pwnbox" style={{ color: "#fff", textDecoration: "none", fontWeight: "500" }}>PwnBox</a>
        <a href="#/about" style={{ color: "#fff", textDecoration: "none", fontWeight: "500" }}>About</a>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
        {currentHash === "#/login" ? (
          <a href="#/signup" className="btn btn-cyan" style={{ color: "black", fontWeight: "bold" }}>Sign Up</a>
        ) : currentHash === "#/signup" ? (
          <a href="#/login" className="btn btn-ghost">Login</a>
        ) : user?.user_id && currentHash !== "#/" && currentHash !== "" ? (
          <a href="#/profile" style={{ display: "flex", alignItems: "center", gap: "10px", textDecoration: "none", color: "inherit" }}>
            <div style={{
              width: "35px",
              height: "35px",
              background: "var(--input-bg)",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "18px",
              border: "1px solid var(--card-border)"
            }}>
              {user?.profilePic ? (
                <img src={user.profilePic} alt="Profile" style={{ width: "100%", height: "100%", borderRadius: "50%", objectFit: "cover" }} />
              ) : (
                <User size={20} color="var(--muted)" />
              )}
            </div>
            <span style={{ color: "var(--text)", fontWeight: "500" }}>{user?.name}</span>
          </a>
        ) : (
          <>
            <a href="#/login" className="btn btn-ghost" style={{ marginRight: "10px" }}>Login</a>
            <a href="#/signup" className="btn btn-cyan" style={{
              color: "#000",
              fontWeight: "bold",
              background: "var(--cyan)",
              padding: "8px 20px",
              borderRadius: "5px",
              textDecoration: "none"
            }}>Sign Up</a>
          </>
        )}
      </div>
    </nav>
  );
}