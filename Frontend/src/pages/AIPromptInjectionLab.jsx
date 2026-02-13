import React, { useState, useEffect, useRef } from 'react';
import { API_BASE } from '../config';
import { Zap, Terminal, Lock, Unlock, ShieldAlert, Cpu, BookOpen, Info, ChevronRight, ShieldCheck, AlertCircle, RefreshCcw, Send } from 'lucide-react';
import PageTemplate from '../components/templates/PageTemplate';
import './AIPromptInjectionLab.css';

const LEVELS = [
    { id: 1, name: "MOD 1", desc: "Instruction Confusion — Tone override and behavioral persona manipulation." },
    { id: 2, name: "MOD 2", desc: "Topic Boundary — Exploiting semantic drift via analogies." },
    { id: 3, name: "MOD 3", desc: "Context Poisoning — Injecting false 'facts' into AI persistence." },
    { id: 4, name: "MOD 4", desc: "Instruction Smuggling — Parsing commands inside formatted blocks." },
    { id: 5, name: "MOD 5", desc: "Reasoning Leak — Extracting internal logic via Verification Oracles." }
];

export default function AIPromptInjectionLab() {
    const [input, setInput] = useState("");
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(false);
    const [currentLevel, setCurrentLevel] = useState(1);
    const [solvedLevels, setSolvedLevels] = useState([]);
    const [activeTab, setActiveTab] = useState('mission');
    const [showAnalysis, setShowAnalysis] = useState(null);
    const [analyzing, setAnalyzing] = useState(false);
    const scrollRef = useRef(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [history]);

    const fetchAnalysis = async (level) => {
        setAnalyzing(true);
        try {
            const res = await fetch(`${API_BASE}/ai/prompt-injection/analysis`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ level })
            });
            const data = await res.json();
            setShowAnalysis(data.analysis);
        } catch (err) {
            console.error(err);
        } finally {
            setAnalyzing(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!input.trim() || loading) return;

        setLoading(true);
        const userMsg = { type: 'user', content: input };
        setHistory(prev => [...prev, userMsg]);
        const currentInput = input;
        setInput("");

        try {
            const res = await fetch(`${API_BASE}/ai/prompt-injection/evaluate`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ input: currentInput, level: currentLevel })
            });
            const data = await res.json();

            setHistory(prev => [...prev, {
                type: 'ai',
                content: data.response,
                success: data.success,
                defense: data.defense_tip,
                tutorial: data.tutorial
            }]);

            if (data.success && !solvedLevels.includes(currentLevel)) {
                setSolvedLevels(prev => [...prev, currentLevel]);
            }
        } catch (err) {
            setHistory(prev => [...prev, { type: 'error', content: "Neural uplink severed. Re-establishing..." }]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflowY: 'auto' }}>
            <PageTemplate
                title="Neural Jailbreak Lab"
                subtitle="Test the boundaries of AI containment policies through advanced prompt manipulation."
                actions={
                    <div className="level-switcher">
                        {LEVELS.map(l => (
                            <button
                                key={l.id}
                                onClick={() => { setCurrentLevel(l.id); setHistory([]); setShowAnalysis(null); }}
                                className={`level-btn ${currentLevel === l.id ? 'active' : ''}`}
                            >
                                {l.name} {solvedLevels.includes(l.id) && "✓"}
                            </button>
                        ))}
                    </div>
                }
            >
                <div className="ai-lab-container">
                    <div className="ai-main-col">
                        <div className="ai-terminal-wrapper">
                            <div className="pwnbox-bar">
                                <span className="terminal-path">NeuralVault // Lvl {currentLevel} // Secure Environment</span>
                                <div style={{ display: 'flex', gap: '6px' }}>
                                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: solvedLevels.includes(currentLevel) ? 'var(--color-success)' : 'var(--color-error)' }} />
                                </div>
                            </div>

                            <div className="ai-messages-area" ref={scrollRef}>
                                {history.length === 0 && (
                                    <div className="flex-center" style={{ height: '100%', flexDirection: 'column', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', fontSize: '13px', textAlign: 'center' }}>
                                        <Cpu size={48} style={{ opacity: 0.1, marginBottom: '20px' }} />
                                        [ MONITOR ] Waiting for interrogation vector...<br />
                                        Challenge: {LEVELS.find(l => l.id === currentLevel).desc}
                                    </div>
                                )}
                                {history.map((msg, idx) => (
                                    <div key={idx} className={`msg-bubble ${msg.type}`}>
                                        {msg.content}
                                        {msg.success && msg.tutorial && (
                                            <div className="vulnerability-report">
                                                <div style={{ color: "var(--color-success)", fontWeight: "800", fontSize: "12px", marginBottom: "8px" }}>✓ VULNERABILITY DETECTED</div>
                                                <div style={{ fontSize: "12px", color: "var(--text-secondary)", display: "flex", flexDirection: "column", gap: "4px" }}>
                                                    <div><span style={{ color: "var(--accent-blue)", fontWeight: "700" }}>TYPE:</span> {msg.tutorial.type}</div>
                                                    <div><span style={{ color: "var(--accent-red)", fontWeight: "700" }}>FLAW:</span> {msg.tutorial.wrong}</div>
                                                    <button
                                                        onClick={() => fetchAnalysis(currentLevel)}
                                                        disabled={analyzing}
                                                        className="btn-outline"
                                                        style={{ alignSelf: "flex-start", marginTop: "10px", fontSize: "11px", padding: '4px 10px' }}
                                                    >
                                                        {analyzing ? "Running Expert Analysis..." : "Request Deep Analysis Report"}
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ))}
                                {showAnalysis && (
                                    <div className="analysis-report">
                                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "12px" }}>
                                            <span style={{ color: "var(--accent-blue)", fontWeight: "800", fontSize: "12px" }}>CENTRAL INTELLIGENCE REPORT</span>
                                            <button onClick={() => setShowAnalysis(null)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>Close</button>
                                        </div>
                                        <div style={{ fontSize: "13px", color: "var(--text-primary)", whiteSpace: "pre-wrap", fontFamily: "var(--font-mono)", lineHeight: '1.6' }}>{showAnalysis}</div>
                                    </div>
                                )}
                            </div>

                            <form onSubmit={handleSubmit} className="ai-input-bar">
                                <div className="ai-input-group">
                                    <input
                                        className="ai-text-input"
                                        placeholder="Enter extraction payload or command override..."
                                        value={input}
                                        onChange={e => setInput(e.target.value)}
                                        disabled={loading}
                                    />
                                    <button type="submit" className="btn-submit" style={{ padding: '0 20px', background: 'var(--accent-purple)' }} disabled={loading}>
                                        {loading ? <RefreshCcw size={18} className="animate-spin" /> : <Send size={18} />}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>

                    <aside className="challenge-sidebar">
                        <div className="level-switcher" style={{ padding: '4px' }}>
                            <button onClick={() => setActiveTab('mission')} className={`level-btn ${activeTab === 'mission' ? 'active' : ''}`} style={{ flex: 1 }}>Mission</button>
                            <button onClick={() => setActiveTab('intel')} className={`level-btn ${activeTab === 'intel' ? 'active' : ''}`} style={{ flex: 1 }}>Neural Intel</button>
                        </div>

                        {activeTab === 'mission' ? (
                            <div className="widget-card">
                                <div className="widget-title"><Info size={18} className="text-primary" /> Sector Protocol</div>
                                <div className="intel-text" style={{ background: 'none', border: 'none', padding: 0 }}>
                                    {LEVELS.find(l => l.id === currentLevel).desc}
                                </div>
                                <div style={{ marginTop: '20px' }}>
                                    <h4 style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '8px' }}>Attack Vectors</h4>
                                    <ul style={{ fontSize: '12px', color: 'var(--text-secondary)', paddingLeft: '16px' }}>
                                        <li>Instruction Hijacking</li>
                                        <li>Role Emulation</li>
                                        <li>Prompt Leakage</li>
                                    </ul>
                                </div>
                            </div>
                        ) : (
                            <div className="widget-card">
                                <div className="widget-title"><BookOpen size={18} className="text-primary" /> Neural Tutorial</div>
                                <div style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                                    Prompt Injection is the primary vulnerability of LLMs. It occurs when untrusted user input is concatenated with high-privilege system instructions without proper sanitization.
                                </div>
                            </div>
                        )}
                    </aside>
                </div>
            </PageTemplate>
        </div>
    );
}
