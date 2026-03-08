import React, { useEffect, useState } from "react";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";
import api from "../api/api";

const COLORS = ["#f59e0b", "#06b6d4", "#10b981", "#3b82f6", "#8b5cf6", "#ef4444"];

export default function Analytics() {
  const [data, setData] = useState({ taskStatusData: [], departmentData: [] });

  useEffect(() => {
    api.get("/analytics").then(r => setData(r.data)).catch(console.error);
  }, []);

  return (
    <div>
      <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 24 }}>📊 Analytics</h1>
      <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
        <div style={{ flex: 1, minWidth: 300, background: "#fff", borderRadius: 14, padding: 28, boxShadow: "0 2px 12px rgba(0,0,0,0.07)" }}>
          <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 20 }}>Tasks by Status</h2>
          {data.taskStatusData.length > 0 ? (
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie data={data.taskStatusData} dataKey="count" nameKey="name" cx="50%" cy="50%" outerRadius={90} label={({ name, count }) => `${name}: ${count}`}>
                  {data.taskStatusData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          ) : <p style={{ color: "#94a3b8", textAlign: "center", paddingTop: 60 }}>No task data yet</p>}
        </div>

        <div style={{ flex: 1, minWidth: 300, background: "#fff", borderRadius: 14, padding: 28, boxShadow: "0 2px 12px rgba(0,0,0,0.07)" }}>
          <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 20 }}>Tasks by Department</h2>
          {data.departmentData.length > 0 ? (
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={data.departmentData}>
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="value" fill="#3b82f6" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : <p style={{ color: "#94a3b8", textAlign: "center", paddingTop: 60 }}>No department data yet</p>}
        </div>
      </div>
    </div>
  );
}
