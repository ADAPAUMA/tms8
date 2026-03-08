import React from "react";
import { Outlet, NavLink, useNavigate } from "react-router-dom";

const styles = {
  wrapper: { display: "flex", minHeight: "100vh" },
  sidebar: {
    width: 220, background: "#1e293b", color: "#fff",
    display: "flex", flexDirection: "column", padding: "24px 16px",
  },
  logo: { fontSize: 20, fontWeight: 700, marginBottom: 32, color: "#60a5fa" },
  navLink: {
    display: "block", padding: "10px 14px", borderRadius: 8,
    color: "#94a3b8", marginBottom: 6, fontSize: 15,
  },
  activeLink: { background: "#334155", color: "#fff" },
  logout: {
    marginTop: "auto", padding: "10px 14px", background: "#ef4444",
    border: "none", borderRadius: 8, color: "#fff", fontSize: 15,
  },
  main: { flex: 1, padding: 32, overflowY: "auto" },
};

export default function Layout() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div style={styles.wrapper}>
      <aside style={styles.sidebar}>
        <div style={styles.logo}>📋 TMS</div>
        {[
          { to: "/", label: "🏠 Dashboard" },
          { to: "/employees", label: "👥 Employees" },
          { to: "/departments", label: "🏢 Departments" },
          { to: "/analytics", label: "📊 Analytics" },
        ].map(({ to, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === "/"}
            style={({ isActive }) => ({
              ...styles.navLink,
              ...(isActive ? styles.activeLink : {}),
            })}
          >
            {label}
          </NavLink>
        ))}
        <div style={{ marginTop: "auto", fontSize: 13, color: "#64748b", marginBottom: 12 }}>
          👤 {user.fullName || "User"}
        </div>
        <button style={styles.logout} onClick={handleLogout}>Logout</button>
      </aside>
      <main style={styles.main}>
        <Outlet />
      </main>
    </div>
  );
}
