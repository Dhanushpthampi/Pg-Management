import { Menu } from "lucide-react";

const Header = ({ onMenuClick }) => {
  return (
    <div style={{ height: "61px", borderBottom: "1px solid var(--border-color)", padding: "20px 24px", display: "flex", alignItems: "center", gap: "12px", background: "#fff" }}>
      <button
        className="btn-icon show-mobile hidden-desktop"
        onClick={onMenuClick}
        style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'none' }}
      >
        <Menu size={24} />
      </button>
      <h3 style={{ margin: 0, fontSize: 18, fontWeight: 600 }}>PG Management System</h3>
    </div>
  );
};

export default Header;
