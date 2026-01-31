import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import { API_BASE } from '../config';
import { Search, ShieldAlert, Activity, FileText, Download, ChevronDown, AlertTriangle, CheckCircle, Shield } from 'lucide-react';

const SAMPLE_LOGS = {
    "ssh_brute": `Oct 10 12:00:01 server sshd[123]: Failed password for root from 192.168.1.50 port 22 ssh2
Oct 10 12:00:03 server sshd[123]: Failed password for root from 192.168.1.50 port 22 ssh2
Oct 10 12:00:05 server sshd[123]: Failed password for root from 192.168.1.50 port 22 ssh2
Oct 10 12:00:07 server sshd[123]: Failed password for root from 192.168.1.50 port 22 ssh2
Oct 10 12:00:10 server sshd[123]: Accepted password for root from 192.168.1.50 port 22 ssh2`,
    "sql_injection": `192.168.1.100 - - [10/Oct/2023:14:05:01 +0000] "GET /products.php?id=1' OR '1'='1 HTTP/1.1" 200 4502 "-" "Mozilla/5.0"
192.168.1.100 - - [10/Oct/2023:14:05:05 +0000] "GET /products.php?id=1 UNION SELECT null, username, password FROM users-- HTTP/1.1" 200 1230 "-" "Mozilla/5.0"
192.168.1.100 - - [10/Oct/2023:14:05:10 +0000] "GET /admin/login.php HTTP/1.1" 403 500 "-" "Mozilla/5.0"`,
    "xss_attempt": `10.0.0.5 - - [11/Oct/2023:09:30:00 +0000] "GET /search?q=<script>alert('XSS')</script> HTTP/1.1" 200 300
10.0.0.5 - - [11/Oct/2023:09:30:05 +0000] "GET /search?q=%3Cimg%20src%3Dx%20onerror%3Dalert(1)%3E HTTP/1.1" 200 300`
};

