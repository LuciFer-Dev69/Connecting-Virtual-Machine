import React, { useState, useEffect } from "react";
import {
    Globe, Trophy, Activity, Zap, Terminal, Cpu,
    ChevronRight, TrendingUp, AlertTriangle, Layers, Map
} from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import { API_BASE } from "../config";
import PageTemplate from "../components/templates/PageTemplate";
import './RealLifeDashboard.css';

export default function RealLifeDashboard() {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const [stats, setStats] = useState({ total: 4, completed: 0, points: 0 });
    const [scenarios, setScenarios] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const resp = await fetch(`${API_BASE}/real-life-challenges`);
            if (!resp.ok) throw new Error("Failed to fetch");
            const data = await resp.json();

            setScenarios(Array.isArray(data) ? data : []);

            // Mock completion for now (since backend doesn't track RL specifically yet)
            setStats({
                total: data.length || 4,
                completed: 1, // Let's say user completed Op Blackout
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

            if (seed > 0.92) {
                lvl = 4; // High Activity (Dark Orange)
            } else if (seed > 0.82) {
                lvl = 3;
            } else if (seed > 0.65) {
                lvl = 2; // Active (Amber)
            } else if (seed > 0.45) {
                lvl = 1;
            } else {
                lvl = 0; // Blank
            }

            bubbles.push(<div key={i} className={`rl-heat-box lvl-${lvl}`}></div>);
        }
        return bubbles;
    };

    if (loading) {
        return (
            <div className="rl-dashboard-loading">
                <Terminal className="animate-pulse text-orange-500" size={48} />
            </div>
        );
    }

    return (
        <div className="rl-dashboard-container">
            <PageTemplate fullWidth>
                <header className="rl-dashboard-header">
                    <div className="protocol-indicator">
                        <span className="blink">●</span> REAL_WORLD_SYNC // OPS_CENTER
                    </div>
                    <h1 className="rl-dashboard-title">
                        INSANE <span className="outline">SCENARIOS</span>
                    </h1>
                </header>

                <div className="rl-dashboard-grid">
                    {/* Mission Status Overview */}
                    <div className="rl-dashboard-card stats-overview">
                        <div className="card-header">
                            <Activity size={18} className="text-orange-500" />
                            <h3>OPERATIONAL_STRICTNESS</h3>
                        </div>
                        <div className="stats-row">
                            <div className="stat-item">
                                <span className="stat-label">SCENARIOS_NEUTRALIZED</span>
                                <span className="stat-value">{stats.completed} / {stats.total}</span>
                                <div className="stat-progress-bg">
                                    <div className="stat-progress-fill" style={{ width: `${(stats.completed / (stats.total || 1)) * 100}%` }}></div>
                                </div>
                            </div>
                            <div className="stat-item">
                                <span className="stat-label">MISSION_REPUTATION</span>
                                <span className="stat-value">{stats.points} XP</span>
                            </div>
                            <div className="stat-item">
                                <span className="stat-label">SYSTEM_THREAT</span>
                                <span className="stat-value text-orange-600">INSANE</span>
                            </div>
                        </div>
                    </div>

                    {/* Neural Sync Graph (Heatmap) */}
                    <div className="rl-dashboard-card activity-graph">
                        <div className="card-header">
                            <TrendingUp size={18} className="text-orange-500" />
                            <h3>NEURAL_SYNC_HISTORY</h3>
                        </div>
                        <div className="rl-heatmap-grid">
                            {renderHeatmap()}
                        </div>
                        <div className="heatmap-legend">
                            <span>LOW_SYNC</span>
                            <div className="legend-boxes">
                                <div className="rl-heat-box lvl-0"></div>
                                <div className="rl-heat-box lvl-1"></div>
                                <div className="rl-heat-box lvl-2"></div>
                                <div className="rl-heat-box lvl-3"></div>
                                <div className="rl-heat-box lvl-4"></div>
                            </div>
                            <span>FULL_SYNC</span>
                        </div>
                    </div>

                    {/* Available Missions */}
                    <div className="rl-dashboard-card labs-snippet">
                        <div className="card-header">
                            <Map size={18} className="text-orange-500" />
                            <h3>ASSIGNED_OPERATIONS</h3>
                            <Link to="../scenarios" className="view-all-link">WORLD_MAP <ChevronRight size={14} /></Link>
                        </div>
                        <div className="snippet-list">
                            {scenarios.slice(0, 3).map(c => (
                                <div key={c.id} className="snippet-item" onClick={() => navigate(`../challenge/${c.id}`)}>
                                    <div className="snippet-icon"><Globe size={16} /></div>
                                    <div className="snippet-info">
                                        <span className="snippet-name">{c.title}</span>
                                        <span className="snippet-tier">DIFFICULTY_INSANE</span>
                                    </div>
                                    <div className="snippet-xp">{c.points} XP</div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Operational Warning */}
                    <div className="rl-dashboard-card warning-card">
                        <div className="card-header">
                            <AlertTriangle size={18} className="text-orange-600" />
                            <h3>ADVISORY_PROTOCOL</h3>
                        </div>
                        <p>Real-world scenarios involve complex logic flaws. Ensure terminal persistence and Burp Suite connectivity before initiating authorization bypasses.</p>
                        <button className="rl-deploy-btn" onClick={() => navigate("../scenarios")}>
                            INITIATE_MISSION
                        </button>
                    </div>
                </div>
            </PageTemplate>
        </div>
    );
}
