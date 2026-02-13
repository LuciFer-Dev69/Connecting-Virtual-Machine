import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { ROUTES } from '../config/routes.config';
import { Layout, Globe, Activity, Map } from 'lucide-react';

const RealLifeLayout = () => {
    const sidebarItems = [
        {
            label: 'Dashboard',
            path: 'dashboard',
            icon: <Layout size={18} />,
            exact: true
        },
        {
            label: 'Scenarios',
            path: 'scenarios',
            icon: <Globe size={18} />
        },
        {
            label: 'Ops Roadmap',
            path: 'roadmap',
            icon: <Map size={18} />
        },
        { type: 'divider' },
        {
            label: 'Leaderboard',
            path: '/dashboard',
            icon: <Activity size={18} />
        }
    ];

    return (
        <div className="theme-real-life" style={{ display: 'flex', height: '100%', width: '100%' }}>
            <Sidebar items={sidebarItems} title="ENTERPRISE OPS" variant="real-life" />
            <div style={{
                flex: 1,
                overflowY: 'auto',
                overflowX: 'hidden',
                position: 'relative',
                display: 'flex',
                flexDirection: 'column'
            }}>
                <div style={{ flex: '1 0 auto', paddingBottom: '2rem' }}>
                    <Outlet />
                </div>
            </div>
        </div>
    );
};

export default RealLifeLayout;
