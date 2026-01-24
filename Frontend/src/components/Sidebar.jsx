import React from "react";
import { LayoutDashboard, Target, BookOpen, GraduationCap, User, Shield, Terminal } from "lucide-react";

export default function Sidebar({ active }) {
  const groups = [
    {
      label: "CORE",
      items: [
        { name: "Dashboard", key: "dashboard", icon: LayoutDashboard },
        { name: "Ops", key: "challenges", icon: Target },
      ]
    },
    {
      label: "LABS",
      items: [
        { name: "Attack Paths", key: "real-life-challenges", icon: Shield, path: "#/real-life-challenges" },
        { name: "Operator Terminal", key: "pwnbox", icon: Terminal, path: "#/pwnbox" },
      ]
    },
    {
      label: "LEARNING",
      items: [
        { name: "Tutorials", key: "tutorials", icon: BookOpen },
        { name: "Lessons", key: "lessons", icon: GraduationCap },
        { name: "Profile", key: "profile", icon: User },
      ]
    }
  ];

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const isAdmin = user.role === "admin" || user.role === "Super Admin";

  if (isAdmin) {
    groups[0].items.push({ name: "Control Panel", key: "admin", icon: Shield });
  }

  return (
    <aside style={{ width: "240px", background: "var(--bg)", color: "var(--text)", padding: "40px 0", minHeight: "100vh", borderRight: "1px solid var(--card-border)", position: "sticky", top: 0 }}>
      {groups.map((group, gIdx) => (
        <div key={group.label} style={{ marginBottom: "30px" }}>
          <div style={{ padding: "0 25px", fontSize: "11px", fontWeight: "700", color: "var(--muted)", letterSpacing: "1.5px", marginBottom: "15px" }}>
            {group.label}
          </div>
          {group.items.map((item) => (
            <a
              key={item.key}
              href={`#/${item.key}`}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                padding: "12px 25px",
                marginBottom: "4px",
                textDecoration: "none",
                fontSize: "14px",
                fontWeight: active === item.key ? "600" : "400",
                color: active === item.key ? "var(--red)" : "var(--text)",
                background: active === item.key ? "rgba(255, 0, 68, 0.05)" : "transparent",
                position: "relative",
                transition: "all 0.2s ease"
              }}
              onMouseEnter={(e) => {
                if (active !== item.key) {
                  e.currentTarget.style.background = "var(--bg-secondary)";
                  e.currentTarget.style.color = "var(--red)";
                }
              }}
              onMouseLeave={(e) => {
                if (active !== item.key) {
                  e.currentTarget.style.background = "transparent";
                  e.currentTarget.style.color = "var(--text)";
                }
              }}
            >
              {active === item.key && (
                <div style={{ position: "absolute", left: 0, top: 0, width: "3px", height: "100%", background: "var(--red)", boxShadow: "0 0 10px var(--red)" }} />
              )}
              <item.icon size={18} />
              {item.name}
            </a>
          ))}
        </div>
      ))}
    </aside>
  );
}
