import React, { useEffect, useState } from "react";
import api from "../api/api";

const card = (bg, icon, label, val) => (
  <div key={label} style={{ background: bg, borderRadius: 14, padding: "24px 28px", color: "#fff", flex: 1, minWidth: 160 }}>
    <div style={{ fontSize: 32 }}>{icon}</div>
    <div style={{ fontSize: 28, fontWeight: 700, marginTop: 8 }}>{val}</div>
    <div style={{ fontSize: 14, opacity: 0.85 }}>{label}</div>
  </div>
);

export default function Dashboard() {
  const [stats, setStats] = useState({ employees: 0, departments: 0, tasks: { pending: 0, inProgress: 0, completed: 0 } });
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  useEffect(() => {
    const load = async () => {
      try {
        const [emp, dept, analytics] = await Promise.all([
          api.get("/employees"),
          api.get("/departments"),
          api.get("/analytics"),
        ]);
        const taskData = analytics.data.taskStatusData || [];
        const get = (name) => taskData.find(t => t.name === name)?.count || 0;
        setStats({
          employees: emp.data.length,
          departments: dept.data.length,
          tasks: { pending: get("Pending"), inProgress: get("In Progress"), completed: get("Completed") },
        });
      } catch (err) { console.error(err); }
    };
    load();
  }, []);

  return (
    <div>
      <h1 style={{ fontSize: 26, fontWeight: 700, marginBottom: 6 }}>👋 Hello, {user.fullName || "User"}!</h1>
      <p style={{ color: "#64748b", marginBottom: 32 }}>Here's your task management overview.</p>
      <div style={{ display: "flex", gap: 16, flexWrap: "wrap", marginBottom: 32 }}>
        {card("#3b82f6", "👥", "Employees", stats.employees)}
        {card("#8b5cf6", "🏢", "Departments", stats.departments)}
        {card("#f59e0b", "⏳", "Pending Tasks", stats.tasks.pending)}
        {card("#06b6d4", "🔄", "In Progress", stats.tasks.inProgress)}
        {card("#10b981", "✅", "Completed", stats.tasks.completed)}
      </div>
      <div style={{ background: "#fff", borderRadius: 14, padding: 28, boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
        <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 12 }}>Quick Links</h2>
        <p style={{ color: "#64748b" }}>Navigate using the sidebar to manage employees, departments, and view analytics.</p>
      </div>
    </div>
  );
}
