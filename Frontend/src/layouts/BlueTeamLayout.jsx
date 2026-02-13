import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { ROUTES } from '../config/routes.config';
import { ShieldCheck, Search, Bell, Activity, FileText } from 'lucide-react';

const BlueTeamLayout = () => {
    const sidebarItems = [
        {
            label: 'SOC Dashboard',
            path: 'dashboard',
            icon: <Activity size={18} />,
            exact: true
        },
        {
            label: 'Incident Roadmap',
            path: 'roadmap',
            icon: <ShieldCheck size={18} />
        },
        {
            label: 'Forensics Labs',
            path: 'forensics',
            icon: <Search size={18} />
        },
        { type: 'divider' },
        {
            label: 'Leaderboard',
            path: '/dashboard',
            icon: <Activity size={18} />
        }
    ];

    return (
        <div className="theme-blue" style={{ display: 'flex', height: '100%', width: '100%' }}>
            <Sidebar items={sidebarItems} title="BLUE TEAM DEFENSE" variant="blue-team" />
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

export default BlueTeamLayout;
