import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/api";

const s = {
  page: { minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#1e293b" },
  card: { background: "#fff", padding: 40, borderRadius: 16, width: 380, boxShadow: "0 20px 60px rgba(0,0,0,0.3)" },
  title: { fontSize: 28, fontWeight: 700, marginBottom: 8, color: "#1e293b" },
  sub: { color: "#64748b", marginBottom: 28, fontSize: 14 },
  label: { display: "block", marginBottom: 6, fontWeight: 600, fontSize: 14 },
  input: { width: "100%", padding: "10px 14px", borderRadius: 8, border: "1px solid #e2e8f0", fontSize: 15, marginBottom: 16 },
  btn: { width: "100%", padding: "12px", borderRadius: 8, background: "#3b82f6", color: "#fff", border: "none", fontSize: 16, fontWeight: 600 },
  error: { background: "#fee2e2", color: "#dc2626", padding: "10px 14px", borderRadius: 8, marginBottom: 16, fontSize: 14 },
  link: { textAlign: "center", marginTop: 16, fontSize: 14, color: "#64748b" },
};

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); setError("");
    try {
      const { data } = await api.post("/auth/login", form);
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally { setLoading(false); }
  };

  return (
    <div style={s.page}>
      <div style={s.card}>
        <div style={s.title}>Welcome back 👋</div>
        <div style={s.sub}>Sign in to your TMS account</div>
        {error && <div style={s.error}>{error}</div>}
        <form onSubmit={handleSubmit}>
          <label style={s.label}>Email</label>
          <input style={s.input} type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} required placeholder="you@example.com" />
          <label style={s.label}>Password</label>
          <input style={s.input} type="password" value={form.password} onChange={e => setForm({...form, password: e.target.value})} required placeholder="••••••••" />
          <button style={s.btn} disabled={loading}>{loading ? "Signing in..." : "Sign In"}</button>
        </form>
        <div style={s.link}>Don't have an account? <Link to="/register" style={{ color: "#3b82f6" }}>Register</Link></div>
      </div>
    </div>
  );
}
