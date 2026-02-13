import React from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import { LayoutDashboard, Zap, Shield, Info } from 'lucide-react';
import { ROUTES } from '../config/routes.config';
import './Layout.css';

const AIInjectorLayout = () => {
    return (
        <div className="section-layout">
            <div className="section-header">
                <div className="header-content">
                    <div className="section-title">
                        <Zap className="title-icon ai-accent" size={24} />
                        <h1>AI Injector</h1>
                    </div>
                    <div className="section-nav">
                        <NavLink
                            to={ROUTES.AI_INJECTOR.DASHBOARD}
                            className={({ isActive }) => `sec-nav-link ${isActive ? 'active' : ''}`}
                        >
                            <LayoutDashboard size={14} /> Dashboard
                        </NavLink>
                        <NavLink
                            to={ROUTES.AI_INJECTOR.LAB}
                            className={({ isActive }) => `sec-nav-link ${isActive ? 'active' : ''}`}
                        >
                            <Shield size={14} /> AI Lab
                        </NavLink>
                    </div>
                </div>
                <div className="header-actions">
                    <div className="status-badge running">
                        <div className="pulse-dot" />
                        Neural Engine Online
                    </div>
                </div>
            </div>

            <div className="section-content">
                <Outlet />
            </div>
        </div>
    );
};

export default AIInjectorLayout;
