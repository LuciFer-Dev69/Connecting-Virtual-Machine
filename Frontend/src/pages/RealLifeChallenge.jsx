import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { API_BASE } from '../config';
import {
    Zap, Terminal, Lock, Unlock, ShieldAlert, Cpu,
    Globe, ExternalLink, RefreshCcw, Target, BookOpen,
    FileText, Check, Copy, ChevronLeft, Loader2, Sparkles, AlertTriangle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import WebTerminal from '../components/WebTerminal';
import { LAB_DOCS } from '../data/labDocs';

export default function RealLifeChallenge() {
    const { id } = useParams();
    const [challenge, setChallenge] = useState(null);
    const [session, setSession] = useState(null);
    const [loading, setLoading] = useState(true);
    const [spawning, setSpawning] = useState(false);
    const [activeTab, setActiveTab] = useState("terminal");
    const [flag, setFlag] = useState("");
    const [result, setResult] = useState(null);
    const [briefingTab, setBriefingTab] = useState("mission");
    const [copied, setCopied] = useState(null);

    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const user_id = user.user_id || 1;

    const docIdMap = {
        "1": "1", "48": "1", "2": "2", "49": "2",
        "3": "3", "50": "3", "4": "4", "51": "4",
        "5": "5", "52": "5", "6": "6", "54": "6",
        "7": "7", "55": "7", "8": "8", "56": "8"
    };
    const docId = docIdMap[id] || id;

    const [pwnboxInfo, setPwnboxInfo] = useState(null);

    const fetchDetails = async () => {
        try {
            const res = await fetch(`${API_BASE}/real-life-challenges/${id}?user_id=${user_id}`);
            const data = await res.json();
            setChallenge(data.challenge);
            setSession(data.session);

            // Auto-spawn pwnbox if not already active
            if (!pwnboxInfo) {
                const pwnRes = await fetch(`${API_BASE}/pwnbox/spawn`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ user_id })
                });
                const pwnData = await pwnRes.json();
                setPwnboxInfo(pwnData);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDetails();
    }, [id]);

    const handleStart = async () => {
        setSpawning(true);
        try {
            const res = await fetch(`${API_BASE}/real-life-challenges/${id}/start`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ user_id })
            });
            const data = await res.json();
            if (data.url || data.assigned_port) {
                await fetchDetails();
            }
        } catch (err) {
            console.error(err);
        } finally {
            setSpawning(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setResult(null);
        try {
            const res = await fetch(`${API_BASE}/real-life-challenges/${id}/submit`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ user_id, flag })
            });
            const data = await res.json();
            if (data.result === 'correct') {
                setResult({ type: 'success', msg: `Operation Successful: +${data.points} XP` });
            } else {
                setResult({ type: 'error', msg: 'System integrity check failed: Invalid Flag' });
            }
        } catch (err) {
            setResult({ type: 'error', msg: 'Connection to uplink lost.' });
        }
    };

    const copyToClipboard = (text, idx) => {
        navigator.clipboard.writeText(text);
        setCopied(idx);
        setTimeout(() => setCopied(null), 2000);
    };

    if (loading) {
        return (
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", background: "var(--bg)" }}>
                <Loader2 className="animate-spin" size={48} color="var(--primary)" />
            </div>
        );
    }

    const isSessionActive = session && session.status === 'active';
    const docs = LAB_DOCS[docId];

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{ padding: "1.5rem", display: "flex", flexDirection: "column", gap: "1.5rem", height: "calc(100vh - 3rem)", overflow: "hidden" }}
        >
            {/* Top Bar */}
            <div className="card" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "1rem 1.5rem" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                    <a href="#/real-life-challenges" className="btn btn-ghost" style={{ padding: "0.5rem" }}>
                        <ChevronLeft size={20} />
                    </a>
                    <div>
                        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.75rem", fontWeight: "bold", textTransform: "uppercase", color: "var(--danger)", marginBottom: "0.25rem" }}>
                            <ShieldAlert size={14} />
                            <span>Live Operation: {challenge?.category}</span>
                            <span style={{ color: "var(--text-muted)", margin: "0 0.25rem" }}>|</span>
                            <span>{challenge?.difficulty}</span>
                        </div>
                        <h1 style={{ margin: 0, fontSize: "1.25rem", fontWeight: "800" }}>{challenge?.title}</h1>
                    </div>
                </div>

                <div style={{ display: "flex", gap: "1rem" }}>
                    {pwnboxInfo && (
                        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", padding: "0 1.5rem", borderLeft: "1px solid var(--border)" }}>
                            <div style={{ display: "flex", flexDirection: "column" }}>
                                <span style={{ fontSize: "0.65rem", color: "var(--text-muted)", textTransform: "uppercase" }}>PwnBox Console</span>
                                <span style={{ fontSize: "0.8125rem", color: "var(--accent-blue)", fontWeight: "bold" }}>
                                    {pwnboxInfo.user} : {pwnboxInfo.password}
                                </span>
                            </div>
                        </div>
                    )}
                    {isSessionActive && (
                        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", padding: "0 1.5rem", borderLeft: "1px solid var(--border)", borderRight: "1px solid var(--border)" }}>
                            <div style={{ display: "flex", flexDirection: "column" }}>
                                <span style={{ fontSize: "0.65rem", color: "var(--text-muted)", textTransform: "uppercase" }}>Target Uplink</span>
                                <span style={{ fontSize: "0.875rem", color: "var(--primary)", fontWeight: "bold", display: "flex", alignItems: "center", gap: "0.25rem" }}>
                                    <Sparkles size={12} /> SECURE
                                </span>
                            </div>
                        </div>
                    )}
                    <button
                        onClick={handleStart}
                        disabled={spawning}
                        className={`btn ${isSessionActive ? "btn-ghost" : "btn-primary"}`}
                        style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
                    >
                        {spawning ? <Loader2 size={16} className="animate-spin" /> : <RefreshCcw size={16} />}
                        {isSessionActive ? "Reset Lab" : "Initiate Lab"}
                    </button>
                </div>
            </div>

            {/* main Workspace */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 450px", gap: "1.5rem", flex: 1, minHeight: 0 }}>
                {/* Left: Lab Panel */}
                <div className="card" style={{ padding: 0, display: "flex", flexDirection: "column", overflow: "hidden" }}>
                    <div style={{ display: "flex", background: "var(--bg-accent)", borderBottom: "1px solid var(--border)" }}>
                        <button
                            onClick={() => setActiveTab("terminal")}
                            style={{
                                padding: "1rem 2rem",
                                background: activeTab === "terminal" ? "var(--bg)" : "transparent",
                                color: activeTab === "terminal" ? "var(--primary)" : "var(--text-muted)",
                                border: "none",
                                borderBottom: activeTab === "terminal" ? "2px solid var(--primary)" : "2px solid transparent",
                                cursor: "pointer",
                                fontWeight: "bold",
                                fontSize: "0.875rem",
                                display: "flex",
                                alignItems: "center",
                                gap: "0.5rem"
                            }}
                        >
                            <Terminal size={16} /> TERMINAL
                        </button>
                        <button
                            onClick={() => setActiveTab("web")}
                            style={{
                                padding: "1rem 2rem",
                                background: activeTab === "web" ? "var(--bg)" : "transparent",
                                color: activeTab === "web" ? "var(--primary)" : "var(--text-muted)",
                                border: "none",
                                borderBottom: activeTab === "web" ? "2px solid var(--primary)" : "2px solid transparent",
                                cursor: "pointer",
                                fontWeight: "bold",
                                fontSize: "0.875rem",
                                display: "flex",
                                alignItems: "center",
                                gap: "0.5rem"
                            }}
                        >
                            <Globe size={16} /> WEB VIEW
                        </button>
                    </div>

                    <div style={{ flex: 1, position: "relative", background: "#000" }}>
                        <AnimatePresence mode="wait">
                            {activeTab === "terminal" ? (
                                <motion.div
                                    key="terminal"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    style={{ height: "100%" }}
                                >
                                    <WebTerminal connectionInfo={pwnboxInfo} challenge_id={id} />
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="web"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    style={{ height: "100%", background: "#fff" }}
                                >
                                    {isSessionActive ? (
                                        <iframe
                                            src={session.target_url || `http://localhost:${session.assigned_port}`}
                                            style={{ width: "100%", height: "100%", border: "none" }}
                                            title="Lab View"
                                        />
                                    ) : (
                                        <div style={{ height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: "var(--bg)" }}>
                                            <div style={{ textAlign: "center", padding: "2rem" }}>
                                                <AlertTriangle size={48} color="var(--danger)" style={{ marginBottom: "1rem", opacity: 0.5 }} />
                                                <h3 style={{ color: "var(--text)", marginBottom: "0.5rem" }}>Environment Offline</h3>
                                                <p style={{ color: "var(--text-muted)", fontSize: "0.875rem" }}>Deploy the lab mission to access the target system.</p>
                                            </div>
                                        </div>
                                    )}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>

                {/* Right: Info Panel */}
                <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem", overflowY: "auto", paddingRight: "0.5rem" }}>
                    {/* Briefing Card */}
                    <div className="card" style={{ display: "flex", flexDirection: "column", minHeight: "400px", padding: 0, overflow: "hidden" }}>
                        <div style={{ display: "flex", background: "var(--bg-accent)", borderBottom: "1px solid var(--border)" }}>
                            <button
                                onClick={() => setBriefingTab("mission")}
                                style={{ flex: 1, padding: "1rem", background: briefingTab === "mission" ? "var(--bg)" : "transparent", color: briefingTab === "mission" ? "var(--primary)" : "var(--text-muted)", border: "none", fontWeight: "bold", fontSize: "0.75rem", cursor: "pointer" }}
                            >
                                MISSION BRIEF
                            </button>
                            {docs && (
                                <button
                                    onClick={() => setBriefingTab("docs")}
                                    style={{ flex: 1, padding: "1rem", background: briefingTab === "docs" ? "var(--bg)" : "transparent", color: briefingTab === "docs" ? "var(--primary)" : "var(--text-muted)", border: "none", fontWeight: "bold", fontSize: "0.75rem", cursor: "pointer" }}
                                >
                                    INTEL / DOCS
                                </button>
                            )}
                        </div>

                        <div style={{ padding: "1.5rem", flex: 1, overflowY: "auto" }}>
                            <AnimatePresence mode="wait">
                                {briefingTab === "mission" ? (
                                    <motion.div
                                        key="mission"
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                    >
                                        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "var(--primary)", marginBottom: "1rem" }}>
                                            <Target size={18} />
                                            <h3 style={{ margin: 0, fontSize: "1rem" }}>Objectives</h3>
                                        </div>
                                        <p style={{ lineHeight: "1.7", color: "var(--text-muted)", fontSize: "0.9375rem" }}>
                                            {challenge?.description}
                                        </p>
                                    </motion.div>
                                ) : (
                                    <motion.div
                                        key="docs"
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                    >
                                        <h3 style={{ fontSize: "1.125rem", fontWeight: "800", marginBottom: "1.5rem" }}>{docs.title}</h3>
                                        {docs.sections.map((section, idx) => (
                                            <div key={idx} style={{ marginBottom: "1.5rem" }}>
                                                {section.type === "text" && <p style={{ fontSize: "0.875rem", color: "var(--text-muted)", lineHeight: "1.6" }}>{section.content}</p>}
                                                {section.type === "subtitle" && <h4 style={{ fontSize: "0.875rem", fontWeight: "bold", color: "var(--primary)", marginTop: "2rem", marginBottom: "0.75rem", textTransform: "uppercase" }}>{section.content}</h4>}
                                                {section.type === "terminal" && (
                                                    <div style={{ background: "#0c0c0c", border: "1px solid var(--border)", borderRadius: "0.5rem", overflow: "hidden", margin: "1rem 0" }}>
                                                        <div style={{ background: "var(--bg-accent)", padding: "0.5rem 1rem", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid var(--border)" }}>
                                                            <span style={{ fontSize: "0.65rem", fontWeight: "bold", color: "var(--text-muted)", fontFamily: "monospace" }}>COMMAND_BUFFER</span>
                                                            <button onClick={() => copyToClipboard(section.command, idx)} className="btn btn-ghost" style={{ padding: "0.25rem" }}>
                                                                {copied === idx ? <Check size={14} color="var(--primary)" /> : <Copy size={14} />}
                                                            </button>
                                                        </div>
                                                        <div style={{ padding: "1rem", fontFamily: "monospace", fontSize: "0.8125rem" }}>
                                                            <div style={{ color: "var(--primary)", display: "flex", gap: "0.5rem" }}>
                                                                <span style={{ opacity: 0.5 }}>#</span>
                                                                <span style={{ color: "var(--text)" }}>{section.command}</span>
                                                            </div>
                                                            {section.output && <div style={{ marginTop: "0.5rem", color: "var(--text-muted)", whiteSpace: "pre-wrap", opacity: 0.8 }}>{section.output}</div>}
                                                        </div>
                                                    </div>
                                                )}
                                                {section.type === "table" && (
                                                    <div style={{ overflowX: "auto", border: "1px solid var(--border)", borderRadius: "0.5rem", margin: "1rem 0" }}>
                                                        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.75rem" }}>
                                                            <thead>
                                                                <tr style={{ background: "var(--bg-accent)" }}>
                                                                    {section.columns.map(col => <th key={col} style={{ padding: "0.75rem", textAlign: "left", color: "var(--primary)", textTransform: "uppercase" }}>{col}</th>)}
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                {section.rows.map((row, rIdx) => (
                                                                    <tr key={rIdx} style={{ borderTop: "1px solid var(--border)" }}>
                                                                        <td style={{ padding: "0.75rem", fontWeight: "bold" }}>{row[0]}</td>
                                                                        <td style={{ padding: "0.75rem", color: "var(--text-muted)" }}>{row[1]}</td>
                                                                    </tr>
                                                                ))}
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>

                    {/* Submission Card */}
                    <div className="card">
                        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1.5rem" }}>
                            <Lock size={18} color="var(--primary)" />
                            <h3 style={{ margin: 0, fontSize: "1rem" }}>Access Authorization</h3>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div style={{ marginBottom: "1rem" }}>
                                <label style={{ fontSize: "0.75rem", color: "var(--text-muted)", display: "block", marginBottom: "0.5rem", textTransform: "uppercase", fontWeight: "bold" }}>System Flag</label>
                                <input
                                    className="input"
                                    placeholder="FLAG{...}"
                                    value={flag}
                                    onChange={(e) => setFlag(e.target.value)}
                                    style={{ marginBottom: 0 }}
                                />
                            </div>
                            <button type="submit" className="btn btn-primary" style={{ width: "100%" }}>
                                SUBMIT AUTHORIZATION
                            </button>
                        </form>
                        {result && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                style={{
                                    marginTop: "1rem",
                                    padding: "1rem",
                                    borderRadius: "0.5rem",
                                    background: result.type === 'success' ? "rgba(34, 197, 94, 0.1)" : "rgba(239, 68, 68, 0.1)",
                                    color: result.type === 'success' ? "var(--primary)" : "var(--danger)",
                                    fontSize: "0.8125rem",
                                    fontWeight: "bold",
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "0.5rem"
                                }}
                            >
                                {result.type === 'success' ? <Check size={16} /> : <AlertTriangle size={16} />}
                                {result.msg}
                            </motion.div>
                        )}
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
