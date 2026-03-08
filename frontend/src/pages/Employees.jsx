import React, { useEffect, useState } from "react";
import api from "../api/api";

const btn = (label, color, onClick) => (
  <button onClick={onClick} style={{ padding: "6px 14px", background: color, color: "#fff", border: "none", borderRadius: 6, fontSize: 13, marginLeft: 6 }}>{label}</button>
);

export default function Employees() {
  const [employees, setEmployees] = useState([]);
  const [form, setForm] = useState({ name: "", email: "", department: "" });
  const [taskForm, setTaskForm] = useState({ title: "", dueDate: "", status: "Pending" });
  const [selected, setSelected] = useState(null);
  const [showAddEmp, setShowAddEmp] = useState(false);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try { const { data } = await api.get("/employees"); setEmployees(data); }
    catch (e) { console.error(e); } finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const addEmployee = async (e) => {
    e.preventDefault();
    try { await api.post("/employees", form); setForm({ name: "", email: "", department: "" }); setShowAddEmp(false); load(); }
    catch (err) { alert(err.response?.data?.message || "Error"); }
  };

  const deleteEmployee = async (id) => {
    if (!window.confirm("Delete this employee?")) return;
    await api.delete(`/employees/${id}`); if (selected?._id === id) setSelected(null); load();
  };

  const addTask = async (e) => {
    e.preventDefault();
    try { await api.post(`/employees/${selected._id}/tasks`, taskForm); setTaskForm({ title: "", dueDate: "", status: "Pending" }); load(); const { data } = await api.get("/employees"); setSelected(data.find(e => e._id === selected._id)); }
    catch (err) { alert(err.response?.data?.message || "Error"); }
  };

  const deleteTask = async (taskId) => {
    await api.delete(`/employees/${selected._id}/tasks/${taskId}`);
    const { data } = await api.get("/employees"); setEmployees(data); setSelected(data.find(e => e._id === selected._id));
  };

  const statusColor = { Pending: "#f59e0b", "In Progress": "#06b6d4", Completed: "#10b981" };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <h1 style={{ fontSize: 24, fontWeight: 700 }}>👥 Employees</h1>
        <button onClick={() => setShowAddEmp(!showAddEmp)} style={{ padding: "10px 20px", background: "#3b82f6", color: "#fff", border: "none", borderRadius: 8, fontWeight: 600 }}>+ Add Employee</button>
      </div>

      {showAddEmp && (
        <form onSubmit={addEmployee} style={{ background: "#fff", padding: 24, borderRadius: 12, marginBottom: 24, boxShadow: "0 2px 12px rgba(0,0,0,0.07)", display: "flex", gap: 12, flexWrap: "wrap" }}>
          {["name", "email", "department"].map(field => (
            <input key={field} placeholder={field.charAt(0).toUpperCase() + field.slice(1)} value={form[field]}
              onChange={e => setForm({...form, [field]: e.target.value})} required
              style={{ flex: 1, minWidth: 160, padding: "10px 14px", borderRadius: 8, border: "1px solid #e2e8f0", fontSize: 14 }} />
          ))}
          <button type="submit" style={{ padding: "10px 20px", background: "#10b981", color: "#fff", border: "none", borderRadius: 8 }}>Save</button>
        </form>
      )}

      <div style={{ display: "flex", gap: 20 }}>
        <div style={{ flex: 1 }}>
          {employees.map(emp => (
            <div key={emp._id} onClick={() => setSelected(emp)} style={{ background: "#fff", padding: "16px 20px", borderRadius: 12, marginBottom: 12, boxShadow: "0 2px 8px rgba(0,0,0,0.06)", cursor: "pointer", border: selected?._id === emp._id ? "2px solid #3b82f6" : "2px solid transparent" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 16 }}>{emp.name}</div>
                  <div style={{ fontSize: 13, color: "#64748b" }}>{emp.email} · {emp.department}</div>
                  <div style={{ fontSize: 12, color: "#94a3b8", marginTop: 4 }}>{emp.tasks?.length || 0} task(s)</div>
                </div>
                <div>{btn("Delete", "#ef4444", (e) => { e.stopPropagation(); deleteEmployee(emp._id); })}</div>
              </div>
            </div>
          ))}
          {employees.length === 0 && <div style={{ color: "#64748b" }}>No employees yet. Add one above.</div>}
        </div>

        {selected && (
          <div style={{ width: 360, background: "#fff", borderRadius: 12, padding: 24, boxShadow: "0 2px 12px rgba(0,0,0,0.08)", alignSelf: "start" }}>
            <h3 style={{ fontWeight: 700, marginBottom: 4 }}>{selected.name}'s Tasks</h3>
            <p style={{ fontSize: 13, color: "#64748b", marginBottom: 16 }}>{selected.department}</p>
            <form onSubmit={addTask} style={{ marginBottom: 16 }}>
              <input placeholder="Task title" required value={taskForm.title} onChange={e => setTaskForm({...taskForm, title: e.target.value})} style={{ width: "100%", padding: "8px 12px", borderRadius: 8, border: "1px solid #e2e8f0", marginBottom: 8, fontSize: 14 }} />
              <input type="date" value={taskForm.dueDate} onChange={e => setTaskForm({...taskForm, dueDate: e.target.value})} style={{ width: "100%", padding: "8px 12px", borderRadius: 8, border: "1px solid #e2e8f0", marginBottom: 8, fontSize: 14 }} />
              <select value={taskForm.status} onChange={e => setTaskForm({...taskForm, status: e.target.value})} style={{ width: "100%", padding: "8px 12px", borderRadius: 8, border: "1px solid #e2e8f0", marginBottom: 8, fontSize: 14 }}>
                <option>Pending</option><option>In Progress</option><option>Completed</option>
              </select>
              <button type="submit" style={{ width: "100%", padding: "9px", background: "#3b82f6", color: "#fff", border: "none", borderRadius: 8, fontWeight: 600 }}>Add Task</button>
            </form>
            {selected.tasks?.map(task => (
              <div key={task._id} style={{ padding: "10px 14px", background: "#f8fafc", borderRadius: 8, marginBottom: 8 }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ fontWeight: 600, fontSize: 14 }}>{task.title}</span>
                  <button onClick={() => deleteTask(task._id)} style={{ background: "none", border: "none", color: "#ef4444", fontSize: 16, cursor: "pointer" }}>✕</button>
                </div>
                <div style={{ display: "flex", gap: 8, marginTop: 4, alignItems: "center" }}>
                  <span style={{ padding: "2px 10px", borderRadius: 20, background: statusColor[task.status] + "22", color: statusColor[task.status], fontSize: 12, fontWeight: 600 }}>{task.status}</span>
                  {task.dueDate && <span style={{ fontSize: 12, color: "#64748b" }}>{new Date(task.dueDate).toLocaleDateString()}</span>}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
