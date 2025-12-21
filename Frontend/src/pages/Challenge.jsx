import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { API_BASE } from "../config";

export default function Challenge({ id }) {
  const [chal, setChal] = useState(null);
  const [flag, setFlag] = useState("");
  const [msg, setMsg] = useState("");
  const [hint, setHint] = useState(null);
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  useEffect(() => {
    fetch(`${API_BASE}/challenges/${id}`)
      .then(r => r.json())
      .then(setChal);
  }, [id]);

  const submitFlag = async (e) => {
    e.preventDefault();
    const res = await fetch(`${API_BASE}/submit`, {
      method:"POST",
      headers:{"Content-Type":"application/json"},
      body:JSON.stringify({ user_id:user.user_id, id:Number(id), flag })
    });
    const data = await res.json();
    setMsg(data.result || data.error);
  };

  const getHint = async () => {
    const res = await fetch(`${API_BASE}/hint`, {
      method:"POST",
      headers:{"Content-Type":"application/json"},
      body:JSON.stringify({ user_id:user.user_id, id:Number(id) })
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
      <div style={{ display:"flex" }}>
        <Sidebar />
        <main className="container">
          <h1 style={{ color:"var(--cyan)" }}>{chal.title}</h1>
          <p>{chal.description}</p>
          <p><b>Category:</b> {chal.category} | <b>Difficulty:</b> {chal.difficulty}</p>

          {/* Tutorial type challenge */}
          {chal.level === 1 ? (
            <div className="card" style={{ marginTop:"20px", color:"var(--muted)" }}>
              <h3>Tutorial Walkthrough</h3>
              <p>
                This is a step-by-step learning challenge. No flag submission required.  
                Please follow the walkthrough below:
              </p>
              <ul>
                <li>Step 1: Open the website page in browser.</li>
                <li>Step 2: Right-click → View Page Source.</li>
                <li>Step 3: Search for <code>&lt;!-- --&gt;</code> HTML comments.</li>
                <li>Step 4: Find the hidden flag inside a comment.</li>
              </ul>
              <p style={{ color:"limegreen" }}>
                ✅ Once you're comfortable, try real flag challenges in higher levels.
              </p>
            </div>
          ) : chal.category === 'AI' ? (
            /* AI Challenge - Interactive */
            <div className="card" style={{ marginTop:"20px", color:"var(--muted)" }}>
              <h3>🤖 Interactive AI Challenge</h3>
              <p>
                This challenge requires you to interact with an AI assistant system. 
                You'll need to use prompt injection techniques to extract the hidden flag.
              </p>
              <p style={{ color:"var(--cyan)", marginTop:"15px" }}>
                💡 <b>Objective:</b> Trick the AI into revealing its secret flag by manipulating its instructions.
              </p>
              <a 
                href="#/ai-challenge" 
                className="btn btn-cyan" 
                style={{ display:"inline-block", marginTop:"15px", textDecoration:"none" }}
              >
                🚀 Launch AI Challenge Interface
              </a>
            </div>
          ) : (
            <>
              {/* Hint button */}
              <button onClick={getHint} className="btn btn-cyan" style={{ marginTop:"15px" }}>
                Get Hint
              </button>
              {hint && <div className="card" style={{ marginTop:"10px" }}>
                <b>Hint:</b> {hint}
              </div>}

              {/* Flag submission form */}
              <form onSubmit={submitFlag} style={{ marginTop:"20px" }}>
                <input
                  className="input"
                  placeholder="flag{...}"
                  value={flag}
                  onChange={e => setFlag(e.target.value)}
                />
                <button className="btn btn-green">Submit</button>
              </form>
              {msg && <p style={{ marginTop:"10px" }}>{msg}</p>}
            </>
          )}
        </main>
      </div>
    </div>
  );
}