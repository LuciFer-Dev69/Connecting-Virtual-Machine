
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { API_BASE } from "../config";
import { Shield, Loader2, Eye, EyeOff, AlertCircle } from "lucide-react";
import './Auth.css';

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setMsg("");
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (res.ok) {
        localStorage.setItem("user", JSON.stringify(data));
        navigate("/dashboard");
      } else {
        setMsg(data.error);
      }
    } catch (err) {
      setMsg("Connection error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      {/* Brand Logo Header */}
      <Link to="/" className="auth-header-logo">
        <Shield size={24} className="auth-logo-icon" fill="currentColor" />
        <span className="auth-logo-text">CHAKRA VIEW</span>
      </Link>

      <div className="auth-card">
        <h2 className="auth-title">Sign in to Chakra View</h2>

        {msg && (
          <div className="error-banner">
            <AlertCircle size={16} />
            {msg}
          </div>
        )}

        <form onSubmit={handleLogin}>
          <div className="auth-form-group">
            <label className="auth-label">Email</label>
            <input
              type="email"
              className="auth-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder=""
              required
            />
          </div>

          <div className="auth-form-group">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <label className="auth-label">Password</label>
              <Link to="/forgot-password" className="forgot-password-link" style={{ marginBottom: '0.5rem', fontSize: '0.75rem' }}>
                Forgot Password?
              </Link>
            </div>
            <div className="auth-input-wrapper">
              <input
                type={showPassword ? "text" : "password"}
                className="auth-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                style={{ right: '12px', background: 'none', border: 'none', cursor: 'pointer' }}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button type="submit" className="btn-auth-primary" disabled={loading}>
            {loading ? <Loader2 className="animate-spin" size={20} /> : "Sign In"}
          </button>
        </form>

        <div className="auth-footer-text">
          Don't have an account?
          <Link to="/signup" className="auth-link">Sign Up</Link>
        </div>
      </div>
    </div>
  );
}