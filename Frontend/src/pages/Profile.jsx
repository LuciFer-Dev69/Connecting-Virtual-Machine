import React, { useState, useRef } from "react";
import { Shield, Camera, Trash2, Save, LogOut, User, Mail, Calendar, Activity, Lock, Palette } from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import PageTemplate from "../components/templates/PageTemplate";
import './Profile.css';

export default function Profile() {
  const { theme, toggleTheme } = useTheme();
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const [name, setName] = useState(user?.name || user?.username || "");
  const [email, setEmail] = useState(user?.email || "");
  const [profilePic, setProfilePic] = useState(user?.profilePic || "");
  const [msg, setMsg] = useState("");
  const [msgType, setMsgType] = useState("");
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        setMsg("Image size should be less than 2MB");
        setMsgType("error");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => setProfilePic(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSave = (e) => {
    e.preventDefault();
    const updatedUser = { ...user, name, email, profilePic };
    localStorage.setItem("user", JSON.stringify(updatedUser));
    setMsg("Identity updated successfully.");
    setMsgType("success");
    setTimeout(() => setMsg(""), 3000);
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    window.location.hash = "#/login";
  };

  // Mock Heatmap Data
  const renderHeatmap = () => {
    const bubbles = [];
    for (let i = 0; i < 60; i++) {
      const lvl = Math.floor(Math.random() * 5); // 0-4
      bubbles.push(<div key={i} className={`heat-box lvl-${lvl}`}></div>);
    }
    return bubbles;
  };

  return (
    <div className="profile-view-container">
      <PageTemplate
        title="Operative Identity"
        subtitle="Manage your digital footprint and operational preferences."
      >
        <div className="profile-container">

          {/* 1. Header Card */}
          <div className="profile-header-card">
            <div className="profile-cover"></div>
            <div className="profile-header-content">

              <div className="avatar-wrapper">
                {profilePic ? (
                  <img src={profilePic} alt="Profile" className="avatar-img" />
                ) : (
                  <div className="avatar-placeholder"><User size={48} /></div>
                )}
                <button
                  className="avatar-edit-btn"
                  onClick={() => fileInputRef.current.click()}
                  title="Update Avatar"
                >
                  <Camera size={18} />
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  style={{ display: "none" }}
                />
              </div>

              <div className="user-identity">
                <h2>{name || "Unknown Operative"}</h2>
                <div className="user-identity-meta">
                  <span className="meta-item"><Shield size={14} className="meta-icon" /> Level {user.level || 1} Operative</span>
                  <span className="meta-item"><Calendar size={14} className="meta-icon" /> Joined {new Date().getFullYear()}</span>
                </div>
              </div>

              <div className="header-stats">
                <div className="stat-box">
                  <span className="stat-value">{user.progress || 0}</span>
                  <span className="stat-label">XP Points</span>
                </div>
                <div className="stat-box">
                  <span className="stat-value">#42</span>
                  <span className="stat-label">Global Rank</span>
                </div>
                <div className="stat-box">
                  <span className="stat-value">12</span>
                  <span className="stat-label">Badges</span>
                </div>
              </div>

            </div>
          </div>

          {/* 2. Main Grid */}
          <div className="profile-main-grid">

            {/* Column 1: Identity Form */}
            <div className="profile-card">
              <div className="card-header">
                <h3 className="card-title"><User size={20} /> Identity Settings</h3>
              </div>

              <form onSubmit={handleSave} className="form-grid">
                <div className="form-group">
                  <label className="label-text">Operative Alias / Name</label>
                  <input
                    type="text"
                    className="input-field"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter alias"
                  />
                </div>

                <div className="form-group">
                  <label className="label-text">Secure Comm Channel (Email)</label>
                  <input
                    type="email"
                    className="input-field"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="agent@chakraview.io"
                  />
                </div>

                <div className="form-group" style={{ gridColumn: 'span 2' }}>
                  <label className="label-text">Bio / Mission Statement</label>
                  <textarea
                    className="input-field"
                    rows={3}
                    placeholder="Describe your operational focus..."
                    style={{ resize: 'none' }}
                  ></textarea>
                </div>
              </form>

              <div className="action-bar">
                {msg && (
                  <span className={`form-message ${msgType}`} style={{ marginRight: 'auto' }}>
                    {msg}
                  </span>
                )}
                <button type="button" className="btn-save" onClick={handleSave}>
                  <Save size={18} /> Update Identity
                </button>
              </div>
            </div>

            {/* Column 2: Stats & Preferences */}
            <div className="profile-column-right" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

              {/* Activity Card */}
              <div className="profile-card">
                <div className="card-header">
                  <h3 className="card-title"><Activity size={20} /> Operational Activity</h3>
                </div>
                <div className="activity-heatmap" style={{ marginTop: '16px' }}>
                  {renderHeatmap()}
                </div>
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '4px', marginTop: '8px', fontSize: '10px', color: '#64748b' }}>
                  <span>Less</span>
                  <div className="heat-box lvl-0" style={{ width: 10, height: 10 }}></div>
                  <div className="heat-box lvl-2" style={{ width: 10, height: 10 }}></div>
                  <div className="heat-box lvl-4" style={{ width: 10, height: 10 }}></div>
                  <span>More</span>
                </div>
              </div>

              {/* Preferences Card */}
              <div className="profile-card">
                <div className="card-header">
                  <h3 className="card-title"><Palette size={20} /> System Preferences</h3>
                </div>

                <div className="pref-row">
                  <div className="pref-info">
                    <h4>Interface Theme</h4>
                    <p>Toggle system dark mode.</p>
                  </div>
                  <button onClick={toggleTheme} className="btn-toggle">
                    {theme === 'dark' ? 'Dark' : 'Light'}
                  </button>
                </div>

                <div className="pref-row">
                  <div className="pref-info">
                    <h4>2FA Security</h4>
                    <p>Enhanced login protection.</p>
                  </div>
                  <button className="btn-toggle">Enable</button>
                </div>

                <div className="pref-row" style={{ marginTop: 'auto', paddingTop: '24px' }}>
                  <button className="btn-logout" style={{ width: '100%', justifyContent: 'center' }} onClick={handleLogout}>
                    <LogOut size={18} /> Logout
                  </button>
                </div>
              </div>

            </div>

          </div>

        </div>
      </PageTemplate>
    </div>
  );
}