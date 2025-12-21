import React from "react";

export default function Sidebar({ active }) {
  const items = [
    { name: "Dashboard", key: "dashboard" },
    { name: "Challenges", key: "challenges" },
    { name: "Tutorials", key: "tutorials" },
    { name: "Lessons", key: "lessons" },
    { name: "Profile", key: "profile" },
  ];

  return (
    <aside style={{ width: "220px", background: "#1f1f1f", color: "#ccc", padding: "20px", minHeight: "100vh" }}>
      {/* <h3 style={{ color: "var(--cyan)", marginBottom: "20px" }}>Chakra-View</h3> */}
      {items.map((item) => (
        <a
          key={item.key}
          href={`#/${item.key}`}
          style={{
            display: "block",
            padding: "10px 15px",
            marginBottom: "5px",
            borderRadius: "5px",
            textDecoration: "none",
            color: active === item.key ? "#fff" : "#ccc",
            background: active === item.key ? "#333" : "transparent"
          }}
        >
          {item.name}
        </a>
      ))}
    </aside>
  );
}
