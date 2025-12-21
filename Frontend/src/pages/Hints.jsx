import React from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

export default function Hints() {
  return (
    <div>
      <Navbar />
      <div style={{ display:"flex" }}>
        <Sidebar />
        <main className="container">
          <h1 style={{ color:"var(--cyan)" }}>Hints</h1>
          <p>Hints will appear in each challenge. Use wisely — they are tracked in analytics.</p>
        </main>
      </div>
    </div>
  );
}
