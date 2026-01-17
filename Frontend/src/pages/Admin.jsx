import React, { useEffect, useState } from "react";
import {
    LayoutDashboard,
    Users,
    Flag,
    Lock,
    Unlock,
    Ban,
    CheckCircle,
    ClipboardList,
    Plus,
    Trash2,
    Edit2,
    ShieldAlert,
    Terminal,
    Search,
    RefreshCcw,
    ChevronRight,
    LogOut
} from "lucide-react";
import { API_BASE } from "../config";

const THEME = {
    bg: "#0a0a0a",
    card: "#121212",
    border: "#222",
    text: "#e4e4e4",
    muted: "#888",
    primary: "#00d4ff",
    secondary: "#00ff88",
    danger: "#ff4d4d",
    warning: "#ff9f43",
    sidebar: "#111"
};

export default function Admin() {
    const [activeTab, setActiveTab] = useState("dashboard");
    const [stats, setStats] = useState({ users: 0, challenges: 0, locked: 0, system_status: "Online" });
    const [challenges, setChallenges] = useState([]);
    const [users, setUsers] = useState([]);
    const [logs, setLogs] = useState([]);
    const [roadmaps, setRoadmaps] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    // Auth
    const token = localStorage.getItem("token");
    const adminUser = JSON.parse(localStorage.getItem("user") || "{}");

    const fetchAll = async () => {
        setLoading(true);
        try {
            const headers = { "Authorization": `Bearer ${token}` };

            const [sRes, cRes, uRes, lRes, roadmapsRes] = await Promise.all([
                fetch(`${API_BASE}/admin/stats`, { headers }),
                fetch(`${API_BASE}/admin/challenges`, { headers }),
                fetch(`${API_BASE}/admin/users`, { headers }),
                fetch(`${API_BASE}/admin/audit-logs`, { headers }),
                fetch(`${API_BASE}/admin/roadmaps`, { headers }).catch(() => ({ ok: false }))
            ]);

            if (sRes.ok) setStats(await sRes.json());
            if (cRes.ok) setChallenges(await cRes.json());
            if (uRes.ok) setUsers(await uRes.json());
            if (lRes.ok) setLogs(await lRes.json());
            if (roadmapsRes && roadmapsRes.ok) setRoadmaps(await roadmapsRes.json());
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

    // Actions
    const toggleLock = async (id, currentState) => {
        await fetch(`${API_BASE}/admin/challenges/lock`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({ id, is_locked: !currentState })
        });
        fetchAll();
    };

    const toggleSuspend = async (user_id, currentState) => {
        await fetch(`${API_BASE}/admin/users/suspend`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({ user_id, is_suspended: !currentState })
        });
        fetchAll();
    };

    const [showModal, setShowModal] = useState(false);
    const [editingChal, setEditingChal] = useState(null);
    const [form, setForm] = useState({
        title: "",
        category: "Web",
        difficulty: "Easy",
        level: 1,
        points: 10,
        flag: "",
        description: "",
        hint: ""
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

    const deleteChallenge = async (id) => {
        if (!window.confirm("Are you sure? This cannot be undone.")) return;
        await fetch(`${API_BASE}/admin/challenges/${id}`, {
            method: "DELETE",
            headers: { "Authorization": `Bearer ${token}` }
        });
        fetchAll();
    };

    const submitChallenge = async (e) => {
        e.preventDefault();
        const method = editingChal ? "PUT" : "POST";
        const url = editingChal ? `${API_BASE}/admin/challenges/${editingChal.id}` : `${API_BASE}/admin/challenges`;

        const res = await fetch(url, {
            method,
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify(form)
        });

        if (res.ok) {
            setShowModal(false);
            fetchAll();
        } else {
            alert("Error saving challenge");
        }
    };

    const [showUserModal, setShowUserModal] = useState(false);
    const [userForm, setUserForm] = useState({ name: "", email: "", password: "" });

    const submitUser = async (e) => {
        e.preventDefault();
        const res = await fetch(`${API_BASE}/admin/users`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify(userForm)
        });

        if (res.ok) {
            setShowUserModal(false);
            setUserForm({ name: "", email: "", password: "" });
            fetchAll();
        } else {
            const err = await res.json();
            alert(err.error || "Error creating user");
        }
    };

    // Sub-components
    const SidebarItem = ({ id, icon: Icon, label }) => (
        <div
            onClick={() => setActiveTab(id)}
            style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                padding: "12px 20px",
                cursor: "pointer",
                background: activeTab === id ? "rgba(0, 212, 255, 0.1)" : "transparent",
                color: activeTab === id ? THEME.primary : THEME.muted,
                borderLeft: `3px solid ${activeTab === id ? THEME.primary : "transparent"}`,
                transition: "all 0.2s ease"
            }}
        >
            <Icon size={20} />
            <span style={{ fontWeight: "500", fontSize: "15px" }}>{label}</span>
        </div>
    );

    const StatCard = ({ icon: Icon, label, value, color }) => (
        <div style={{
            background: THEME.card,
            padding: "24px",
            borderRadius: "16px",
            border: `1px solid ${THEME.border}`,
            flex: 1,
            minWidth: "200px"
        }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                <span style={{ color: THEME.muted, fontSize: "14px", fontWeight: "600" }}>{label}</span>
                <Icon size={20} color={color} />
            </div>
            <div style={{ fontSize: "28px", fontWeight: "bold", color: "#fff" }}>{value}</div>
        </div>
    );

    const renderContent = () => {
        if (loading) return (
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%", color: THEME.primary }}>
                <RefreshCcw className="animate-spin" size={32} />
            </div>
        );

        switch (activeTab) {
            case "dashboard":
                return (
                    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
                        <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
                            <StatCard label="TOTAL USERS" value={stats.users} icon={Users} color={THEME.primary} />
                            <StatCard label="TOTAL CHALLENGES" value={stats.challenges} icon={Flag} color={THEME.secondary} />
                            <StatCard label="LOCKED CONTENT" value={stats.locked} icon={Lock} color={THEME.warning} />
                            <StatCard label="SYSTEM STATUS" value={stats.system_status} icon={ShieldAlert} color={THEME.secondary} />
                        </div>

                        <div style={{ background: THEME.card, borderRadius: "16px", border: `1px solid ${THEME.border}`, padding: "24px" }}>
                            <h3 style={{ color: "#fff", marginBottom: "20px", display: "flex", alignItems: "center", gap: "10px" }}>
                                <Terminal size={20} color={THEME.primary} /> Recent System Activity
                            </h3>
                            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                                {logs.slice(0, 5).map(log => (
                                    <div key={log.id} style={{ display: "flex", justifyContent: "space-between", padding: "12px", background: "rgba(255,255,255,0.02)", borderRadius: "8px", fontSize: "14px" }}>
                                        <div style={{ color: THEME.muted }}>
                                            <span style={{ color: THEME.primary, fontWeight: "600" }}>{log.admin_name}</span> {log.action.toLowerCase()} {log.target_type} #{log.target_id}
                                        </div>
                                        <div style={{ color: THEME.muted, fontSize: "12px" }}>{new Date(log.created_at).toLocaleString()}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                );

            case "challenges":
                return (
                    <div style={{ background: THEME.card, borderRadius: "16px", border: `1px solid ${THEME.border}`, overflow: "hidden" }}>
                        <div style={{ padding: "24px", borderBottom: `1px solid ${THEME.border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <div style={{ position: "relative" }}>
                                <Search size={18} color={THEME.muted} style={{ position: "absolute", left: "12px", top: "10px" }} />
                                <input
                                    placeholder="Search challenges..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    style={{
                                        background: "#1a1a1a",
                                        border: `1px solid ${THEME.border}`,
                                        borderRadius: "8px",
                                        padding: "8px 12px 8px 40px",
                                        color: "#fff",
                                        outline: "none",
                                        width: "300px"
                                    }}
                                />
                            </div>
                            <button onClick={() => openModal()} style={{ background: THEME.primary, color: "#000", border: "none", padding: "10px 20px", borderRadius: "8px", fontWeight: "700", display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }}>
                                <Plus size={18} /> Add Challenge
                            </button>
                        </div>
                        <table style={{ width: "100%", borderCollapse: "collapse" }}>
                            <thead>
                                <tr style={{ color: THEME.muted, fontSize: "12px", textTransform: "uppercase", textAlign: "left" }}>
                                    <th style={{ padding: "16px 24px" }}>Challenge</th>
                                    <th style={{ padding: "16px 24px" }}>Category</th>
                                    <th style={{ padding: "16px 24px" }}>Level</th>
                                    <th style={{ padding: "16px 24px" }}>Status</th>
                                    <th style={{ padding: "16px 24px" }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {challenges.filter(c => c.title.toLowerCase().includes(searchTerm.toLowerCase())).map(c => (
                                    <tr key={c.id} style={{ borderTop: `1px solid ${THEME.border}`, color: THEME.text }}>
                                        <td style={{ padding: "16px 24px" }}>
                                            <div style={{ fontWeight: "600" }}>{c.title}</div>
                                            <div style={{ fontSize: "12px", color: THEME.muted }}>ID: {c.id}</div>
                                        </td>
                                        <td style={{ padding: "16px 24px" }}>
                                            <span style={{ background: "rgba(255,255,255,0.05)", padding: "4px 10px", borderRadius: "6px", fontSize: "12px" }}>{c.category}</span>
                                        </td>
                                        <td style={{ padding: "16px 24px" }}>Level {c.level}</td>
                                        <td style={{ padding: "16px 24px" }}>
                                            {c.is_locked ? (
                                                <span style={{ color: THEME.warning, display: "flex", alignItems: "center", gap: "6px", fontSize: "13px" }}><Lock size={14} /> Locked</span>
                                            ) : (
                                                <span style={{ color: THEME.secondary, display: "flex", alignItems: "center", gap: "6px", fontSize: "13px" }}><Unlock size={14} /> Active</span>
                                            )}
                                        </td>
                                        <td style={{ padding: "16px 24px" }}>
                                            <div style={{ display: "flex", gap: "12px" }}>
                                                <button onClick={() => openModal(c)} style={{ background: "none", border: "none", cursor: "pointer", color: THEME.primary }} title="Edit">
                                                    <Edit2 size={18} />
                                                </button>
                                                <button onClick={() => toggleLock(c.id, c.is_locked)} style={{ background: "none", border: "none", cursor: "pointer", color: THEME.muted }} title={c.is_locked ? "Unlock" : "Lock"}>
                                                    {c.is_locked ? <Unlock size={18} /> : <Lock size={18} />}
                                                </button>
                                                <button onClick={() => deleteChallenge(c.id)} style={{ background: "none", border: "none", cursor: "pointer", color: THEME.danger }} title="Delete">
                                                    <Trash2 size={18} />
                                                </button>
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
                    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
                        <div style={{ background: THEME.card, padding: "24px", borderRadius: "16px", border: `1px solid ${THEME.border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <div>
                                <h3 style={{ color: "#fff", margin: 0 }}>User Management</h3>
                                <p style={{ color: THEME.muted, fontSize: "14px", margin: "5px 0 0 0" }}>Manage student accounts and access.</p>
                            </div>
                            <button onClick={() => setShowUserModal(true)} style={{ background: THEME.secondary, color: "#000", border: "none", padding: "10px 20px", borderRadius: "8px", fontWeight: "700", display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }}>
                                <Plus size={18} /> Add User
                            </button>
                        </div>
                        <div style={{ background: THEME.card, borderRadius: "16px", border: `1px solid ${THEME.border}`, overflow: "hidden" }}>
                            <table style={{ width: "100%", borderCollapse: "collapse" }}>
                                <thead>
                                    <tr style={{ color: THEME.muted, fontSize: "12px", textTransform: "uppercase", textAlign: "left" }}>
                                        <th style={{ padding: "16px 24px" }}>User</th>
                                        <th style={{ padding: "16px 24px" }}>Email</th>
                                        <th style={{ padding: "16px 24px" }}>Role</th>
                                        <th style={{ padding: "16px 24px" }}>Status</th>
                                        <th style={{ padding: "16px 24px" }}>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {users.map(u => (
                                        <tr key={u.user_id} style={{ borderTop: `1px solid ${THEME.border}`, color: THEME.text }}>
                                            <td style={{ padding: "16px 24px" }}>
                                                <div style={{ fontWeight: "600" }}>{u.name}</div>
                                                <div style={{ fontSize: "12px", color: THEME.muted }}>Joined: {new Date(u.created_at).toLocaleDateString()}</div>
                                            </td>
                                            <td style={{ padding: "16px 24px" }}>{u.email}</td>
                                            <td style={{ padding: "16px 24px" }}>
                                                <span style={{
                                                    color: u.role === "admin" ? THEME.primary : THEME.text,
                                                    fontWeight: u.role === "admin" ? "700" : "400"
                                                }}>
                                                    {u.role}
                                                </span>
                                            </td>
                                            <td style={{ padding: "16px 24px" }}>
                                                {u.is_suspended ? (
                                                    <span style={{ color: THEME.danger, fontSize: "13px" }}>Suspended</span>
                                                ) : (
                                                    <span style={{ color: THEME.secondary, fontSize: "13px" }}>Active</span>
                                                )}
                                            </td>
                                            <td style={{ padding: "16px 24px" }}>
                                                <button
                                                    onClick={() => toggleSuspend(u.user_id, u.is_suspended)}
                                                    style={{
                                                        background: u.is_suspended ? THEME.secondary : "rgba(255, 77, 77, 0.1)",
                                                        color: u.is_suspended ? "#000" : THEME.danger,
                                                        border: `1px solid ${u.is_suspended ? THEME.secondary : THEME.danger}`,
                                                        padding: "6px 12px",
                                                        borderRadius: "6px",
                                                        cursor: "pointer",
                                                        fontSize: "12px",
                                                        fontWeight: "600"
                                                    }}
                                                >
                                                    {u.is_suspended ? "Reactivate" : "Suspend"}
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                );

            case "roadmaps":
                return (
                    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
                        <div style={{ background: THEME.card, padding: "24px", borderRadius: "16px", border: `1px solid ${THEME.border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <div>
                                <h3 style={{ color: "#fff", margin: 0 }}>Learning Roadmaps</h3>
                                <p style={{ color: THEME.muted, fontSize: "14px", margin: "5px 0 0 0" }}>Manage structured paths for Red and Blue teams.</p>
                            </div>
                            <button style={{ background: THEME.secondary, color: "#000", border: "none", padding: "10px 20px", borderRadius: "8px", fontWeight: "700", cursor: "pointer" }}>
                                New Roadmap
                            </button>
                        </div>
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "20px" }}>
                            {roadmaps.map(r => (
                                <div key={r.id} style={{ background: THEME.card, padding: "20px", borderRadius: "12px", border: `1px solid ${THEME.border}` }}>
                                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "15px" }}>
                                        <div style={{ color: THEME.primary, fontSize: "12px", fontWeight: "bold", textTransform: "uppercase" }}>{r.type}</div>
                                        <div style={{ color: THEME.muted }}><ChevronRight size={18} /></div>
                                    </div>
                                    <h4 style={{ color: "#fff", margin: "0 0 10px 0" }}>{r.name}</h4>
                                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "20px" }}>
                                        <span style={{ color: THEME.muted, fontSize: "12px" }}>Dynamic Path</span>
                                        <span style={{ color: r.is_locked ? THEME.warning : THEME.secondary, fontSize: "12px", fontWeight: "600" }}>
                                            {r.is_locked ? "Locked" : "Unlocked"}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                );

            case "logs":
                return (
                    <div style={{ background: THEME.card, borderRadius: "16px", border: `1px solid ${THEME.border}`, overflow: "hidden" }}>
                        <div style={{ padding: "20px", borderBottom: `1px solid ${THEME.border}`, background: "rgba(255,255,255,0.02)" }}>
                            <h3 style={{ margin: 0, color: "#fff", fontSize: "16px" }}>Security Audit Logs</h3>
                        </div>
                        <div style={{ overflowX: "auto" }}>
                            <table style={{ width: "100%", borderCollapse: "collapse" }}>
                                <thead>
                                    <tr style={{ color: THEME.muted, fontSize: "11px", textTransform: "uppercase", textAlign: "left" }}>
                                        <th style={{ padding: "16px 24px" }}>Admin</th>
                                        <th style={{ padding: "16px 24px" }}>Action</th>
                                        <th style={{ padding: "16px 24px" }}>Details</th>
                                        <th style={{ padding: "16px 24px" }}>IP Address</th>
                                        <th style={{ padding: "16px 24px" }}>Timestamp</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {logs.map(log => (
                                        <tr key={log.id} style={{ borderTop: `1px solid ${THEME.border}`, color: THEME.text, fontSize: "13px" }}>
                                            <td style={{ padding: "16px 24px", color: THEME.primary, fontWeight: "600" }}>{log.admin_name}</td>
                                            <td style={{ padding: "16px 24px" }}>{log.action}</td>
                                            <td style={{ padding: "16px 24px" }}>
                                                {log.target_type} #{log.target_id}
                                                <span style={{ color: THEME.muted, marginLeft: "10px" }}>({log.old_value} → {log.new_value})</span>
                                            </td>
                                            <td style={{ padding: "16px 24px", color: THEME.muted, fontFamily: "monospace" }}>{log.ip_address}</td>
                                            <td style={{ padding: "16px 24px", color: THEME.muted }}>{new Date(log.created_at).toLocaleString()}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                );

            default:
                return <div>Select a tab</div>;
        }
    };

    return (
        <div style={{ display: "flex", height: "100vh", background: THEME.bg, color: THEME.text }}>
            {/* Sidebar */}
            <div style={{
                width: "260px",
                background: THEME.sidebar,
                borderRight: `1px solid ${THEME.border}`,
                display: "flex",
                flexDirection: "column",
                zIndex: 10
            }}>
                <div style={{ padding: "30px 20px", borderBottom: `1px solid ${THEME.border}` }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px", color: "#fff" }}>
                        <div style={{ background: THEME.primary, padding: "8px", borderRadius: "8px", color: "#000" }}>
                            <ShieldAlert size={24} />
                        </div>
                        <div style={{ fontWeight: "800", fontSize: "20px", letterSpacing: "-0.5px" }}>CHAKRA <span style={{ color: THEME.primary }}>ADMIN</span></div>
                    </div>
                </div>

                <div style={{ flex: 1, paddingTop: "20px" }}>
                    <SidebarItem id="dashboard" icon={LayoutDashboard} label="Dashboard" />
                    <SidebarItem id="challenges" icon={Flag} label="Challenges" />
                    <SidebarItem id="users" icon={Users} label="Users" />
                    <SidebarItem id="roadmaps" icon={ChevronRight} label="Roadmaps" />
                    <SidebarItem id="logs" icon={ClipboardList} label="Audit Logs" />
                </div>

                <div style={{ padding: "20px", borderTop: `1px solid ${THEME.border}` }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "20px", padding: "0 10px" }}>
                        <div style={{ width: "36px", height: "36px", background: THEME.primary, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", color: "#000", fontWeight: "bold" }}>
                            {adminUser.name?.[0].toUpperCase() || "A"}
                        </div>
                        <div>
                            <div style={{ fontSize: "14px", fontWeight: "600", color: "#fff" }}>{adminUser.name}</div>
                            <div style={{ fontSize: "12px", color: THEME.muted }}>{adminUser.role}</div>
                        </div>
                    </div>
                    <button
                        onClick={handleLogout}
                        style={{
                            width: "100%",
                            padding: "10px",
                            background: "rgba(255, 77, 77, 0.1)",
                            color: THEME.danger,
                            border: "none",
                            borderRadius: "8px",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: "8px",
                            fontWeight: "600"
                        }}
                    >
                        <LogOut size={18} /> Logout
                    </button>
                    <div style={{ marginTop: "12px", textAlign: "center", fontSize: "10px", color: THEME.muted }}>
                        Admin Portal v2.1.0
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <main style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
                <header style={{
                    padding: "20px 40px",
                    borderBottom: `1px solid ${THEME.border}`,
                    background: "rgba(0,0,0,0.2)",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center"
                }}>
                    <h2 style={{ margin: 0, textTransform: "capitalize", fontSize: "20px", fontWeight: "700" }}>{activeTab}</h2>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px", color: THEME.muted, fontSize: "13px" }}>
                        Chakra Security Lab Platform <ChevronRight size={14} /> Admin <ChevronRight size={14} /> {activeTab}
                    </div>
                </header>

                <div style={{ flex: 1, padding: "40px", overflowY: "auto" }}>
                    {renderContent()}
                </div>

                {/* Modal */}
                {showModal && (
                    <div style={{
                        position: "fixed",
                        top: 0, left: 0, right: 0, bottom: 0,
                        background: "rgba(0,0,0,0.8)",
                        backdropFilter: "blur(5px)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        zIndex: 1000
                    }}>
                        <div style={{
                            background: THEME.card,
                            padding: "32px",
                            borderRadius: "16px",
                            border: `1px solid ${THEME.border}`,
                            width: "100%",
                            maxWidth: "600px",
                            maxHeight: "90vh",
                            overflowY: "auto"
                        }}>
                            <h2 style={{ color: "#fff", marginBottom: "24px" }}>{editingChal ? "Edit Challenge" : "Add New Challenge"}</h2>
                            <form onSubmit={submitChallenge} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                                    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                                        <label style={{ color: THEME.muted, fontSize: "14px" }}>Title</label>
                                        <input
                                            value={form.title}
                                            onChange={(e) => setForm({ ...form, title: e.target.value })}
                                            required
                                            style={{ background: "#1a1a1a", border: `1px solid ${THEME.border}`, padding: "10px", borderRadius: "8px", color: "#fff" }}
                                        />
                                    </div>
                                    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                                        <label style={{ color: THEME.muted, fontSize: "14px" }}>Category</label>
                                        <select
                                            value={form.category}
                                            onChange={(e) => setForm({ ...form, category: e.target.value })}
                                            style={{ background: "#1a1a1a", border: `1px solid ${THEME.border}`, padding: "10px", borderRadius: "8px", color: "#fff" }}
                                        >
                                            <option>Web</option><option>Cryptography</option><option>Forensics</option><option>Reverse</option><option>AI</option><option>Misc</option><option>Linux</option>
                                        </select>
                                    </div>
                                </div>

                                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "16px" }}>
                                    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                                        <label style={{ color: THEME.muted, fontSize: "14px" }}>Difficulty</label>
                                        <select
                                            value={form.difficulty}
                                            onChange={(e) => setForm({ ...form, difficulty: e.target.value })}
                                            style={{ background: "#1a1a1a", border: `1px solid ${THEME.border}`, padding: "10px", borderRadius: "8px", color: "#fff" }}
                                        >
                                            <option>Easy</option><option>Medium</option><option>Hard</option>
                                        </select>
                                    </div>
                                    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                                        <label style={{ color: THEME.muted, fontSize: "14px" }}>Level (1-5)</label>
                                        <input
                                            type="number"
                                            value={form.level}
                                            onChange={(e) => setForm({ ...form, level: Number(e.target.value) })}
                                            style={{ background: "#1a1a1a", border: `1px solid ${THEME.border}`, padding: "10px", borderRadius: "8px", color: "#fff" }}
                                        />
                                    </div>
                                    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                                        <label style={{ color: THEME.muted, fontSize: "14px" }}>Points</label>
                                        <input
                                            type="number"
                                            value={form.points}
                                            onChange={(e) => setForm({ ...form, points: Number(e.target.value) })}
                                            style={{ background: "#1a1a1a", border: `1px solid ${THEME.border}`, padding: "10px", borderRadius: "8px", color: "#fff" }}
                                        />
                                    </div>
                                </div>

                                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                                    <label style={{ color: THEME.muted, fontSize: "14px" }}>Flag</label>
                                    <input
                                        value={form.flag}
                                        onChange={(e) => setForm({ ...form, flag: e.target.value })}
                                        placeholder="flag{...}"
                                        style={{ background: "#1a1a1a", border: `1px solid ${THEME.border}`, padding: "10px", borderRadius: "8px", color: "#fff", fontFamily: "monospace" }}
                                    />
                                </div>

                                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                                    <label style={{ color: THEME.muted, fontSize: "14px" }}>Description</label>
                                    <textarea
                                        value={form.description}
                                        onChange={(e) => setForm({ ...form, description: e.target.value })}
                                        style={{ background: "#1a1a1a", border: `1px solid ${THEME.border}`, padding: "10px", borderRadius: "8px", color: "#fff", minHeight: "80px" }}
                                    ></textarea>
                                </div>

                                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                                    <label style={{ color: THEME.muted, fontSize: "14px" }}>Hint</label>
                                    <textarea
                                        value={form.hint}
                                        onChange={(e) => setForm({ ...form, hint: e.target.value })}
                                        style={{ background: "#1a1a1a", border: `1px solid ${THEME.border}`, padding: "10px", borderRadius: "8px", color: "#fff", minHeight: "60px" }}
                                    ></textarea>
                                </div>

                                <div style={{ display: "flex", gap: "12px", marginTop: "12px" }}>
                                    <button
                                        type="button"
                                        onClick={() => setShowModal(false)}
                                        style={{ flex: 1, padding: "12px", background: "transparent", border: `1px solid ${THEME.border}`, color: THEME.muted, borderRadius: "8px", cursor: "pointer" }}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        style={{ flex: 1, padding: "12px", background: THEME.primary, border: "none", color: "#000", fontWeight: "bold", borderRadius: "8px", cursor: "pointer" }}
                                    >
                                        {editingChal ? "Save Changes" : "Create Challenge"}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* User Modal */}
                {showUserModal && (
                    <div style={{
                        position: "fixed",
                        top: 0, left: 0, right: 0, bottom: 0,
                        background: "rgba(0,0,0,0.8)",
                        backdropFilter: "blur(5px)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        zIndex: 1000
                    }}>
                        <div style={{
                            background: THEME.card,
                            padding: "32px",
                            borderRadius: "16px",
                            border: `1px solid ${THEME.border}`,
                            width: "100%",
                            maxWidth: "450px"
                        }}>
                            <h2 style={{ color: "#fff", marginBottom: "24px" }}>Add New User</h2>
                            <form onSubmit={submitUser} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                                    <label style={{ color: THEME.muted, fontSize: "14px" }}>Full Name</label>
                                    <input
                                        value={userForm.name}
                                        onChange={(e) => setUserForm({ ...userForm, name: e.target.value })}
                                        required
                                        style={{ background: "#1a1a1a", border: `1px solid ${THEME.border}`, padding: "10px", borderRadius: "8px", color: "#fff" }}
                                    />
                                </div>
                                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                                    <label style={{ color: THEME.muted, fontSize: "14px" }}>Email Address</label>
                                    <input
                                        type="email"
                                        value={userForm.email}
                                        onChange={(e) => setUserForm({ ...userForm, email: e.target.value })}
                                        required
                                        style={{ background: "#1a1a1a", border: `1px solid ${THEME.border}`, padding: "10px", borderRadius: "8px", color: "#fff" }}
                                    />
                                </div>
                                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                                    <label style={{ color: THEME.muted, fontSize: "14px" }}>Password</label>
                                    <input
                                        type="password"
                                        value={userForm.password}
                                        onChange={(e) => setUserForm({ ...userForm, password: e.target.value })}
                                        required
                                        style={{ background: "#1a1a1a", border: `1px solid ${THEME.border}`, padding: "10px", borderRadius: "8px", color: "#fff" }}
                                    />
                                </div>
                                <div style={{ display: "flex", gap: "12px", marginTop: "12px" }}>
                                    <button
                                        type="button"
                                        onClick={() => setShowUserModal(false)}
                                        style={{ flex: 1, padding: "12px", background: "transparent", border: `1px solid ${THEME.border}`, color: THEME.muted, borderRadius: "8px", cursor: "pointer" }}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        style={{ flex: 1, padding: "12px", background: THEME.secondary, border: "none", color: "#000", fontWeight: "bold", borderRadius: "8px", cursor: "pointer" }}
                                    >
                                        Create User
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}
