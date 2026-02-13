import React, { useState, useEffect } from "react";
import {
    Shield, Trophy, Activity, Zap, Terminal, Eye,
    ChevronRight, TrendingUp, ShieldAlert, Layers, Search
} from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import { API_BASE } from "../config";
import PageTemplate from "../components/templates/PageTemplate";
import './BlueTeamDashboard.css';

export default function BlueTeamDashboard() {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const [stats, setStats] = useState({ total: 0, completed: 0, points: 0 });
    const [challenges, setChallenges] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const resp = await fetch(`${API_BASE}/challenges/`);
            if (!resp.ok) throw new Error("Failed to fetch");
            const data = await resp.json();

            // Filter for Blue Team (Blue, Forensics)
            const blueChals = data.filter(c =>
                c.category?.toLowerCase().includes("blue") ||
                c.category?.toLowerCase().includes("forensics")
            );

            setChallenges(blueChals);

            // Mock completion stats
            setStats({
                total: blueChals.length,
                completed: Math.floor(blueChals.length * 0.3), // Mocked 30%
                points: user.progress || 0
            });

        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const renderHeatmap = () => {
        const bubbles = [];
        const totalBoxes = 140; // 20 columns * 7 rows

        for (let i = 0; i < totalBoxes; i++) {
            let lvl = 0;
            const seed = Math.random();

            if (seed > 0.9) {
                lvl = 4; // High Activity (Dark Blue)
            } else if (seed > 0.78) {
                lvl = 3;
            } else if (seed > 0.6) {
                lvl = 2; // Active (Light Blue)
            } else if (seed > 0.4) {
                lvl = 1;
            } else {
                lvl = 0; // Blank
            }

            bubbles.push(<div key={i} className={`blue-heat-box lvl-${lvl}`}></div>);
        }
        return bubbles;
    };

    if (loading) {
        return (
            <div className="blue-dashboard-loading">
                <Terminal className="animate-pulse text-blue-500" size={48} />
            </div>
        );
    }

    return (
        <div className="blue-dashboard-container">
            <PageTemplate fullWidth>
                <header className="blue-dashboard-header">
                    <div className="protocol-indicator">
                        <span className="blink">●</span> BLUE_PROTOCOL // SOC_DASHBOARD
                    </div>
                    <h1 className="blue-dashboard-title">
                        DEFENSIVE <span className="outline">COMMAND</span>
                    </h1>
                </header>

                <div className="blue-dashboard-grid">
                    {/* SOC Health Overview */}
                    <div className="blue-dashboard-card stats-overview">
                        <div className="card-header">
                            <Activity size={18} className="text-blue-500" />
                            <h3>SYSTEM_HEALTH_INDEX</h3>
                        </div>
                        <div className="stats-row">
                            <div className="stat-item">
                                <span className="stat-label">INVESTIGATIONS_CLOSED</span>
                                <span className="stat-value">{stats.completed} / {stats.total}</span>
                                <div className="stat-progress-bg">
                                    <div className="stat-progress-fill" style={{ width: `${(stats.completed / (stats.total || 1)) * 100}%` }}></div>
                                </div>
                            </div>
                            <div className="stat-item">
                                <span className="stat-label">DEFENSIVE_SCORE</span>
                                <span className="stat-value">{stats.points} XP</span>
                            </div>
                            <div className="stat-item">
                                <span className="stat-label">THREAT_LEVEL</span>
                                <span className="stat-value text-green-500">STABLE</span>
                            </div>
                        </div>
                    </div>

                    {/* Defensive Activity Graph */}
                    <div className="blue-dashboard-card activity-graph">
                        <div className="card-header">
                            <TrendingUp size={18} className="text-blue-500" />
                            <h3>GUARDIAN_LOGBOOK</h3>
                        </div>
                        <div className="blue-heatmap-grid">
                            {renderHeatmap()}
                        </div>
                        <div className="heatmap-legend">
                            <span>MINIMAL</span>
                            <div className="legend-boxes">
                                <div className="blue-heat-box lvl-0"></div>
                                <div className="blue-heat-box lvl-1"></div>
                                <div className="blue-heat-box lvl-2"></div>
                                <div className="blue-heat-box lvl-3"></div>
                                <div className="blue-heat-box lvl-4"></div>
                            </div>
                            <span>MAXIMUM</span>
                        </div>
                    </div>

                    {/* Pending Cases */}
                    <div className="blue-dashboard-card labs-snippet">
                        <div className="card-header">
                            <Search size={18} className="text-blue-500" />
                            <h3>OPEN_INVESTIGATIONS</h3>
                            <Link to="../forensics" className="view-all-link">ALL_CASES <ChevronRight size={14} /></Link>
                        </div>
                        <div className="snippet-list">
                            {challenges.slice(0, 3).map(c => (
                                <div key={c.id} className="snippet-item" onClick={() => navigate(`../challenge/${c.id}`)}>
                                    <div className="snippet-icon"><Eye size={16} /></div>
                                    <div className="snippet-info">
                                        <span className="snippet-name">{c.title}</span>
                                        <span className="snippet-tier">TIER_{c.difficulty?.toUpperCase()}</span>
                                    </div>
                                    <div className="snippet-xp">{c.points} XP</div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Monitoring Card */}
                    <div className="blue-dashboard-card monitoring-card">
                        <div className="card-header">
                            <Shield size={18} className="text-blue-400" />
                            <h3>THREAT_MONITORING</h3>
                        </div>
                        <p>Deploy the Guardian Toolkit to analyze logs, detect persistence, and neutralize incoming offensive protocols.</p>
                        <button className="blue-deploy-btn" onClick={() => navigate("../forensics")}>
                            BOOT_GUARDIAN_OS
                        </button>
                    </div>
                </div>
            </PageTemplate>
        </div>
    );
}
