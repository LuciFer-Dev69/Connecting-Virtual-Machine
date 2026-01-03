import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import WebTerminal from "../components/WebTerminal";
import { API_BASE } from "../config";
import { Terminal, X } from "lucide-react";

export default function Challenge({ id }) {
  const [chal, setChal] = useState(null);
  const [flag, setFlag] = useState("");
  const [msg, setMsg] = useState("");
  const [hint, setHint] = useState(null);
  const [showTerminal, setShowTerminal] = useState(false);
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  useEffect(() => {
    fetch(`${API_BASE}/challenges/${id}`)
      .then(r => r.json())
      .then(setChal);
  }, [id]);

  const submitFlag = async (e) => {
    e.preventDefault();
    const res = await fetch(`${API_BASE}/submit`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_id: user.user_id, id: Number(id), flag })
    });
    const data = await res.json();
    setMsg(data.result || data.error);
  };

  const getHint = async () => {
    const res = await fetch(`${API_BASE}/hint`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_id: user.user_id, id: Number(id) })
    });
    const data = await res.json();
    if (res.ok) {
      setHint(data.hint);
    } else {
      setMsg(data.error || "Could not fetch hint");
    }
  };

  if (!chal) return <div>Loading...</div>;

  return (
    <div>
      <Navbar />
      <div style={{ display: "flex" }}>
        <Sidebar />
        <main className="container" style={{ maxWidth: "1200px" }}>

          {/* HEADER SECTION */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "30px", borderBottom: "1px solid var(--card-border)", paddingBottom: "20px" }}>
            <div>
              <h1 style={{ color: "var(--cyan)", margin: "0 0 10px 0" }}>{chal.title}</h1>
              <div style={{ display: "flex", gap: "10px", fontSize: "0.9em", color: "var(--muted)" }}>
                <span style={{ background: "var(--card-bg)", padding: "4px 8px", borderRadius: "4px", border: "1px solid var(--card-border)" }}>{chal.category}</span>
                <span style={{ background: "var(--card-bg)", padding: "4px 8px", borderRadius: "4px", border: "1px solid var(--card-border)" }}>Level {chal.level}</span>
                <span style={{ color: chal.difficulty === "Easy" ? "var(--green)" : chal.difficulty === "Medium" ? "orange" : "var(--danger)" }}>{chal.difficulty}</span>
              </div>
            </div>

            {/* SPAWN PWNBOX BUTTON */}
            <button
              onClick={() => setShowTerminal(!showTerminal)}
              style={{
                background: "#1a1a1a",
                border: showTerminal ? "1px solid var(--danger)" : "1px solid var(--green)",
                color: showTerminal ? "var(--danger)" : "var(--green)",
                padding: "12px 20px",
                borderRadius: "4px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "10px",
                fontWeight: "bold",
                boxShadow: showTerminal ? "0 0 15px rgba(255, 107, 107, 0.2)" : "0 0 15px rgba(32, 201, 151, 0.2)",
                transition: "all 0.3s"
              }}
            >
              <Terminal size={18} />
              {showTerminal ? "Terminate PwnBox" : "Spawn PwnBox"}
            </button>
          </div>

          {/* TOP SECTION: LEVEL GOAL / DESCRIPTION */}
          <div className="card">
            <h2 style={{ color: "var(--text)", marginTop: 0, borderBottom: "1px solid var(--card-border)", paddingBottom: "10px", marginBottom: "15px" }}>
              Level Goal
            </h2>
            <div style={{ lineHeight: "1.6" }}>
              <p>{chal.description}</p>

              {/* Static placeholders mimicking OneTheWire style */}
              <div style={{ marginTop: "20px" }}>
                <h4 style={{ color: "var(--muted)", marginBottom: "10px" }}>Commands you may need to solve this level</h4>
                <code style={{ background: "#222", padding: "5px 10px", borderRadius: "4px", color: "var(--cyan)" }}>
                  ssh, ls, cat, strings, base64, grep, find
                </code>
              </div>
            </div>
          </div>

          {/* MIDDLE SECTION: DYNAMIC CONTENT (Appears on Spawn) */}
          {showTerminal && (
            <div className="card" style={{
              marginTop: "20px",
              borderLeft: "4px solid var(--green)",
              animation: "fadeIn 0.5s ease"
            }}>
              <h3 style={{ marginTop: 0, color: "var(--green)" }}>✅ PwnBox Instance Active</h3>
              <p>The interactive environment has been spawned below. You have full root access.</p>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginTop: "15px" }}>
                <div style={{ background: "#000", padding: "15px", borderRadius: "6px" }}>
                  <div style={{ color: "var(--muted)", fontSize: "0.8em", marginBottom: "5px" }}>TARGET HOST</div>
                  <div style={{ fontFamily: "monospace", color: "var(--cyan)", fontSize: "1.1em" }}>127.0.0.1 (Local)</div>
                </div>
                <div style={{ background: "#000", padding: "15px", borderRadius: "6px" }}>
                  <div style={{ color: "var(--muted)", fontSize: "0.8em", marginBottom: "5px" }}>CREDENTIALS</div>
                  <div style={{ fontFamily: "monospace", color: "var(--green)", fontSize: "1.1em" }}>user / user</div>
                </div>
              </div>
            </div>
          )}

          {/* BOTTOM SECTION: EMBEDDED TERMINAL */}
          {showTerminal && (
            <div style={{
              marginTop: "20px",
              height: "600px",
              border: "1px solid #333",
              borderRadius: "8px",
              overflow: "hidden",
              boxShadow: "0 10px 40px rgba(0,0,0,0.5)",
              animation: "slideUp 0.5s ease"
            }}>
              {/* Terminal Header */}
              <div style={{ background: "#1e1e1e", padding: "8px 15px", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #333" }}>
                <div style={{ display: "flex", gap: "6px" }}>
                  <div style={{ width: "12px", height: "12px", borderRadius: "50%", background: "#ff5f56" }}></div>
                  <div style={{ width: "12px", height: "12px", borderRadius: "50%", background: "#ffbd2e" }}></div>
                  <div style={{ width: "12px", height: "12px", borderRadius: "50%", background: "#27c93f" }}></div>
                </div>
                <span style={{ color: "#888", fontSize: "12px" }}>root@pwnbox:~</span>
                <div style={{ width: "40px" }}></div>
              </div>
              {/* Actual Terminal Component */}
              <div style={{ height: "calc(100% - 35px)", background: "#000" }}>
                <WebTerminal host="pwnbox" user={user} onExit={() => setShowTerminal(false)} />
              </div>
            </div>
          )}

          {/* SUBMISSION SECTION */}
          {!showTerminal && hint && (
            <div className="card" style={{ marginTop: "20px", border: "1px solid var(--cyan)" }}>
              <b>💡 Hint:</b> {hint}
            </div>
          )}

          <div className="card" style={{ marginTop: "20px" }}>
            <h3>Submit Flag</h3>
            <form onSubmit={submitFlag} style={{ display: "flex", gap: "10px" }}>
              <input
                className="input"
                style={{ marginBottom: 0 }}
                placeholder="flag{...}"
                value={flag}
                onChange={e => setFlag(e.target.value)}
              />
              <button className="btn btn-green">Submit Flag</button>
            </form>

            {!showTerminal && (
              <div style={{ marginTop: "15px" }}>
                <button onClick={getHint} className="btn btn-ghost" style={{ fontSize: "0.9em", padding: "6px 12px" }}>
                  Need a Hint?
                </button>
              </div>
            )}

            {msg && <p style={{ marginTop: "15px", padding: "10px", background: msg.includes("Correct") ? "rgba(32, 201, 151, 0.1)" : "rgba(255, 107, 107, 0.1)", borderRadius: "4px", borderLeft: msg.includes("Correct") ? "4px solid var(--green)" : "4px solid var(--danger)" }}>{msg}</p>}
          </div>

        </main>
      </div>

      {/* Simple animations */}
      <style>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideUp { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
      `}</style>
    </div>
  );
}