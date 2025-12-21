import React, { useState, useRef } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { API_BASE } from "../config";

export default function Profile() {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [profilePic, setProfilePic] = useState(user?.profilePic || "");
  const [msg, setMsg] = useState("");
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePic(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    
    // Save directly to localStorage (no backend call needed)
    const updatedUser = { ...user, name, email, profilePic };
    localStorage.setItem("user", JSON.stringify(updatedUser));
    setMsg("Profile saved successfully!");
    setTimeout(() => setMsg(""), 3000);
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    window.location.hash = "#/login";
  };

  return (
    <div>
      <Navbar />
      <div style={{ display: "flex" }}>
        <Sidebar active="profile" />
        <main className="container" style={{ maxWidth: "600px", margin: "40px auto" }}>
          <h1 style={{ color: "var(--cyan)", marginBottom: "30px" }}>Profile Settings</h1>

          <div className="card" style={{ padding: "30px" }}>
            <form onSubmit={handleSave}>
              {/* Profile Picture */}
              <div style={{ textAlign: "center", marginBottom: "30px" }}>
                <div style={{
                  width: "120px",
                  height: "120px",
                  background: "#333",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "48px",
                  margin: "0 auto 20px",
                  overflow: "hidden",
                  border: "3px solid var(--cyan)"
                }}>
                  {profilePic ? (
                    <img src={profilePic} alt="Profile" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  ) : (
                    "👤"
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

                {/* Image selection button */}
                <button
                  type="button"
                  className="btn btn-cyan"
                  onClick={() => fileInputRef.current.click()}
                  style={{ padding: "10px 20px" }}
                >
                  📁 Choose from Gallery
                </button>
              </div>

              {/* Username */}
              <div style={{ marginBottom: "20px" }}>
                <label style={{ display: "block", marginBottom: "8px", color: "#ccc", fontWeight: "500" }}>Username</label>
                <input
                  className="input"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              {/* Email */}
              <div style={{ marginBottom: "25px" }}>
                <label style={{ display: "block", marginBottom: "8px", color: "#ccc", fontWeight: "500" }}>Email</label>
                <input
                  className="input"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              {/* Save Button */}
              <button type="submit" className="btn btn-green" style={{ width: "100%", marginBottom: "15px" }}>
                Save Changes
              </button>

              {msg && <p style={{ color: msg.includes("success") ? "limegreen" : "red", textAlign: "center", marginTop: "10px" }}>{msg}</p>}
            </form>

            {/* Logout Button */}
            <button onClick={handleLogout} className="btn btn-ghost" style={{ width: "100%", marginTop: "20px" }}>
              Logout
            </button>
          </div>
        </main>
      </div>
    </div>
  );
}