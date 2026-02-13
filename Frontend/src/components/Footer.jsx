import React from 'react';
import { Shield, Github, Twitter, Linkedin, Facebook, Instagram } from 'lucide-react';
import './Footer.css';

const Footer = () => {
    const user = JSON.parse(localStorage.getItem('user') || 'null');

    return (
        <footer className="footer-section">
            <div className="footer-container">
                {/* 1. Brand & CTA Column */}
                <div className="footer-brand-col">
                    <a href={user ? "#/dashboard" : "#/"} className="footer-logo">
                        <Shield className="auth-logo-icon" fill="currentColor" size={24} />
                        <span>CHAKRA VIEW</span>
                    </a>
                    <p className="footer-tagline">
                        The #1 platform to build attack-ready teams and organizations. Master cybersecurity with hands-on labs and AI-driven insights.
                    </p>
                    {!user && (
                        <a href="#/signup" className="btn-footer-cta">
                            Get Started
                        </a>
                    )}
                    <div style={{ marginTop: '20px', color: '#64748b', fontSize: '12px' }}>
                        Trusted by top security teams worldwide
                    </div>
                </div>

                {/* 2. Links Grid */}
                <div className="footer-links-grid">
                    <div>
                        <span className="footer-col-title">Products</span>
                        <div className="footer-link-list">
                            <a href="#/modules" className="footer-link">Teams</a>
                            <a href="#/modules" className="footer-link">Courses & Certifications</a>
                            <a href="#/pwnbox" className="footer-link">Cyber Ranges</a>
                            <a href="#/pwnbox" className="footer-link">Cloud Infrastructure</a>
                        </div>
                    </div>

                    <div>
                        <span className="footer-col-title">Solutions</span>
                        <div className="footer-link-list">
                            <a href="#/red-team" className="footer-link">Red Teams</a>
                            <a href="#/blue-team" className="footer-link">Blue Teams</a>
                            <a href="#/purple-team" className="footer-link">Purple Teams</a>
                            <a href="#/government" className="footer-link">Government</a>
                            <a href="#/education" className="footer-link">Education</a>
                        </div>
                    </div>

                    <div>
                        <span className="footer-col-title">Resources</span>
                        <div className="footer-link-list">
                            <a href="#/community" className="footer-link">Community</a>
                            <a href="#/blog" className="footer-link">Blog</a>
                            <a href="#/reports" className="footer-link">Industry Reports</a>
                            <a href="#/careers" className="footer-link">Careers</a>
                        </div>
                    </div>

                    <div>
                        <span className="footer-col-title">Company</span>
                        <div className="footer-link-list">
                            <a href="#/about" className="footer-link">About Us</a>
                            <a href="#/newsroom" className="footer-link">Newsroom</a>
                            <a href="#/partners" className="footer-link">Partners</a>
                            <a href="#/legal" className="footer-link">Legal</a>
                            <a href="#/contact" className="footer-link">Contact Us</a>
                        </div>
                    </div>
                </div>
            </div>

            {/* 3. Bottom Bar */}
            <div className="footer-bottom">
                <div className="footer-socials">
                    <a href="#" className="social-icon"><Github size={18} /></a>
                    <a href="#" className="social-icon"><Twitter size={18} /></a>
                    <a href="#" className="social-icon"><Linkedin size={18} /></a>
                    <a href="#" className="social-icon"><Instagram size={18} /></a>
                    <a href="#" className="social-icon"><Facebook size={18} /></a>
                </div>

                <div style={{ display: 'flex', gap: '24px' }}>
                    <a href="#/privacy" className="footer-link">Privacy Policy</a>
                    <a href="#/terms" className="footer-link">Terms of Service</a>
                    <a href="#/cookies" className="footer-link">Cookie Settings</a>
                </div>

                <div>
                    &copy; {new Date().getFullYear()} Chakra View. All rights reserved.
                </div>
            </div>
        </footer>
    );
};

export default Footer;
