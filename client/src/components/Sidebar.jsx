import { NavLink } from "react-router-dom";

const Sidebar = () => {
  return (
    <div style={{ width: "220px", background: "#111", color: "#fff", padding: "20px" }}>
      <h2>PG Admin</h2>

      <nav style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        <NavLink to="/" style={{ color: "#fff" }}>Dashboard</NavLink>
        <NavLink to="/properties" style={{ color: "#fff" }}>Properties</NavLink>
        <NavLink to="/tenants" style={{ color: "#fff" }}>Tenants</NavLink>
        <NavLink to="/bookings" style={{ color: "#fff" }}>Bookings</NavLink>
        <NavLink to="/staff" style={{ color: "#fff" }}>Staff</NavLink>
        <NavLink to="/complaints" style={{ color: "#fff" }}>Complaints</NavLink>
        <NavLink to="/invoices" style={{ color: "#fff" }}>Invoices</NavLink>
      </nav>
    </div>
  );
};

export default Sidebar;
