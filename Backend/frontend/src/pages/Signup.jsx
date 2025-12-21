import React, { useState } from "react";
import Navbar from "../components/Navbar";
import { API_BASE } from "../config";

export default function Signup() {
  const [name,setName] = useState("");
  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");
  const [error,setError] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_BASE}/auth/signup`, {
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({ name, email, password })
      });
      const data = await res.json();
      if(!res.ok) throw new Error(data.error || "Signup failed");
      localStorage.setItem("user", JSON.stringify(data.user));
      window.location.hash = "#/dashboard";
    } catch(err) { setError(err.message); }
  };

  return (
    <div>
      <Navbar />
      <div className="container">
        <h2>Sign Up</h2>
        <form onSubmit={onSubmit}>
          <input className="input" placeholder="Name" value={name} onChange={e=>setName(e.target.value)} />
          <input className="input" type="email" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
          <input className="input" type="password" placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)} />
          <button className="btn btn-cyan">Create Account</button>
        </form>
        {error && <p style={{ color:"var(--danger)" }}>{error}</p>}
      </div>
    </div>
  );
}
