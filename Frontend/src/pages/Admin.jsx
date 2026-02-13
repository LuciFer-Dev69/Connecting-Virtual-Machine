import React, { useEffect, useState } from "react";
import {
    LayoutDashboard, Users, Flag, Lock, Unlock, Ban, CheckCircle, ClipboardList,
    Plus, Trash2, Edit2, ShieldAlert, Terminal, Search, RefreshCcw, LogOut, Map, ShieldCheck
} from "lucide-react";
import { API_BASE } from "../config";
import './Admin.css';

export default function Admin() {
    const [activeTab, setActiveTab] = useState("dashboard");
    const [stats, setStats] = useState({ users: 0, challenges: 0, locked: 0, system_status: "Online" });
    const [challenges, setChallenges] = useState([]);
    const [userList, setUserList] = useState([]);
    const [logs, setLogs] = useState([]);
    const [roadmaps, setRoadmaps] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    const token = localStorage.getItem("token");

    const fetchAll = async () => {
        setLoading(true);
        try {
            const headers = { "Authorization": `Bearer ${token}` };
            const [sRes, cRes, uRes, lRes, rRes] = await Promise.all([
                fetch(`${API_BASE}/admin/stats`, { headers }),
                fetch(`${API_BASE}/admin/challenges`, { headers }),
                fetch(`${API_BASE}/admin/users`, { headers }),
                fetch(`${API_BASE}/admin/audit-logs`, { headers }),
                fetch(`${API_BASE}/admin/roadmaps`, { headers }).catch(() => ({ ok: false }))
            ]);

            if (sRes.ok) setStats(await sRes.json());
            if (cRes.ok) setChallenges(await cRes.json());
            if (uRes.ok) setUserList(await uRes.json());
            if (lRes.ok) setLogs(await lRes.json());
            if (rRes && rRes.ok) setRoadmaps(await rRes.json());
        } catch (err) {
            console.error("Admin fetch error:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAll();
    }, [activeTab]);

    const handleLogout = () => {
        localStorage.clear();
        window.location.hash = "#/login";
    };

    const sidebarItems = [
        { label: 'Dashboard', icon: <LayoutDashboard size={18} />, id: 'dashboard' },
        { label: 'Challenges', icon: <Flag size={18} />, id: 'challenges' },
        { label: 'Users', icon: <Users size={18} />, id: 'users' },
        { label: 'Roadmaps', icon: <Map size={18} />, id: 'roadmaps' },
        { label: 'Audit Logs', icon: <ClipboardList size={18} />, id: 'logs' },
    ];

    const [showModal, setShowModal] = useState(false);
    const [editingChal, setEditingChal] = useState(null);
    const [form, setForm] = useState({
        title: "", category: "Web", difficulty: "Easy", level: 1, points: 10, flag: "", description: "", hint: ""
    });

    const openModal = (chal = null) => {
        if (chal) {
            setEditingChal(chal);
            setForm({ ...chal });
        } else {
            setEditingChal(null);
            setForm({ title: "", category: "Web", difficulty: "Easy", level: 1, points: 10, flag: "", description: "", hint: "" });
        }
        setShowModal(true);
    };

    const submitChallenge = async (e) => {
        e.preventDefault();
        const method = editingChal ? "PUT" : "POST";
        const url = editingChal ? `${API_BASE}/admin/challenges/${editingChal.id}` : `${API_BASE}/admin/challenges`;

        const res = await fetch(url, {
            method,
            headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
            body: JSON.stringify(form)
        });

        if (res.ok) { setShowModal(false); fetchAll(); }
        else alert("Error saving challenge");
    };

    const toggleLock = async (id, currentState) => {
        await fetch(`${API_BASE}/admin/challenges/lock`, {
            method: "POST",
            headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
            body: JSON.stringify({ id, is_locked: !currentState })
        });
        fetchAll();
    };

    const deleteChallenge = async (id) => {
        if (!window.confirm("Are you sure?")) return;
        await fetch(`${API_BASE}/admin/challenges/${id}`, {
            method: "DELETE",
            headers: { "Authorization": `Bearer ${token}` }
        });
        fetchAll();
    };

    const renderContent = () => {
        if (loading) return (
            <div className="flex-center" style={{ height: '400px', color: 'var(--accent-blue)' }}>
                <RefreshCcw className="animate-spin" size={32} />
            </div>
        );

        switch (activeTab) {
            case "dashboard":
                return (
                    <div className="dashboard-view">
                        <div className="stats-grid">
                            <div className="stat-card"><span className="label">Total Operatives</span><span className="value">{stats.users}</span></div>
                            <div className="stat-card"><span className="label">Active Missions</span><span className="value">{stats.challenges}</span></div>
                            <div className="stat-card"><span className="label">Secured Assets</span><span className="value">{stats.locked}</span></div>
                            <div className="stat-card"><span className="label">System Integrity</span><span className="value" style={{ color: 'var(--color-success)' }}>{stats.system_status}</span></div>
                        </div>

                        <div className="data-table-container">
                            <div className="table-header-actions">
                                <h3>RECENT MISSION LOGS</h3>
                                <button className="btn-action" onClick={fetchAll}><RefreshCcw size={16} /></button>
                            </div>
                            <table className="admin-table">
                                <thead>
                                    <tr><th>Admin</th><th>Action</th><th>Target</th><th>Timestamp</th></tr>
                                </thead>
                                <tbody>
                                    {logs.slice(0, 8).map(log => (
                                        <tr key={log.id}>
                                            <td style={{ fontWeight: '600', color: 'var(--accent-blue)' }}>{log.admin_name}</td>
                                            <td>{log.action}</td>
                                            <td>{log.target_type} #{log.target_id}</td>
                                            <td>{new Date(log.created_at).toLocaleString()}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                );

            case "challenges":
                return (
                    <div className="data-table-container">
                        <div className="table-header-actions">
                            <div className="search-input-wrapper">
                                <Search className="search-icon" size={16} />
                                <input className="search-input" placeholder="Filter missions..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
                            </div>
                            <button className="btn-add" onClick={() => openModal()}><Plus size={18} /> Initialize Mission</button>
                        </div>
                        <table className="admin-table">
                            <thead>
                                <tr><th>Title</th><th>Category</th><th>Lvl</th><th>Status</th><th style={{ textAlign: 'right' }}>Ops</th></tr>
                            </thead>
                            <tbody>
                                {challenges.filter(c => c.title.toLowerCase().includes(searchTerm.toLowerCase())).map(c => (
                                    <tr key={c.id}>
                                        <td style={{ fontWeight: '600' }}>{c.title}</td>
                                        <td>{c.category}</td>
                                        <td>{c.level}</td>
                                        <td><span className={`status-badge ${c.is_locked ? 'locked' : 'active'}`}>{c.is_locked ? 'Locked' : 'Active'}</span></td>
                                        <td style={{ textAlign: 'right' }}>
                                            <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                                                <button className="btn-action" onClick={() => openModal(c)}><Edit2 size={16} /></button>
                                                <button className="btn-action" onClick={() => toggleLock(c.id, c.is_locked)}>{c.is_locked ? <Unlock size={16} /> : <Lock size={16} />}</button>
                                                <button className="btn-action" style={{ color: 'var(--brand-danger)' }} onClick={() => deleteChallenge(c.id)}><Trash2 size={16} /></button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                );

            case "users":
                return (
                    <div className="data-table-container">
                        <div className="table-header-actions">
                            <h3>PERSONNEL REGISTRY</h3>
                            <div className="search-input-wrapper">
                                <Search size={16} className="search-icon" />
                                <input className="search-input" placeholder="Find operative..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
                            </div>
                        </div>
                        <table className="admin-table">
                            <thead>
                                <tr><th>Operative</th><th>Email</th><th>Role</th><th>Registry Date</th></tr>
                            </thead>
                            <tbody>
                                {userList.filter(u => u.name?.toLowerCase().includes(searchTerm.toLowerCase())).map(u => (
                                    <tr key={u.user_id}>
                                        <td style={{ fontWeight: '600' }}>{u.name}</td>
                                        <td>{u.email}</td>
                                        <td><span className={`status-badge ${u.role === 'admin' ? 'active' : 'locked'}`} style={{ background: u.role === 'admin' ? 'rgba(59, 130, 246, 0.1)' : 'rgba(255,255,255,0.05)', color: u.role === 'admin' ? 'var(--accent-blue)' : 'var(--text-muted)' }}>{u.role.toUpperCase()}</span></td>
                                        <td>{new Date(u.created_at).toLocaleDateString()}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                );

            case "roadmaps":
                return (
                    <div className="data-table-container">
                        <div className="table-header-actions">
                            <h3>SECTOR ROADMAPS</h3>
                            <button className="btn-add"><Plus size={18} /> Define Path</button>
                        </div>
                        <table className="admin-table">
                            <thead>
                                <tr><th>Sector</th><th>Node Count</th><th>Compliance</th><th>Action</th></tr>
                            </thead>
                            <tbody>
                                {["Web", "Forensics", "AI", "Infrastructure"].map(sec => (
                                    <tr key={sec}>
                                        <td style={{ fontWeight: '600' }}>{sec} Security</td>
                                        <td>{challenges.filter(c => c.category === sec).length} Nodes</td>
                                        <td><span className="status-badge active">Operational</span></td>
                                        <td><button className="btn-action"><Edit2 size={16} /></button></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                );

            case "logs":
                return (
                    <div className="data-table-container">
                        <div className="table-header-actions">
                            <h3>SYSTEM AUDIT TRAIL</h3>
                            <button className="btn-action" onClick={fetchAll}><RefreshCcw size={16} /></button>
                        </div>
                        <table className="admin-table">
                            <thead>
                                <tr><th>Admin</th><th>Operation</th><th>Target Asset</th><th>Timestamp</th></tr>
                            </thead>
                            <tbody>
                                {logs.map(log => (
                                    <tr key={log.id}>
                                        <td style={{ fontWeight: '600', color: 'var(--accent-blue)' }}>{log.admin_name}</td>
                                        <td>{log.action}</td>
                                        <td>{log.target_type} // ID: {log.target_id}</td>
                                        <td>{new Date(log.created_at).toLocaleString()}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                );

            default: return null;
        }
    };

    return (
        <div className="admin-container">
            <aside className="sidebar-container" style={{ width: '260px', borderRight: '1px solid var(--border-primary)' }}>
                <div className="sidebar-header" style={{ padding: '24px 20px', fontSize: '12px', color: 'var(--accent-blue)', fontWeight: '800', letterSpacing: '0.1em' }}>
                    CHAKRA_CONTROL // ADMIN
                </div>
                <nav style={{ padding: '0 12px' }}>
                    {sidebarItems.map(item => (
                        <div
                            key={item.id}
                            onClick={() => setActiveTab(item.id)}
                            className={`sidebar-link ${activeTab === item.id ? 'active' : ''}`}
                            style={{ cursor: 'pointer', marginBottom: '4px' }}
                        >
                            <span className="sidebar-icon">{item.icon}</span>
                            <span>{item.label}</span>
                        </div>
                    ))}
                    <div style={{ margin: '20px 0', borderTop: '1px solid var(--border-primary)', opacity: 0.3 }}></div>
                    <div className="sidebar-link" onClick={handleLogout} style={{ cursor: 'pointer', color: 'var(--brand-danger)' }}>
                        <span className="sidebar-icon"><LogOut size={18} /></span>
                        <span>Terminal Exit</span>
                    </div>
                </nav>
            </aside>

            <div className="admin-main">
                <header className="admin-header">
                    <h2>SEC_OPS // {activeTab.toUpperCase()}</h2>
                    <div className="nav-right" style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', textAlign: 'right' }}>
                            <span style={{ fontSize: '11px', color: 'var(--color-success)', fontWeight: '800' }}>SYS_OK</span>
                        </div>
                        <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--accent-blue)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
                            <ShieldCheck size={18} />
                        </div>
                    </div>
                </header>

                <div className="admin-content" style={{ display: 'flex', flexDirection: 'column' }}>
                    <div style={{ flex: '1 0 auto', paddingBottom: '2rem' }}>
                        {renderContent()}
                    </div>
                </div>
            </div>

            {showModal && (
                <div className="admin-modal-overlay" onClick={() => setShowModal(false)}>
                    <div className="admin-modal" onClick={e => e.stopPropagation()}>
                        <h2>{editingChal ? "RECONFIGURE_NODAL_POINT" : "INITIALIZE_NEW_MISSION"}</h2>
                        <form className="admin-form" onSubmit={submitChallenge}>
                            <div className="form-group">
                                <label>Nodal Identifier (Title)</label>
                                <input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required placeholder="Mission name" />
                            </div>
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Sector Category</label>
                                    <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>
                                        <option>Web</option><option>Forensics</option><option>AI</option><option>Linux</option><option>Infrastructure</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label>Reward (XP)</label>
                                    <input type="number" value={form.points} onChange={e => setForm({ ...form, points: Number(e.target.value) })} />
                                </div>
                            </div>
                            <div className="form-group">
                                <label>Mission Briefing</label>
                                <textarea style={{ minHeight: '120px' }} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="Mission technical requirements..." />
                            </div>
                            <div className="form-actions" style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
                                <button type="submit" className="btn-add" style={{ flex: 1, justifyContent: 'center' }}>COMMIT CHANGES</button>
                                <button type="button" className="btn-action" onClick={() => setShowModal(false)} style={{ flex: 1, padding: '10px' }}>ABORT_OPS</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
