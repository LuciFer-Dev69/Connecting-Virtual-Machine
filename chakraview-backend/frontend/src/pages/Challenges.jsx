import React from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

const categories = [
  { name: "Web Exploitation", key: "Web", icon: "🌐" },
  { name: "Cryptography", key: "Cryptography", icon: "🔑" },
  { name: "Forensics", key: "Forensics", icon: "🕵️" },
  { name: "Reverse Engineering", key: "Reverse", icon: "🔧" },
  { name: "AI / Prompt Injection", key: "AI", icon: "🤖" }
];

export default function Challenges() {
  return (
    <div>
      <Navbar />
      <div style={{ display:"flex" }}>
        <Sidebar />
        <main className="container">
          <h1 style={{ color:"var(--cyan)" }}>Challenge Categories</h1>

          {/* ✅ Force grid with 2 cards per row */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",   // always 2 columns
            gap: "20px",
            marginTop: "20px"
          }}>
            {categories.map(c => (
              <a
                key={c.key}
                href={`#/challenges/${c.key}`}
                className="card"
                style={{
                  textDecoration:"none",
                  color:"inherit",
                  textAlign:"center",
                  padding:"30px",
                  minHeight:"150px",
                  display:"flex",
                  flexDirection:"column",
                  justifyContent:"center",
                  alignItems:"center"
                }}
              >
                <h2 style={{ color:"var(--cyan)" }}>
                  {c.icon} {c.name}
                </h2>
                <p style={{ color:"var(--muted)" }}>Click to start</p>
              </a>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
