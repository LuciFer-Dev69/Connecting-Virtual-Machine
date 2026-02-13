import React from "react";
import {
    Globe, Terminal, Search, Zap,
    MapPin, ChevronRight, Lock,
    Layers, Cpu, Activity, AlertCircle, Database
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import PageTemplate from "../components/templates/PageTemplate";
import './RealLifeRoadmap.css';

export default function RealLifeRoadmap() {
    const navigate = useNavigate();

    const phases = [
        {
            id: 1,
            title: "Sim I: Industrial Sabotage",
            code: "SCADA_RESTART",
            description: "Interact with PLCs and simulate a critical infrastructure recovery in 'Operation Blackout'.",
            status: "Complete",
            skills: [
                { name: "Modbus Discovery", level: "Expert" },
                { name: "PLC Mapping", level: "Advanced" },
                { name: "System Hardening", level: "Intermediate" }
            ],
            icon: <Zap size={24} />
        },
        {
            id: 2,
            title: "Sim II: Financial Hijacking",
            code: "SWIFT_BYPASS",
            description: "Exploit logic flaws and race conditions in SWIFT gateway protocols to authorize vault transfers.",
            status: "Active",
            skills: [
                { name: "Race Condition Exploit", level: "Master" },
                { name: "Burp Proxy Mastery", level: "Advanced" },
                { name: "Database Log Recovery", level: "Intermediate" }
            ],
            icon: <Database size={24} />
        },
        {
            id: 3,
            title: "Sim III: Supply Chain Poison",
            code: "JENKINS_PIPELINE",
            description: "Compromise a dev server and inject malicious payloads into build pipelines in 'Chain Reaction'.",
            status: "Locked",
            skills: [
                { name: "Jenkins Exploitation", level: "Intermediate" },
                { name: "Build Artifact Poisoning", level: "Beginner" },
                { name: "Lateral Movement", level: "Beginner" }
            ],
            icon: <Cpu size={24} />
        },
        {
            id: 4,
            title: "Sim IV: Ransomware Reversal",
            code: "MALWARE_DECRYPT",
            description: "Reverse-engineer a ransomware key and restore a medical database in 'Patient Zero'.",
            status: "Locked",
            skills: [
                { name: "Malware Analysis", level: "Beginner" },
                { name: "Decryption Routine", level: "Locked" },
                { name: "Backup Restoration", level: "Locked" }
            ],
            icon: <AlertCircle size={24} />
        }
    ];

    return (
        <div className="rl-roadmap-container">
            <PageTemplate fullWidth>
                <header className="rl-roadmap-header">
                    <div className="protocol-tab">
                        <MapPin size={14} className="text-orange-500" />
                        ROADMAP // REAL_WORLD_SIM_PATH
                    </div>
                    <h1 className="rl-roadmap-title">
                        ENTERPRISE <span className="outline">ROADMAP</span>
                    </h1>
                    <p className="rl-roadmap-subtitle">The path through our high-fidelity enterprise simulations. Master all insane scenarios.</p>
                </header>

                <div className="roadmap-timeline">
                    {phases.map((phase, index) => (
                        <div key={phase.id} className={`roadmap-phase ${phase.status.toLowerCase()}`}>
                            <div className="phase-marker">
                                <div className="marker-dot">
                                    {phase.status === 'Locked' ? <Lock size={14} /> : phase.icon}
                                </div>
                                {index !== phases.length - 1 && <div className="marker-line"></div>}
                            </div>

                            <div className="phase-content">
                                <div className="phase-header">
                                    <div className="phase-meta">
                                        <span className="phase-code">{phase.code}</span>
                                        <span className={`status-badge ${phase.status.toLowerCase()}`}>{phase.status}</span>
                                    </div>
                                    <h2 className="phase-title">{phase.title}</h2>
                                </div>

                                <p className="phase-desc">{phase.description}</p>

                                <div className="phase-skills">
                                    {phase.skills.map((skill, sIdx) => (
                                        <div key={sIdx} className="skill-tag">
                                            <span className="skill-name">{skill.name}</span>
                                            <span className="skill-level">{skill.level}</span>
                                        </div>
                                    ))}
                                </div>

                                {phase.status !== 'Locked' && (
                                    <button className="phase-action-btn" onClick={() => navigate('../scenarios')}>
                                        VIEW_SIMULATION <ChevronRight size={14} />
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="roadmap-final-card">
                    <div className="final-glow"></div>
                    <div className="final-content">
                        <Globe size={32} className="text-orange-600 mb-4" />
                        <h3>REAL_WORLD_MASTER_READY</h3>
                        <p>Complete the entire 'Insane' set to be eligible for global leaderboards and specialized certifications.</p>
                        <div className="final-stats">
                            <div className="f-stat">
                                <Layers size={16} />
                                <span>Simulations: 1/4</span>
                            </div>
                            <div className="f-stat">
                                <Activity size={16} />
                                <span>Complexity: EXTREME</span>
                            </div>
                        </div>
                    </div>
                </div>
            </PageTemplate>
        </div>
    );
}
