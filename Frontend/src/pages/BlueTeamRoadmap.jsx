import React from "react";
import {
    Shield, Terminal, Search, Zap,
    MapPin, ChevronRight, Lock,
    Layers, Eye, Activity, Info, BarChart
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import PageTemplate from "../components/templates/PageTemplate";
import './BlueTeamRoadmap.css';

export default function BlueTeamRoadmap() {
    const navigate = useNavigate();

    const phases = [
        {
            id: 1,
            title: "Phase I: Traffic Analysis",
            code: "PROTOCOL_WATCH",
            description: "Monitor network packets and identify suspicious patterns using Wireshark and IDS tools.",
            status: "Complete",
            skills: [
                { name: "Packet Decryption", level: "Expert" },
                { name: "Snort Rule Writing", level: "Advanced" },
                { name: "Traffic Flow Analysis", level: "Intermediate" }
            ],
            icon: <Activity size={24} />
        },
        {
            id: 2,
            title: "Phase II: Digital Forensics",
            code: "PROTOCOL_TRACE",
            description: "Recover deleted artifacts and trace the origin of unauthorized neural link attempts.",
            status: "Active",
            skills: [
                { name: "Memory Forensics", level: "Master" },
                { name: "Disk Image Analysis", level: "Advanced" },
                { name: "Artifact Recovery", level: "Intermediate" }
            ],
            icon: <Search size={24} />
        },
        {
            id: 3,
            title: "Phase III: Threat Hunting",
            code: "PROTOCOL_HUNT",
            description: "Proactively search for hidden persistence mechanisms and rootkits within the global infrastructure.",
            status: "Locked",
            skills: [
                { name: "EDR Monitoring", level: "Intermediate" },
                { name: "Process Analysis", level: "Beginner" },
                { name: "SIEM Dashboard Config", level: "Beginner" }
            ],
            icon: <Eye size={24} />
        },
        {
            id: 4,
            title: "Phase IV: Malware Sanitization",
            code: "PROTOCOL_PURGE",
            description: "Deconstruct malicious payloads safely and develop vaccination signatures for neural links.",
            status: "Locked",
            skills: [
                { name: "Static Analysis", level: "Beginner" },
                { name: "Dynamic Sandboxing", level: "Locked" },
                { name: "Code Deobfuscation", level: "Locked" }
            ],
            icon: <Terminal size={24} />
        },
        {
            id: 5,
            title: "Phase V: Crisis Response",
            code: "PROTOCOL_RESOLVE",
            description: "Neutralize high-level threats like ransomware and restore critical infrastructure integrity.",
            status: "Locked",
            skills: [
                { name: "Ransomware Decryption", level: "Locked" },
                { name: "System Hardening", level: "Locked" }
            ],
            icon: <Shield size={24} />
        }
    ];

    return (
        <div className="blue-roadmap-container">
            <PageTemplate fullWidth>
                <header className="blue-roadmap-header">
                    <div className="protocol-tab">
                        <MapPin size={14} className="text-blue-500" />
                        ROADMAP // BLUE_OPERATIVE_PATH
                    </div>
                    <h1 className="blue-roadmap-title">
                        DEFENSIVE <span className="outline">ROADMAP</span>
                    </h1>
                    <p className="blue-roadmap-subtitle">From monitoring to full-scale threat neutralization. Your path to becoming a Guardian Operative.</p>
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
                                    <button className="phase-action-btn" onClick={() => navigate('../forensics')}>
                                        VIEW_RELATED_LABS <ChevronRight size={14} />
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Final Resilience Card */}
                <div className="roadmap-final-card">
                    <div className="final-glow"></div>
                    <div className="final-content">
                        <BarChart size={32} className="text-blue-600 mb-4" />
                        <h3>GUARDIAN_OPERATIVE_STATUS</h3>
                        <p>Complete all defensive phases to unlock exclusive "Patient Zero" ransomware reversal scenarios and master blue team tools.</p>
                        <div className="final-stats">
                            <div className="f-stat">
                                <Layers size={16} />
                                <span>Phases: 1/5</span>
                            </div>
                            <div className="f-stat">
                                <Zap size={16} />
                                <span>Complexity: ROBUST</span>
                            </div>
                        </div>
                    </div>
                </div>
            </PageTemplate>
        </div>
    );
}