export default function AILogAnalyzer() {
    const [logs, setLogs] = useState("");
    const [analysis, setAnalysis] = useState(null);
    const [loading, setLoading] = useState(false);
    const [sampleMenuOpen, setSampleMenuOpen] = useState(false);

    const handleAnalyze = async () => {
        if (!logs) return;
        setLoading(true);
        setAnalysis(null);
        try {
            const res = await fetch(`${API_BASE}/ai/analyze-logs`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ logs, mode: "real-world" })
            });
            const data = await res.json();
            setAnalysis(data.analysis);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const loadSample = (key) => {
        setLogs(SAMPLE_LOGS[key]);
        setSampleMenuOpen(false);
        setAnalysis(null);
    };

    const getRiskColor = (score) => {
        if (score < 30) return "var(--green)";
        if (score < 70) return "var(--yellow)";
        return "var(--red)";
    };

    return (
        <div style={{ background: "var(--bg)", minHeight: "100vh", color: "var(--text)" }}>
            <Navbar />
            <div style={{ display: "flex" }}>
                <Sidebar active="ai-log-analyzer" />
                <main style={{ flex: 1, padding: "40px" }}>
                    <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
                        <div style={{ marginBottom: "30px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
                                <div style={{ background: "var(--red)20", padding: "12px", borderRadius: "12px", color: "var(--red)" }}>
                                    <ShieldAlert size={32} />
                                </div>
                                <div>
                                    <h1 style={{ fontSize: "28px", fontWeight: "800", margin: 0 }}>SOC Log Forensic Dashboard</h1>
                                    <p style={{ color: "var(--muted)", marginTop: "5px", fontSize: "14px" }}>
                                        AI-Powered Sentinel for Threat Hunting & Incident Response
                                    </p>
                                </div>
                            </div>

                            <div style={{ position: "relative" }}>
                                <button
                                    onClick={() => setSampleMenuOpen(!sampleMenuOpen)}
                                    style={{
                                        background: "var(--card-bg)", color: "var(--cyan)", border: "1px solid var(--cyan)",
                                        padding: "10px 20px", borderRadius: "8px", cursor: "pointer", fontWeight: "600",
                                        display: "flex", alignItems: "center", gap: "8px"
                                    }}
                                >
                                    <FileText size={16} /> Load Attack Sample <ChevronDown size={14} />
                                </button>
                                {sampleMenuOpen && (
                                    <div style={{
                                        position: "absolute", top: "100%", right: 0, marginTop: "5px",
                                        background: "var(--card-bg)", border: "1px solid var(--card-border)",
                                        borderRadius: "8px", width: "200px", zIndex: 100, boxShadow: "0 4px 12px rgba(0,0,0,0.3)"
                                    }}>
                                        <div onClick={() => loadSample("ssh_brute")} style={{ padding: "10px", cursor: "pointer", fontSize: "13px", borderBottom: "1px solid var(--card-border)", color: "var(--text)" }}>🔓 SSH Brute Force</div>
                                        <div onClick={() => loadSample("sql_injection")} style={{ padding: "10px", cursor: "pointer", fontSize: "13px", borderBottom: "1px solid var(--card-border)", color: "var(--text)" }}>💉 SQL Injection (Union)</div>
                                        <div onClick={() => loadSample("xss_attempt")} style={{ padding: "10px", cursor: "pointer", fontSize: "13px", color: "var(--text)" }}>🌐 XSS Script Injection</div>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1.2fr", gap: "30px" }}>
                            {/* LEFT: INPUT */}
                            <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                                <div style={{ background: "var(--card-bg)", border: "1px solid var(--card-border)", borderRadius: "16px", padding: "20px", flex: 1, display: "flex", flexDirection: "column" }}>
                                    <h3 style={{ marginBottom: "15px", fontSize: "16px", color: "var(--muted)", display: "flex", alignItems: "center", gap: "10px" }}>
                                        <Activity size={18} /> Raw Log Stream
                                    </h3>
                                    <textarea
                                        value={logs}
                                        onChange={(e) => setLogs(e.target.value)}
                                        placeholder="Paste server logs or load a sample..."
                                        style={{
                                            flex: 1,
                                            width: "100%",
                                            minHeight: "400px",
                                            background: "#0d1117",
                                            border: "1px solid var(--card-border)",
                                            borderRadius: "12px",
                                            padding: "15px",
                                            color: "#e6edf3",
                                            fontFamily: "monospace",
                                            fontSize: "12px",
                                            outline: "none",
                                            resize: "none",
                                            lineHeight: "1.5"
                                        }}
                                    />
                                    <button
                                        onClick={handleAnalyze}
                                        disabled={loading || !logs}
                                        style={{
                                            width: "100%",
                                            marginTop: "20px",
                                            padding: "15px",
                                            background: "var(--red)",
                                            color: "#fff",
                                            border: "none",
                                            borderRadius: "12px",
                                            fontWeight: "700",
                                            cursor: loading ? "wait" : "pointer",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            gap: "10px",
                                            opacity: loading || !logs ? 0.6 : 1
                                        }}
                                    >
                                        <Shield size={18} /> {loading ? "Analyzing Threat Vectors..." : "Scan Logs"}
                                    </button>
                                </div>
                            </div>

                            {/* RIGHT: DASHBOARD */}
                            <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                                {!analysis && !loading && (
                                    <div style={{
                                        height: "100%", border: "2px dashed var(--card-border)", borderRadius: "16px",
                                        display: "flex", alignItems: "center", justifyContent: "center", color: "var(--muted)", flexDirection: "column", gap: "10px"
                                    }}>
                                        <Activity size={48} style={{ opacity: 0.2 }} />
                                        <p>Ready for Analysis</p>
                                    </div>
                                )}

                                {loading && (
                                    <div style={{
                                        height: "100%", borderRadius: "16px", background: "var(--card-bg)",
                                        display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: "20px"
                                    }}>
                                        <div className="spinner"></div>
                                        <p style={{ color: "var(--cyan)", fontWeight: "600" }}>AI Sentinel is correlating events...</p>
                                    </div>
                                )}

                                {analysis && (
                                    <>
                                        {/* TOP STATS */}
                                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px" }}>
                                            <div style={{ background: "var(--card-bg)", padding: "20px", borderRadius: "16px", border: "1px solid var(--card-border)", textAlign: "center" }}>
                                                <div style={{ fontSize: "12px", color: "var(--muted)", marginBottom: "5px" }}>THREAT SCORE</div>
                                                <div style={{ fontSize: "42px", fontWeight: "900", color: getRiskColor(analysis.threat_score) }}>
                                                    {analysis.threat_score}/100
                                                </div>
                                                <div style={{ fontSize: "12px", fontWeight: "700", color: getRiskColor(analysis.threat_score), marginTop: "5px" }}>
                                                    {analysis.classification.toUpperCase()}
                                                </div>
                                            </div>
                                            <div style={{ background: "var(--card-bg)", padding: "20px", borderRadius: "16px", border: "1px solid var(--card-border)" }}>
                                                <div style={{ fontSize: "12px", color: "var(--muted)", marginBottom: "10px" }}>DETECTED VECTORS</div>
                                                <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                                                    {analysis.badges?.map((badge, i) => (
                                                        <span key={i} style={{
                                                            background: "rgba(255,255,255,0.1)", fontSize: "11px", padding: "4px 8px", borderRadius: "4px",
                                                            border: "1px solid rgba(255,255,255,0.2)", color: "#fff"
                                                        }}>
                                                            {badge}
                                                        </span>
                                                    ))}
                                                    <span style={{
                                                        background: "var(--red)20", fontSize: "11px", padding: "4px 8px", borderRadius: "4px",
                                                        border: "1px solid var(--red)40", color: "var(--red)", fontWeight: "700"
                                                    }}>
                                                        {analysis.attack_type}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* TIMELINE */}
                                        <div style={{ background: "var(--card-bg)", padding: "20px", borderRadius: "16px", border: "1px solid var(--card-border)", flex: 1, overflowY: "auto", maxHeight: "300px" }}>
                                            <div style={{ fontSize: "12px", color: "var(--muted)", marginBottom: "15px", fontWeight: "700" }}>⚠️ INCIDENT TIMELINE</div>
                                            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                                                {analysis.timeline?.map((event, i) => (
                                                    <div key={i} style={{ display: "flex", gap: "15px", fontSize: "13px" }}>
                                                        <div style={{ fontFamily: "monospace", color: "var(--muted)", minWidth: "70px" }}>{event.time}</div>
                                                        <div style={{ flex: 1, color: "var(--text)" }}>{event.event}</div>
                                                        <div style={{
                                                            fontSize: "10px", fontWeight: "700", padding: "2px 6px", borderRadius: "4px", height: "fit-content",
                                                            background: event.risk === "high" ? "var(--red)" : event.risk === "medium" ? "var(--yellow)" : "var(--green)",
                                                            color: "#000"
                                                        }}>
                                                            {event.risk.toUpperCase()}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        {/* DEFENSE */}
                                        <div style={{ background: "rgba(81, 207, 102, 0.1)", padding: "20px", borderRadius: "16px", border: "1px solid var(--green)" }}>
                                            <div style={{ color: "var(--green)", fontWeight: "700", fontSize: "14px", marginBottom: "10px", display: "flex", alignItems: "center", gap: "8px" }}>
                                                <CheckCircle size={16} /> Recommended Actions
                                            </div>
                                            <ul style={{ margin: 0, paddingLeft: "20px", fontSize: "13px", color: "var(--text)" }}>
                                                {analysis.defensive_actions?.map((action, i) => (
                                                    <li key={i} style={{ marginBottom: "5px" }}>{action}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}
