import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { ROUTES } from '../config/routes.config';
import { Layout, Target, Map, Terminal, BarChart2, Award } from 'lucide-react';

const RedTeamLayout = () => {
    const sidebarItems = [
        {
            label: 'Dashboard',
            path: 'dashboard',
            icon: <Layout size={18} />,
            exact: true
        },
        {
            label: 'Labs',
            path: 'challenges',
            icon: <Target size={18} />
        },
        {
            label: 'Roadmap',
            path: 'roadmap',
            icon: <Map size={18} />
        },
        {
            label: 'Tools',
            path: ROUTES.PWNBOX,
            icon: <Terminal size={18} />
        },
        { type: 'divider' },
        {
            label: 'Progress',
            path: ROUTES.PROFILE,
            icon: <BarChart2 size={18} />
        },
        {
            label: 'Leaderboard',
            path: '/dashboard',
            icon: <Award size={18} />
        }
    ];

    return (
        <div style={{ display: 'flex', height: '100%', width: '100%' }}>
            <Sidebar items={sidebarItems} title="RED TEAM OPS" variant="red-team" />
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

export default RedTeamLayout;
