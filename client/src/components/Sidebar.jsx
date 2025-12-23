import { NavLink } from "react-router-dom";
import {
  LayoutDashboard, Building, Users, CalendarCheck,
  UserCog, MessageSquare, Receipt, UserX, X, LogOut
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

const Sidebar = ({ isOpen, onClose }) => {
  const { logout } = useAuth();
  const navItems = [
    { to: "/", label: "Dashboard", icon: <LayoutDashboard size={20} /> },
    { to: "/properties", label: "Properties", icon: <Building size={20} /> },
    { to: "/tenants", label: "Tenants", icon: <Users size={20} /> },
    { to: "/bookings", label: "Bookings", icon: <CalendarCheck size={20} /> },
    { to: "/staff", label: "Staff", icon: <UserCog size={20} /> },
    { to: "/complaints", label: "Complaints", icon: <MessageSquare size={20} /> },
    { to: "/invoices", label: "Invoices", icon: <Receipt size={20} /> },
    { to: "/checkout-notice", label: "Checkout & Notice", icon: <UserX size={20} /> },
  ];

  return (
    <>
      <div className={`sidebar ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <h2>GullyPG</h2>
          <button className="close-btn show-mobile hidden-desktop" onClick={onClose}>
            <X size={24} />
          </button>
        </div>
        <nav className="sidebar-nav">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={() => window.innerWidth < 768 && onClose()}
              className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
            >
              {item.icon}
              <span>{item.label}</span>
            </NavLink>
          ))}
          <button
            className="nav-item"
            onClick={logout}
            style={{ marginTop: "auto", color: "#d32f2f" }}
          >
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </nav>


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
          z-index: 20;
          transition: transform 0.3s ease;
        }
        
        .sidebar-header {
          padding: 20px 24px;
          border-bottom: 1px solid var(--border-color);
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .sidebar-header h2 {
          font-size: 20px;
          color: var(--primary);
          margin: 0;
        }
        .close-btn {
          background: none;
          border: none;
          cursor: pointer;
          color: var(--secondary);
          padding: 0;
          display: none;
        }
        .sidebar-nav {
          padding: 20px 12px;
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 4px;
          overflow-y: auto;
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
          width: 85%;
        }
        .nav-item.active {
          background: #f0f0f0;
          color: var(--primary);
          font-weight: 600;
          width: 85%;
        }

        @media (max-width: 768px) {
          .sidebar {
            position: fixed;
            left: 0;
            right: 0;
            top: 61px;
            bottom: auto; /* Not full height */
            height: auto;
            max-height: calc(100vh - 61px);
            width: 100%;
            max-width: none;
            transform: translateY(-150%);
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
            border-bottom: 1px solid var(--border-color);
            border-right: none;
          }
          
          .sidebar.open {
            transform: translateY(0);
          }
          
          /* Hide the internal header since main Header is visible */
          .sidebar-header {
            display: none;
          }
          
          .sidebar-nav {
             padding: 10px 0;
          }
          
          .nav-item {
             border-radius: 0;
             margin-bottom: 0;
             padding: 15px 24px;
             width: 100%;
             justify-content: center; /* Centered items looks nice on dropdown, or left? Let's keep left */
             justify-content: flex-start;
          }
          
          .nav-item:hover {
             width: 100%;
             transform: none;
          }
          
          .nav-item.active {
             width: 100%;
          }
        }
      `}</style>
      </div >
    </>
  );
};

export default Sidebar;
