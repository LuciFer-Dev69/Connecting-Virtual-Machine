import React from "react";
import {
    Search, Shield, Terminal, Target, Zap,
    MapPin, ChevronRight, Lock, Unlock,
    Layers, Globe, Sword, Activity
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import PageTemplate from "../components/templates/PageTemplate";
import './RedTeamRoadmap.css';

export default function RedTeamRoadmap() {
    const navigate = useNavigate();

    const phases = [
        {
            id: 1,
            title: "Phase I: Reconnaissance",
            code: "PROTOCOL_RECON",
            description: "Master the art of information gathering and network mapping without being detected.",
            status: "Complete",
            skills: [
                { name: "Advanced Nmap Scanning", level: "Expert" },
                { name: "OSINT Techniques", level: "Advanced" },
                { name: "Subdomain Enumeration", level: "Intermediate" }
            ],
            icon: <Search size={24} />
        },
        {
            id: 2,
            title: "Phase II: Web Weaponization",
            code: "PROTOCOL_WEAPON",
            description: "Bypass modern firewalls and exploit common web vulnerabilities like SQLi, XSS, and SSRF.",
            status: "Active",
            skills: [
                { name: "Burp Suite Pro Simulation", level: "Master" },
                { name: "Manual SQL Injection", level: "Advanced" },
                { name: "Broken Auth Bypass", level: "Intermediate" }
            ],
            icon: <Globe size={24} />
        },
        {
            id: 3,
            title: "Phase III: System Exploitation",
            code: "PROTOCOL_EXPLOIT",
            description: "Gain initial footholds on Linux and Windows systems using buffer overflows and known CVEs.",
            status: "Locked",
            skills: [
                { name: "Metasploit Mastery", level: "Intermediate" },
                { name: "Custom Exploit Development", level: "Beginner" },
                { name: "Reverse Shell Management", level: "Beginner" }
            ],
            icon: <Sword size={24} />
        },
        {
            id: 4,
            title: "Phase IV: Post-Exploitation",
            code: "PROTOCOL_POST_OPS",
            description: "Maintain persistence, escalate privileges to root, and move laterally through the network.",
            status: "Locked",
            skills: [
                { name: "PrivEsc Techniques", level: "Beginner" },
                { name: "Lateral Movement (AD)", level: "Locked" },
                { name: "Persistence Scripts", level: "Locked" }
            ],
            icon: <Shield size={24} />
        },
        {
            id: 5,
            title: "Phase V: Domain Domination",
            code: "PROTOCOL_DOMINATE",
            description: "Final assault on the internal domain controller and exfiltration of sensitive neural data.",
            status: "Locked",
            skills: [
                { name: "Domain Admin Takeover", level: "Locked" },
                { name: "Data Exfiltration", level: "Locked" }
            ],
            icon: <Target size={24} />
        }
    ];

    return (
        <div className="red-roadmap-container">
            <PageTemplate fullWidth>
                <header className="red-roadmap-header">
                    <div className="protocol-tab">
                        <MapPin size={14} className="text-red-500" />
                        ROADMAP // RED_OPERATIVE_PATH
                    </div>
                    <h1 className="red-roadmap-title">
                        OFFENSIVE <span className="outline">ROADMAP</span>
                    </h1>
                    <p className="red-roadmap-subtitle">From reconnaissance to full domain takeover. Your path to becoming an Elite Red Team Operative.</p>
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
                                    <button className="phase-action-btn" onClick={() => navigate('../challenges')}>
                                        VIEW_RELATED_LABS <ChevronRight size={14} />
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Final Target Card */}
                <div className="roadmap-final-card">
                    <div className="final-glow"></div>
                    <div className="final-content">
                        <Activity size={32} className="text-red-600 mb-4" />
                        <h3>ELITE_OPERATIVE_STATUS</h3>
                        <p>Complete all phases to unlock the classified "Real Life" insane scenarios and join the high-level ranking system.</p>
                        <div className="final-stats">
                            <div className="f-stat">
                                <Layers size={16} />
                                <span>Phases: 2/5</span>
                            </div>
                            <div className="f-stat">
                                <Zap size={16} />
                                <span>Complexity: HIGH</span>
                            </div>
                        </div>
                    </div>
                </div>
            </PageTemplate>
        </div>
    );
}
