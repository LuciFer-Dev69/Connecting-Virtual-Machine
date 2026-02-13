
import React, { useState } from "react";
import PublicNavbar from "../components/PublicNavbar";
import Footer from "../components/Footer";
import { Shield, ChevronRight, Zap, Target, Award, Terminal, Activity, Globe, Cpu } from "lucide-react";
import './Landing.css';

import MatrixBackground from "../components/MatrixBackground";

export default function Landing() {
  const [activeTab, setActiveTab] = useState('readiness');

  return (
    <div className="landing-page">
      <MatrixBackground />
      <PublicNavbar />

      {/* --- HERO SECTION --- */}
      <section className="hero-wrapper">
        <div className="hero-geometric-bg"></div>
        <div className="hero-main">
          <h1>
            Cyber Mastery:<br />
            <span style={{ color: 'var(--brand-primary)' }}>Personal Insight.</span><br />
            Professional Power.
          </h1>
          <p>
            Chakra View combines hands-on offensive and defensive labs, AI-enhanced
            intelligence, and the power of community to help individuals and teams master
            cybersecurity and accelerate operational readiness.
          </p>
          <div className="hero-cta-group">
            <a href="#/signup" className="btn-hero-primary">
              Join the Operation
            </a>
            <a href="#/about" className="nav-item" style={{ fontWeight: 700, fontSize: '1rem' }}>
              Discover the Platform
            </a>
          </div>
        </div>
        <div className="hero-visual-side">
          <div className="hero-video-container">
            <video
              autoPlay
              loop
              muted
              playsInline
              className="hero-video"
            >
              <source src="/assets/hacker-bg.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
            <div className="video-overlay"></div>
          </div>
        </div>
      </section>

      {/* --- TRUSTED BY --- */}
      <section className="trusted-section">
        <div className="trusted-title">Leading the next generation of security pros</div>
        <div className="logo-cloud">
          {/* Mock Logos for Professional Look */}
          <span style={{ fontSize: '1.5rem', fontWeight: 900, color: '#fff' }}>HACKER</span>
          <span style={{ fontSize: '1.5rem', fontWeight: 900, color: '#fff' }}>SECURE</span>
          <span style={{ fontSize: '1.5rem', fontWeight: 900, color: '#fff' }}>QUANTUM</span>
          <span style={{ fontSize: '1.5rem', fontWeight: 900, color: '#fff' }}>DEFENSE</span>
          <span style={{ fontSize: '1.5rem', fontWeight: 900, color: '#fff' }}>CHAKRA</span>
        </div>
      </section>

      {/* --- VALIDATION SECTION --- */}
      <section className="validation-section">
        <div className="validation-header">
          <h2>Emulate Real Threats. Validate Readiness.</h2>
        </div>

        <div className="tab-container">
          <button
            className={`tab-trigger ${activeTab === 'readiness' ? 'active' : ''}`}
            onClick={() => setActiveTab('readiness')}
          >
            Validate Your Readiness
          </button>
          <button
            className={`tab-trigger ${activeTab === 'workforce' ? 'active' : ''}`}
            onClick={() => setActiveTab('workforce')}
          >
            Develop Your Workforce
          </button>
          <button
            className={`tab-trigger ${activeTab === 'resilience' ? 'active' : ''}`}
            onClick={() => setActiveTab('resilience')}
          >
            Achieve Cyber Resilience
          </button>
        </div>

        <div className="validation-content-card">
          <div className="v-text">
            <h3>{activeTab === 'readiness' ? 'Emulate Real Threats.' : activeTab === 'workforce' ? 'Scale Your Team.' : 'Always Prepared.'}</h3>
            <p>
              Validate cybersecurity capabilities and operational readiness against real-world
              threats by replicating adversarial behaviors or attacks in threat simulation
              programs.
            </p>
            <div className="v-features">
              <div className="v-feature-item">
                <h4>Enterprise attack simulation training</h4>
                <p>Real-world attack simulations and live-fire team exercises.</p>
              </div>
              <div className="v-feature-item">
                <h4>Purple-minded scenarios</h4>
                <p>Replicate complex multi-stage threats because modern breaches exploit entire networks.</p>
              </div>
            </div>
          </div>
          <div className="v-visual">
            <div style={{
              width: '100%',
              height: '550px', // Increased height to accommodate the detailed interface
              background: '#0b0f19',
              borderRadius: '24px',
              border: '1px solid var(--border-primary)',
              overflow: 'hidden',
              position: 'relative',
              boxShadow: '0 20px 50px rgba(0, 0, 0, 0.5)'
            }}>
              <iframe
                src="https://livethreatmap.radware.com/"
                style={{
                  width: '100%',
                  height: '100%',
                  border: 'none',
                  // Applying a subtle blue tint to integrate with the theme without distorting the map too much
                  filter: 'sepia(0.2) hue-rotate(180deg) contrast(1.1) brightness(0.9)'
                }}
                title="Live Cyber Threat Map"
                loading="lazy"
                sandbox="allow-scripts allow-same-origin allow-forms"
              ></iframe>

              {/* Inner Border Glow for consistent branding */}
              <div style={{
                position: 'absolute',
                inset: 0,
                boxShadow: 'inset 0 0 30px rgba(0, 212, 255, 0.1)',
                pointerEvents: 'none',
                zIndex: 20
              }}></div>
            </div>
          </div>
        </div>
      </section>

      {/* --- AUDIENCE/SECTORS --- */}
      <section className="sectors-section">
        <div className="sectors-grid">
          <div className="sector-card">
            <div className="sector-image" style={{ background: 'linear-gradient(45deg, #0b0f19, #1e293b)' }}></div>
            <div className="sector-body">
              <h3>For Individuals</h3>
              <p>Learn, refine and master your cyber skills in the ultimate gamified platform.</p>
              <a href="#/signup" className="btn-sector">Begin your journey <ChevronRight size={16} /></a>
            </div>
          </div>

          <div className="sector-card">
            <div className="sector-image" style={{ background: 'linear-gradient(45deg, #05080f, #0b0f19)' }}></div>
            <div className="sector-body">
              <h3>For Businesses</h3>
              <p>Build and scale threat-ready enterprise cyber teams with targeted challenges.</p>
              <a href="#/signup" className="btn-sector">Scale your team <ChevronRight size={16} /></a>
            </div>
          </div>

          <div className="sector-card">
            <div className="sector-image" style={{ background: 'linear-gradient(45deg, #111927, #1e293b)' }}></div>
            <div className="sector-body">
              <h3>For Academic</h3>
              <p>Cyber career development designed specifically for educational institutions.</p>
              <a href="#/signup" className="btn-sector">Learn more <ChevronRight size={16} /></a>
            </div>
          </div>
        </div>
      </section>

      {/* --- AI RANGE BANNER --- */}
      <section style={{ padding: '0 40px 100px' }}>
        <div style={{
          background: 'linear-gradient(135deg, #0b0f19, #05080f)',
          borderRadius: '24px',
          padding: '60px',
          border: '1px solid var(--border-primary)',
          textAlign: 'center'
        }}>
          <span style={{ color: 'var(--brand-primary)', fontWeight: 700, letterSpacing: '0.1em', fontSize: '0.9rem' }}>LATEST PRODUCT NEWS</span>
          <h2 style={{ fontSize: '3rem', margin: '20px 0 40px' }}>Chakra View launches the world's <span style={{ color: 'var(--brand-primary)' }}>first AI Range</span></h2>
          <p style={{ maxWidth: '800px', margin: '0 auto 40px', fontSize: '1.2rem' }}>
            The world's first controlled AI cyber range built to test and benchmark the safety,
            limits and capabilities of autonomous AI security agents.
          </p>
          <a href="#/signup" className="btn-hero-primary">Learn more</a>
        </div>
      </section>

      <Footer />
    </div>
  );
}