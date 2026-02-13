import React, { useState } from 'react';
import { API_BASE } from '../config';
import { Search, ShieldAlert, Activity, FileText, Download, ChevronDown, AlertTriangle, CheckCircle, Shield, RefreshCcw, LayoutDashboard } from 'lucide-react';
import PageTemplate from '../components/templates/PageTemplate';
import './AILogAnalyzer.css';

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
        if (!logs.trim()) return;
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
        if (score < 30) return "var(--color-success)";
        if (score < 70) return "var(--color-warning)";
        return "var(--color-error)";
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflowY: 'auto' }}>
            <PageTemplate
                title="Sentinel SOC Dashboard"
                subtitle="AI-Powered forensics engine for correlation and threat hunting."
                actions={
                    <div style={{ position: "relative" }}>
                        <button
                            onClick={() => setSampleMenuOpen(!sampleMenuOpen)}
                            className="btn-outline"
                            style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px' }}
                        >
                            <FileText size={16} /> Load Battle Record <ChevronDown size={14} />
                        </button>
                        {sampleMenuOpen && (
                            <div style={{
                                position: "absolute", top: "100%", right: 0, marginTop: "8px",
                                background: "var(--bg-panel)", border: "1px solid var(--border-primary)",
                                borderRadius: "8px", width: "220px", zIndex: 100, boxShadow: "0 10px 30px rgba(0,0,0,0.5)",
                                padding: '4px'
                            }}>
                                <div onClick={() => loadSample("ssh_brute")} className="sidebar-link" style={{ fontSize: '13px' }}>🔓 SSH Brute Force</div>
                                <div onClick={() => loadSample("sql_injection")} className="sidebar-link" style={{ fontSize: '13px' }}>💉 SQL Injection</div>
                                <div onClick={() => loadSample("xss_attempt")} className="sidebar-link" style={{ fontSize: '13px' }}>🌐 XSS Injection</div>
                            </div>
                        )}
                    </div>
                }
            >
                <div className="soc-dashboard-container">
                    <div className="log-input-section">
                        <div className="widget-title"><Activity size={18} className="text-primary" /> Row Telemetry Stream</div>
                        <textarea
                            className="log-textarea"
                            value={logs}
                            onChange={(e) => setLogs(e.target.value)}
                            placeholder="Paste operational logs here for cross-correlation analysis..."
                        />
                        <button
                            className="btn-submit"
                            style={{ marginTop: '20px', padding: '14px' }}
                            onClick={handleAnalyze}
                            disabled={loading || !logs.trim()}
                        >
                            {loading ? <RefreshCcw size={18} className="animate-spin" /> : <Shield size={18} />}
                            {loading ? "CORRELATING VECTORS..." : "INITIATE SCAN"}
                        </button>
                    </div>

                    <div className="analysis-results-section">
                        {!analysis && !loading && (
                            <div className="flex-center" style={{ flex: 1, border: '1px dashed var(--border-primary)', borderRadius: '16px', color: 'var(--text-muted)', flexDirection: 'column' }}>
                                <Shield size={48} style={{ opacity: 0.1, marginBottom: '15px' }} />
                                <span>Awaiting operational data for ingest.</span>
                            </div>
                        )}

                        {loading && (
                            <div className="flex-center" style={{ flex: 1, color: 'var(--accent-blue)', flexDirection: 'column' }}>
                                <RefreshCcw size={48} className="animate-spin" style={{ marginBottom: '15px' }} />
                                <span>Sentinel is reconstructing the kill chain...</span>
                            </div>
                        )}

                        {analysis && (
                            <>
                                <div className="analysis-summary-grid">
                                    <div className="risk-level-card">
                                        <div className="risk-label">Threat Severity</div>
                                        <div className="risk-score" style={{ color: getRiskColor(analysis.threat_score) }}>
                                            {analysis.threat_score}
                                        </div>
                                        <div style={{ fontSize: '12px', fontWeight: '800', color: getRiskColor(analysis.threat_score) }}>
                                            {analysis.classification.toUpperCase()}
                                        </div>
                                    </div>
                                    <div className="risk-level-card" style={{ textAlign: 'left' }}>
                                        <div className="risk-label" style={{ marginBottom: '12px' }}>Detected Artifacts</div>
                                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                                            {analysis.badges?.map((badge, i) => (
                                                <span key={i} className="tool-tag">{badge}</span>
                                            ))}
                                            <span style={{ fontSize: '10px', fontWeight: '900', color: 'var(--color-error)', background: 'rgba(239, 68, 68, 0.1)', padding: '4px 8px', borderRadius: '4px' }}>
                                                {analysis.attack_type.toUpperCase()}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="incident-timeline">
                                    <div className="widget-title" style={{ fontSize: '12px' }}><AlertTriangle size={14} /> INCIDENT TIMELINE</div>
                                    {analysis.timeline?.map((event, i) => (
                                        <div key={i} className="timeline-event">
                                            <span className="event-time">{event.time}</span>
                                            <span className="event-desc">{event.event}</span>
                                            <span className={`event-risk-badge ${event.risk.toLowerCase()}`}>
                                                {event.risk.toUpperCase()}
                                            </span>
                                        </div>
                                    ))}
                                </div>

                                <div className="remediation-card">
                                    <h4><CheckCircle size={18} /> STRATEGIC COUNTERMEASURES</h4>
                                    <ul className="remediation-list">
                                        {analysis.defensive_actions?.map((action, i) => (
                                            <li key={i}>{action}</li>
                                        ))}
                                    </ul>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </PageTemplate>
        </div>
    );
}
