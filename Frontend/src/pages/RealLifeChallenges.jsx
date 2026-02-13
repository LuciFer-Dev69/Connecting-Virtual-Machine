import React, { useState, useEffect } from "react";
import { API_BASE } from "../config";
import {
    Globe, Search, Target, ArrowRight, Loader2
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import PageTemplate from "../components/templates/PageTemplate";
import './RealLifeChallenges.css';

export default function RealLifeChallenges() {
    const [challenges, setChallenges] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        fetchChallenges();
    }, []);

    const fetchChallenges = async () => {
        setLoading(true);
        try {
            const res = await fetch(`${API_BASE}/real-life-challenges`);
            const data = await res.json();
            setChallenges(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const filteredChallenges = challenges.filter(c =>
        (c.title || "").toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return (
            <div className="flex-center" style={{ height: "400px", color: "var(--accent-red)" }}>
                <Loader2 className="animate-spin" size={48} />
            </div>
        );
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflowY: 'auto' }}>
            <PageTemplate
                title="Simulation Battlegrounds"
                subtitle="High-fidelity corporate environments. Breach, pivot, and exfiltrate in real-time."
                actions={
                    <div className="search-input-wrapper">
                        <Search className="search-icon" size={16} />
                        <input
                            className="search-input"
                            placeholder="Locate target vector..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                }
            >
                <div className="battlegrounds-grid">
                    <AnimatePresence>
                        {filteredChallenges.map((c, i) => (
                            <motion.div
                                layout
                                key={c.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.05 }}
                            >
                                <div className="battleground-card">
                                    <div
                                        className="card-banner"
                                        style={{ backgroundImage: `url(${c.image_url || 'https://images.unsplash.com/photo-1558494949-ef010cbdcc4b?w=500'})` }}
                                    >
                                        <div className="banner-tag">
                                            <Target size={12} /> TARGET: {c.category || 'EXT-PROD'}
                                        </div>
                                    </div>

                                    <div className="card-body">
                                        <div className="card-header-row">
                                            <h3>{c.title}</h3>
                                            <span className={`diff-tag ${c.difficulty.toLowerCase()}`}>
                                                {c.difficulty}
                                            </span>
                                        </div>

                                        <p className="card-desc">{c.description}</p>

                                        <div className="card-footer-row">
                                            <div className="bounty-info">
                                                <span className="bounty-val">{c.points} XP</span>
                                                <span className="bounty-label">BOUNTY_SYNC</span>
                                            </div>

                                            <a href={`#/real-life/challenge/${c.id}`} className="btn-engage">
                                                <span>INITIATE_ENGAGEMENT</span> <ArrowRight size={16} />
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            </PageTemplate>
        </div>
    );
}
