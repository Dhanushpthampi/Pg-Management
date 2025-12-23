import { NavLink } from "react-router-dom";
import {
  LayoutDashboard, Building, Users, CalendarCheck,
  UserCog, MessageSquare, Receipt, LogOut
} from "lucide-react";

const Sidebar = () => {
  const navItems = [
    { to: "/", label: "Dashboard", icon: <LayoutDashboard size={20} /> },
    { to: "/properties", label: "Properties", icon: <Building size={20} /> },
    { to: "/tenants", label: "Tenants", icon: <Users size={20} /> },
    { to: "/bookings", label: "Bookings", icon: <CalendarCheck size={20} /> },
    { to: "/staff", label: "Staff", icon: <UserCog size={20} /> },
    { to: "/complaints", label: "Complaints", icon: <MessageSquare size={20} /> },
    { to: "/invoices", label: "Invoices", icon: <Receipt size={20} /> },
  ];

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h2>GullyPG</h2>
      </div>
      <nav className="sidebar-nav">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
          >
            {item.icon}
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>
      {/* Logout removed as per request */}

      <style>{`
        .sidebar {
          width: 260px;
          height: 100vh;
          background: #fff;
          border-right: 1px solid var(--border-color);
          display: flex;
          flex-direction: column;
          position: sticky;
          top: 0;
        }
        .sidebar-header {
          padding: 24px;
          border-bottom: 1px solid var(--border-color);
        }
        .sidebar-header h2 {
          font-size: 20px;
          color: var(--primary);
        }
        .sidebar-nav {
          padding: 20px 12px;
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .nav-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 16px;
          color: var(--secondary);
          text-decoration: none;
          border-radius: var(--radius);
          transition: all 0.2s ease;
          font-weight: 500;
          font-size: 14px;
          border: none;
          background: none;
          width: 100%;
          cursor: pointer;
          margin-bottom: 2px;
        }
        .nav-item:hover {
          background: var(--bg-main);
          color: var(--primary);
          transform: translateX(4px);
        }
        .nav-item.active {
          background: #f0f0f0;
          color: var(--primary);
          font-weight: 600;
        }
        /* Removed Footer/Logout as requested */
      `}</style>
    </div>
  );
};

export default Sidebar;
