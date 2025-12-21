import React from "react";
import { User } from "lucide-react";

export default function Navbar() {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const currentHash = window.location.hash;

  return (
    <nav className="nav">
      <a href="#/" style={{ fontWeight: "bold", color: "var(--cyan)" }}>ChakraView</a>
      <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
        {currentHash === "#/login" ? (
          <a href="#/signup" className="btn btn-cyan">Sign Up</a>
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
            <a href="#/login" className="btn btn-ghost">Login</a>
            <a href="#/signup" className="btn btn-cyan">Sign Up</a>
          </>
        )}
      </div>
    </nav>
  );
}