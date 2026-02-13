import React from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { Shield, Bell, User, LogOut, ChevronDown, Terminal, Zap, Cpu, Layout, Activity, Globe } from 'lucide-react';
import { ROUTES } from '../config/routes.config';
import { useNavigation } from '../context/NavigationContext';
import './Layout.css';

const RootLayout = () => {
  const navigate = useNavigate();
  const { activeSection } = useNavigation();
  const [user, setUser] = React.useState(JSON.parse(localStorage.getItem('user') || '{}'));

  React.useEffect(() => {
    const handleStorageChange = () => {
      setUser(JSON.parse(localStorage.getItem('user') || '{}'));
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    window.location.href = '#/login';
  };

  // Helper to determine active class with specific color accents
  const getTabClass = (isActive, section) => {
    return `nav-tab ${isActive ? 'active' : ''}`; // clean base class
  };

  return (
    <div className="app-layout">
      {/* 1. Top Navbar (Slim - 56px) */}
      <nav className="top-navbar">
        <div className="nav-container">
          {/* Logo Area */}
          <div className="nav-brand-group" onClick={() => navigate(ROUTES.DASHBOARD)}>
            <div className="brand-icon">
              <Shield size={18} weight="bold" />
            </div>
            <span className="brand-text">CHAKRA VIEW</span>
          </div>

          <div className="nav-divider" />

          {/* Primary Navigation Tabs */}
          <div className="nav-tabs">
            <NavLink to={ROUTES.DASHBOARD} className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
              <Layout size={16} /> Dashboard
            </NavLink>

            <NavLink to={ROUTES.MODULES} className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
              <Cpu size={16} /> Modules
            </NavLink>

            <NavLink to={ROUTES.RED_TEAM.BASE} className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
              <Zap size={16} /> Red Team
            </NavLink>

            <NavLink to={ROUTES.BLUE_TEAM.BASE} className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
              <Shield size={16} /> Blue Team
            </NavLink>

            <NavLink to={ROUTES.AI_INJECTOR.BASE} className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
              <Zap size={16} /> AI Injector
            </NavLink>


            <NavLink to={ROUTES.REAL_LIFE.BASE} className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
              <Globe size={16} /> Real Life
            </NavLink>

            <NavLink to={ROUTES.SOC_ANALYST} className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
              <Activity size={16} /> SOC Analyst
            </NavLink>
          </div>
        </div>

        {/* Right Actions */}
        <div className="nav-actions">
          <div className="actions-group">
            {/* XP Indicator */}
            <div className="xp-chip">
              <Zap size={12} fill="currentColor" />
              <span>{user.progress || 0} XP</span>
            </div>

            <button className="action-button" title="Notifications">
              <Bell size={18} />
              <span className="notification-dot" />
            </button>
          </div>

          <div className="nav-divider" />

          {/* User Profile */}
          <div className="user-dropdown" onClick={() => navigate(ROUTES.PROFILE)}>
            <div className="avatar-frame">
              {(user.name?.[0] || user.username?.[0] || 'A').toUpperCase()}
            </div>
            <div className="user-info">
              <span className="user-name">{user.name || 'Operative'}</span>
              <ChevronDown size={14} />
            </div>
          </div>
        </div>
      </nav>

      {/* 2. Content Area (Sidebar + Main View) */}
      <div className="content-wrapper">
        <Outlet />
      </div>
    </div>
  );
};

export default RootLayout;
