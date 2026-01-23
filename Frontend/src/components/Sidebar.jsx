import React from "react";
import { LayoutDashboard, Target, BookOpen, GraduationCap, User, Shield, Terminal } from "lucide-react";

export default function Sidebar({ active }) {
  const items = [
    { name: "Dashboard", key: "dashboard", icon: LayoutDashboard },
    { name: "Challenges", key: "challenges", icon: Target },
    { name: "Real-Life Web", key: "real-life-challenges", icon: Shield, path: "#/real-life-challenges" },
    { name: "PwnBox", key: "pwnbox", icon: Terminal, path: "#/pwnbox" },
    { name: "Tutorials", key: "tutorials", icon: BookOpen },
    { name: "Lessons", key: "lessons", icon: GraduationCap },
    { name: "Profile", key: "profile", icon: User },
  ];

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const isAdmin = user.role === "admin" || user.role === "Super Admin";

  let finalItems = items;
  if (isAdmin) {
    finalItems = [
      ...items,
      { name: "Admin Panel", key: "admin", icon: Shield }
    ];
  }

  return (
    <aside style={{ width: "220px", background: "var(--sidebar-bg)", color: "var(--text)", padding: "20px", minHeight: "100vh", borderRight: "1px solid var(--card-border)" }}>
      {/* <h3 style={{ color: "var(--cyan)", marginBottom: "20px" }}>Chakra-View</h3> */}
      {finalItems.map((item) => (
        <a
          key={item.key}
          href={`#/${item.key}`}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            padding: "10px 15px",
            marginBottom: "5px",
            borderRadius: "5px",
            textDecoration: "none",
            color: active === item.key ? "var(--text)" : "var(--muted)",
            background: active === item.key ? "var(--card-border)" : "transparent"
          }}
        >
          <item.icon size={18} />
          {item.name}
        </a>
      ))}
    </aside>
  );
}
