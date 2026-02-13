import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Zap, Shield, Target, Award, ArrowRight, Brain, Lock, ChevronRight } from 'lucide-react';
import { API_BASE } from '../config';
import { ROUTES } from '../config/routes.config';
import './AIInjectorDashboard.css';

const AIInjectorDashboard = () => {
    const navigate = useNavigate();
    const [challenges, setChallenges] = useState([]);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('user') || '{}'));

    useEffect(() => {
        fetchChallenges();
    }, []);

    const fetchChallenges = async () => {
        try {
            const response = await fetch(`${API_BASE}/challenges?category=AI`);
            const data = await response.json();
            setChallenges(data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching AI challenges:', error);
            setLoading(false);
        }
    };

    const stats = [
        { label: 'Total Scenarios', value: challenges.length, icon: Target, color: '#3b82f6' },
        { label: 'Completed', value: user.solved_challenges?.filter(id => challenges.some(c => c.id === id)).length || 0, icon: Shield, color: '#10b981' },
        { label: 'Neural XP', value: challenges.reduce((acc, c) => acc + (user.solved_challenges?.includes(c.id) ? c.points : 0), 0), icon: Award, color: '#f59e0b' },
    ];

    if (loading) {
        return (
            <div className="loading-container">
                <div className="glitch-text" data-text="INITIALIZING_NEURAL_INTERFACE...">INITIALIZING_NEURAL_INTERFACE...</div>
            </div>
        );
    }

    return (
        <div className="dashboard-container">
            {/* Stats Grid */}
            <div className="stats-grid">
                {stats.map((stat, idx) => (
                    <div key={idx} className="stat-card">
                        <div className="stat-icon" style={{ backgroundColor: `${stat.color}15`, color: stat.color }}>
                            <stat.icon size={20} />
                        </div>
                        <div className="stat-info">
                            <span className="stat-label">{stat.label}</span>
                            <span className="stat-value">{stat.value}</span>
                        </div>
                    </div>
                ))}
            </div>

            <div className="dashboard-main">
                <div className="content-panel">
                    <div className="panel-header">
                        <h2>Available Vulnerability Scenarios</h2>
                        <p>Master the art of prompt injection and adversarial AI manipulation.</p>
                    </div>

                    <div className="challenge-cards">
                        {challenges.map((challenge) => {
                            const isSolved = user.solved_challenges?.includes(challenge.id);
                            return (
                                <div key={challenge.id} className={`challenge-item-card ${isSolved ? 'solved' : ''}`}>
                                    <div className="card-top">
                                        <div className="card-meta">
                                            <span className={`difficulty-tag ${challenge.difficulty.toLowerCase()}`}>
                                                {challenge.difficulty}
                                            </span>
                                            <span className="points-tag">{challenge.points} XP</span>
                                        </div>
                                        {isSolved && <div className="solved-badge">RESOLVED</div>}
                                    </div>

                                    <div className="card-body">
                                        <h3>{challenge.title}</h3>
                                        <p>{challenge.description}</p>
                                    </div>

                                    <div className="card-footer">
                                        <button
                                            className="btn-enter-lab"
                                            onClick={() => navigate(ROUTES.AI_INJECTOR.LAB, { state: { challengeId: challenge.id } })}
                                        >
                                            {isSolved ? 'REVIEW SCENARIO' : 'ENTER LAB'}
                                            <ChevronRight size={16} />
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                <div className="side-panel">
                    <div className="intel-card">
                        <div className="intel-header">
                            <Brain size={18} className="ai-accent" />
                            <h3>Neural Intel</h3>
                        </div>
                        <div className="intel-body">
                            <div className="intel-item">
                                <strong>01: Neural Vault</strong>
                                <p>Learn basic prompt injection to extract hidden system secrets.</p>
                            </div>
                            <div className="intel-item">
                                <strong>02: Neural Drift</strong>
                                <p>Exploit semantic drift and analogies to bypass topical filters.</p>
                            </div>
                            <div className="intel-item">
                                <strong>03: Role Poisoning</strong>
                                <p>Infect the AI context with unauthorized administrative roles.</p>
                            </div>
                            <div className="intel-item">
                                <strong>04: Directive Smuggling</strong>
                                <p>Smuggle instructions inside logic blocks to subvert core safety.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AIInjectorDashboard;
