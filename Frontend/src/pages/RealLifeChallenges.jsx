import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Globe, Terminal, Activity, Server, Shield, ChevronRight } from 'lucide-react';
import PageTemplate from '../components/templates/PageTemplate';
import { API_BASE } from '../config';
import './RealLifeChallenges.css';

const RealLifeChallenges = () => {
    const navigate = useNavigate();
    const [challenges, setChallenges] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchChallenges = async () => {
        try {
            const response = await fetch(`${API_BASE}/real-life-challenges`);
            if (!response.ok) throw new Error('Failed to fetch challenges');
            const data = await response.json();
            setChallenges(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchChallenges();
    }, []);

    const handleCardClick = (id) => {
        navigate(`/real-life/challenge/${id}`);
    };

    return (
        <PageTemplate
            title="Real Life Scenarios"
            subtitle="Corporate environments and advanced simulation challenges."
            icon={Globe}
        >
            <div className="challenges-grid">
                {loading ? (
                    <div className="col-span-full text-center py-20 text-gray-500">Loading simulations...</div>
                ) : error ? (
                    <div className="col-span-full text-center py-20 text-red-400">Error: {error}</div>
                ) : challenges.length === 0 ? (
                    null
                ) : (
                    challenges.map(challenge => (
                        <div
                            key={challenge.id}
                            className="real-life-card group"
                        >
                            {/* Header: Badge & XP */}
                            <div className="flex justify-between items-start mb-4">
                                <div className="rl-badge">
                                    TIER_{challenge.difficulty}
                                </div>
                                <div className="flex items-center gap-1 text-xs font-bold text-yellow-500">
                                    <Activity size={14} />
                                    <span>{challenge.points} XP</span>
                                </div>
                            </div>

                            {/* Body: Icon & Content */}
                            <div className="flex flex-col items-center text-center mb-4">
                                <div className="rl-icon-container">
                                    <Globe size={48} strokeWidth={1.5} />
                                </div>
                                <h3 className="rl-title">
                                    {challenge.title}
                                </h3>
                                <p className="rl-desc">
                                    {challenge.description}
                                </p>
                            </div>

                            {/* Footer: Category & Action */}
                            <div className="rl-footer">
                                <span className="rl-category">
                                    REAL LIFE - {challenge.category}
                                </span>

                                <button
                                    onClick={() => handleCardClick(challenge.id)}
                                    className="rl-btn"
                                >
                                    INITIATE_OPS
                                    <ChevronRight size={14} />
                                </button>
                            </div>

                            {/* Documentation Toggle */}
                            {challenge.walkthrough && (
                                <div className="mt-4 border-t border-white/5 pt-4">
                                    <details className="group/details" onClick={(e) => e.stopPropagation()}>
                                        <summary className="flex justify-center items-center gap-2 cursor-pointer text-[10px] font-mono text-gray-500 hover:text-yellow-500 transition-colors list-none uppercase tracking-widest">
                                            <Shield size={10} />
                                            View Classified Data
                                        </summary>
                                        <div className="mt-4 p-4 bg-black/50 rounded-lg border border-yellow-500/20 text-xs text-gray-400 font-mono whitespace-pre-wrap text-left">
                                            {challenge.walkthrough}
                                        </div>
                                    </details>
                                </div>
                            )}
                        </div>
                    ))
                )}

            </div>
        </PageTemplate>
    );
};

export default RealLifeChallenges;
