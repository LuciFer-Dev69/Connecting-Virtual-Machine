import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { API_BASE } from "../config";

export default function CategoryChallenges({ category }) {
  const [chals, setChals] = useState([]);
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  useEffect(() => {
    fetch(`${API_BASE}/challenges`)
      .then(r => r.json())
      .then(data => {
        // ✅ remove duplicates by challenge ID
        const unique = [];
        const seen = new Set();
        data.forEach(c => {
          if (c.category === category && !seen.has(c.id)) {
            unique.push(c);
            seen.add(c.id);
          }
        });
        setChals(unique);
      });
  }, [category]);

  const levels = {
    1: "Level 1 - Tutorials",
    2: "Level 2 - Easy",
    3: "Level 3 - Medium",
    4: "Level 4 - Hard",
    5: "Level 5 - Insane"
  };

  const grouped = {};
  chals.forEach(c => {
    if (!grouped[c.level]) grouped[c.level] = [];
    grouped[c.level].push(c);
  });

  // ✅ unlock logic based on progress
  const unlockedLevel = Math.floor((user?.progress || 0) / 10) + 1;

  return (
    <div>
      <Navbar />
      <div style={{ display:"flex" }}>
        <Sidebar />
        <main className="container">
          <h1 style={{ color: "var(--cyan)" }}>{category} Challenges</h1>

          {Object.keys(levels).sort((a, b) => Number(a) - Number(b)).map(lvl => {
            const levelNum = Number(lvl);
            const locked = levelNum > unlockedLevel;

            return (
              <section key={lvl} className="mt-4">
                <h2 style={{ color: locked ? "gray" : "var(--muted)" }}>
                  {levels[lvl]} {locked && " 🔒"}
                </h2>

                {locked ? (
                  <p style={{ color:"gray" }}>Locked — complete previous levels to unlock.</p>
                ) : grouped[lvl] && grouped[lvl].length > 0 ? (
                  <div style={{
                    display:"grid",
                    gridTemplateColumns:"1fr 1fr",  // ✅ always 2 cards per row
                    gap:"20px",
                    marginTop:"15px"
                  }}>
                    {grouped[lvl].map(c => (
                      <a
                        key={c.id}
                        href={`#/challenge/${c.id}`}
                        className="card"
                        style={{
                          textDecoration:"none",
                          color:"inherit",
                          padding:"20px",
                          minHeight:"120px",
                          display:"flex",
                          flexDirection:"column",
                          justifyContent:"center",
                          alignItems:"center",
                          textAlign:"center"
                        }}
                      >
                        <h3 style={{ color:"var(--cyan)", marginBottom:"8px" }}>{c.title}</h3>
                        <p style={{ color:"var(--muted)" }}>{c.difficulty}</p>
                      </a>
                    ))}
                  </div>
                ) : (
                  <p style={{ color:"var(--muted)" }}>No challenges yet.</p>
                )}
              </section>
            );
          })}
        </main>
      </div>
    </div>
  );
}
