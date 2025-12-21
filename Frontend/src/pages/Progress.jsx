import React from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

export default function Progress() {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  return (
    <div>
      <Navbar />
      <div style={{ display:"flex" }}>
        <Sidebar />
        <main className="container">
          <h1 style={{ color:"var(--cyan)" }}>Your Progress</h1>
          <div className="progress">
            <div className="progress__bar" style={{ width:`${user?.progress||0}%` }} />
          </div>
          <p>{user?.progress || 0}% complete</p>
        </main>
      </div>
    </div>
  );
}
