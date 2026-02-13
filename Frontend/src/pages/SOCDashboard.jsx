import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Activity,
    Shield,
    AlertTriangle,
    Search,
    Bell,
    BarChart3,
    Lock,
    Terminal,
    Cpu,
    Zap,
    Radio,
    Eye,
    Crosshair,
    Server,
    FileText,
    MousePointer2,
    List,
    Layers,
    Settings,
    Database,
    Globe,
    RefreshCcw,
    UserCheck,
    Flag,
    ChevronRight,
    ClipboardList
} from 'lucide-react';

const API_BASE = "http://localhost:5001/api";

const SOCDashboard = () => {
    const [activeTab, setActiveTab] = useState('monitor'); // monitor, detect, respond, analyze, report
    const [tier, setTier] = useState('L1'); // L1, L2, L3
    const [aiLoading, setAiLoading] = useState(false);
    const [aiResponse, setAiResponse] = useState('');

    const [alerts, setAlerts] = useState([
        { id: 1, type: 'Firewall', severity: 'CRITICAL', title: 'Brute Force Attack', source: '103.45.12.89', time: '14:02:11', status: 'NEW' },
        { id: 2, type: 'IDS', severity: 'HIGH', title: 'SQL Injection Attempt', source: '192.168.1.55', time: '13:58:45', status: 'INVESTIGATING' },
        { id: 3, type: 'SIEM', severity: 'MEDIUM', title: 'Unauthorized sudo', source: 'workstation-03', time: '13:45:12', status: 'ACK' },
        { id: 4, type: 'Traffic', severity: 'LOW', title: 'Port Scan Detected', source: '88.12.99.3', time: '13:30:04', status: 'CLOSED' }
    ]);

    const [logs, setLogs] = useState(`
Feb 14 02:15:01 server-01 sshd[1234]: Failed password for root from 103.45.12.89 port 54321 ssh2
Feb 14 02:15:05 server-01 sshd[1234]: Failed password for root from 103.45.12.89 port 54321 ssh2
Feb 14 02:15:10 server-01 sshd[1234]: Failed password for root from 103.45.12.89 port 54321 ssh2
Feb 14 02:18:22 server-01 apache2: [warn] [client 192.168.1.55] base64_decode() detected in GET parameter: /index.php?id=MQ==; SELECT * FROM users;
  `);

    const handleAiAction = async (type, payload) => {
        setAiLoading(true);
        setAiResponse('');
        try {
            const endpoint = type === 'analyze' ? '/ai/soc/analyze' : type === 'respond' ? '/ai/soc/respond' : '/ai/soc/report';
            const body = type === 'analyze' ? { logs: payload, tier, context: 'log analysis' } :
                type === 'respond' ? { threat: payload } : { incident: payload };

            const res = await fetch(`${API_BASE}${endpoint}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body)
            });
            const data = await res.json();
            setAiResponse(data.analysis || data.plan || data.report || 'No response from AI.');
        } catch (err) {
            setAiResponse('Error: Failed to connect to AI Sentinel Engine.');
        } finally {
            setAiLoading(false);
        }
    };

    const tabs = [
        { id: 'monitor', label: 'Monitor', icon: Radio },
        { id: 'analyze', label: 'Analyze', icon: Activity },
        { id: 'report', label: 'Report', icon: FileText },
    ];

    return (
        <div className="soc-v2-container" style={{
            display: 'flex',
            height: 'calc(100vh - 64px)',
            background: '#080808',
            color: '#e2e8f0',
            fontFamily: 'Inter, system-ui, sans-serif',
            overflow: 'hidden'
        }}>

            {/* SIDEBAR NAVIGATION */}
            <div style={{
                width: '80px',
                background: 'rgba(17, 24, 39, 0.6)',
                borderRight: '1px solid rgba(255, 255, 255, 0.05)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                padding: '24px 0',
                gap: '24px',
                backdropFilter: 'blur(20px)'
            }}>
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        style={{
                            background: activeTab === tab.id ? 'rgba(16, 185, 129, 0.1)' : 'transparent',
                            border: 'none',
                            borderRadius: '12px',
                            padding: '12px',
                            cursor: 'pointer',
                            color: activeTab === tab.id ? '#10b981' : '#64748b',
                            transition: 'all 0.2s ease',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: '4px'
                        }}
                    >
                        <tab.icon size={22} />
                        <span style={{ fontSize: '9px', fontWeight: '800', textTransform: 'uppercase' }}>{tab.label}</span>
                    </button>
                ))}

                <div style={{ flex: 1 }} />

                {/* TIER TOGGLE */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', paddingBottom: '24px' }}>
                    {['L1', 'L2', 'L3'].map((l) => (
                        <button
                            key={l}
                            onClick={() => setTier(l)}
                            style={{
                                width: '32px',
                                height: '32px',
                                borderRadius: '8px',
                                border: '1px solid',
                                borderColor: tier === l ? '#10b981' : 'rgba(255, 255, 255, 0.1)',
                                background: tier === l ? 'rgba(16, 185, 129, 0.2)' : 'transparent',
                                color: tier === l ? '#10b981' : '#64748b',
                                fontSize: '11px',
                                fontWeight: '900',
                                cursor: 'pointer'
                            }}
                        >
                            {l}
                        </button>
                    ))}
                </div>
            </div>

            {/* MAIN CONTENT AREA */}
            <div style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden'
            }}>

                {/* HUD HEADER */}
                <div style={{
                    height: '70px',
                    borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
                    padding: '0 32px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    background: 'rgba(17, 24, 39, 0.2)'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <div style={{
                            background: 'rgba(16, 185, 129, 0.1)',
                            padding: '10px',
                            borderRadius: '12px'
                        }}>
                            <Shield size={20} className="text-[#10b981]" />
                        </div>
                        <div>
                            <h1 style={{ fontSize: '18px', fontWeight: '800', margin: 0, letterSpacing: '0.05em' }}>
                                SENTINEL SOC <span style={{ color: '#10b981' }}>{activeTab.toUpperCase()}</span>
                            </h1>
                            <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginTop: '2px' }}>
                                <span style={{ fontSize: '11px', color: '#64748b' }}>ANALYST TIER: <span style={{ color: '#10b981', fontWeight: '900' }}>{tier}</span></span>
                                <div style={{ width: '4px', height: '4px', background: '#64748b', borderRadius: '50%' }} />
                                <span style={{ fontSize: '11px', color: '#64748b' }}>SECTOR: SIGMA-9</span>
                            </div>
                        </div>
                    </div>

                    <div style={{ display: 'flex', gap: '16px' }}>
                        <button style={{
                            background: 'rgba(255, 255, 255, 0.03)',
                            border: '1px solid rgba(255, 255, 255, 0.05)',
                            color: '#e2e8f0',
                            padding: '8px 16px',
                            borderRadius: '8px',
                            fontSize: '12px',
                            fontWeight: '700',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px'
                        }}>
                            <RefreshCcw size={14} /> REFRESH FEED
                        </button>
                        <button style={{
                            background: '#10b981',
                            color: '#080808',
                            border: 'none',
                            padding: '8px 20px',
                            borderRadius: '8px',
                            fontSize: '12px',
                            fontWeight: '800',
                            boxShadow: '0 0 15px rgba(16, 185, 129, 0.3)'
                        }}>
                            EMERGENCY LOCKDOWN
                        </button>
                    </div>
                </div>

                {/* CONTENT PANELS */}
                <div style={{ flex: 1, padding: '24px', overflowY: 'auto' }}>

                    <AnimatePresence mode="wait">

                        {activeTab === 'monitor' && (
                            <motion.div
                                key="monitor"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}
                            >
                                {/* SIEM / FIREWALL FEED */}
                                <div style={{ background: 'rgba(17, 24, 39, 0.4)', borderRadius: '24px', border: '1px solid rgba(255, 255, 255, 0.05)', overflow: 'hidden' }}>
                                    <div style={{ padding: '20px', borderBottom: '1px solid rgba(255, 255, 255, 0.05)', display: 'flex', justifyContent: 'space-between' }}>
                                        <h3 style={{ fontSize: '14px', fontWeight: '800', margin: 0, color: '#10b981' }}>SYSTEM ALERTS (REAL-TIME)</h3>
                                        <Activity size={16} className="text-[#10b981] animate-pulse" />
                                    </div>
                                    <div style={{ padding: '16px' }}>
                                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                            <thead>
                                                <tr style={{ textAlign: 'left', fontSize: '10px', color: '#64748b', textTransform: 'uppercase' }}>
                                                    <th style={{ padding: '12px' }}>Type</th>
                                                    <th style={{ padding: '12px' }}>Severity</th>
                                                    <th style={{ padding: '12px' }}>Alert Title</th>
                                                    <th style={{ padding: '12px' }}>Source</th>
                                                    <th style={{ padding: '12px' }}>Time</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {alerts.map(alert => (
                                                    <tr key={alert.id} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.02)', fontSize: '13px' }}>
                                                        <td style={{ padding: '12px', color: '#60a5fa', fontWeight: '700' }}>{alert.type}</td>
                                                        <td style={{ padding: '12px' }}>
                                                            <span style={{
                                                                fontSize: '9px', fontWeight: '900', padding: '2px 6px', borderRadius: '4px',
                                                                background: alert.severity === 'CRITICAL' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(59, 130, 246, 0.1)',
                                                                color: alert.severity === 'CRITICAL' ? '#ef4444' : '#3b82f6'
                                                            }}>{alert.severity}</span>
                                                        </td>
                                                        <td style={{ padding: '12px', fontWeight: '600' }}>{alert.title}</td>
                                                        <td style={{ padding: '12px', fontFamily: 'monospace', color: '#94a3b8' }}>{alert.source}</td>
                                                        <td style={{ padding: '12px', color: '#64748b' }}>{alert.time}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>

                                {/* TELEMETRY CARDS */}
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                                    {[
                                        { label: 'CPU USAGE', val: '44%', icon: Cpu, color: '#10b981' },
                                        { label: 'TRAFFIC VOLUME', val: '1.2 GB/s', icon: Radio, color: '#3b82f6' },
                                        { label: 'SENTINEL UPTIME', val: '98.9%', icon: Zap, color: '#f59e0b' }
                                    ].map((stat, i) => (
                                        <div key={i} style={{ background: 'rgba(17, 24, 39, 0.4)', padding: '20px', borderRadius: '20px', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                                                <span style={{ fontSize: '11px', color: '#64748b', fontWeight: '800' }}>{stat.label}</span>
                                                <stat.icon size={14} style={{ color: stat.color }} />
                                            </div>
                                            <div style={{ fontSize: '24px', fontWeight: '800' }}>{stat.val}</div>
                                            <div style={{ height: '4px', background: 'rgba(255, 255, 255, 0.05)', borderRadius: '2px', marginTop: '12px' }}>
                                                <div style={{ width: stat.val.includes('%') ? stat.val : '60%', height: '100%', background: stat.color, borderRadius: '2px' }} />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        )}


                        {activeTab === 'analyze' && (
                            <motion.div
                                key="analyze"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', height: '100%' }}
                            >
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                                    <div style={{ background: 'rgba(17, 24, 39, 0.4)', padding: '24px', borderRadius: '24px', border: '1px solid rgba(255, 255, 255, 0.05)', flex: 1, display: 'flex', flexDirection: 'column' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                                            <h3 style={{ fontSize: '14px', fontWeight: '800', margin: 0 }}>ACTIVE LOG STREAM</h3>
                                            <List size={16} />
                                        </div>
                                        <textarea
                                            value={logs}
                                            onChange={(e) => setLogs(e.target.value)}
                                            style={{
                                                flex: 1, background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.05)',
                                                color: '#10b981', fontFamily: 'monospace', fontSize: '12px', padding: '16px', borderRadius: '12px', outline: 'none'
                                            }}
                                        />
                                        <button
                                            onClick={() => handleAiAction('analyze', logs)}
                                            style={{
                                                marginTop: '16px', background: '#3b82f6', color: '#fff', border: 'none',
                                                padding: '12px', borderRadius: '12px', fontSize: '13px', fontWeight: '800', cursor: 'pointer'
                                            }}
                                        >
                                            RUN AI LOG CORRELATION
                                        </button>
                                    </div>
                                </div>

                                <div style={{ background: 'rgba(17, 24, 39, 0.4)', padding: '24px', borderRadius: '24px', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
                                    <h3 style={{ fontSize: '14px', fontWeight: '800', marginBottom: '16px', color: '#3b82f6' }}>PATTERN ANALYSIS RESULT</h3>
                                    <div style={{ background: 'rgba(0,0,0,0.2)', borderRadius: '16px', padding: '20px', height: 'calc(100% - 40px)', overflowY: 'auto' }}>
                                        {aiLoading ? (
                                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: '12px' }}>
                                                <RefreshCcw size={24} className="animate-spin text-[#3b82f6]" />
                                                <span style={{ fontSize: '12px', color: '#94a3b8' }}>Detecting Malicious Patterns...</span>
                                            </div>
                                        ) : aiResponse ? (
                                            <div style={{ fontSize: '14px', lineHeight: '1.6', whiteSpace: 'pre-wrap' }}>{aiResponse}</div>
                                        ) : (
                                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', opacity: 0.3 }}>
                                                <Activity size={48} style={{ marginBottom: '12px' }} />
                                                <span>Upload or paste logs to initiate pattern detection.</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {activeTab === 'report' && (
                            <motion.div
                                key="report"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                style={{ maxWidth: '900px', margin: '0 auto', width: '100%' }}
                            >
                                <div style={{ background: 'rgba(17, 24, 39, 0.4)', padding: '40px', borderRadius: '32px', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px' }}>
                                        <div>
                                            <h2 style={{ fontSize: '24px', fontWeight: '800', margin: 0 }}>INCIDENT REPORT GENERATOR</h2>
                                            <p style={{ color: '#64748b', fontSize: '14px', marginTop: '4px' }}>Analyze and document resolved security threats.</p>
                                        </div>
                                        <FileText size={32} className="text-[#10b981]" />
                                    </div>

                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                                            <div>
                                                <label style={{ fontSize: '12px', fontWeight: '800', color: '#64748b', display: 'block', marginBottom: '8px' }}>INCIDENT CONTEXT</label>
                                                <textarea
                                                    placeholder="Summarize the incident findings (e.g., Brute force attack on web server from 103.45.12.89)"
                                                    style={{ width: '100%', height: '150px', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '12px', padding: '16px', color: '#fff', outline: 'none' }}
                                                    id="incidentInput"
                                                />
                                            </div>
                                            <button
                                                onClick={() => handleAiAction('report', document.getElementById('incidentInput').value)}
                                                style={{ background: '#10b981', color: '#080808', border: 'none', padding: '16px', borderRadius: '12px', fontSize: '14px', fontWeight: '900', cursor: 'pointer' }}
                                            >
                                                GENERATE AI REPORT
                                            </button>
                                        </div>

                                        <div style={{ background: 'rgba(0,0,0,0.3)', borderRadius: '20px', padding: '24px', border: '1px solid rgba(255,255,255,0.03)', position: 'relative' }}>
                                            {aiLoading ? (
                                                <div className="animate-pulse" style={{ color: '#10b981', fontSize: '13px' }}>Drafting final report...</div>
                                            ) : aiResponse ? (
                                                <div style={{ whiteSpace: 'pre-wrap', fontSize: '13px', lineHeight: '1.5' }}>{aiResponse}</div>
                                            ) : (
                                                <div style={{ textAlign: 'center', opacity: 0.2, marginTop: '50px' }}>
                                                    <ClipboardList size={48} style={{ margin: '0 auto 16px' }} />
                                                    <span>Complete the data form to generate report.</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                    </AnimatePresence>

                </div>

            </div>

            <style dangerouslySetInnerHTML={{
                __html: `
        @keyframes scan-anim {
          from { top: 0; }
          to { top: 100%; }
        }
        .animate-pulse {
          animation: pulse-anim 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        @keyframes pulse-anim {
          0%, 100% { opacity: 1; }
          50% { opacity: .5; }
        }
        .animate-spin {
          animation: spin-anim 1s linear infinite;
        }
        @keyframes spin-anim {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        ::-webkit-scrollbar {
          width: 6px;
        }
        ::-webkit-scrollbar-track {
          background: transparent;
        }
        ::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 3px;
        }
        ::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.1);
        }
      `}} />
        </div>
    );
};

export default SOCDashboard;
