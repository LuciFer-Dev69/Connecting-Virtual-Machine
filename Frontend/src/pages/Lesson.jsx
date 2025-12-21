import React from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

const lessons = {
  "1": {
    title: "Lesson - 0 welcome to CTF Learning",
    sections: [
      {
        heading: "What is CTF?",
        content: 'CTF stands for "Capture The Flag" - a cybersecurity competition where player solve challenges to find "Flag" (Secret piece of text).'
      },
      {
        heading: "Why do hacker and cybersecurity students plays it?",
        content: "CTF challenges improve technical skills, teach new concepts, and prepare for real world scenarios."
      },
      {
        heading: "Common categories",
        content: "Web · Crypto · Forensic · Reverse Engg"
      },
      {
        heading: "Tools you would need",
        content: "Wireshark, nmap, burp suite, browserars and extensions"
      }
    ]
  },
  "2": {
    title: "Web Security Mastery - Module 1",
    sections: [
      {
        heading: "Introduction to Web Security",
        content: "Understanding the foundations of web application security and common attack vectors."
      },
      {
        heading: "HTTP Protocol Deep Dive",
        content: "Learn how HTTP requests and responses work, headers, methods, and status codes."
      },
      {
        heading: "Authentication & Sessions",
        content: "Cookies · JWT Tokens · OAuth · Session Management"
      },
      {
        heading: "Practice Exercises",
        content: "Complete 5 hands-on exercises covering HTTP basics and session handling vulnerabilities."
      }
    ]
  },
  "3": {
    title: "Advanced Cryptography - Module 1",
    sections: [
      {
        heading: "Modern Encryption Standards",
        content: "Deep dive into AES, RSA, and elliptic curve cryptography used in modern systems."
      },
      {
        heading: "Cryptographic Attacks",
        content: "Learn about timing attacks, side-channel attacks, and padding oracle attacks."
      },
      {
        heading: "Key Exchange Protocols",
        content: "Diffie-Hellman · ECDH · TLS Handshake"
      },
      {
        heading: "Hands-on Labs",
        content: "Break weak implementations and understand real-world cryptographic vulnerabilities."
      }
    ]
  },
  "4": {
    title: "Binary Exploitation - Module 1",
    sections: [
      {
        heading: "Memory Layout Understanding",
        content: "Learn about stack, heap, and how programs manage memory at runtime."
      },
      {
        heading: "Buffer Overflow Basics",
        content: "Understand how buffer overflows work and how to exploit them to gain control."
      },
      {
        heading: "Exploitation Techniques",
        content: "ROP Chains · Stack Canaries · ASLR Bypass · Return-to-libc"
      },
      {
        heading: "Practice Challenges",
        content: "Exploit vulnerable programs with increasing difficulty levels to master binary exploitation."
      }
    ]
  }
};

export default function Lesson({ id }) {
  const lesson = lessons[id] || lessons["1"];

  return (
    <div>
      <Navbar />
      <div style={{ display: "flex" }}>
        <Sidebar active="lessons" />
        <main style={{
          flex: 1,
          padding: "40px 60px",
          background: "var(--bg)",
          minHeight: "100vh",
          color: "var(--text)"
        }}>
          <h1 style={{
            color: "var(--text)",
            fontSize: "28px",
            marginBottom: "40px",
            fontWeight: "500"
          }}>
            {lesson.title}
          </h1>

          {lesson.sections.map((section, index) => (
            <div key={index} style={{ marginBottom: "35px" }}>
              <h2 style={{
                color: "var(--text)",
                fontSize: "18px",
                marginBottom: "12px",
                fontWeight: "600"
              }}>
                {section.heading}
              </h2>
              <p style={{
                color: "var(--muted)",
                fontSize: "15px",
                lineHeight: "1.6",
                marginBottom: "0"
              }}>
                {section.content}
              </p>
            </div>
          ))}

          <button
            onClick={() => window.location.hash = '#/lessons'}
            style={{
              marginTop: "50px",
              marginTop: "50px",
              padding: "12px 30px",
              background: "var(--button-bg)",
              color: "var(--text)",
              border: "1px solid var(--card-border)",
              borderRadius: "6px",
              fontSize: "15px",
              cursor: "pointer",
              transition: "background 0.3s ease"
            }}
            onMouseEnter={(e) => e.target.style.background = "var(--input-bg)"}
            onMouseLeave={(e) => e.target.style.background = "var(--button-bg)"}
          >
            Next page
          </button>
        </main>
      </div>
    </div>
  );
}