import React, { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { Terminal, Wifi, Clock, Activity, Power, RefreshCw } from 'lucide-react';
import { API_BASE } from '../config';

const PwnBoxLayout = () => {
    const [terminating, setTerminating] = useState(false);
    const navigate = useNavigate();

    const handleTerminateAndRespawn = async () => {
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        const userId = user.user_id || user.id;

        if (!userId) {
            alert('User not authenticated');
            return;
        }

        setTerminating(true);

        try {
            // Use atomic restart endpoint
            const response = await fetch(`${API_BASE}/pwnbox/restart`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ user_id: userId })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to restart PwnBox');
            }

            // Success - reload to reconnect with new container
            console.log('✅ PwnBox restarted:', data);
            window.location.reload();

        } catch (error) {
            console.error('❌ Restart error:', error);
            alert(`Failed to restart PwnBox: ${error.message}`);
            setTerminating(false);
        }
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%', width: '100%', background: '#000' }}>
            {/* Minimal Status Header */}
            <div style={{
                height: '40px',
                background: 'var(--bg-panel)',
                borderBottom: '1px solid var(--border-primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0 1rem',
                fontSize: '13px',
                color: 'var(--text-secondary)'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--accent-green)', fontWeight: 600 }}>
                        <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--accent-green)', boxShadow: '0 0 8px var(--accent-green)' }} />
                        SYSTEM ONLINE
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Wifi size={14} />
                        <span>VPN: <span style={{ color: 'var(--text-primary)' }}>10.10.14.22</span></span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Terminal size={14} />
                        <span>TARGET: <span style={{ color: 'var(--accent-red)' }}>10.10.11.24</span></span>
                    </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontFamily: 'var(--font-mono)' }}>
                        <Clock size={14} />
                        <span>01:59:33</span>
                    </div>
                    <button
                        onClick={handleTerminateAndRespawn}
                        disabled={terminating}
                        style={{
                            background: terminating ? 'rgba(100, 100, 100, 0.1)' : 'rgba(220, 38, 38, 0.1)',
                            color: terminating ? '#666' : 'var(--accent-red)',
                            border: `1px solid ${terminating ? 'rgba(100, 100, 100, 0.2)' : 'rgba(220, 38, 38, 0.2)'}`,
                            borderRadius: '4px',
                            padding: '4px 8px',
                            cursor: terminating ? 'not-allowed' : 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                            fontSize: '11px',
                            fontWeight: 600,
                            transition: 'all 0.2s'
                        }}
                    >
                        {terminating ? (
                            <>
                                <RefreshCw size={12} style={{ animation: 'spin 1s linear infinite' }} />
                                RESTARTING...
                            </>
                        ) : (
                            <>
                                <Power size={12} /> TERMINATE & RESPAWN
                            </>
                        )}
                    </button>
                </div>
            </div>

            {/* Terminal Area */}
            <div style={{ flex: 1, overflowY: 'auto', position: 'relative' }}>
                <Outlet />
            </div>

            <style>{`
                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    );
};

export default PwnBoxLayout;
