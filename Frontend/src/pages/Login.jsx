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
      localStorage.setItem("token", data.token); // Store JWT token
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
    <div style={{ minHeight: "100vh", background: "var(--bg)" }}>
      <Navbar />
      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "calc(100vh - 80px)",
        padding: "20px"
      }}>
        <div style={{
          background: "var(--card-bg)",
          backdropFilter: "blur(20px)",
          border: "1px solid var(--card-border)",
          borderRadius: "24px",
          padding: "50px 40px",
          maxWidth: "450px",
          width: "100%",
          boxShadow: "0 20px 60px rgba(0, 0, 0, 0.4)"
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
                  background: "var(--input-bg)",
                  border: `1px solid ${emailError ? "var(--danger)" : "var(--card-border)"}`,
                  borderRadius: "12px",
                  color: "var(--text)",
                  fontSize: "15px",
                  outline: "none",
                  transition: "all 0.3s ease"
                }}
                onFocus={(e) => !emailError && (e.target.style.borderColor = "var(--cyan)")}
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
                background: loading ? "var(--button-bg)" : "linear-gradient(90deg, var(--cyan), var(--accent))",
                color: "#fff",
                fontSize: "16px",
                fontWeight: "600",
                border: "none",
                borderRadius: "12px",
                cursor: loading ? "not-allowed" : "pointer",
                transition: "all 0.3s ease",
                boxShadow: loading ? "none" : "0 8px 20px var(--glow)"
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