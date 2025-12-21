import React from "react";

export default function Navbar() {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const currentHash = window.location.hash;

  return (
    <nav className="nav">
      <a href="#/" style={{ fontWeight:"bold", color:"var(--cyan)" }}>ChakraView</a>
      <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
        {currentHash === "#/login" ? (
          <a href="#/signup" className="btn btn-cyan" style={{ color: "#fff" }}>Sign Up</a>
        ) : currentHash === "#/signup" ? (
          <a href="#/login" className="btn btn-ghost" style={{ color: "#fff" }}>Login</a>
        ) : user?.user_id && currentHash !== "#/" && currentHash !== "" ? (
          <a href="#/profile" style={{ display: "flex", alignItems: "center", gap: "10px", textDecoration: "none", color: "inherit" }}>
            <div style={{
              width: "35px",
              height: "35px",
              background: "#333",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "18px"
            }}>
              {user?.profilePic ? (
                <img src={user.profilePic} alt="Profile" style={{ width: "100%", height: "100%", borderRadius: "50%", objectFit: "cover" }} />
              ) : (
                "👤"
              )}
            </div>
            <span style={{ color: "#fff", fontWeight: "500" }}>{user?.name}</span>
          </a>
        ) : (
          <>
            <a href="#/login" className="btn btn-ghost" style={{ color: "#fff" }}>Login</a>
            <a href="#/signup" className="btn btn-cyan" style={{ color: "#fff" }}>Sign Up</a>
          </>
        )}
      </div>
    </nav>
  );
}