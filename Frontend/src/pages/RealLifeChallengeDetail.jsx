import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
    Shield, Activity, Globe, Zap, Info, Flag,
    ChevronRight, Loader2, AlertCircle, CheckCircle2,
    Terminal, Play, Sword
} from "lucide-react";
import PageTemplate from "../components/templates/PageTemplate";
import FakeTerminal from "../components/FakeTerminal";
import AiMentorPopup from "../components/AiMentorPopup";
import { API_BASE } from "../config";
import './RealLifeChallengeDetail.css';

export default function RealLifeChallengeDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [chal, setChal] = useState(null);
    const [flag, setFlag] = useState("");
    const [msg, setMsg] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showWebTarget, setShowWebTarget] = useState(false);
    const [showTerminal, setShowTerminal] = useState(false);
    const [user, setUser] = useState(JSON.parse(localStorage.getItem("user") || "{}"));
    const [lastCommand, setLastCommand] = useState("");

    const handleCommandExplainer = React.useCallback((cmd) => {
        setLastCommand(cmd);
    }, []);

    const handleTerminalExit = React.useCallback(() => {
        setShowTerminal(false);
    }, []);

    useEffect(() => {
        fetch(`${API_BASE}/real-life-challenges`)
            .then(r => r.json())
            .then(data => {
                const found = data.find(c => c.id === Number(id));
                if (found) {
                    setChal(found);
                } else {
                    navigate("/real-life/scenarios");
                }
            })
            .catch(() => navigate("/real-life/scenarios"));
    }, [id, navigate]);

    const toggleTerminal = () => {
        setShowTerminal(!showTerminal);
    };

    const submitFlag = async (e) => {
        e.preventDefault();
        if (!flag.trim()) return;
        setIsSubmitting(true);
        setMsg("");

        // Custom flags matching the FakeTerminal virtual FS
        const expectedFlags = {
            "Operation Blackout": "SIGNATURE{grid_restart_0x77}",
            "The Heist": "SIGNATURE{swift_race_bypass_vault}",
            "Chain Reaction": "SIGNATURE{jenkins_poison_pipeline}",
            "Patient Zero": "SIGNATURE{ransomware_reversal_key_01}"
        };

        setTimeout(() => {
            if (flag === expectedFlags[chal.title]) {
                setMsg("CRITICAL SUCCESS: Environment Secured. 🌸");
                const updatedUser = { ...user, progress: (user.progress || 0) + (chal.points || 0) };
                localStorage.setItem("user", JSON.stringify(updatedUser));
                window.dispatchEvent(new Event('storage'));
            } else {
                setMsg("ACCESS DENIED: Neural Signature Mismatch.");
            }
            setIsSubmitting(false);
        }, 1000);
    };

    if (!chal) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="animate-spin text-yellow-500" size={48} />
            </div>
        );
    }

    const isCorrect = msg && msg.includes("SUCCESS");

    return (
        <div className="real-life-detail-wrapper">
            <PageTemplate
                title={
                    <div className="flex items-center gap-3">
                        <Zap className="text-yellow-500" size={24} />
                        {chal.title}
                    </div>
                }
                subtitle={<div className="font-mono text-[11px] opacity-70">OPERATIVE_PROTOCOL: <span className="text-yellow-500">REAL-LIFE-{chal.id}</span> // NEURAL_LINK: <span className="text-green-500">STABLE</span> // SECTOR: <span className="text-yellow-500">{chal.category}</span></div>}
                actions={
                    <div className="flex gap-3">
                        <button
                            className="rl-btn-primary"
                            onClick={() => setShowWebTarget(true)}
                        >
                            <Globe size={16} /> Access Industrial Console
                        </button>
                        <button
                            className={`rl-btn-secondary ${showTerminal ? 'active' : ''}`}
                            onClick={toggleTerminal}
                        >
                            <Terminal size={16} /> {showTerminal ? 'Disconnect Node' : 'Deploy Field Terminal'}
                        </button>
                    </div>
                }
            >
                <div className="rl-detail-container">
                    <div className="rl-main-content">
                        {/* Terminal Area (PwnBox) */}
                        {showTerminal && (
                            <div className="rl-terminal-card mb-6">
                                <div className="rl-terminal-header">
                                    <div className="flex gap-2">
                                        <Activity size={12} className="text-yellow-500" />
                                        <span className="text-[10px] font-black uppercase tracking-widest text-yellow-500">Neural Uplink Terminal</span>
                                    </div>
                                    <span className="text-[9px] font-mono opacity-40">chakra@chakraview:~/ops/real-life</span>
                                </div>
                                <div className="h-[400px] bg-black rounded-b-xl overflow-hidden border-2 border-yellow-500/20 relative">
                                    <FakeTerminal
                                        challenge_title={chal.title}
                                        category="real-life"
                                        onExit={handleTerminalExit}
                                        onCommand={handleCommandExplainer}
                                    />
                                </div>
                            </div>
                        )}

                        {/* Mission Briefing */}
                        <div className="rl-card mb-6">
                            <div className="rl-card-header">
                                <Info size={18} className="text-yellow-500" />
                                <span className="font-bold tracking-widest uppercase text-xs">Mission Briefing</span>
                            </div>
                            <div className="rl-briefing-text">
                                {chal.description}
                            </div>

                            <div className="mt-8">
                                <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-4">Required Toolset</h4>
                                <div className="flex gap-2">
                                    {["nmap", "wireshark", "metasploit", "custom_exploit", "neural_link"].map(tool => (
                                        <span key={tool} className="px-2 py-1 bg-yellow-500/5 border border-yellow-500/10 text-[10px] font-mono text-yellow-500/80 rounded uppercase">
                                            {tool}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Operational Documentation */}
                        {chal.walkthrough && (
                            <div className="rl-card">
                                <div className="rl-card-header">
                                    <Sword size={18} className="text-yellow-500" />
                                    <span className="font-bold tracking-widest uppercase text-xs">Operational Walkthrough</span>
                                </div>
                                <div className="rl-walkthrough-content">
                                    {chal.walkthrough.split('\n').map((line, i) => (
                                        <p key={i} className="mb-4 text-gray-400 leading-relaxed">
                                            {line.startsWith('#') ? (
                                                <span className="text-yellow-500 font-bold block mt-6 mb-2">{line.replace(/^#+\s/, '')}</span>
                                            ) : line}
                                        </p>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    <aside className="rl-sidebar">
                        <div className="rl-widget-card">
                            <div className="rl-widget-title">
                                <Activity size={16} className="text-yellow-500" />
                                <span>Operative Stats</span>
                            </div>
                            <div className="flex justify-between items-center mt-4">
                                <span className="text-[10px] text-gray-500 font-bold uppercase">Sector Rank</span>
                                <span className="text-sm font-bold text-white">#04</span>
                            </div>
                            <div className="flex justify-between items-center mt-2">
                                <span className="text-[10px] text-gray-500 font-bold uppercase">Reward Value</span>
                                <span className="text-sm font-bold text-yellow-500">{chal.points} XP</span>
                            </div>
                        </div>

                        <div className="rl-widget-card">
                            <div className="rl-widget-title">
                                <Flag size={16} className="text-yellow-500" />
                                <span>Neutralize System</span>
                            </div>
                            <form onSubmit={submitFlag} className="mt-4">
                                <input
                                    className="rl-flag-input"
                                    placeholder="SIGNATURE{...}"
                                    value={flag}
                                    onChange={e => setFlag(e.target.value)}
                                    disabled={isCorrect}
                                />
                                <button
                                    className={`rl-submit-btn ${isCorrect ? 'success' : ''}`}
                                    disabled={isSubmitting || isCorrect}
                                >
                                    {isSubmitting ? <Loader2 className="animate-spin" /> : isCorrect ? 'COMMITTED' : 'SUBMIT SIGNATURE'}
                                </button>
                                {msg && (
                                    <div className={`mt-3 flex items-center gap-2 text-[10px] font-bold ${isCorrect ? 'text-green-400' : 'text-red-400'}`}>
                                        {isCorrect ? <CheckCircle2 size={12} /> : <AlertCircle size={12} />}
                                        {msg}
                                    </div>
                                )}
                            </form>
                        </div>

                        <AiMentorPopup command={lastCommand} />
                    </aside>
                </div>
            </PageTemplate>

            {/* Simulated Web View Overlay */}
            {showWebTarget && (
                <div className="rl-web-target-overlay">
                    <div className="rl-web-target-modal">
                        <div className="rl-web-header">
                            <div className="flex gap-2">
                                <div className="w-3 h-3 rounded-full bg-red-500/50" />
                                <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
                                <div className="w-3 h-3 rounded-full bg-green-500/50" />
                            </div>
                            <span className="text-[10px] font-mono text-gray-500">HTTPS://SECURE-OPS.LOCAL/TARGET-UPLINK</span>
                            <button onClick={() => setShowWebTarget(false)} className="text-gray-500 hover:text-white transition-colors">✕</button>
                        </div>
                        <div className="rl-web-content">
                            {/* Sub-component based on challenge title */}
                            <ChallengeSimulation title={chal.title} />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

// Simulated targets for the 4 Insane challenges
function ChallengeSimulation({ title }) {
    const [heistState, setHeistState] = useState({
        interceptEnabled: false,
        interceptedRequest: null,
        showBurp: false,
        burpTab: 'intercept',
        isAttacking: false,
        attackProgress: 0,
        attackFinished: false,
        signatures: 0
    });

    const handleInterceptToggle = () => {
        setHeistState(prev => ({ ...prev, interceptEnabled: !prev.interceptEnabled }));
    };

    const handleAuthorize = () => {
        if (heistState.interceptEnabled) {
            setHeistState(prev => ({
                ...prev,
                interceptedRequest: {
                    method: 'POST',
                    url: '/api/v1/swift/approve',
                    body: '{"transaction_id": "99128", "signatures": 1}',
                    headers: { 'Content-Type': 'application/json', 'X-Auth-Token': 'REDACTED' }
                },
                showBurp: true,
                burpTab: 'intercept'
            }));
        } else {
            alert("Authorization failed: Missing signatures.");
        }
    };

    const runTurboAttack = () => {
        setHeistState(prev => ({ ...prev, isAttacking: true, attackProgress: 0 }));
        let progress = 0;
        const interval = setInterval(() => {
            progress += 10;
            setHeistState(prev => ({ ...prev, attackProgress: progress }));
            if (progress >= 100) {
                clearInterval(interval);
                setHeistState(prev => ({
                    ...prev,
                    isAttacking: false,
                    attackFinished: true,
                    signatures: 3
                }));
            }
        }, 200);
    };

    if (title.includes("Blackout")) {
        return (
            <div className="p-8 h-full flex flex-col items-center justify-center bg-[#050505]">
                <div className="grid grid-cols-2 gap-8 w-full max-w-2xl">
                    <div className="p-6 border-2 border-yellow-500/20 rounded-xl bg-yellow-500/[0.02]">
                        <h4 className="text-yellow-500 font-bold mb-4 uppercase tracking-tighter">GRID_LOAD_STABILITY</h4>
                        <div className="h-32 flex items-end gap-2 px-2">
                            {[40, 60, 85, 95, 80, 70, 45].map((h, i) => (
                                <div key={i} className="flex-1 bg-yellow-500/20 border-t-2 border-yellow-500" style={{ height: `${h}%` }} />
                            ))}
                        </div>
                    </div>
                    <div className="p-6 border-2 border-red-500/20 rounded-xl bg-red-500/[0.02]">
                        <h4 className="text-red-500 font-bold mb-4 uppercase tracking-tighter">REACTOR_CORE_TEMP</h4>
                        <div className="text-4xl font-black text-red-500 animate-pulse">98.4°C</div>
                        <div className="text-[10px] text-red-400/50 mt-2 font-mono uppercase tracking-widest">CRITICAL EXPOSURE DETECTED</div>
                    </div>
                </div>
                <div className="mt-12 p-8 border-2 border-yellow-500/50 rounded-2xl bg-black">
                    <button className="px-12 py-4 bg-yellow-500 text-black font-black hover:bg-yellow-400 transition-all rounded shadow-[0_0_30px_rgba(234,179,8,0.4)]">
                        EMERGENCY SHUTDOWN [KILL_SWITCH]
                    </button>
                </div>
            </div>
        );
    }

    if (title.includes("Heist")) {
        return (
            <div className="h-full flex flex-col relative overflow-hidden">
                <div className="p-8 flex-1 flex flex-col bg-[#1a1a2e]">
                    <div className="bg-[#16213e] p-4 border-b border-white/10 flex justify-between items-center rounded-t-xl">
                        <span className="text-xl font-black text-white italic">AZURE BANKING</span>
                        <div className="flex gap-4 items-center">
                            <button
                                onClick={handleInterceptToggle}
                                className={`px-3 py-1 text-[10px] font-bold rounded flex items-center gap-2 border ${heistState.interceptEnabled ? 'bg-orange-500 text-white border-orange-400' : 'bg-gray-800 text-gray-500 border-gray-700'}`}
                            >
                                <Shield size={10} /> {heistState.interceptEnabled ? 'PROXY: INTERCEPT ON' : 'PROXY: INTERCEPT OFF'}
                            </button>
                            <div className="px-2 py-1 bg-green-500 text-black text-[10px] font-bold rounded">SECURE SWIFT GATEWAY</div>
                        </div>
                    </div>
                    <div className="flex-1 flex items-center justify-center p-12 bg-black/20">
                        <div className="w-full max-w-md p-8 bg-white/5 rounded-2xl border border-white/10 shadow-2xl backdrop-blur-xl">
                            <div className="flex justify-between items-center mb-6">
                                <h4 className="text-white font-bold uppercase tracking-widest opacity-80">Wire Transfer</h4>
                                <div className="text-[10px] font-mono text-yellow-500">
                                    AUTH_STATUS: {heistState.signatures}/3 SIGNATURES
                                </div>
                            </div>
                            <div className="space-y-4">
                                <label className="text-[10px] text-gray-500 font-bold block uppercase">Source Account</label>
                                <input className="w-full bg-black/40 border border-white/10 p-3 rounded text-white text-sm" value="SWIFT-7781-X99" readOnly />
                                <label className="text-[10px] text-gray-500 font-bold block uppercase">Recipient IBAN</label>
                                <input className="w-full bg-black/40 border border-white/10 p-3 rounded text-white text-sm" placeholder="GB 55 BK 300..." readOnly value="RECOVERY-VAL-099" />
                                <label className="text-[10px] text-gray-500 font-bold block uppercase">Amount (USD)</label>
                                <input className="w-full bg-black/40 border border-white/10 p-3 rounded text-white text-sm" value="$100,000,000.00" readOnly />
                                <button
                                    onClick={handleAuthorize}
                                    className={`w-full p-4 font-black transition-all rounded mt-4 ${heistState.signatures >= 3 ? 'bg-green-500 text-black cursor-default' : 'bg-white text-black hover:bg-yellow-500'}`}
                                >
                                    {heistState.signatures >= 3 ? 'TRANSFER AUTHORIZED' : 'AUTHORIZE & SIGN'}
                                </button>
                            </div>
                            <p className="text-[9px] text-gray-500 mt-6 text-center italic">Requires 3 separate authorized signatures.</p>
                        </div>
                    </div>
                </div>

                {/* Simulated Burp Suite Window */}
                {heistState.showBurp && (
                    <div className="absolute inset-x-8 bottom-8 top-20 bg-[#2d2d2d] border border-orange-500/50 rounded-lg shadow-[0_0_50px_rgba(255,165,0,0.2)] flex flex-col font-mono z-50">
                        <div className="bg-[#3d3d3d] p-2 flex justify-between items-center border-b border-black">
                            <div className="flex gap-4">
                                <span className="text-orange-500 font-bold text-xs px-2">BURP SUITE PROFESSIONAL v2024.1</span>
                                <div className="flex gap-2">
                                    {['intercept', 'repeater', 'turbo intruder'].map(tab => (
                                        <button
                                            key={tab}
                                            onClick={() => setHeistState(prev => ({ ...prev, burpTab: tab }))}
                                            className={`text-[10px] px-2 py-0.5 rounded capitalize ${heistState.burpTab === tab ? 'bg-orange-500 text-white' : 'text-gray-400 hover:text-white'}`}
                                        >
                                            {tab}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <button onClick={() => setHeistState(prev => ({ ...prev, showBurp: false }))} className="text-gray-500 hover:text-white px-2">✕</button>
                        </div>

                        <div className="flex-1 overflow-auto p-4 bg-[#1e1e1e] text-[11px] text-gray-300 scrollbar-hide">
                            {heistState.burpTab === 'intercept' && heistState.interceptedRequest && (
                                <div className="flex flex-col h-full">
                                    <div className="flex gap-4 mb-4">
                                        <button className="bg-orange-600 border border-orange-500 text-white px-4 py-1 rounded font-bold hover:bg-orange-500">Forward</button>
                                        <button className="bg-gray-700 border border-gray-600 px-4 py-1 rounded font-bold text-gray-400">Drop</button>
                                        <button
                                            onClick={() => setHeistState(prev => ({ ...prev, burpTab: 'turbo intruder' }))}
                                            className="ml-auto bg-blue-600/20 border border-blue-500 text-blue-400 px-4 py-1 rounded font-bold hover:bg-blue-600/40"
                                        >
                                            Action: Send to Turbo Intruder
                                        </button>
                                    </div>
                                    <div className="bg-[#0d0d0d] p-4 rounded border border-white/5 flex-1 font-mono">
                                        <div className="text-blue-400">{heistState.interceptedRequest.method} {heistState.interceptedRequest.url} HTTP/1.1</div>
                                        <div>Host: secure-ops.local</div>
                                        {Object.entries(heistState.interceptedRequest.headers).map(([k, v]) => (
                                            <div key={k}>{k}: {v}</div>
                                        ))}
                                        <div className="mt-4 text-orange-400">{heistState.interceptedRequest.body}</div>
                                    </div>
                                </div>
                            )}

                            {heistState.burpTab === 'turbo intruder' && (
                                <div className="flex flex-col h-full">
                                    <div className="grid grid-cols-2 gap-4 flex-1">
                                        <div className="bg-[#0d0d0d] p-4 rounded border border-white/5 font-mono text-[10px]">
                                            <div className="text-gray-500 mb-2">// Race Condition Script</div>
                                            <div className="text-purple-400">def queueRequests(target, wordlists):</div>
                                            <div className="pl-4 text-white">engine = RequestEngine(endpoint=target.endpoint,</div>
                                            <div className="pl-16 text-white text-orange-400">concurrentConnections=30)</div>
                                            <div className="pl-4 text-white mt-2">for i in range(50):</div>
                                            <div className="pl-8 text-white">engine.queue(target.req, i)</div>

                                            <button
                                                onClick={runTurboAttack}
                                                disabled={heistState.isAttacking}
                                                className="mt-8 w-full bg-blue-600 text-white p-2 rounded font-bold hover:bg-blue-500 transition-colors"
                                            >
                                                {heistState.isAttacking ? 'ATTACKING...' : 'RUN ATTACK'}
                                            </button>
                                        </div>
                                        <div className="bg-[#0d0d0d] p-4 rounded border border-white/5 font-mono text-[10px]">
                                            <div className="flex justify-between items-center mb-4">
                                                <span className="text-gray-500 uppercase tracking-widest text-[9px]">Attack Results</span>
                                                {heistState.isAttacking && <div className="bg-blue-900/40 h-1 flex-1 mx-4 rounded overflow-hidden"><div className="bg-blue-400 h-full transition-all duration-300" style={{ width: `${heistState.attackProgress}%` }} /></div>}
                                            </div>
                                            <div className="space-y-1">
                                                {heistState.attackFinished ? (
                                                    <>
                                                        <div className="text-green-400">#01 | 200 OK | 42 ms | Result: Authorize_1</div>
                                                        <div className="text-green-400 font-bold shadow-[0_0_10px_rgba(74,222,128,0.2)]">#02 | 200 OK | 42 ms | Result: Authorize_2 (RACE_SUCCESS)</div>
                                                        <div className="text-green-400 font-bold shadow-[0_0_10px_rgba(74,222,128,0.2)]">#03 | 200 OK | 43 ms | Result: Authorize_3 (RACE_SUCCESS)</div>
                                                        <div className="text-gray-600 mt-4 animate-pulse">--- RACE CONDITION DETECTED ---</div>
                                                        <div className="text-yellow-500 mt-2 font-black tracking-widest text-[9px]">TRANSACTION #99128 FULLY AUTHORIZED.</div>
                                                        <div className="text-blue-400 underline mt-2 cursor-pointer">Check workstation logs for master signature.</div>
                                                    </>
                                                ) : heistState.isAttacking ? (
                                                    <div className="flex items-center justify-center h-40">
                                                        <Loader2 className="animate-spin text-blue-500" size={32} />
                                                    </div>
                                                ) : (
                                                    <div className="text-gray-600 italic">No output. Run script to commence injection.</div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        );
    }

    if (title.includes("Chain Reaction")) {
        return (
            <div className="p-8 h-full flex flex-col bg-[#010b14] text-[#a8bbd3] font-mono">
                <div className="border-b border-[#303f4f] pb-4 mb-6 flex justify-between items-center text-sm font-bold">
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-[#32CD32] shadow-[0_0_8px_#32CD32]" />
                        <span>JENKINS // global-pipeline-steward</span>
                    </div>
                    <span className="text-[#32CD32] font-black">[BUILD_SUCCESS]</span>
                </div>
                <div className="grid grid-cols-4 gap-4 mb-8">
                    {[1, 2, 3, 4].map(i => (
                        <div key={i} className="p-4 border border-[#303f4f] bg-[#0d151e] rounded flex flex-col items-center">
                            <div className="text-[10px] mb-2 opacity-50">NODE_B_0{i}</div>
                            <div className="w-8 h-8 rounded bg-[#32CD32]/20 border border-[#32CD32] animate-pulse flex items-center justify-center">
                                <CheckCircle2 size={14} className="text-[#32CD32]" />
                            </div>
                        </div>
                    ))}
                </div>
                <div className="flex-1 p-6 bg-[#0d151e] rounded border border-[#303f4f] overflow-y-auto scrollbar-hide">
                    <div className="text-[11px] space-y-2 font-mono">
                        <p className="opacity-40">09:14:02 [INFO] Fetching upstream dependencies...</p>
                        <p className="opacity-40">09:14:05 [INFO] Commencing SonarQube v8.4 analysis...</p>
                        <p className="text-[#32CD32] font-bold">09:14:12 [SUCCESS] Static Code Analysis: 0 Critical, 0 Major</p>
                        <p className="text-yellow-500 animate-pulse">09:14:15 [WARN] Unknown hook detected: ./scripts/pre-compile.sh</p>
                        <p className="opacity-40">09:14:20 [INFO] Wrapping binaries for PRODUCTION...</p>
                        <p className="opacity-40">09:14:25 [INFO] Deployment to Sector-7 complete.</p>
                        <p className="text-blue-400 mt-4 underline cursor-pointer">View Build Artifacts (.zip)</p>
                    </div>
                </div>
            </div>
        );
    }

    if (title.includes("Patient Zero")) {
        return (
            <div className="p-12 h-full flex flex-col bg-[#111] text-red-500 font-mono">
                <div className="border-4 border-red-500/50 p-8 rounded-xl bg-red-500/5 backdrop-blur-sm">
                    <h1 className="text-6xl font-black mb-4">SYSTEM_ENCRYPTED</h1>
                    <p className="text-xl mb-8">All your hospital records have been locked by DARK_SIDE_2.0.</p>
                    <div className="grid grid-cols-2 gap-8 text-left mb-12">
                        <div className="p-4 bg-black/50 border border-red-500/30">
                            <h4 className="font-bold mb-2">TIME LEFT</h4>
                            <div className="text-3xl font-black">23:59:42</div>
                        </div>
                        <div className="p-4 bg-black/50 border border-red-500/30">
                            <h4 className="font-bold mb-2">BTC ADDRESS</h4>
                            <div className="text-xs break-all">1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa</div>
                        </div>
                    </div>
                    <div className="bg-red-500 text-black p-4 font-black text-center text-2xl animate-bounce">
                        PULSE CHECK: 0 BPM DETECTED
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="p-20 text-center opacity-40">
            <Globe size={100} className="mx-auto mb-8" />
            <h2 className="text-4xl font-black">ENVIRONMENT OFFLINE</h2>
            <p className="mt-4 text-xl">TARGET SYSTEMS ARE CURRENTLY INACCESSIBLE THROUGH THIS UPLINK.</p>
        </div>
    );
}
