import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { ROUTES } from '../config/routes.config';
import { Briefcase, Server, UserX, Layout, Globe } from 'lucide-react';

const RealLifeLayout = () => {
    const sidebarItems = [
        {
            label: 'Scenarios Hub',
            path: 'corporate', // Base redirects here, should highlight this
            icon: <Layout size={18} />,
            exact: true
        },
        {
            label: 'Corporate Espionage',
            path: 'corporate',
            icon: <Briefcase size={18} />
        },
        {
            label: 'Infrastructure Breach',
            path: 'infrastructure',
            icon: <Globe size={18} />
        },
        {
            label: 'Insider Threat',
            path: 'insider',
            icon: <UserX size={18} />
        },
        { type: 'divider' },
        {
            label: 'Network Logs',
            path: '/real-life/logs', // Future
            icon: <Server size={18} />
        }
    ];

    return (
        <div style={{ display: 'flex', height: '100%', width: '100%' }}>
            <Sidebar items={sidebarItems} title="ENTERPRISE SIMULATION" variant="real-life" />
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
