import React, { useState } from "react";
import { Shield, Lock, Search, FileText, Terminal, User, Mail } from "lucide-react";
import { API_BASE } from "../config";

export default function WebLabs({ level, user }) {
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [result, setResult] = useState(null);

    // Scenario 2: Dev Portal (Hidden Comment)
    const DevPortal = () => {
        const [pass, setPass] = useState("");
        const handleLogin = (e) => {
            e.preventDefault();
            if (pass === "dev_secret_2024") {
                setMessage("🎉 Access Granted! Password found in comments.");
                setResult("flag{hidden_in_comments}");
            } else {
                setMessage("❌ Invalid password. Look deeper in the code!");
            }
        };
        return (
            <div style={{ background: "#f8f9fa", padding: "40px", borderRadius: "8px", border: "1px solid #dee2e6", color: "#333" }}>
                <div style={{ maxWidth: "400px", margin: "0 auto", textAlign: "center" }}>
                    <div style={{ marginBottom: "20px" }}>
                        <Lock size={48} color="#007bff" />
                    </div>
                    <h2 style={{ color: "#343a40", marginBottom: "10px" }}>Developer Portal</h2>
                    <p style={{ color: "#6c757d", marginBottom: "30px" }}>Internal access only. Maintenance mode active.</p>
                    {/* HTML COMMENT: The maintenance password is dev_secret_2024 */}
                    <form onSubmit={handleLogin} style={{ textAlign: "left" }}>
                        <div style={{ marginBottom: "15px" }}>
                            <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>Username</label>
                            <input type="text" value="admin" disabled style={{ width: "100%", padding: "10px", border: "1px solid #ced4da", borderRadius: "4px", background: "#e9ecef" }} />
                        </div>
                        <div style={{ marginBottom: "20px" }}>
                            <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>Password</label>
                            <input
                                type="password"
                                value={pass}
                                onChange={(e) => setPass(e.target.value)}
                                placeholder="Enter password..."
                                style={{ width: "100%", padding: "10px", border: "1px solid #ced4da", borderRadius: "4px" }}
                            />
                        </div>
                        <button type="submit" style={{ width: "100%", padding: "12px", background: "#007bff", color: "#fff", border: "none", borderRadius: "4px", fontWeight: "bold", cursor: "pointer" }}> Login </button>
                    </form>
                    {message && <p style={{ marginTop: "20px", color: pass === "dev_secret_2024" ? "#28a745" : "#dc3545", fontWeight: "bold" }}>{message}</p>}
                    {result && <div style={{ marginTop: "15px", padding: "10px", background: "#d4edda", border: "1px solid #c3e6cb", borderRadius: "4px" }}><b>Flag:</b> <code>{result}</code></div>}
                </div>
            </div>
        );
    };

    // Scenario 3: SQL Injection (Login Bypass)
    const SQLiLab = () => {
        const [u, setU] = useState("");
        const [p, setP] = useState("");

        const handleSQLi = async (e) => {
            e.preventDefault();
            setLoading(true);
            try {
                const res = await fetch(`${API_BASE}/vuln/sqli_login`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ username: u, password: p })
                });
                const data = await res.json();
                if (data.status === "success") {
                    setMessage(`🎉 Login Successful! Admin account accessed.`);
                    setResult(data.flag);
                } else {
                    setMessage(`❌ ${data.message || "Invalid credentials"}`);
                    setResult(null);
                }
            } catch (err) {
                setMessage("❌ Server error. Try a simpler injection.");
            }
            setLoading(false);
        };

        return (
            <div style={{ background: "#1a1a1a", padding: "40px", borderRadius: "12px", border: "1px solid #333", color: "#eee" }}>
                <div style={{ maxWidth: "450px", margin: "0 auto" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "30px" }}>
                        <Shield size={32} color="var(--cyan)" />
                        <h2 style={{ margin: 0, fontSize: "1.5rem" }}>Secure Admin Panel</h2>
                    </div>
                    <p style={{ color: "#888", marginBottom: "20px" }}>Note: This site is protected by legacy database filters.</p>
                    <form onSubmit={handleSQLi}>
                        <div style={{ marginBottom: "15px" }}>
                            <label style={{ display: "block", marginBottom: "8px", fontSize: "0.9rem" }}>Administrator ID</label>
                            <input
                                className="input"
                                placeholder="Email or Username"
                                value={u}
                                onChange={e => setU(e.target.value)}
                                style={{ width: "100%", margin: 0 }}
                            />
                        </div>
                        <div style={{ marginBottom: "25px" }}>
                            <label style={{ display: "block", marginBottom: "8px", fontSize: "0.9rem" }}>Access Key</label>
                            <input
                                className="input"
                                type="password"
                                placeholder="********"
                                value={p}
                                onChange={e => setP(e.target.value)}
                                style={{ width: "100%", margin: 0 }}
                            />
                        </div>
                        <button className="btn btn-cyan" style={{ width: "100%" }} disabled={loading}>
                            {loading ? "Verifying..." : "Authenticate"}
                        </button>
                    </form>
                    {message && <p style={{ marginTop: "20px", color: result ? "#51cf66" : "#ff6b6b", textAlign: "center" }}>{message}</p>}
                    {result && (
                        <div style={{ marginTop: "15px", padding: "15px", background: "rgba(81, 207, 102, 0.1)", border: "1px dashed #51cf66", borderRadius: "8px", textAlign: "center" }}>
                            <small style={{ color: "var(--cyan)", display: "block", marginBottom: "5px" }}>SYSTEM COMPROMISED</small>
                            <code style={{ fontSize: "1.2rem", color: "#51cf66" }}>{result}</code>
                        </div>
                    )}
                </div>
            </div>
        );
    };

    // Scenario 4: Invoice Viewer (IDOR)
    const IDORLab = () => {
        const [id, setId] = useState("10243");
        const [invoice, setInvoice] = useState(null);

        const fetchInvoice = async () => {
            setLoading(true);
            try {
                const res = await fetch(`${API_BASE}/vuln/invoice/${id}`);
                const data = await res.json();
                setInvoice(data);
                if (data.flag) {
                    setMessage("🎉 IDOR Successful! You accessed another user's invoice.");
                } else {
                    setMessage("");
                }
            } catch (err) {
                setMessage("❌ Invoice not found.");
                setInvoice(null);
            }
            setLoading(false);
        };

        return (
            <div style={{ background: "#fff", padding: "30px", borderRadius: "15px", border: "1px solid #eee", color: "#2d3436", boxShadow: "0 10px 25px rgba(0,0,0,0.05)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px", borderBottom: "2px solid #f1f2f6", paddingBottom: "15px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        <FileText size={24} color="#0984e3" />
                        <h3 style={{ margin: 0 }}>Customer Billing Portal</h3>
                    </div>
                    <div style={{ fontSize: "0.9rem", color: "#636e72" }}>Logged in as: <b>ChakraUser</b></div>
                </div>

                <div style={{ marginBottom: "30px", display: "flex", gap: "15px", alignItems: "flex-end" }}>
                    <div style={{ flex: 1 }}>
                        <label style={{ display: "block", marginBottom: "5px", fontSize: "0.8rem", color: "#b2bec3", fontWeight: "bold" }}>INVOICE ID</label>
                        <input
                            type="text"
                            value={id}
                            onChange={e => setId(e.target.value)}
                            style={{ width: "100%", padding: "12px", border: "1px solid #dfe6e9", borderRadius: "8px", background: "#f1f2f6", fontSize: "1rem" }}
                        />
                    </div>
                    <button
                        onClick={fetchInvoice}
                        style={{ padding: "12px 25px", background: "#0984e3", color: "#fff", border: "none", borderRadius: "8px", fontWeight: "bold", cursor: "pointer" }}
                    >
                        View Invoice
                    </button>
                </div>

                {invoice ? (
                    <div style={{ padding: "20px", background: "#f8f9fa", borderRadius: "10px", border: "1px solid #eee", animation: "slideIn 0.3s ease" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "15px" }}>
                            <div>
                                <h4 style={{ margin: "0 0 5px 0", color: "#2d3436" }}>Invoice #{invoice.id}</h4>
                                <small style={{ color: "#636e72" }}>Issued to: <b>{invoice.owner}</b></small>
                            </div>
                            <div style={{ textAlign: "right" }}>
                                <div style={{ color: "#00b894", fontWeight: "bold", fontSize: "1.2rem" }}>${invoice.amount}</div>
                                <small style={{ color: "#636e72" }}>Status: Paid</small>
                            </div>
                        </div>
                        <p style={{ color: "#2d3436", fontSize: "0.9rem", margin: 0 }}>
                            <b>Description:</b> Cloud Services Subscription - {invoice.owner === "Admin" ? "Enterprise Plan" : "Basic Plan"}
                        </p>
                        {invoice.flag && (
                            <div style={{ marginTop: "20px", padding: "10px", background: "#dff9fb", border: "1px solid #c7ecee", borderRadius: "6px", textAlign: "center" }}>
                                <code style={{ color: "#0984e3", fontWeight: "bold" }}>{invoice.flag}</code>
                            </div>
                        )}
                    </div>
                ) : (
                    <div style={{ textAlign: "center", padding: "40px", color: "#b2bec3", border: "2px dashed #f1f2f6", borderRadius: "10px" }}>
                        Enter an invoice ID to view details
                    </div>
                )}
            </div>
        );
    };

    // Scenario 5: Cloud Console (Advanced/SSRF)
    const CloudConsole = () => {
        const [target, setTarget] = useState("");

        const handleAction = async (type) => {
            setLoading(true);
            try {
                const endpoint = type === 'ping' ? '/api/vuln/ping' : '/api/vuln/fetch';
                const res = await fetch(`${API_BASE}${endpoint}`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ ip: target, url: target })
                });
                const data = await res.json();
                setResult(data.output || data.content || data.error || JSON.stringify(data));
            } catch (err) {
                setResult("Communication Error: Target unreachable.");
            }
            setLoading(false);
        };

        return (
            <div style={{ background: "#0c0c0c", padding: "20px", borderRadius: "10px", border: "1px solid #333", color: "#00ff00", fontFamily: "monospace" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", borderBottom: "1px solid #333", paddingBottom: "10px", marginBottom: "20px" }}>
                    <Terminal size={20} />
                    <h3 style={{ margin: 0, fontSize: "1.1rem" }}>Chakra Cloud Shell v4.5</h3>
                </div>

                <div style={{ marginBottom: "20px" }}>
                    <p style={{ color: "#888", marginBottom: "10px" }}>// Diagnostic Tools Available</p>
                    <div style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
                        <input
                            value={target}
                            onChange={e => setTarget(e.target.value)}
                            placeholder="127.0.0.1"
                            style={{ flex: 1, background: "#1a1a1a", border: "1px solid #444", color: "#00ff00", padding: "10px", borderRadius: "4px" }}
                        />
                    </div>
                    <div style={{ display: "flex", gap: "10px" }}>
                        <button
                            onClick={() => handleAction('ping')}
                            style={{ flex: 1, padding: "8px", background: "#333", color: "#fff", border: "1px solid #555", cursor: "pointer" }}
                        >
                            sys_ping
                        </button>
                        <button
                            onClick={() => handleAction('fetch')}
                            style={{ flex: 1, padding: "8px", background: "#333", color: "#fff", border: "1px solid #555", cursor: "pointer" }}
                        >
                            web_get
                        </button>
                    </div>
                </div>

                <div style={{ background: "#000", padding: "15px", borderRadius: "5px", minHeight: "200px", border: "1px solid #222", overflowY: "auto", fontSize: "0.85rem" }}>
                    {loading ? <div className="blink">Executing...</div> : (
                        <pre style={{ whiteSpace: "pre-wrap", color: "#00ff00", margin: 0 }}>
                            {result || "Waiting for command input..."}
                        </pre>
                    )}
                </div>
                <style>{`
           .blink { animation: blink 1s step-end infinite; }
           @keyframes blink { 50% { opacity: 0; } }
         `}</style>
            </div>
        );
    };

    return (
        <div style={{ marginTop: "20px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "15px" }}>
                <div style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#51cf66", boxShadow: "0 0 10px #51cf66" }}></div>
                <span style={{ fontSize: "0.8rem", color: "#888", fontWeight: "bold", letterSpacing: "1px" }}>TARGET_ENVIRONMENT_ACTIVE</span>
            </div>

            {level === 2 && <DevPortal />}
            {level === 3 && <SQLiLab />}
            {level === 4 && <IDORLab />}
            {level === 5 && <CloudConsole />}

            <style>{`
        @keyframes slideIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
        </div>
    );
}
