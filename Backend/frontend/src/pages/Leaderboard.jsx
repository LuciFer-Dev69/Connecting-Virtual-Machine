import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { API_BASE } from "../config";

export default function Leaderboard() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetch(`${API_BASE}/leaderboard`)
      .then(r => r.json())
      .then(setUsers)
      .catch(err => console.error("Leaderboard fetch error:", err));
  }, []);

  return (
    <div>
      <Navbar />
      <div style={{ display: "flex" }}>
        <Sidebar />
        <main className="container">
          <h1 style={{ color: "var(--cyan)" }}>Leaderboard</h1>
          {users.length === 0 ? (
            <p style={{ color: "var(--muted)" }}>No users yet.</p>
          ) : (
            users.map((u, i) => (
              <div key={i} className="card">
                <b>{i + 1}. {u.name}</b> — {u.progress}% progress
              </div>
            ))
          )}
        </main>
      </div>
    </div>
  );
}
