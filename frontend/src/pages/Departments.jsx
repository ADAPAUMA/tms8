import React, { useEffect, useState } from "react";
import api from "../api/api";

export default function Departments() {
  const [departments, setDepartments] = useState([]);
  const [form, setForm] = useState({ name: "" });
  const [editId, setEditId] = useState(null);
  const [editName, setEditName] = useState("");

  const load = async () => {
    const { data } = await api.get("/departments");
    setDepartments(data);
  };
  useEffect(() => { load(); }, []);

  const add = async (e) => {
    e.preventDefault();
    try { await api.post("/departments", form); setForm({ name: "" }); load(); }
    catch (err) { alert(err.response?.data?.message || "Error"); }
  };

  const update = async (id) => {
    await api.put(`/departments/${id}`, { name: editName }); setEditId(null); load();
  };

  const remove = async (id) => {
    if (!window.confirm("Delete department?")) return;
    await api.delete(`/departments/${id}`); load();
  };

  return (
    <div>
      <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 24 }}>🏢 Departments</h1>
      <form onSubmit={add} style={{ background: "#fff", padding: 24, borderRadius: 12, marginBottom: 24, boxShadow: "0 2px 12px rgba(0,0,0,0.07)", display: "flex", gap: 12 }}>
        <input placeholder="New department name" value={form.name} onChange={e => setForm({ name: e.target.value })} required style={{ flex: 1, padding: "10px 14px", borderRadius: 8, border: "1px solid #e2e8f0", fontSize: 15 }} />
        <button type="submit" style={{ padding: "10px 24px", background: "#3b82f6", color: "#fff", border: "none", borderRadius: 8, fontWeight: 600 }}>Add</button>
      </form>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 16 }}>
        {departments.map(dept => (
          <div key={dept._id} style={{ background: "#fff", padding: "20px 24px", borderRadius: 12, boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
            {editId === dept._id ? (
              <div>
                <input value={editName} onChange={e => setEditName(e.target.value)} style={{ width: "100%", padding: "8px 12px", borderRadius: 8, border: "1px solid #e2e8f0", marginBottom: 10 }} />
                <button onClick={() => update(dept._id)} style={{ padding: "6px 16px", background: "#10b981", color: "#fff", border: "none", borderRadius: 6, marginRight: 8 }}>Save</button>
                <button onClick={() => setEditId(null)} style={{ padding: "6px 16px", background: "#94a3b8", color: "#fff", border: "none", borderRadius: 6 }}>Cancel</button>
              </div>
            ) : (
              <div>
                <div style={{ fontWeight: 700, fontSize: 17, marginBottom: 12 }}>🏢 {dept.name}</div>
                <div style={{ display: "flex", gap: 8 }}>
                  <button onClick={() => { setEditId(dept._id); setEditName(dept.name); }} style={{ padding: "6px 14px", background: "#f59e0b", color: "#fff", border: "none", borderRadius: 6, fontSize: 13 }}>Edit</button>
                  <button onClick={() => remove(dept._id)} style={{ padding: "6px 14px", background: "#ef4444", color: "#fff", border: "none", borderRadius: 6, fontSize: 13 }}>Delete</button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
      {departments.length === 0 && <p style={{ color: "#64748b" }}>No departments yet.</p>}
    </div>
  );
}
