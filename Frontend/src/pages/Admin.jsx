import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { API_BASE } from "../config";

export default function Admin() {
    const [chals, setChals] = useState([]);
    const [form, setForm] = useState({
        title: "",
        difficulty: "Easy",
        category: "Web",
        description: "",
        solution: "",
        hint: "",
        level: 1
    });

    const fetchAll = () => {
        fetch(`${API_BASE}/admin/challenges`)
            .then(r => r.json())
            .then(setChals);
    };

    useEffect(fetchAll, []);

    const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const addChallenge = async (e) => {
        e.preventDefault();
        await fetch(`${API_BASE}/admin/challenges`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ...form, level: Number(form.level), flag: form.solution })
        });
        setForm({ title: "", difficulty: "Easy", category: "Web", description: "", solution: "", hint: "", level: 1 });
        fetchAll();
    };

    const deleteChallenge = async (id) => {
        await fetch(`${API_BASE}/admin/challenges/${id}`, { method: "DELETE" });
        fetchAll();
    };

    return (
        <div style={{ background: "#f5f5f5", minHeight: "100vh", color: "#333", fontFamily: "sans-serif" }}>
            <Navbar />
            <div style={{ display: "flex" }}>
                {/* Sidebar - Hidden or styled differently for admin? 
                    User said "dont make same as normal theme". 
                    Let's keep sidebar but maybe invert it or just keep it as is for navigation consistency.
                    Actually, let's keep it but make the main content very distinct.
                */}
                <Sidebar />
                <main className="container" style={{ flex: 1, padding: "40px", background: "#f5f5f5" }}>
                    <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
                        <h1 style={{ color: "#2c3e50", fontSize: "32px", marginBottom: "30px", borderBottom: "2px solid #ddd", paddingBottom: "10px" }}>
                            Admin Panel <span style={{ fontSize: "16px", color: "#7f8c8d", fontWeight: "normal" }}>(Secure Area)</span>
                        </h1>

                        {/* Add Challenge Form */}
                        <div style={{ background: "#fff", padding: "30px", borderRadius: "12px", boxShadow: "0 4px 6px rgba(0,0,0,0.1)", marginBottom: "40px" }}>
                            <h3 style={{ color: "#2c3e50", marginBottom: "20px", fontSize: "20px" }}>Add New Challenge</h3>
                            <form onSubmit={addChallenge}>
                                <div style={{ marginBottom: "15px" }}>
                                    <label style={{ display: "block", marginBottom: "5px", fontWeight: "600", color: "#555" }}>Title</label>
                                    <input className="input" name="title" placeholder="e.g. SQL Injection 101" value={form.title} onChange={onChange} required
                                        style={{ width: "100%", padding: "12px", borderRadius: "6px", border: "1px solid #ddd", background: "#f9f9f9", color: "#333", fontSize: "16px" }} />
                                </div>

                                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "15px" }}>
                                    <div>
                                        <label style={{ display: "block", marginBottom: "5px", fontWeight: "600", color: "#555" }}>Difficulty</label>
                                        <select className="input" name="difficulty" value={form.difficulty} onChange={onChange}
                                            style={{ width: "100%", padding: "12px", borderRadius: "6px", border: "1px solid #ddd", background: "#f9f9f9", color: "#333", fontSize: "16px" }}>
                                            <option>Easy</option><option>Medium</option><option>Hard</option><option>Insane</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label style={{ display: "block", marginBottom: "5px", fontWeight: "600", color: "#555" }}>Category</label>
                                        <select className="input" name="category" value={form.category} onChange={onChange}
                                            style={{ width: "100%", padding: "12px", borderRadius: "6px", border: "1px solid #ddd", background: "#f9f9f9", color: "#333", fontSize: "16px" }}>
                                            <option>Web</option><option>Cryptography</option><option>Forensics</option><option>Reverse</option><option>AI</option><option>Misc</option>
                                        </select>
                                    </div>
                                </div>

                                <div style={{ marginBottom: "15px" }}>
                                    <label style={{ display: "block", marginBottom: "5px", fontWeight: "600", color: "#555" }}>Description</label>
                                    <textarea className="input" name="description" placeholder="Challenge description..." value={form.description} onChange={onChange}
                                        style={{ width: "100%", padding: "12px", borderRadius: "6px", border: "1px solid #ddd", background: "#f9f9f9", color: "#333", minHeight: "100px", fontSize: "16px", fontFamily: "inherit" }}></textarea>
                                </div>

                                <div style={{ marginBottom: "15px" }}>
                                    <label style={{ display: "block", marginBottom: "5px", fontWeight: "600", color: "#555" }}>Hint</label>
                                    <textarea className="input" name="hint" placeholder="Helpful hint..." value={form.hint} onChange={onChange}
                                        style={{ width: "100%", padding: "12px", borderRadius: "6px", border: "1px solid #ddd", background: "#f9f9f9", color: "#333", minHeight: "60px", fontSize: "16px", fontFamily: "inherit" }}></textarea>
                                </div>

                                <div style={{ marginBottom: "15px" }}>
                                    <label style={{ display: "block", marginBottom: "5px", fontWeight: "600", color: "#555" }}>Solution (Flag)</label>
                                    <input className="input" name="solution" placeholder="flag{...}" value={form.solution} onChange={onChange}
                                        style={{ width: "100%", padding: "12px", borderRadius: "6px", border: "1px solid #ddd", background: "#f9f9f9", color: "#333", fontSize: "16px", fontFamily: "monospace" }} />
                                </div>

                                <div style={{ marginBottom: "20px" }}>
                                    <label style={{ display: "block", marginBottom: "5px", fontWeight: "600", color: "#555" }}>Level (1-5)</label>
                                    <input className="input" type="number" name="level" min="1" max="5" value={form.level} onChange={onChange}
                                        style={{ width: "100%", padding: "12px", borderRadius: "6px", border: "1px solid #ddd", background: "#f9f9f9", color: "#333", fontSize: "16px" }} />
                                </div>

                                <button className="btn" type="submit"
                                    style={{ padding: "12px 30px", background: "#2c3e50", color: "#fff", border: "none", borderRadius: "6px", cursor: "pointer", fontWeight: "bold", fontSize: "16px", transition: "background 0.2s" }}
                                    onMouseOver={e => e.currentTarget.style.background = "#34495e"}
                                    onMouseOut={e => e.currentTarget.style.background = "#2c3e50"}
                                >
                                    + Add Challenge
                                </button>
                            </form>
                        </div>

                        {/* List & View */}
                        <h3 style={{ color: "#2c3e50", marginBottom: "20px", fontSize: "24px", borderBottom: "1px solid #ddd", paddingBottom: "10px" }}>Existing Challenges</h3>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "15px" }}>
                            {chals.map(c => (
                                <div key={c.id} className="card" style={{ background: "#fff", padding: "20px", borderRadius: "8px", border: "1px solid #e0e0e0", boxShadow: "0 2px 4px rgba(0,0,0,0.05)" }}>
                                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                                        <div>
                                            <div style={{ fontSize: "18px", fontWeight: "bold", color: "#2c3e50", marginBottom: "5px" }}>
                                                {c.title}
                                            </div>
                                            <div style={{ display: "flex", gap: "10px", fontSize: "14px", color: "#7f8c8d", marginBottom: "10px" }}>
                                                <span style={{ background: "#ecf0f1", padding: "2px 8px", borderRadius: "4px" }}>{c.category}</span>
                                                <span style={{ background: "#ecf0f1", padding: "2px 8px", borderRadius: "4px" }}>Level {c.level}</span>
                                                <span style={{ background: "#ecf0f1", padding: "2px 8px", borderRadius: "4px" }}>{c.difficulty}</span>
                                            </div>
                                        </div>
                                        <button className="btn" onClick={() => deleteChallenge(c.id)}
                                            style={{ background: "#e74c3c", color: "#fff", border: "none", padding: "8px 15px", borderRadius: "5px", cursor: "pointer", fontWeight: "600", fontSize: "14px" }}>
                                            Delete
                                        </button>
                                    </div>

                                    <div style={{ marginTop: "15px", paddingTop: "15px", borderTop: "1px solid #f0f0f0", fontSize: "14px", color: "#555" }}>
                                        <p style={{ margin: "0 0 5px 0" }}><strong style={{ color: "#333" }}>Description:</strong> {c.description || "—"}</p>
                                        <p style={{ margin: "0 0 5px 0" }}><strong style={{ color: "#333" }}>Hint:</strong> {c.hint || "—"}</p>
                                        <p style={{ margin: "0", fontFamily: "monospace", background: "#f8f9fa", padding: "5px", borderRadius: "4px", display: "inline-block" }}>
                                            <strong style={{ color: "#333" }}>Flag:</strong> {c.flag || c.solution || "—"}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}
