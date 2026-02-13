import React, { useState } from 'react';
import {
    Search, Filter, ChevronRight, BookOpen, Clock,
    Star, Heart, Layout, Zap, Shield, Cpu, Globe,
    Terminal, Award, Layers, Flame, Book, HelpCircle,
    Orbit, Radio, Activity, Target
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { ROUTES } from '../config/routes.config';
import './Modules.css';

const CATEGORIES = [
    { id: 'all', label: 'All Sectors', icon: <Orbit size={14} /> },
    { id: 'fundamental', label: 'Initiation', icon: <BookOpen size={14} /> },
    { id: 'easy', label: 'Tactical', icon: <Zap size={14} /> },
    { id: 'medium', label: 'Strategic', icon: <Layers size={14} /> },
    { id: 'hard', label: 'Elite', icon: <Flame size={14} /> },
];

const SECTORS = [
    { id: 'all', label: 'All Protocols' },
    { id: 'offensive', label: 'Red Protocol', color: 'var(--accent-red)' },
    { id: 'defensive', label: 'Blue Protocol', color: 'var(--accent-blue)' },
    { id: 'ai', label: 'Neural Protocol', color: 'var(--accent-purple)' },
];

const MODULE_DATA = [
    {
        id: 1,
        title: "Chakra Core: Neural Sync",
        desc: "Initialize your connection to the Chakra View engine. Configure your profile and calibrate your terminal interface.",
        category: "fundamental",
        sector: "general",
        sections: 4,
        tier: "SECTOR_0",
        label: "CORE",
        icon: <Orbit size={48} className="icon-chakra" />,
        status: "Online",
        progress: 100
    },
    {
        id: 2,
        title: "Linux Command Mastery",
        desc: "Deep-layer interaction with Linux kernels. Mastering the bash environment for advanced infiltration.",
        category: "easy",
        sector: "offensive",
        sections: 12,
        tier: "SECTOR_1",
        label: "TACTICAL",
        icon: <Terminal size={48} className="icon-red" />,
        status: "Updated",
        progress: 45
    },
    {
        id: 3,
        title: "Neural Breach: Prompt Injection",
        desc: "Exploit the latent vulnerabilities in high-level LLMs. Bypass safety filters and leak hidden system context.",
        category: "medium",
        sector: "ai",
        sections: 8,
        tier: "SECTOR_2",
        label: "NEURAL",
        icon: <Cpu size={48} className="icon-purple" />,
        status: "New",
        progress: 0
    },
    {
        id: 4,
        title: "Active Reconnaissance",
        desc: "Stealthy mapping of network architectures. Identifying listening services without triggering IDS alerts.",
        category: "easy",
        sector: "offensive",
        sections: 15,
        tier: "SECTOR_1",
        label: "TACTICAL",
        icon: <Globe size={48} className="icon-red" />,
        status: "Online",
        progress: 0
    },
    {
        id: 5,
        title: "Blue Sentinel: Log Forensics",
        desc: "Analyzing data streams to reconstruct attack timelines. Identifying early warning signs of a breach.",
        category: "medium",
        sector: "defensive",
        sections: 10,
        tier: "SECTOR_2",
        label: "DEFENSIVE",
        icon: <Shield size={48} className="icon-blue" />,
        status: "Online",
        progress: 10
    },
    {
        id: 6,
        title: "Database Decryption: SQLi",
        desc: "Forcing database engines to leak credentials. Advanced Boolean and Time-based blind injection techniques.",
        category: "hard",
        sector: "offensive",
        sections: 20,
        tier: "SECTOR_3",
        label: "ELITE",
        icon: <Radio size={48} className="icon-red" />,
        status: "Critical",
        progress: 0
    }
];

export default function Modules() {
    const [activeTab, setActiveTab] = useState('all');
    const [activeSector, setActiveSector] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const user = JSON.parse(localStorage.getItem("user") || "{}");

    const filteredModules = MODULE_DATA.filter(m => {
        const matchesTab = activeTab === 'all' || m.category === activeTab;
        const matchesSector = activeSector === 'all' || m.sector === activeSector;
        const matchesSearch = m.title.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesTab && matchesSector && matchesSearch;
    });

    return (
        <div className="chakra-modules-container">
            {/* Header / Hero Section */}
            <div className="modules-hero">
                <div className="hero-blur"></div>
                <div className="hero-content">
                    <div className="breadcrumb">PLATFORM // <span className="highlight">MISSION_LIBRARY</span></div>
                    <div className="title-row">
                        <h1>KNOWLEDGE <span className="outline">NODES</span></h1>
                        <div className="user-energy">
                            <Activity size={16} />
                            <span>SOURCE_ENERGY: {user.progress || 0} SE</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Dashboard Control Panel */}
            <div className="control-deck">
                <div className="deck-group search-group">
                    <Search size={18} className="deck-icon" />
                    <input
                        className="deck-input"
                        placeholder="Search mission protocols..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <div className="deck-group filter-group">
                    {CATEGORIES.map(cat => (
                        <button
                            key={cat.id}
                            onClick={() => setActiveTab(cat.id)}
                            className={`deck-btn ${activeTab === cat.id ? 'active' : ''}`}
                        >
                            <span className="btn-icon">{cat.icon}</span>
                            <span className="btn-label">{cat.label}</span>
                        </button>
                    ))}
                </div>

                <div className="deck-group sector-group">
                    {SECTORS.map(sec => (
                        <button
                            key={sec.id}
                            onClick={() => setActiveSector(sec.id)}
                            className={`protocol-btn ${activeSector === sec.id ? 'active' : ''}`}
                            style={{ '--color': sec.color }}
                        >
                            {sec.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Content Grid */}
            <div className="nodes-grid">
                <AnimatePresence>
                    {filteredModules.map((node, index) => (
                        <motion.div
                            key={node.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className={`node-card ${node.progress > 0 ? 'active-link' : ''}`}
                            data-sector={node.sector}
                        >
                            <div className="node-glow"></div>

                            <div className="node-header">
                                <div className="node-id">{node.tier}</div>
                                <div className="node-status">
                                    <span className="pulse-dot"></span>
                                    {node.status}
                                </div>
                            </div>

                            <div className="node-visual">
                                <div className="node-aura"></div>
                                {node.icon}
                            </div>

                            <div className="node-body">
                                <h3 className="node-title">{node.title}</h3>
                                <p className="node-desc">{node.desc}</p>

                                <div className="node-meta">
                                    <div className="meta-item">
                                        <BookOpen size={12} />
                                        <span>{node.sections} NODES</span>
                                    </div>
                                    <div className="meta-item">
                                        <Target size={12} />
                                        <span>{node.label}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="node-footer">
                                {node.progress > 0 ? (
                                    <div className="progress-container">
                                        <div className="progress-text">SYNC STATUS: {node.progress}%</div>
                                        <div className="progress-bar">
                                            <div className="progress-fill" style={{ width: `${node.progress}%` }}></div>
                                        </div>
                                    </div>
                                ) : (
                                    <button className="btn-sync">
                                        <span>INITIATE_SYNC</span>
                                        <ChevronRight size={16} />
                                    </button>
                                )}
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
        </div>
    );
}
