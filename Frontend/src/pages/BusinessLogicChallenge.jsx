import React, { useState } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import WebTerminal from "../components/WebTerminal";
import { API_BASE } from "../config";
import { Terminal, X, Award, Lightbulb, Globe, Code, ShieldCheck, CheckCircle2, Shield, Info, ShoppingCart, Search } from "lucide-react";

export default function BusinessLogicChallenge() {
    const [flag, setFlag] = useState("");
    const [message, setMessage] = useState("");
    const [showTerminal, setShowTerminal] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [activeTab, setActiveTab] = useState("terminal"); // "terminal" or "web"
    const user = JSON.parse(localStorage.getItem("user") || "{}");

    const submitFlag = async (e) => {
        e.preventDefault();
        const correctFlag = "FLAG{business_logic_price_tampering}";

        if (flag.trim() === correctFlag) {
            setMessage("🎉 Correct Flag! You successfully exploited the business logic flaw.");
            setSubmitted(true);

            try {
                await fetch(`${API_BASE}/submit`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        user_id: user.user_id,
                        id: 998, // Unique ID for this challenge
                        flag: flag
                    })
                });
            } catch (err) {
                console.error(err);
            }
        } else {
            setMessage("❌ Incorrect flag. Manipulate the order total to get the secret!");
        }
    };

    return (
        <div>
            <Navbar />
            <div style={{ display: "flex" }}>
                <Sidebar />
                <main style={{
                    flex: 1,
                    padding: "20px",
                    background: "var(--bg)",
                    minHeight: "100vh",
                    color: "var(--text)",
                    maxWidth: "1400px",
                    margin: "0 auto"
                }}>
                    {/* Header */}
                    <div style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: "30px",
                        borderBottom: "1px solid var(--card-border)",
                        paddingBottom: "20px"
                    }}>
                        <div>
                            <div style={{ fontSize: "14px", color: "var(--muted)", marginBottom: "8px" }}>
                                Real-Life Web → Level 4 (Final Boss)
                            </div>
                            <h1 style={{ fontSize: "28px", fontWeight: "700", margin: 0 }}>
                                Zero-Dollar Checkout – Business Logic
                            </h1>
                        </div>
                        {showTerminal && (
                            <button
                                onClick={() => setShowTerminal(false)}
                                style={{
                                    background: "#ff6b6b",
                                    color: "#fff",
                                    border: "none",
                                    padding: "10px 20px",
                                    borderRadius: "8px",
                                    cursor: "pointer",
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "8px",
                                    fontWeight: "600"
                                }}
                            >
                                <X size={18} /> Terminate PawnBox
                            </button>
                        )}
                    </div>

                    {/* Main Content Grid */}
                    <div style={{ display: "grid", gridTemplateColumns: showTerminal ? "450px 1fr" : "1fr", gap: "20px" }}>
                        {/* Left Panel - Challenge Cards (Scrollable) */}
                        <div style={{ display: "flex", flexDirection: "column", gap: "20px", overflowY: "auto", maxHeight: "calc(100vh - 150px)", paddingRight: "10px" }}>

                            {/* Level Goal Card */}
                            <div style={{ background: "var(--card-bg)", border: "1px solid var(--card-border)", borderRadius: "12px", padding: "20px" }}>
                                <h3 style={{ fontSize: "14px", fontWeight: "700", color: "#00ff00", marginBottom: "12px", textTransform: "uppercase" }}>Level Goal</h3>
                                <div style={{ fontSize: "14px", lineHeight: "1.6", color: "var(--muted)" }}>
                                    <p style={{ margin: "0 0 10px 0" }}>Exploit a business logic flaw in an online electronics store to manipulate the order total and retrieve the flag.</p>
                                    <p style={{ margin: "0 0 10px 0" }}>The server trusts client-side price data during checkout. If you can change the price of a mid-range item to $1 or less, the system will award you the secret flag.</p>
                                    <p style={{ margin: 0, color: "#00ff00", fontWeight: "600" }}>Objective: Purchase any item for $1 or less.</p>
                                </div>
                            </div>

                            {/* Target Information Card */}
                            <div style={{ background: "var(--card-bg)", border: "1px solid var(--card-border)", borderRadius: "12px", padding: "20px" }}>
                                <h3 style={{ fontSize: "14px", fontWeight: "700", color: "var(--cyan)", marginBottom: "12px", textTransform: "uppercase" }}>🎯 Target Information</h3>
                                <div style={{ fontSize: "13px", color: "var(--muted)", lineHeight: "1.8" }}>
                                    <div style={{ marginBottom: "8px" }}>
                                        <strong style={{ color: "var(--text)" }}>Service URL:</strong> <code style={{ background: "var(--input-bg)", padding: "2px 6px", borderRadius: "4px", color: "var(--cyan)" }}>http://localhost:9090</code>
                                    </div>
                                    <div style={{ marginBottom: "8px" }}>
                                        <strong style={{ color: "var(--text)" }}>Vulnerability:</strong> Business Logic / Price Manipulation
                                    </div>
                                    <div style={{ marginBottom: "8px" }}>
                                        <strong style={{ color: "var(--text)" }}>Challenge Type:</strong> Transactional Integrity
                                    </div>
                                </div>
                            </div>

                            {/* Helpful Tools Card */}
                            <div style={{ background: "var(--card-bg)", border: "1px solid var(--card-border)", borderRadius: "12px", padding: "20px" }}>
                                <h3 style={{ fontSize: "14px", fontWeight: "700", color: "var(--cyan)", marginBottom: "12px", textTransform: "uppercase", display: "flex", alignItems: "center", gap: "8px" }}>
                                    <Lightbulb size={16} /> 🛠 Useful Tools
                                </h3>
                                <p style={{ fontSize: "12px", color: "var(--muted)", marginBottom: "10px" }}>Use these to intercept and modify requests:</p>
                                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
                                    {["Browser DevTools", "curl", "Postman", "Burp Suite"].map(cmd => (
                                        <code key={cmd} style={{ background: "var(--input-bg)", color: "var(--cyan)", padding: "4px", borderRadius: "4px", fontSize: "12px", textAlign: "center", fontFamily: "monospace" }}>{cmd}</code>
                                    ))}
                                </div>
                            </div>

                            {/* Progressive Hints */}
                            <div style={{ background: "var(--card-bg)", border: "1px solid var(--card-border)", borderRadius: "12px", padding: "20px" }}>
                                <h3 style={{ fontSize: "14px", fontWeight: "700", color: "var(--cyan)", marginBottom: "12px", textTransform: "uppercase", display: "flex", alignItems: "center", gap: "8px" }}>
                                    <Info size={16} /> 💡 Progressive Hints
                                </h3>
                                <div style={{ fontSize: "13px", color: "var(--muted)", lineHeight: "1.5", display: "flex", flexDirection: "column", gap: "12px" }}>
                                    <div>
                                        <strong>Hint 1: Observe the Cart</strong>
                                        <p style={{ margin: "4px 0" }}>Check the Network tab in DevTools when clicking 'EXECUTE_CHECKOUT'. What JSON data is being sent?</p>
                                    </div>
                                    <div>
                                        <strong>Hint 2: Trust Issues</strong>
                                        <p style={{ margin: "4px 0" }}>Notice the <code>"price": 220</code> field in the request. What happens if you replay that request with a different number?</p>
                                    </div>
                                    <div>
                                        <strong>Hint 3: Logic over Technique</strong>
                                        <p style={{ margin: "4px 0" }}>The server accepts the price as-is. Use the terminal to send a manipulated price payload.</p>
                                    </div>
                                </div>
                            </div>

                            {/* Detailed Step-by-Step Walkthrough */}
                            <div style={{ background: "var(--card-bg)", border: "1px solid var(--card-border)", borderRadius: "12px", padding: "20px" }}>
                                <h3 style={{ fontSize: "14px", fontWeight: "700", color: "#ff8c00", marginBottom: "12px", textTransform: "uppercase", display: "flex", alignItems: "center", gap: "8px" }}>
                                    <Search size={16} /> 🔍 Detailed Walkthrough (How to use Inspect)
                                </h3>
                                <div style={{ fontSize: "13px", color: "var(--muted)", lineHeight: "1.6" }}>
                                    <ol style={{ paddingLeft: "20px", margin: "0" }}>
                                        <li style={{ marginBottom: "8px" }}>
                                            <strong>Open the Store:</strong> Click <code>Launch Environment</code> and switch to the <code>Web View</code> tab.
                                        </li>
                                        <li style={{ marginBottom: "8px" }}>
                                            <strong>Open DevTools:</strong> Right-click anywhere in the shop window and select <strong>Inspect</strong> (or press <code>F12</code>).
                                        </li>
                                        <li style={{ marginBottom: "8px" }}>
                                            <strong>Monitor Network:</strong> Go to the <strong>Network</strong> tab inside the Inspect panel. This shows all data traveling between you and the server.
                                        </li>
                                        <li style={{ marginBottom: "8px" }}>
                                            <strong>Trigger a Request:</strong> Add an item like "ZenBuds Pro" to your cart, then click the cart icon and hit <code>EXECUTE_CHECKOUT</code>.
                                        </li>
                                        <li style={{ marginBottom: "8px" }}>
                                            <strong>Identify the Vulnerability:</strong> In the Network list, look for a red or yellow <code>POST</code> request named <code>checkout</code>. Click it, then click <strong>Payload</strong> or <strong>Request</strong>. See the <code>"price": 220</code>?
                                        </li>
                                        <li style={{ marginBottom: "8px" }}>
                                            <strong>The Breach:</strong> The server doesn't verify this price. Switch to the <code>Terminal</code> tab and use the <code>curl</code> command from the Teacher Demonstration below, but change the price to <code>1</code>.
                                        </li>
                                    </ol>
                                </div>
                            </div>

                            {/* Submit Flag Card */}
                            <div style={{ background: "var(--card-bg)", border: "1px solid var(--card-border)", borderRadius: "12px", padding: "20px" }}>
                                <h3 style={{ fontSize: "14px", fontWeight: "700", color: "var(--cyan)", marginBottom: "12px", textTransform: "uppercase", display: "flex", alignItems: "center", gap: "8px" }}>
                                    <Award size={16} /> 🚩 Submit Flag
                                </h3>
                                <form onSubmit={submitFlag}>
                                    <input type="text" placeholder="FLAG{...}" value={flag} onChange={(e) => setFlag(e.target.value)} style={{ width: "100%", padding: "12px", background: "var(--input-bg)", border: "1px solid var(--card-border)", borderRadius: "8px", color: "var(--text)", fontSize: "14px", fontFamily: "monospace", marginBottom: "12px" }} />
                                    <button type="submit" style={{ width: "100%", padding: "12px", background: submitted ? "#51cf66" : "var(--cyan)", color: "#000", border: "none", borderRadius: "8px", fontWeight: "700", cursor: "pointer", fontSize: "14px" }}>
                                        {submitted ? "✓ Submitted" : "Submit Flag"}
                                    </button>
                                </form>
                                {message && (
                                    <div style={{ marginTop: "12px", padding: "12px", borderRadius: "8px", background: message.includes("Correct") ? "#51cf6620" : "#ff6b6b20", border: `1px solid \${message.includes("Correct") ? "#51cf66" : "#ff6b6b"}40`, color: message.includes("Correct") ? "#51cf66" : "#ff6b6b", fontSize: "13px", fontWeight: "600" }}>{message}</div>
                                )}
                            </div>

                            {/* Teacher Demo Card */}
                            <div style={{ background: "var(--card-bg)", border: "1px solid var(--card-border)", borderRadius: "12px", padding: "20px" }}>
                                <h3 style={{ fontSize: "14px", fontWeight: "700", color: "#ff0066", marginBottom: "12px", textTransform: "uppercase", display: "flex", alignItems: "center", gap: "8px" }}>
                                    <ShoppingCart size={16} /> 🧪 Teacher Demonstration
                                </h3>
                                <div style={{ fontSize: "13px", color: "var(--muted)", lineHeight: "1.6" }}>
                                    <p>Demonstrate why client-side trust is a critical business risk:</p>
                                    <ol style={{ paddingLeft: "20px", margin: "10px 0" }}>
                                        <li>Add a **Smart Watch** ($150) to the cart.</li>
                                        <li>Instead of standard checkout, use the terminal to send the manipulated request.</li>
                                    </ol>
                                    <div style={{ background: "var(--input-bg)", padding: "10px", borderRadius: "8px", border: "1px solid var(--card-border)", marginTop: "10px" }}>
                                        <p style={{ margin: "0 0 5px 0", fontSize: "11px" }}>Exploit command:</p>
                                        <code style={{ fontSize: "11px", color: "var(--cyan)" }}>{'curl -X POST http://localhost:9090/checkout -H "Content-Type: application/json" -d \'{"product":"Smart Watch", "price":1, "quantity":1}\''}</code>
                                    </div>
                                    <p style={{ fontSize: "12px", color: "#ffa500", marginTop: "10px" }}>💡 This maps to OWASP A04: Insecure Design.</p>
                                </div>
                            </div>

                            {/* Learning Outcome Card */}
                            <div style={{ background: "var(--card-bg)", border: "1px solid var(--card-border)", borderRadius: "12px", padding: "20px", marginBottom: "20px" }}>
                                <h3 style={{ fontSize: "14px", fontWeight: "700", color: "#00ff00", marginBottom: "12px", textTransform: "uppercase", display: "flex", alignItems: "center", gap: "8px" }}>
                                    <CheckCircle2 size={16} /> ✅ Learning Outcome
                                </h3>
                                <div style={{ fontSize: "13px", color: "var(--muted)", lineHeight: "1.6" }}>
                                    <p>What the student learns:</p>
                                    <ul style={{ margin: "5px 0", paddingLeft: "18px" }}>
                                        <li>Identifying business logic flaws vs. coding bugs.</li>
                                        <li>The danger of trusting hidden/manual form values.</li>
                                        <li>Importance of server-side re-validation for every transaction.</li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        {/* Right Panel - Terminal & Web View Tabs */}
                        {showTerminal ? (
                            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                                <div style={{ display: "flex", gap: "10px", padding: "0 10px" }}>
                                    <button
                                        onClick={() => setActiveTab("terminal")}
                                        style={{
                                            padding: "10px 20px",
                                            background: activeTab === "terminal" ? "var(--cyan)" : "var(--input-bg)",
                                            color: activeTab === "terminal" ? "#000" : "var(--text)",
                                            border: "none",
                                            borderRadius: "8px 8px 0 0",
                                            cursor: "pointer",
                                            fontWeight: "600",
                                            display: "flex", gap: "8px", alignItems: "center"
                                        }}
                                    >
                                        <Code size={16} /> Terminal
                                    </button>
                                    <button
                                        onClick={() => setActiveTab("web")}
                                        style={{
                                            padding: "10px 20px",
                                            background: activeTab === "web" ? "var(--cyan)" : "var(--input-bg)",
                                            color: activeTab === "web" ? "#000" : "var(--text)",
                                            border: "none",
                                            borderRadius: "8px 8px 0 0",
                                            cursor: "pointer",
                                            fontWeight: "600",
                                            display: "flex", gap: "8px", alignItems: "center"
                                        }}
                                    >
                                        <Globe size={16} /> Web View
                                    </button>
                                </div>

                                <div style={{
                                    background: "var(--card-bg)",
                                    border: "1px solid var(--card-border)",
                                    borderRadius: "12px",
                                    overflow: "hidden",
                                    height: "calc(100vh - 250px)",
                                    position: "relative"
                                }}>
                                    {activeTab === "terminal" ? (
                                        <div style={{ height: "100%" }}>
                                            <div style={{ background: "var(--input-bg)", padding: "8px 16px", borderBottom: "1px solid var(--card-border)", fontSize: "12px", color: "var(--muted)" }}>PawnBox Terminal</div>
                                            <WebTerminal />
                                        </div>
                                    ) : (
                                        <div style={{ height: "100%", background: "#fff" }}>
                                            <div style={{ background: "#f0f0f0", padding: "8px 16px", borderBottom: "1px solid #ddd", fontSize: "12px", color: "#666", display: "flex", alignItems: "center", gap: "10px" }}>
                                                <div style={{ background: "#eee", padding: "4px 12px", borderRadius: "15px", flex: 1, border: "1px solid #ccc", color: "#333" }}>http://localhost:9090</div>
                                                <button onClick={() => { const f = document.getElementById('logic-frame'); f.src = f.src; }} style={{ border: "none", background: "none", cursor: "pointer", color: "#666" }}>Refresh</button>
                                            </div>
                                            <iframe
                                                id="logic-frame"
                                                src="http://localhost:9090"
                                                style={{ width: "100%", height: "calc(100% - 35px)", border: "none" }}
                                                title="Business Logic Lab View"
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>
                        ) : (
                            <div style={{ background: "var(--card-bg)", border: "1px solid var(--card-border)", borderRadius: "12px", padding: "80px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", minHeight: "600px" }}>
                                <div style={{ width: "100px", height: "100px", background: "#00d4ff20", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "24px" }}><ShoppingCart size={50} style={{ color: "#00d4ff" }} /></div>
                                <h2 style={{ fontSize: "28px", fontWeight: "700", marginBottom: "16px" }}>Electronics Smart Shop</h2>
                                <p style={{ color: "var(--muted)", marginBottom: "32px", maxWidth: "500px", lineHeight: "1.6", fontSize: "16px" }}>Manipulate transaction data to bypass payment logic and secure high-value items for free.</p>
                                <button onClick={() => setShowTerminal(true)} style={{ background: "#00d4ff", color: "#000", border: "none", padding: "16px 48px", borderRadius: "12px", fontWeight: "700", fontSize: "17px", cursor: "pointer", display: "flex", alignItems: "center", gap: "12px" }}>
                                    <Terminal size={24} /> Launch Environment
                                </button>
                            </div>
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
}
