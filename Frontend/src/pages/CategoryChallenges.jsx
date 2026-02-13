import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { API_BASE } from "../config";
import { Check, Lock, Play, RotateCcw, ChevronRight, Target, Activity, Shield } from "lucide-react";
import PageTemplate from "../components/templates/PageTemplate";
import { motion } from "framer-motion";
import './CategoryChallenges.css';

const LEVELS_MAP = {
  1: "Infiltration Protocol",
  2: "Baseline Reconnaissance",
  3: "Vulnerability Assessment",
  4: "Exploitation Phase",
  5: "Privilege Escalation",
  6: "Network Lateral Movement",
  7: "Data Exfiltration",
  8: "Persistence Tactics",
  9: "Encryption Cracking",
  10: "System Takeover"
};

export default function CategoryChallenges({ category: categoryProp }) {
  const { category: categoryParam } = useParams();
  const category = categoryProp || categoryParam;
  const [chals, setChals] = useState([]);
  const [completedLevels, setCompletedLevels] = useState(new Set());
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  useEffect(() => {
    fetchChallenges();
    fetchCompletedLevels();
  }, [category]);

  const fetchChallenges = () => {
    fetch(`${API_BASE}/challenges`)
      .then(r => r.json())
      .then(data => {
        const filtered = data.filter(c => c.category === category);
        setChals(filtered);
      })
      .catch(err => console.error("Fetch challenges error:", err));
  };

  const fetchCompletedLevels = async () => {
    try {
      const res = await fetch(`${API_BASE}/user/${user.user_id}/completed/${category}`);
      if (res.ok) {
        const data = await res.json();
        const levelsCompleted = new Set(data.map(c => c.level));
        setCompletedLevels(levelsCompleted);
      }
    } catch (err) {
      console.error("Could not fetch completed challenges:", err);
    }
  };

  const grouped = {};
  chals.forEach(c => {
    if (!grouped[c.level]) grouped[c.level] = c;
  });

  const isLevelUnlocked = (level) => true;

  const getPathClass = () => {
    const cat = category?.toLowerCase() || '';
    if (cat.includes('blue') || cat.includes('forensics')) return 'blue-path';
    if (cat.includes('ai')) return 'ai-path';
    return 'web-path';
  };

  return (
    <div className={`category-page-container ${getPathClass()}`}>
      <PageTemplate fullWidth>
        {/* Sector Hero */}
        <header className="protocol-hero">
          <div className="protocol-header">
            <div className="hero-text">
              <div className="breadcrumb">
                MISSION_SECTOR // <span className="highlight">{category?.toUpperCase()}</span>
              </div>
              <h1 className="protocol-title">
                {category} <span className="outline">PATHWAY</span>
              </h1>
            </div>
            <div className="user-energy">
              <Activity size={16} />
              <span>OPERATIONAL_NODES: {chals.length}</span>
            </div>
          </div>
        </header>

        <div className="roadmap-container">
          <div className="roadmap-line"></div>

          {Object.keys(LEVELS_MAP).map((lvl, index) => {
            const levelNum = Number(lvl);
            const challenge = grouped[levelNum];
            if (!challenge) return null;

            const locked = !isLevelUnlocked(levelNum);
            const isCompleted = completedLevels.has(levelNum);
            const isActive = !locked && !isCompleted;

            return (
              <motion.div
                key={lvl}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className={`roadmap-step`}
              >
                <div className={`roadmap-node ${isCompleted ? 'completed' : isActive ? 'active' : ''}`}>
                  <div className="node-ring"></div>
                  {isCompleted ? <Check size={28} /> : locked ? <Lock size={24} /> : (
                    <span style={{ fontSize: '1.2rem' }}>{levelNum}</span>
                  )}
                </div>

                <div className={`roadmap-card ${isActive ? 'level-active' : ''}`}>
                  <div className="card-glitch"></div>
                  <span className="level-tag">SECTOR_STATION_{levelNum}</span>
                  <h3>{LEVELS_MAP[lvl]}</h3>
                  <p>{challenge.description || "Infiltrate the target system using sector-specific vulnerabilities."}</p>

                  <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    {locked ? (
                      <div className="roadmap-btn disabled" style={{ opacity: 0.5, cursor: 'not-allowed' }}>
                        <Lock size={16} /> RESTRICTED_ACCESS
                      </div>
                    ) : (
                      <a
                        href={`#/challenge/${challenge.id}`}
                        className={`roadmap-btn ${isCompleted ? 'completed' : ''}`}
                      >
                        {isCompleted ? (
                          <><RotateCcw size={16} /> REBOOT_OP</>
                        ) : (
                          <><Play size={16} /> INITIATE_SYNC</>
                        )}
                      </a>
                    )}
                    {isCompleted && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent-blue)', fontSize: '11px', fontWeight: '800' }}>
                        <Shield size={14} /> CLEARANCE_GRANTED
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </PageTemplate>
    </div>
  );
}