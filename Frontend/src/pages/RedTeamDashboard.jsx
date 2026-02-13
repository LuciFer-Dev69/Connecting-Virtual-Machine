import React, { useState, useEffect } from "react";
import {
    Target, Trophy, Activity, Zap, Terminal, Sword,
    ChevronRight, TrendingUp, ShieldAlert, Layers
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { API_BASE } from "../config";
import PageTemplate from "../components/templates/PageTemplate";
import './RedTeamDashboard.css';

export default function RedTeamDashboard() {
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

            // Filter for Red Team (Non-Blue, Non-Real Life, Non-AI)
            const redChals = data.filter(c =>
                !c.category?.toLowerCase().includes("blue") &&
                !c.category?.toLowerCase().includes("real") &&
                !c.category?.toLowerCase().includes("ai")
            );

            setChallenges(redChals);

            // For now, mock completion stats if not available in backend
            // In a real app, we'd fetch user progress
            setStats({
                total: redChals.length,
                completed: Math.floor(redChals.length * 0.4), // Mocked 40%
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

            if (seed > 0.88) {
                lvl = 4; // High Activity (Dark Red)
            } else if (seed > 0.75) {
                lvl = 3;
            } else if (seed > 0.6) {
                lvl = 2; // Active (Light Red)
            } else if (seed > 0.45) {
                lvl = 1;
            } else {
                lvl = 0; // Blank
            }

            bubbles.push(<div key={i} className={`red-heat-box lvl-${lvl}`}></div>);
        }
        return bubbles;
    };

    if (loading) {
        return (
            <div className="red-dashboard-loading">
                <Terminal className="animate-pulse text-red-500" size={48} />
            </div>
        );
    }

    return (
        <div className="red-dashboard-container">
            <PageTemplate fullWidth>
                <header className="red-dashboard-header">
                    <div className="protocol-indicator">
                        <span className="blink">●</span> RED_PROTOCOL // OPS_DASHBOARD
                    </div>
                    <h1 className="red-dashboard-title">
                        OFFENSIVE <span className="outline">COMMAND</span>
                    </h1>
                </header>

                <div className="red-dashboard-grid">
                    {/* Stats Overview */}
                    <div className="red-dashboard-card stats-overview">
                        <div className="card-header">
                            <Activity size={18} className="text-red-500" />
                            <h3>OPERATIONAL_STATUS</h3>
                        </div>
                        <div className="stats-row">
                            <div className="stat-item">
                                <span className="stat-label">COMPLETED_MISSIONS</span>
                                <span className="stat-value">{stats.completed} / {stats.total}</span>
                                <div className="stat-progress-bg">
                                    <div className="stat-progress-fill" style={{ width: `${(stats.completed / (stats.total || 1)) * 100}%` }}></div>
                                </div>
                            </div>
                            <div className="stat-item">
                                <span className="stat-label">TOTAL_INFLUENCE</span>
                                <span className="stat-value">{stats.points} XP</span>
                            </div>
                            <div className="stat-item">
                                <span className="stat-label">THREAT_LEVEL</span>
                                <span className="stat-value text-red-500">CRITICAL</span>
                            </div>
                        </div>
                    </div>

                    {/* Git-like Activity */}
                    <div className="red-dashboard-card activity-graph">
                        <div className="card-header">
                            <TrendingUp size={18} className="text-red-500" />
                            <h3>NEURAL_ACTIVITY_LOG</h3>
                        </div>
                        <div className="red-heatmap-grid">
                            {renderHeatmap()}
                        </div>
                        <div className="heatmap-legend">
                            <span>LESS</span>
                            <div className="legend-boxes">
                                <div className="red-heat-box lvl-0"></div>
                                <div className="red-heat-box lvl-1"></div>
                                <div className="red-heat-box lvl-2"></div>
                                <div className="red-heat-box lvl-3"></div>
                                <div className="red-heat-box lvl-4"></div>
                            </div>
                            <span>MORE</span>
                        </div>
                    </div>

                    {/* Recent Missions Snippet */}
                    <div className="red-dashboard-card labs-snippet">
                        <div className="card-header">
                            <Target size={18} className="text-red-500" />
                            <h3>ACTIVE_TARGETS</h3>
                            <Link to="../challenges" className="view-all-link">ALL_LABS <ChevronRight size={14} /></Link>
                        </div>
                        <div className="snippet-list">
                            {challenges.slice(0, 3).map(c => (
                                <div key={c.id} className="snippet-item" onClick={() => navigate(`../challenge/${c.id}`)}>
                                    <div className="snippet-icon"><Sword size={16} /></div>
                                    <div className="snippet-info">
                                        <span className="snippet-name">{c.title}</span>
                                        <span className="snippet-tier">TIER_{c.difficulty?.toUpperCase()}</span>
                                    </div>
                                    <div className="snippet-xp">{c.points} XP</div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Deployment Card */}
                    <div className="red-dashboard-card deployment-card">
                        <div className="card-header">
                            <Zap size={18} className="text-red-600" />
                            <h3>RAPID_DEPLOYMENT</h3>
                        </div>
                        <p>Access the unified offensive toolkit to begin immediate reconnaissance and exploitation operations.</p>
                        <button className="red-deploy-btn" onClick={() => navigate("../challenges")}>
                            INITIATE_PWNBOX
                        </button>
                    </div>
                </div>
            </PageTemplate>
        </div>
    );
}
