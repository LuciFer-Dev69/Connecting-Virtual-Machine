
import React, { useState, useEffect } from 'react';
import { Shield } from 'lucide-react';
import './PublicNavbar.css';

export default function PublicNavbar() {
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <nav className="public-navbar">
            <a href="#/" className="nav-left-section">
                <div className="nav-logo-icon">
                    <Shield size={24} fill="currentColor" />
                </div>
                <span className="nav-logo-text">CHAKRA VIEW</span>
            </a>

            <div className="nav-center-section">
                <a href="#/about" className="nav-item">Why Chakra?</a>
                <a href="#/platform" className="nav-item">Platform</a>
                <a href="#/pwnbox" className="nav-item">Labs</a>
                <a href="#/resources" className="nav-item">Resources</a>
            </div>

            <div className="nav-right-section">
                <a href="#/login" className="btn-signin">Sign in</a>
                <a href="#/signup" className="btn-getstarted">Get Started</a>
            </div>
        </nav>
    );
}
