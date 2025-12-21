import React from "react";
import Navbar from "../components/Navbar";

export default function Landing() {
  return (
    <div>
      <Navbar />
      <div className="container">
        <h1 style={{ color:"var(--cyan)" }}>Welcome to ChakraView</h1>
        <p style={{ color:"var(--muted)" }}>Learn cybersecurity by solving real CTF challenges!</p>
        <a href="#/login" className="btn btn-green">Get Started</a>
      </div>
    </div>
  );
}
