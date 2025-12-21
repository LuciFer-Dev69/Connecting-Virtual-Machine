import React, { useState, useRef } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { API_BASE } from "../config";
import { useTheme } from "../context/ThemeContext";

export default function Profile() {
  const { theme, toggleTheme } = useTheme();
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [profilePic, setProfilePic] = useState(user?.profilePic || "");
  const [msg, setMsg] = useState("");
  const [msgType, setMsgType] = useState(""); // success or error
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check file size (max 2MB)
      if (file.size > 2 * 1024 * 1024) {
        setMsg("Image size should be less than 2MB");
        setMsgType("error");
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePic(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();

    // Save directly to localStorage
    const updatedUser = { ...user, name, email, profilePic };
    localStorage.setItem("user", JSON.stringify(updatedUser));
    setMsg("Profile saved successfully!");
    setMsgType("success");
    setTimeout(() => setMsg(""), 3000);
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    window.location.hash = "#/login";
  };

  const handleRemovePhoto = () => {
    setProfilePic("");
  };

  return (
    <div>
      <Navbar />
      <div style={{ display: "flex" }}>
        <Sidebar active="profile" />
        <main style={{
          flex: 1,
          padding: "40px",
          background: "var(--bg)",
          minHeight: "100vh"
        }}>
          <div style={{ maxWidth: "900px", margin: "0 auto" }}>
            {/* Header */}
            <div style={{ marginBottom: "40px" }}>
              <h1 style={{
                color: "var(--cyan)",
                fontSize: "42px",
                marginBottom: "10px",
                fontWeight: "bold"
              }}>
                Profile Settings
              </h1>
              <p style={{ color: "#888", fontSize: "16px" }}>
                Manage your account information and preferences
              </p>
            </div>

            <div style={{ display: "flex", gap: "30px", flexWrap: "wrap" }}>
              {/* Left Section - Profile Picture */}
              <div style={{ flex: "0 0 300px" }}>
                <div style={{
                  background: "var(--card-bg)",
                  backdropFilter: "blur(10px)",
                  border: "1px solid var(--card-border)",
                  borderRadius: "15px",
                  padding: "30px",
                  textAlign: "center"
                }}>
                  <h3 style={{ color: "var(--text)", marginBottom: "25px", fontSize: "18px" }}>
                    Profile Picture
                  </h3>

                  {/* Profile Picture Display */}
                  <div style={{
                    width: "150px",
                    height: "150px",
                    margin: "0 auto 25px",
                    borderRadius: "50%",
                    overflow: "hidden",
                    border: "4px solid var(--cyan)",
                    background: "#333",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    position: "relative"
                  }}>
                    {profilePic ? (
                      <img
                        src={profilePic}
                        alt="Profile"
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover"
                        }}
                      />
                    ) : (
                      <div style={{ fontSize: "64px" }}>👤</div>
                    )}
                  </div>

                  {/* Hidden file input */}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    style={{ display: "none" }}
                  />

                  {/* Upload Button */}
                  <button
                    type="button"
                    onClick={() => fileInputRef.current.click()}
                    style={{
                      width: "100%",
                      padding: "12px",
                      background: "linear-gradient(90deg, #00d4ff, #00ff88)",
                      color: "#000",
                      fontSize: "14px",
                      fontWeight: "600",
                      border: "none",
                      borderRadius: "10px",
                      cursor: "pointer",
                      marginBottom: "10px",
                      transition: "transform 0.2s ease"
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.transform = "translateY(-2px)"}
                    onMouseLeave={(e) => e.currentTarget.style.transform = "translateY(0)"}
                  >
                    📁 Choose Photo
                  </button>

                  {/* Remove Photo Button */}
                  {profilePic && (
                    <button
                      type="button"
                      onClick={handleRemovePhoto}
                      style={{
                        width: "100%",
                        padding: "12px",
                        background: "rgba(255, 77, 77, 0.2)",
                        color: "#ff4d4d",
                        fontSize: "14px",
                        fontWeight: "600",
                        border: "1px solid rgba(255, 77, 77, 0.4)",
                        borderRadius: "10px",
                        cursor: "pointer",
                        transition: "all 0.2s ease"
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = "rgba(255, 77, 77, 0.3)";
                        e.currentTarget.style.transform = "translateY(-2px)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = "rgba(255, 77, 77, 0.2)";
                        e.currentTarget.style.transform = "translateY(0)";
                      }}
                    >
                      🗑️ Remove Photo
                    </button>
                  )}

                  <p style={{
                    color: "#666",
                    fontSize: "12px",
                    marginTop: "15px",
                    lineHeight: "1.5"
                  }}>
                    Recommended: Square image, at least 400x400px, max 2MB
                  </p>
                </div>
              </div>

              {/* Right Section - Form */}
              <div style={{ flex: 1, minWidth: "300px" }}>
                <form onSubmit={handleSave}>
                  <div style={{
                    background: "var(--card-bg)",
                    backdropFilter: "blur(10px)",
                    border: "1px solid var(--card-border)",
                    borderRadius: "15px",
                    padding: "30px",
                    marginBottom: "20px"
                  }}>
                    <h3 style={{ color: "var(--text)", marginBottom: "25px", fontSize: "18px" }}>
                      Account Information
                    </h3>

                    {/* Theme Toggle */}
                    <div style={{ marginBottom: "25px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <label style={{
                        color: "var(--text)",
                        fontSize: "14px",
                        fontWeight: "500"
                      }}>
                        App Theme
                      </label>
                      <button
                        type="button"
                        onClick={toggleTheme}
                        style={{
                          background: "var(--card-bg)",
                          border: "1px solid var(--cyan)",
                          color: "var(--cyan)",
                          padding: "8px 16px",
                          borderRadius: "20px",
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                          fontSize: "14px",
                          fontWeight: "bold",
                          transition: "all 0.3s ease"
                        }}
                      >
                        {theme === 'dark' ? '🌙 Dark Mode' : '☀️ Light Mode'}
                      </button>
                    </div>

                    {/* Username Field */}
                    <div style={{ marginBottom: "25px" }}>
                      <label style={{
                        display: "block",
                        color: "var(--text)",
                        marginBottom: "8px",
                        fontSize: "14px",
                        fontWeight: "500"
                      }}>
                        Username
                      </label>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        style={{
                          width: "100%",
                          padding: "12px 15px",
                          background: "var(--input-bg)",
                          border: "1px solid var(--card-border)",
                          borderRadius: "10px",
                          color: "var(--text)",
                          fontSize: "15px",
                          outline: "none",
                          transition: "all 0.3s ease"
                        }}
                        onFocus={(e) => e.target.style.borderColor = "#00d4ff"}
                        onBlur={(e) => e.target.style.borderColor = "var(--card-border)"}
                      />
                    </div>

                    {/* Email Field */}
                    <div style={{ marginBottom: "25px" }}>
                      <label style={{
                        display: "block",
                        color: "var(--text)",
                        marginBottom: "8px",
                        fontSize: "14px",
                        fontWeight: "500"
                      }}>
                        Email Address
                      </label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        style={{
                          width: "100%",
                          padding: "12px 15px",
                          background: "var(--input-bg)",
                          border: "1px solid var(--card-border)",
                          borderRadius: "10px",
                          color: "var(--text)",
                          fontSize: "15px",
                          outline: "none",
                          transition: "all 0.3s ease"
                        }}
                        onFocus={(e) => e.target.style.borderColor = "#00d4ff"}
                        onBlur={(e) => e.target.style.borderColor = "var(--card-border)"}
                      />
                    </div>

                    {/* Account Stats */}
                    <div style={{
                      marginTop: "30px",
                      padding: "20px",
                      background: "rgba(0, 212, 255, 0.1)",
                      border: "1px solid rgba(0, 212, 255, 0.3)",
                      borderRadius: "10px"
                    }}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}>
                        <span style={{ color: "#888", fontSize: "14px" }}>Progress</span>
                        <span style={{ color: "#00d4ff", fontSize: "14px", fontWeight: "600" }}>
                          {user?.progress || 0}%
                        </span>
                      </div>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}>
                        <span style={{ color: "#888", fontSize: "14px" }}>Level</span>
                        <span style={{ color: "#00ff88", fontSize: "14px", fontWeight: "600" }}>
                          {Math.floor((user?.progress || 0) / 10) + 1}
                        </span>
                      </div>
                      <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <span style={{ color: "#888", fontSize: "14px" }}>Member Since</span>
                        <span style={{ color: "#fff", fontSize: "14px", fontWeight: "600" }}>
                          {new Date().toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div style={{ display: "flex", gap: "15px" }}>
                    <button
                      type="submit"
                      style={{
                        flex: 1,
                        padding: "14px",
                        background: "linear-gradient(90deg, #00d4ff, #00ff88)",
                        color: "#000",
                        fontSize: "16px",
                        fontWeight: "bold",
                        border: "none",
                        borderRadius: "10px",
                        cursor: "pointer",
                        transition: "transform 0.2s ease",
                        boxShadow: "0 5px 20px rgba(0, 212, 255, 0.3)"
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.transform = "translateY(-2px)"}
                      onMouseLeave={(e) => e.currentTarget.style.transform = "translateY(0)"}
                    >
                      💾 Save Changes
                    </button>

                    <button
                      type="button"
                      onClick={handleLogout}
                      style={{
                        flex: 1,
                        padding: "14px",
                        background: "transparent",
                        color: "var(--text)",
                        fontSize: "16px",
                        fontWeight: "bold",
                        border: "1px solid var(--card-border)",
                        borderRadius: "10px",
                        cursor: "pointer",
                        transition: "all 0.2s ease"
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = "rgba(255, 77, 77, 0.2)";
                        e.currentTarget.style.borderColor = "#ff4d4d";
                        e.currentTarget.style.color = "#ff4d4d";
                        e.currentTarget.style.transform = "translateY(-2px)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = "transparent";
                        e.currentTarget.style.borderColor = "var(--card-border)";
                        e.currentTarget.style.color = "var(--text)";
                        e.currentTarget.style.transform = "translateY(0)";
                      }}
                    >
                      🚪 Logout
                    </button>
                  </div>

                  {/* Success/Error Message */}
                  {msg && (
                    <div style={{
                      marginTop: "20px",
                      padding: "15px",
                      background: msgType === "success"
                        ? "rgba(81, 207, 102, 0.15)"
                        : "rgba(255, 77, 77, 0.15)",
                      border: `1px solid ${msgType === "success" ? "#51cf66" : "#ff4d4d"}`,
                      borderRadius: "10px",
                      color: msgType === "success" ? "#51cf66" : "#ff4d4d",
                      fontSize: "14px",
                      textAlign: "center",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "10px"
                    }}>
                      <span>{msgType === "success" ? "✅" : "⚠️"}</span>
                      <span>{msg}</span>
                    </div>
                  )}
                </form>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}