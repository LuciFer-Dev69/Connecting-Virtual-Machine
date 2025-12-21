import React from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

const tutorials = {
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
    title: "Web Exploitation Basics",
    sections: [
      {
        heading: "What is Web Exploitation?",
        content: "Web exploitation involves finding and exploiting vulnerabilities in web applications to gain unauthorized access or extract sensitive information."
      },
      {
        heading: "Common Web Vulnerabilities",
        content: "SQL Injection, Cross-Site Scripting (XSS), Cross-Site Request Forgery (CSRF), and Server-Side Request Forgery (SSRF)."
      },
      {
        heading: "Essential Tools",
        content: "Burp Suite · OWASP ZAP · Nikto · SQLMap"
      },
      {
        heading: "How to get started",
        content: "Learn HTML, JavaScript, and HTTP basics. Understand how web applications work and practice on platforms like HackTheBox."
      }
    ]
  },
  "3": {
    title: "Cryptography Fundamentals",
    sections: [
      {
        heading: "What is Cryptography?",
        content: "Cryptography is the practice of securing information by transforming it into an unreadable format, which can only be decrypted with the correct key."
      },
      {
        heading: "Types of Encryption",
        content: "Symmetric Encryption (same key for encryption and decryption) and Asymmetric Encryption (public-private key pairs)."
      },
      {
        heading: "Common Ciphers",
        content: "Caesar Cipher · Base64 · ROT13 · RSA · AES"
      },
      {
        heading: "Breaking Ciphers",
        content: "Frequency analysis, brute force attacks, and understanding mathematical weaknesses in encryption algorithms."
      }
    ]
  },
  "4": {
    title: "Digital Forensics Introduction",
    sections: [
      {
        heading: "What is Digital Forensics?",
        content: "Digital forensics involves investigating and analyzing digital devices to uncover evidence of cybercrimes or security incidents."
      },
      {
        heading: "Key Forensics Areas",
        content: "File analysis, memory forensics, network traffic analysis, and steganography detection."
      },
      {
        heading: "Essential Tools",
        content: "Autopsy · Wireshark · Volatility · Binwalk · ExifTool"
      },
      {
        heading: "Investigation Process",
        content: "Acquire evidence, preserve integrity, analyze data, document findings, and present results."
      }
    ]
  },
  "5": {
    title: "Reverse Engineering Basics",
    sections: [
      {
        heading: "What is Reverse Engineering?",
        content: "Reverse engineering is the process of analyzing software or hardware to understand how it works, often to find vulnerabilities or modify behavior."
      },
      {
        heading: "Why Learn Reverse Engineering?",
        content: "Understand malware behavior, find security flaws, crack software protections, and analyze proprietary systems."
      },
      {
        heading: "Essential Tools",
        content: "IDA Pro · Ghidra · GDB · Radare2 · OllyDbg"
      },
      {
        heading: "Getting Started",
        content: "Learn assembly language, understand how programs are compiled, and practice with simple binaries before moving to complex software."
      }
    ]
  }
};

export default function Tutorial({ id }) {
  const tutorial = tutorials[id] || tutorials["1"];

  return (
    <div>
      <Navbar />
      <div style={{ display: "flex" }}>
        <Sidebar active="tutorials" />
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
            {tutorial.title}
          </h1>

          {tutorial.sections.map((section, index) => (
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
            onClick={() => window.location.hash = '#/tutorials'}
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