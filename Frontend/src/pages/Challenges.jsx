import React, { useState, useEffect } from "react";
import { API_BASE } from "../config";
import { Link } from "react-router-dom";
import {
  Target, Shield, Search, Lock, CheckCircle2,
  Trophy, Activity, Terminal, Zap, Eye, FileUp,
  Filter, ChevronRight, Orbit, Cpu, Globe, Radio,
  Layers, Flame, Sword, ShieldAlert
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import PageTemplate from "../components/templates/PageTemplate";
import { ROUTES } from "../config/routes.config";
import './Challenges.css';

export default function Challenges({ initialView = "all" }) {
  const [challenges, setChallenges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDifficulty, setFilterDifficulty] = useState("All");

  const isRed = initialView === "red-roadmap";
  const isBlue = initialView === "blue-roadmap";

  useEffect(() => {
    fetchChallenges();
  }, [initialView]);

  const fetchChallenges = async () => {
    setLoading(true);
    try {
      const resp = await fetch(`${API_BASE}/challenges/`);
      if (!resp.ok) throw new Error("Failed to fetch");
      const data = await resp.json();

      let filtered = data;
      if (isRed) {
        filtered = data.filter(c => !c.category?.toLowerCase().includes("blue") && !c.category?.toLowerCase().includes("real"));
      } else if (isBlue) {
        filtered = data.filter(c => c.category?.toLowerCase().includes("blue") || c.category?.toLowerCase().includes("forensics"));
      }

      setChallenges(filtered);
    } catch (err) {
      console.error(err);
      setChallenges([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredChallenges = challenges.filter(c => {
    const matchesSearch = c.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDiff = filterDifficulty === "All" || c.difficulty === filterDifficulty;
    return matchesSearch && matchesDiff;
  });

  const getChallengeLink = (challenge) => {
    const cat = challenge.category?.toLowerCase() || '';
    if (cat.includes('blue') || cat.includes('forensics')) {
      return `${ROUTES.BLUE_TEAM.BASE}/challenge/${challenge.id}`;
    }
    if (cat.includes('real') || cat.includes('corporate')) {
      return `${ROUTES.REAL_LIFE.BASE}/challenge/${challenge.id}`;
    }
    return `${ROUTES.RED_TEAM.BASE}/challenge/${challenge.id}`;
  };

  const getCategoryIcon = (category) => {
    const cat = category?.toLowerCase() || '';
    if (cat.includes('web')) return <Globe size={48} />;
    if (cat.includes('pwn') || cat.includes('linux')) return <Terminal size={48} />;
    if (cat.includes('ai')) return <Cpu size={48} />;
    if (cat.includes('forensic') || cat.includes('blue')) return <Shield size={48} />;
    if (cat.includes('crack') || cat.includes('hash')) return <Zap size={48} />;
    return <Sword size={48} />;
  };

  if (loading) {
    return (
      <div className="flex-center" style={{ height: "60vh", color: isRed ? 'var(--accent-red)' : 'var(--accent-blue)' }}>
        <Terminal className="animate-pulse" size={48} />
      </div>
    );
  }

  return (
    <div className={`challenges-hud-container ${isRed ? 'red-protocol-theme' : 'blue-protocol-theme'}`}>
      <PageTemplate fullWidth>
        {/* Protocol Hero */}
        <header className="protocol-hero">
          <div className="protocol-header">
            <div className="hero-text">
              <div className="breadcrumb">
                PLATFORM // <span className="highlight">{isRed ? 'RED_PROTOCOL' : 'BLUE_PROTOCOL'}</span>
              </div>
              <h1 className="protocol-title">
                {isRed ? 'OFFENSIVE' : 'DEFENSIVE'} <span className="outline">OPERATIONS</span>
              </h1>
            </div>
            <div className="user-energy">
              <Activity size={16} />
              <span>ACTIVE_NODES: {challenges.length}</span>
            </div>
          </div>
        </header>

        {/* Control Deck */}
        <div className="challenge-control-deck">
          <div className="deck-search">
            <Search size={18} className="deck-icon" />
            <input
              className="deck-input"
              placeholder="Scan for mission identifiers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="deck-filters">
            {['All', 'Easy', 'Medium', 'Hard', 'Insane'].map(diff => (
              <button
                key={diff}
                onClick={() => setFilterDifficulty(diff)}
                className={`deck-filter-btn ${filterDifficulty === diff ? 'active' : ''}`}
              >
                {diff}
              </button>
            ))}
          </div>
        </div>

        {/* Node Grid */}
        <div className="challenges-nodes-grid">
          <AnimatePresence>
            {filteredChallenges.map((c, i) => (
              <motion.div
                key={c.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.2, delay: i * 0.04 }}
              >
                <Link to={getChallengeLink(c)} className="challenge-node-card">
                  <div className="node-glow"></div>
                  <div className="node-header">
                    <div className="node-tier">TIER_{c.difficulty?.toUpperCase()}</div>
                    <div className="node-points">
                      <Trophy size={14} />
                      <span>{c.points} XP</span>
                    </div>
                  </div>

                  <div className="node-visual-box">
                    <div className="node-icon-glow"></div>
                    <div style={{ opacity: 0.8, color: 'var(--accent)' }}>
                      {getCategoryIcon(c.category)}
                    </div>
                  </div>

                  <div className="node-body">
                    <h3 className="node-title">{c.title}</h3>
                    <p className="node-desc">{c.description}</p>
                  </div>

                  <div className="node-footer">
                    <div className="node-cat">{c.category || 'GENERAL'}</div>
                    <button className="btn-deploy">
                      <span>INITIATE_OPS</span>
                      <ChevronRight size={14} />
                    </button>
                  </div>
                </Link>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {filteredChallenges.length === 0 && (
          <div style={{ textAlign: 'center', padding: '5rem', color: 'var(--text-muted)', border: '1px dashed rgba(255,255,255,0.05)', borderRadius: '12px' }}>
            <ShieldAlert size={48} style={{ marginBottom: '1rem', opacity: 0.2 }} />
            <p style={{ fontSize: '14px', fontWeight: '700' }}>NO ACTIVE OPERATIONS DETECTED IN THIS SECTOR</p>
          </div>
        )}
      </PageTemplate>
    </div>
  );
}
