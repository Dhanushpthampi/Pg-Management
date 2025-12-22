import { NavLink } from "react-router-dom";

const Sidebar = () => {
  return (
    <div style={{ width: "220px",borderRight: "1px solid #ddd", padding: "20px" }}>
      <h2>PG Admin</h2>
      <nav style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        <NavLink to="/"  >Dashboard</NavLink>
        <NavLink to="/properties"  >Properties</NavLink>
        <NavLink to="/tenants"  >Tenants</NavLink>
        <NavLink to="/bookings" >Bookings</NavLink>
        <NavLink to="/staff" >Staff</NavLink>
        <NavLink to="/complaints" >Complaints</NavLink>
        <NavLink to="/invoices" >Invoices</NavLink>
      </nav>
    </div>
  );
};

export default Sidebar;
