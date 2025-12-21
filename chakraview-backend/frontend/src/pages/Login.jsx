import React, { useState } from "react";
import Navbar from "../components/Navbar";
import { API_BASE } from "../config";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg("");
    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setMsg(data.error || "Login failed");
        return;
      }

      // Save and route
      localStorage.setItem("user", JSON.stringify(data.user || {}));
      if (data.user?.role === "admin") {
        window.location.hash = "#/admin";
      } else {
        window.location.hash = "#/dashboard";
      }
    } catch (err) {
      setMsg(err.message || "Network error");
    }
  };

  return (
    <div>
      <Navbar />
      <main className="container">
        <h1 style={{ color:"var(--cyan)" }}>Login</h1>
        <form onSubmit={handleSubmit} className="card">
          <input
            className="input"
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e)=>setEmail(e.target.value)}
            required
          />
          <input
            className="input"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e)=>setPassword(e.target.value)}
            required
          />
          <button className="btn btn-green">Login</button>
        </form>
        {msg && <p style={{ color:"red" }}>{msg}</p>}
      </main>
    </div>
  );
}
