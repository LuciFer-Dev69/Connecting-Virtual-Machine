import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import FakeTerminal from "../components/FakeTerminal";
import AiMentorPopup from "../components/AiMentorPopup";
import { API_BASE } from "../config";
import {
  Terminal, Shield, Zap, Info, Flag, ChevronRight,
  Loader2, AlertCircle, CheckCircle2, Lightbulb, Play,
  Globe, Activity, ShieldCheck, Sword, ShieldAlert
} from "lucide-react";
import PageTemplate from "../components/templates/PageTemplate";
import { LAB_DOCS } from "../data/labDocs";
import './Challenge.css';

export default function Challenge() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [chal, setChal] = useState(null);
  const [flag, setFlag] = useState("");
  const [msg, setMsg] = useState("");
  const [hint, setHint] = useState(null);
  const [showTerminal, setShowTerminal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user") || "{}"));
  const [showWalkthrough, setShowWalkthrough] = useState(false);
  const [lastCommand, setLastCommand] = useState("");

  const handleCommandExplainer = React.useCallback((cmd) => {
    setLastCommand(cmd);
  }, []);

  const handleTerminalExit = React.useCallback(() => {
    setShowTerminal(false);
  }, []);

  useEffect(() => {
    const handleStorage = () => setUser(JSON.parse(localStorage.getItem("user") || "{}"));
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  useEffect(() => {
    fetch(`${API_BASE}/challenges/${id}`)
      .then(r => r.json())
      .then(data => {
        if (!data || data.error) {
          navigate(-1);
        } else {
          setChal(data);
        }
      })
      .catch(() => navigate(-1));
  }, [id]);

  const submitFlag = async (e) => {
    e.preventDefault();
    if (!flag.trim()) return;
    setIsSubmitting(true);
    setMsg("");

    try {
      const res = await fetch(`${API_BASE}/challenges/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: user.user_id, id: Number(id), flag })
      });
      const data = await res.json();

      if (data.result && data.result.includes("Correct")) {
        setMsg("Congratulation! Flag matched 🌸");

        // Update local XP for immediate feedback
        const updatedUser = { ...user, progress: (user.progress || 0) + (chal.points || 0) };
        localStorage.setItem("user", JSON.stringify(updatedUser));

        // Trigger a custom event to notify RootLayout/Header
        window.dispatchEvent(new Event('storage'));
      } else {
        setMsg(data.result || "Don't try to fool me!");
      }
    } catch (err) {
      setMsg("Connection error. Try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const getHint = async () => {
    try {
      const res = await fetch(`${API_BASE}/challenges/hint`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: user.user_id, challenge_id: Number(id) })
      });
      const data = await res.json();
      if (res.ok) {
        setHint(data.hint);
      } else {
        setMsg(data.message || "Information restricted.");
      }
    } catch (e) {
      setMsg("Intel retrieval failed.");
    }
  };

  const [labInfo, setLabInfo] = useState(null);
  const [isSpawningLab, setIsSpawningLab] = useState(false);
  const [pwnboxInfo, setPwnboxInfo] = useState(null);
  const [isSpawning, setIsSpawning] = useState(false);

  const toggleTerminal = () => {
    setShowTerminal(!showTerminal);
  };

  const spawnLab = async () => {
    setIsSpawningLab(true);
    setMsg("");
    try {
      // For now, we simulate or use the generic start endpoint if available
      // Since these are new challenges, we'll simulate the environment setup for the teacher demo
      setTimeout(() => {
        setLabInfo({
          url: "http://target.local",
          ip: "10.10.12.34",
          status: "ONLINE"
        });
        setIsSpawningLab(false);
        setMsg("Target environment deployed successfully at http://target.local");
      }, 2000);
    } catch (e) {
      setMsg("Mission deployment failed.");
      setIsSpawningLab(false);
    }
  };

  if (!chal) {
    return (
      <div className="flex-center" style={{ height: "400px", color: "var(--accent-blue)" }}>
        <Loader2 className="animate-spin" size={48} />
      </div>
    );
  }

  const isCorrect = msg && msg.includes("matched");
  const isRed = chal.category?.toLowerCase().includes("red") || !chal.category?.toLowerCase().includes("blue");

  return (
    <div className={`challenge-page-wrapper ${isRed ? 'red-mission' : 'blue-mission'}`} style={{ display: 'flex', flexDirection: 'column', height: '100%', overflowY: 'auto' }}>
      <PageTemplate
        title={<div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {isRed ? <Sword size={24} className="text-red" /> : <ShieldAlert size={24} className="text-blue" />}
          {chal.title}
        </div>}
        subtitle={`${isRed ? 'OFFENSOR' : 'PROTECTOR'}_PROTOCOL_ID: SEC-${chal.id.toString().padStart(4, '0')} // Sector: ${chal.category}`}
        actions={
          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              className="btn-submit"
              onClick={spawnLab}
              disabled={isSpawningLab}
              style={{ padding: '8px 16px', fontSize: '13px', background: 'var(--accent-purple)', border: 'none' }}
            >
              {isSpawningLab ? <><Loader2 className="animate-spin" size={16} /> Spawning Target...</> :
                labInfo ? <><Globe size={16} /> Target: {labInfo.ip}</> : <><Play size={16} /> Spawn Lab Target</>}
            </button>
            <button
              className="btn-submit"
              onClick={toggleTerminal}
              disabled={isSpawning}
              style={{ padding: '8px 16px', fontSize: '13px', background: showTerminal ? 'var(--brand-danger)' : 'var(--accent-blue)', border: 'none' }}
            >
              {isSpawning ? <><Loader2 className="animate-spin" size={16} /> Syncing Node...</> :
                showTerminal ? <><Terminal size={16} /> Exit Terminal</> : <><Terminal size={16} /> Deploy PwnBox</>}
            </button>
          </div>
        }
      >
        <div className="challenge-view-container">
          <div className="challenge-main-col">
            <div className="mission-card">
              <div className="mission-header">
                <div className="mission-meta">
                  <span className="meta-item">{chal.category}</span>
                  <span className="meta-item">{chal.difficulty}</span>
                  <span className="meta-item" style={{ color: 'var(--color-success)', fontWeight: '900' }}>{chal.points} XP REWARD</span>
                </div>
              </div>

              {labInfo && (
                <div className="target-info-banner" style={{
                  background: 'rgba(168, 85, 247, 0.1)',
                  border: '1px solid var(--accent-purple)',
                  borderRadius: '8px',
                  padding: '16px',
                  marginBottom: '24px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <div>
                    <div style={{ fontSize: '10px', textTransform: 'uppercase', color: 'var(--accent-purple)', fontWeight: '900', marginBottom: '4px' }}>Target Uplink Active</div>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: '18px', fontWeight: '700', color: '#fff' }}>{labInfo.url}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '10px', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: '900', marginBottom: '4px' }}>Infrastructure IP</div>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: '14px', color: 'var(--accent-purple)' }}>{labInfo.ip}</div>
                  </div>
                </div>
              )}



              <div className="mission-objective">
                <h3><Info size={20} className="text-primary" /> MISSION_BRIEFING</h3>
                <div className="mission-description" style={{ fontSize: '16px', lineHeight: '1.8', color: '#e2e8f0' }}>{chal.description}</div>
              </div>

              <div className="recommended-tools" style={{ marginTop: '2rem' }}>
                <h4 style={{ fontSize: '11px', fontWeight: '800', color: 'var(--text-muted)', marginBottom: '12px', textTransform: 'uppercase' }}>Recommended Arsenal</h4>
                <div className="tools-list">
                  {isRed
                    ? ["nmap", "gobuster", "curl", "unzip", "nano", "cat"].map(tool => (
                      <span key={tool} className="tool-tag">{tool}</span>
                    ))
                    : ["ps aux", "kill", "ls -la", "cat", "grep", "id"].map(tool => (
                      <span key={tool} className="tool-tag blue">{tool}</span>
                    ))
                  }
                </div>
              </div>

              {showTerminal && (
                <div className="pwnbox-deployment" style={{ marginTop: '32px', height: '400px' }}>
                  <div className="pwnbox-bar">
                    <span className="terminal-path">
                      <span style={{ color: 'var(--accent-blue)' }}>
                        chakra@chakraview:~/ops# <span style={{ color: '#64748b', marginLeft: '10px' }}>[Neural Uplink: STABLE]</span>
                      </span>
                    </span>
                    <div style={{ display: 'flex', gap: '6px' }}>
                      <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#ff5f56' }} />
                      <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#ffbd2e' }} />
                      <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#27c93f' }} />
                    </div>
                  </div>
                  <div style={{ flex: 1, background: '#000', overflow: 'hidden', position: 'relative' }}>
                    <FakeTerminal
                      challenge_title={chal.title}
                      category={chal.category}
                      onExit={handleTerminalExit}
                      onCommand={handleCommandExplainer}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Dynamic Documentation Section */}
            {(LAB_DOCS[chal.title]) && (
              <div className="mission-card" style={{ marginTop: '24px', borderTop: `4px solid ${isRed ? 'var(--accent-red)' : 'var(--accent-blue)'}` }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: isRed ? 'var(--accent-red)' : 'var(--accent-blue)', fontWeight: '800', fontSize: '14px', textTransform: 'uppercase', marginBottom: '16px' }}>
                  {isRed ? <Sword size={20} /> : <ShieldCheck size={20} />} DOCUMENTATION & WALKTHROUGH
                </div>

                <div className="baby-docs">
                  {LAB_DOCS[chal.title].sections.map((section, idx) => (
                    <div key={idx} style={{ marginBottom: '20px' }}>
                      {section.type === "text" && (
                        <p style={{ fontSize: '15px', color: '#94a3b8', lineHeight: '1.7', borderLeft: '2px solid #1e293b', paddingLeft: '15px' }}>
                          {section.content}
                        </p>
                      )}

                      {section.type === "subtitle" && (
                        <h4 style={{
                          fontSize: '13px',
                          fontWeight: '800',
                          color: '#fff',
                          marginTop: '24px',
                          marginBottom: '12px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px'
                        }}>
                          <ChevronRight size={14} className="text-primary" /> {section.content}
                        </h4>
                      )}

                      {section.type === "terminal" && (
                        <div style={{
                          background: '#0a0a0a',
                          borderRadius: '6px',
                          border: '1px solid #1e293b',
                          padding: '12px',
                          fontFamily: 'var(--font-mono)',
                          fontSize: '13px',
                          marginTop: '8px'
                        }}>
                          <div style={{ color: 'var(--accent-blue)', marginBottom: '4px' }}>
                            <span style={{ color: 'var(--color-success)', marginRight: '8px' }}>$</span>
                            {section.command}
                          </div>
                          {section.output && (
                            <div style={{ color: '#475569', fontSize: '12px', whiteSpace: 'pre-wrap' }}>
                              {section.output}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                <div style={{
                  marginTop: '20px',
                  paddingTop: '20px',
                  borderTop: '1px solid #1e293b',
                  fontSize: '12px',
                  color: '#64748b',
                  fontStyle: 'italic'
                }}>
                  * This guide is designed for educational purposes. Always follow ethical hacking guidelines.
                </div>
              </div>
            )}
          </div>

          <aside className="challenge-sidebar">
            <div className="widget-card">
              <div className="widget-title"><Activity size={18} className="text-primary" /> Operative Stats</div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '12px' }}>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>CURRENT_XP</div>
                <div style={{ fontSize: '16px', fontWeight: '800', color: 'var(--color-success)' }}>{user.progress || 0}</div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '8px' }}>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>RANKING</div>
                <div style={{ fontSize: '14px', fontWeight: '700', color: '#fff' }}>#42</div>
              </div>
            </div>

            <div className="widget-card">
              <div className="widget-title"><Flag size={18} className="text-primary" /> Neutralize Threat</div>
              <form onSubmit={submitFlag} className="flag-input-group">
                <input
                  className="flag-input"
                  placeholder="CHAKRA{...}"
                  value={flag}
                  onChange={e => setFlag(e.target.value)}
                  disabled={isCorrect}
                />
                <button
                  type="submit"
                  className={`btn-submit ${isCorrect ? 'success' : ''}`}
                  disabled={isSubmitting || isCorrect || !flag.trim()}
                >
                  {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : isCorrect ? 'COMMITTED' : 'SUBMIT FLAG'}
                </button>
              </form>
              {msg && (
                <div className={`submission-msg ${isCorrect ? 'success' : 'error'}`}>
                  {isCorrect ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
                  {msg}
                </div>
              )}
            </div>

            <div className="widget-card">
              <div className="widget-title"><Lightbulb size={18} className="text-primary" /> Mission Intel</div>
              {hint ? (
                <div className="intel-text">
                  {hint}
                  <button
                    className="btn-outline"
                    onClick={() => setShowWalkthrough(true)}
                    style={{ width: '100%', fontSize: '11px', marginTop: '12px', borderColor: 'var(--accent-purple)', color: 'var(--accent-purple)' }}
                  >
                    VIEW OPERATION WALKTHROUGH
                  </button>
                </div>
              ) : (
                <button className="btn-outline" onClick={getHint} style={{ width: '100%', fontSize: '12px' }}>
                  REQUEST INTEL DISCLOSURE
                </button>
              )}
            </div>

            <AiMentorPopup command={lastCommand} />
          </aside>
        </div>

        {/* Walkthrough Modal Overlay */}
        {showWalkthrough && (
          <div style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(0,0,0,0.85)', zIndex: 9999,
            display: 'flex', justifyContent: 'center', alignItems: 'center',
            backdropFilter: 'blur(8px)', padding: '40px'
          }}>
            <div className="card" style={{
              width: '100%', maxWidth: '800px', maxHeight: '90vh',
              overflowY: 'auto', position: 'relative', padding: '32px',
              border: '1px solid var(--accent-purple)',
              boxShadow: '0 0 30px rgba(168, 85, 247, 0.2)',
              background: '#111827'
            }}>
              <button
                onClick={() => setShowWalkthrough(false)}
                style={{ position: 'absolute', top: '20px', right: '20px', background: 'transparent', border: 'none', color: '#64748b', cursor: 'pointer', fontSize: '14px' }}
              >
                ✕ Close
              </button>

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: isRed ? 'var(--brand-danger)' : 'var(--accent-blue)', fontWeight: '800', fontSize: '12px', textTransform: 'uppercase', marginBottom: '8px' }}>
                <Zap size={16} /> Tactical Walkthrough
              </div>
              <h2 style={{ fontSize: '24px', fontWeight: '800', marginBottom: '24px', color: '#fff' }}>{LAB_DOCS[chal.title]?.title}</h2>

              <div className="walkthrough-content">
                {LAB_DOCS[chal.title]?.sections.map((section, idx) => (
                  <div key={idx} style={{ marginBottom: '24px' }}>
                    {section.type === "text" && <p style={{ fontSize: '15px', color: '#94a3b8', lineHeight: '1.7' }}>{section.content}</p>}
                    {section.type === "subtitle" && <h4 style={{ fontSize: '14px', fontWeight: 'bold', color: 'var(--accent-blue)', margin: '20px 0 10px', textTransform: 'uppercase' }}>{section.content}</h4>}
                    {section.type === "terminal" && (
                      <div style={{ background: '#000', borderRadius: '8px', border: '1px solid #1e293b', overflow: 'hidden', margin: '12px 0' }}>
                        <div style={{ background: '#1e293b', padding: '6px 12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ fontSize: '10px', fontFamily: 'monospace', color: '#94a3b8' }}>SHELL_COMMAND</span>
                        </div>
                        <div style={{ padding: '16px', fontFamily: 'var(--font-mono)', fontSize: '13px' }}>
                          <div style={{ color: 'var(--color-success)' }}>$ {section.command}</div>
                          {section.output && <div style={{ color: '#64748b', marginTop: '8px', whiteSpace: 'pre-wrap' }}>{section.output}</div>}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </PageTemplate >
    </div >
  );
}
