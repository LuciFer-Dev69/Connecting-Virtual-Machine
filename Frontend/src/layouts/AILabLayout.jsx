import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { ROUTES } from '../config/routes.config';
import { Terminal, ShieldAlert, Cpu, Activity, Layout } from 'lucide-react';

const AILabLayout = () => {
    const sidebarItems = [
        {
            label: 'AI Dashboard',
            path: 'prompt-injection',
            icon: <Layout size={18} />,
            exact: true
        },
        {
            label: 'Prompt Injection',
            path: 'prompt-injection',
            icon: <Terminal size={18} />
        },
        {
            label: 'Log Analyzer',
            path: 'log-analysis',
            icon: <ShieldAlert size={18} />
        },
        {
            label: 'LLM Defenses',
            path: 'simulator',
            icon: <Cpu size={18} />
        },
        { type: 'divider' },
        {
            label: 'Research Papers',
            path: '/ai-labs/research', // Future
            icon: <Activity size={18} />
        }
    ];

    return (
        <div style={{ display: 'flex', height: '100%', width: '100%' }}>
            <Sidebar items={sidebarItems} title="AI SECURITY LABS" variant="ai-labs" />
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

export default AILabLayout;
