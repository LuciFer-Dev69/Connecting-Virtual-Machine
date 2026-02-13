import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import WebTerminal from "../components/WebTerminal";
import { API_BASE } from "../config";
import {
  Terminal, Shield, Zap, Info, Flag, ChevronRight,
  Loader2, AlertCircle, CheckCircle2, Lightbulb, Play
} from "lucide-react";
import PageTemplate from "../components/templates/PageTemplate";
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
  const user = JSON.parse(localStorage.getItem("user") || "{}");

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
        body: JSON.stringify({ user_id: user.user_id, challenge_id: Number(id), flag })
      });
      const data = await res.json();
      setMsg(data.status === "success" ? "Operation Successful: Flag Accepted" : (data.message || "Invalid Flag"));
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

  const [pwnboxInfo, setPwnboxInfo] = useState(null);
  const [isSpawning, setIsSpawning] = useState(false);

  const toggleTerminal = async () => {
    if (!showTerminal && !pwnboxInfo) {
      setIsSpawning(true);
      try {
        const res = await fetch(`${API_BASE}/pwnbox/spawn`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ user_id: user.user_id })
        });
        const data = await res.json();
        setPwnboxInfo(data);
      } catch (e) {
        console.error("PwnBox spawn error:", e);
      } finally {
        setIsSpawning(false);
      }
    }
    setShowTerminal(!showTerminal);
  };

  if (!chal) {
    return (
      <div className="flex-center" style={{ height: "400px", color: "var(--accent-blue)" }}>
        <Loader2 className="animate-spin" size={48} />
      </div>
    );
  }

  const isCorrect = msg && msg.includes("Successful");
  const isRed = chal.category?.toLowerCase().includes("red") || !chal.category?.toLowerCase().includes("blue");

  return (
    <div className={`challenge-page-wrapper ${isRed ? 'red-mission' : 'blue-mission'}`} style={{ display: 'flex', flexDirection: 'column', height: '100%', overflowY: 'auto' }}>
      <PageTemplate
        title={chal.title}
        subtitle={`Mission ID: SEC-${chal.id.toString().padStart(4, '0')} // Operational Sector: ${chal.category}`}
        actions={
          <button
            className="btn-submit"
            onClick={toggleTerminal}
            disabled={isSpawning}
            style={{ padding: '8px 16px', fontSize: '14px', background: showTerminal ? 'var(--brand-danger)' : 'var(--accent-blue)' }}
          >
            {isSpawning ? <><Loader2 className="animate-spin" size={18} /> Syncing Node...</> :
              showTerminal ? <><Terminal size={18} /> Exit Environment</> : <><Play size={18} /> Deploy PwnBox</>}
          </button>
        }
      >
        <div className="challenge-view-container">
          <div className="challenge-main-col">
            {showTerminal ? (
              <div className="pwnbox-deployment">
                <div className="pwnbox-bar">
                  <span className="terminal-path">
                    {pwnboxInfo ? (
                      <span style={{ color: 'var(--accent-blue)' }}>
                        {pwnboxInfo.user}@chakraview:~/ops# <span style={{ color: '#64748b', marginLeft: '10px' }}>[CREDENTIALS // USER: {pwnboxInfo.user} PASS: {pwnboxInfo.password}]</span>
                      </span>
                    ) : 'Establishing Neural Uplink...'}
                  </span>
                  <div style={{ display: 'flex', gap: '6px' }}>
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#ff5f56' }} />
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#ffbd2e' }} />
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#27c93f' }} />
                  </div>
                </div>
                <div style={{ flex: 1, background: '#000' }}>
                  <WebTerminal connectionInfo={pwnboxInfo} onExit={() => setShowTerminal(false)} challenge_id={id} />
                </div>
              </div>
            ) : (
              <div className="mission-card">
                <div className="mission-header">
                  <div className="mission-meta">
                    <span className="meta-item">{chal.category}</span>
                    <span className="meta-item">{chal.difficulty}</span>
                    <span className="meta-item">{chal.points} XP</span>
                  </div>
                </div>
                <div className="mission-objective">
                  <h3><Info size={20} className="text-primary" /> MISSION_BRIEFING</h3>
                  <div className="mission-description">{chal.description}</div>
                </div>

                <div className="recommended-tools" style={{ marginTop: '2rem' }}>
                  <h4 style={{ fontSize: '11px', fontWeight: '800', color: 'var(--text-muted)', marginBottom: '12px', textTransform: 'uppercase' }}>Recommended Arsenal</h4>
                  <div className="tools-list">
                    {["ssh", "nmap", "cat", "grep", "curl", "base64"].map(tool => (
                      <span key={tool} className="tool-tag">{tool}</span>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          <aside className="challenge-sidebar">
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
                <div className="intel-text">{hint}</div>
              ) : (
                <button className="btn-outline" onClick={getHint} style={{ width: '100%', fontSize: '12px' }}>
                  REQUEST INTEL DISCLOSURE
                </button>
              )}
            </div>
          </aside>
        </div>
      </PageTemplate>
    </div>
  );
}
