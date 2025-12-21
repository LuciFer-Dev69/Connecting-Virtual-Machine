import React, { useState } from "react";
import Navbar from "../components/Navbar";
import { API_BASE } from "../config";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);
  
  // Validation states
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const validateEmail = (value) => {
    if (!value) {
      setEmailError("");
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      setEmailError("Please enter a valid email address");
      return false;
    }
    setEmailError("");
    return true;
  };

  const validatePassword = (value) => {
    if (!value) {
      setPasswordError("");
      return false;
    }
    
    const hasUpperCase = /[A-Z]/.test(value);
    const hasNumber = /[0-9]/.test(value);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(value);
    const isLongEnough = value.length >= 8;
    
    if (!isLongEnough) {
      setPasswordError("Password must be at least 8 characters");
      return false;
    }
    if (!hasUpperCase) {
      setPasswordError("Password must contain at least one uppercase letter");
      return false;
    }
    if (!hasNumber) {
      setPasswordError("Password must contain at least one number");
      return false;
    }
    if (!hasSpecialChar) {
      setPasswordError("Password must contain at least one special character");
      return false;
    }
    
    setPasswordError("");
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg("");
    
    // Validate fields
    const isEmailValid = validateEmail(email);
    const isPasswordValid = validatePassword(password);
    
    if (!isEmailValid || !isPasswordValid) {
      return;
    }
    
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setMsg(data.error || "Login failed");
        setLoading(false);
        return;
      }

      localStorage.setItem("user", JSON.stringify(data.user || {}));
      if (data.user?.role === "admin") {
        window.location.hash = "#/admin";
      } else {
        window.location.hash = "#/dashboard";
      }
    } catch (err) {
      setMsg(err.message || "Network error");
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 100%)" }}>
      <Navbar />
      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "calc(100vh - 80px)",
        padding: "20px"
      }}>
        <div style={{
          background: "rgba(255, 255, 255, 0.05)",
          backdropFilter: "blur(20px)",
          border: "1px solid rgba(255, 255, 255, 0.1)",
          borderRadius: "20px",
          padding: "50px 40px",
          maxWidth: "450px",
          width: "100%",
          boxShadow: "0 20px 60px rgba(0, 0, 0, 0.5)"
        }}>
          <h1 style={{
            fontSize: "32px",
            fontWeight: "bold",
            color: "#fff",
            marginBottom: "10px",
            textAlign: "center"
          }}>
            Welcome Back
          </h1>
          <p style={{
            color: "#888",
            textAlign: "center",
            marginBottom: "30px"
          }}>
            Sign in to continue your journey
          </p>

          <form onSubmit={handleSubmit} autoComplete="on">
            <div style={{ marginBottom: emailError ? "50px" : "25px", position: "relative" }}>
              <label style={{
                display: "block",
                color: "#ccc",
                marginBottom: "8px",
                fontSize: "14px",
                fontWeight: "500"
              }}>
                Email Address
              </label>
              <input
                type="email"
                name="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (e.target.value) validateEmail(e.target.value);
                  else setEmailError("");
                }}
                onBlur={(e) => e.target.value && validateEmail(e.target.value)}
                autoComplete="email"
                required
                style={{
                  width: "100%",
                  padding: "12px 15px",
                  background: "rgba(255, 255, 255, 0.08)",
                  border: `1px solid ${emailError ? "#ff4d4d" : "rgba(255, 255, 255, 0.2)"}`,
                  borderRadius: "10px",
                  color: "#fff",
                  fontSize: "15px",
                  outline: "none",
                  transition: "all 0.3s ease"
                }}
                onFocus={(e) => !emailError && (e.target.style.borderColor = "#00d4ff")}
              />
              {emailError && (
                <div style={{
                  position: "absolute",
                  top: "calc(100% + 5px)",
                  left: "0",
                  right: "0",
                  padding: "10px 12px",
                  background: "rgba(255, 77, 77, 0.15)",
                  border: "1px solid rgba(255, 77, 77, 0.4)",
                  borderRadius: "8px",
                  color: "#ff6b6b",
                  fontSize: "12px",
                  zIndex: 10
                }}>
                  ⚠️ {emailError}
                </div>
              )}
            </div>

            <div style={{ marginBottom: passwordError ? "50px" : "30px", position: "relative" }}>
              <label style={{
                display: "block",
                color: "#ccc",
                marginBottom: "8px",
                fontSize: "14px",
                fontWeight: "500"
              }}>
                Password
              </label>
              <input
                type="password"
                name="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (e.target.value) validatePassword(e.target.value);
                  else setPasswordError("");
                }}
                onBlur={(e) => e.target.value && validatePassword(e.target.value)}
                autoComplete="current-password"
                required
                style={{
                  width: "100%",
                  padding: "12px 15px",
                  background: "rgba(255, 255, 255, 0.08)",
                  border: `1px solid ${passwordError ? "#ff4d4d" : "rgba(255, 255, 255, 0.2)"}`,
                  borderRadius: "10px",
                  color: "#fff",
                  fontSize: "15px",
                  outline: "none",
                  transition: "all 0.3s ease"
                }}
                onFocus={(e) => !passwordError && (e.target.style.borderColor = "#00d4ff")}
              />
              {passwordError && (
                <div style={{
                  position: "absolute",
                  top: "calc(100% + 5px)",
                  left: "0",
                  right: "0",
                  padding: "10px 12px",
                  background: "rgba(255, 77, 77, 0.15)",
                  border: "1px solid rgba(255, 77, 77, 0.4)",
                  borderRadius: "8px",
                  color: "#ff6b6b",
                  fontSize: "12px",
                  zIndex: 10
                }}>
                  ⚠️ {passwordError}
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                width: "100%",
                padding: "14px",
                background: loading ? "#555" : "linear-gradient(90deg, #00d4ff, #00ff88)",
                color: "#000",
                fontSize: "16px",
                fontWeight: "bold",
                border: "none",
                borderRadius: "10px",
                cursor: loading ? "not-allowed" : "pointer",
                transition: "transform 0.2s ease",
                boxShadow: "0 5px 20px rgba(0, 212, 255, 0.3)"
              }}
              onMouseEnter={(e) => !loading && (e.currentTarget.style.transform = "translateY(-2px)")}
              onMouseLeave={(e) => !loading && (e.currentTarget.style.transform = "translateY(0)")}
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          {msg && (
            <p style={{
              marginTop: "20px",
              padding: "12px",
              background: "rgba(255, 77, 77, 0.1)",
              border: "1px solid rgba(255, 77, 77, 0.3)",
              borderRadius: "8px",
              color: "#ff4d4d",
              fontSize: "14px",
              textAlign: "center"
            }}>
              {msg}
            </p>
          )}

          <p style={{
            marginTop: "25px",
            textAlign: "center",
            color: "#888",
            fontSize: "14px"
          }}>
            Don't have an account?{" "}
            <a href="#/signup" style={{
              color: "#00d4ff",
              textDecoration: "none",
              fontWeight: "500"
            }}>
              Sign up
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}