import React, { useState, useEffect } from "react";
import { API_BASE } from "../config";

export default function ChallengeHint({ challengeId, user }) {
    const [hint, setHint] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        setHint(null);
        setError(null);
    }, [challengeId]);

    const getHint = async () => {
        if (!challengeId || !user?.user_id) return;
        setLoading(true);
        setError(null);
        try {
            const res = await fetch(`${API_BASE}/hint`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    user_id: user.user_id,
                    id: challengeId
                })
            });
            const data = await res.json();
            if (res.ok) {
                setHint(data.hint);
            } else {
                setError("Could not fetch hint");
            }
        } catch (err) {
            console.error(err);
            setError("Error fetching hint");
        } finally {
            setLoading(false);
        }
    };

    if (!challengeId) return null;

    return (
        <div style={{
            marginTop: "30px",
            padding: "20px",
            background: "var(--card-bg)",
            borderRadius: "10px",
            border: "1px solid var(--card-border)"
        }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
                <h3 style={{ color: "var(--cyan)", margin: 0 }}>💡 Hint</h3>
                {!hint && (
                    <button
                        onClick={getHint}
                        disabled={loading}
                        className="btn"
                        style={{
                            padding: "8px 20px",
                            background: "#ffd43b",
                            color: "#000",
                            fontWeight: "600",
                            border: "none",
                            borderRadius: "5px",
                            cursor: loading ? "not-allowed" : "pointer"
                        }}
                    >
                        {loading ? "Loading..." : "Get Hint"}
                    </button>
                )}
            </div>
            {error && <p style={{ color: "var(--danger)" }}>{error}</p>}
            {hint ? (
                <p style={{
                    color: "var(--text)",
                    background: "var(--bg)",
                    padding: "15px",
                    borderRadius: "8px",
                    marginTop: "10px",
                    border: "1px dashed var(--muted)"
                }}>
                    {hint}
                </p>
            ) : (
                <p style={{ color: "var(--muted)" }}>Click "Get Hint" button to reveal the hint for this level.</p>
            )}
        </div>
    );
}
