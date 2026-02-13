import React, { useEffect, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Zap, Shield, Cpu, Target, Award, Terminal, Activity, TrendingUp, User, Layout, ChevronRight, BarChart3, Clock, Trophy, MapPin, Calendar, Lock
} from 'lucide-react';
import { API_BASE } from "../config";
import { ROUTES } from "../config/routes.config";
import PageTemplate from "../components/templates/PageTemplate";
import './Dashboard.css';

export default function Dashboard() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const [stats, setStats] = useState({ beginner: 0, intermediate: 0, advanced: 0, total_challenges: 0 });
  const [leaderboard, setLeaderboard] = useState([]);
  const [activeLabs, setActiveLabs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userId = user.user_id || user.id;
    if (!userId) return;

    setLoading(true);
    const fetchData = async () => {
      try {
        // Fetch Leaderboard
        const lbRes = await fetch(`${API_BASE}/user/leaderboard`);
        if (lbRes.ok) {
          const data = await lbRes.json();
          setLeaderboard(Array.isArray(data) ? data.slice(0, 5) : []);
        }

        // Fetch Stats
        const statsRes = await fetch(`${API_BASE}/user/${userId}/stats`);
        if (statsRes.ok) {
          const data = await statsRes.json();
          setStats(data);
        }

        // Fetch Recent Challenges
        const challengesRes = await fetch(`${API_BASE}/challenges`);
        if (challengesRes.ok) {
          const data = await challengesRes.json();
          setActiveLabs(data.slice(0, 4));
        }
      } catch (err) {
        console.error("Dashboard fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user.user_id, user.id]);

  const progress = user?.progress || 0;
  const level = Math.floor(progress / 20) + 1;
  const rankName = level > 5 ? "Elite Operative" : `Operative ${"I".repeat(level)}`;
  const xpToNextLevel = level * 20;
  const xpProgressPercent = (progress % 20) / 20 * 100;

  // Mock Heatmap Data
  const renderHeatmap = () => {
    const bubbles = [];
    for (let i = 0; i < 60; i++) {
      const lvl = Math.floor(Math.random() * 5); // 0-4
      bubbles.push(<div key={i} className={`heat-box lvl-${lvl}`}></div>);
    }
    return bubbles;
  };

  const skills = [
    { name: "Web Exploitation", percent: 75 },
    { name: "Network Security", percent: 40 },
    { name: "Privilege Escalation", percent: 60 },
    { name: "Defensive Analysis", percent: 30 },
  ];

  const achievements = [
    { id: 1, icon: <Zap size={20} />, title: "First Blood", unlocked: true },
    { id: 2, icon: <Terminal size={20} />, title: "Shell Master", unlocked: true },
    { id: 3, icon: <Shield size={20} />, title: "Defender", unlocked: false },
    { id: 4, icon: <Cpu size={20} />, title: "AI Breaker", unlocked: false },
    { id: 5, icon: <Target size={20} />, title: "Sniper", unlocked: false },
  ];

  return (
    <div className="dashboard-container">
      {/* 1. Header Card (Professional Profile Style) */}
      <div className="dashboard-header-card">
        <div className="dashboard-cover"></div>
        <div className="dashboard-header-content">
          <div className="avatar-wrapper">
            <div className="avatar-placeholder"><User size={48} /></div>
            <div className="status-indicator"></div>
          </div>

          <div className="user-identity">
            <h2>{user.name || "Unknown Operative"}</h2>
            <div className="user-identity-meta">
              <span className="meta-item"><Shield size={14} className="meta-icon" /> {rankName}</span>
              <span className="meta-item"><MapPin size={14} className="meta-icon" /> Global Node #42</span>
              <span className="meta-item"><Activity size={14} className="meta-icon" /> System Online</span>
            </div>
          </div>

          <div className="header-stats">
            <div className="stat-box">
              <span className="stat-value">{stats.total_challenges || 0}</span>
              <span className="stat-label">Labs</span>
            </div>
            <div className="stat-box">
              <span className="stat-value">{progress}</span>
              <span className="stat-label">XP</span>
            </div>
            <div className="stat-box">
              <span className="stat-value">{level}</span>
              <span className="stat-label">Level</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Main Grid */}
      <div className="dashboard-main-grid">
        {/* Left Column */}
        <div className="dashboard-col-left">

          {/* Progress Card */}
          <div className="panel-card xp-card">
            <div className="card-header">
              <h3><TrendingUp size={18} /> Operative Progression</h3>
              <span className="xp-badge">{progress} / {xpToNextLevel} XP</span>
            </div>
            <div className="progress-bar-container">
              <div className="progress-bar-fill" style={{ width: `${xpProgressPercent || 5}%` }}></div>
            </div>
            <div className="xp-details">
              <span>Level {level}</span>
              <span>Next: Level {level + 1}</span>
            </div>
          </div>

          {/* Active Labs */}
          <div className="panel-card">
            <div className="card-header">
              <h3><Terminal size={18} /> Active Missions</h3>
              <Link to={ROUTES.MODULES} className="link-action">View All <ChevronRight size={14} /></Link>
            </div>
            <div className="labs-list">
              {activeLabs.map((lab) => (
                <div key={lab.id} className="lab-row" onClick={() => navigate(`${ROUTES.CHALLENGE_BASE}/${lab.id}`)}>
                  <div className="lab-icon"><Target size={18} /></div>
                  <div className="lab-info">
                    <span className="lab-name">{lab.title}</span>
                    <span className="lab-diff">{lab.difficulty || 'Medium'}</span>
                  </div>
                  <div className="lab-status">In Progress</div>
                </div>
              ))}
            </div>
          </div>

          {/* Heatmap Card */}
          <div className="panel-card">
            <div className="card-header">
              <h3><Activity size={18} /> Operational Activity</h3>
            </div>
            <div className="activity-heatmap" style={{ marginTop: '16px' }}>
              {renderHeatmap()}
            </div>
          </div>

        </div>

        {/* Right Column */}
        <div className="dashboard-col-right">

          {/* Skills */}
          <div className="panel-card">
            <div className="card-header">
              <h3><Cpu size={18} /> Skill Matrix</h3>
            </div>
            <div className="skills-list">
              {skills.map((skill, idx) => (
                <div key={idx} className="skill-item">
                  <div className="skill-header">
                    <span className="skill-name">{skill.name}</span>
                    <span className="skill-percent">{skill.percent}%</span>
                  </div>
                  <div className="skill-bar-bg">
                    <div className="skill-bar-fill" style={{ width: `${skill.percent}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Achievements */}
          <div className="panel-card">
            <div className="card-header">
              <h3><Trophy size={18} /> Badges</h3>
            </div>
            <div className="achievements-grid">
              {achievements.map((a) => (
                <div key={a.id} className={`achievement-item ${a.unlocked ? 'unlocked' : ''}`}>
                  <div className="achievement-icon" title={a.title}>{a.icon}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Leaderboard Snippet */}
          <div className="panel-card">
            <div className="card-header">
              <h3><Award size={18} /> Top Agents</h3>
            </div>
            <div className="leaderboard-list">
              {leaderboard.map((u, i) => (
                <div key={i} className="leaderboard-item">
                  <span className="lb-rank">#{i + 1}</span>
                  <span className="lb-name">{u.username || u.name}</span>
                  <span className="lb-xp">{u.progress} XP</span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
