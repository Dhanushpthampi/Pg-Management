import { useEffect, useState } from "react";
import api from "../../api/axios";
import { Users, Home, TrendingUp, AlertCircle, ShoppingBag } from "lucide-react";

const Dashboard = () => {
  const [stats, setStats] = useState({
    properties: 0,
    tenants: 0,
    bookings: 0,
    complaints: 0,
    revenue: 0
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await api.get("/dashboard/stats");
        if (data.stats) setStats(data.stats);
      } catch (error) {
        console.error("Failed to fetch dashboard stats", error);
      }
    };
    fetchStats();
  }, []);

  const cards = [
    { title: "Properties", value: stats.properties, icon: <Home size={24} color="#2196F3" />, bg: "#E3F2FD" },
    { title: "Total Tenants", value: stats.tenants, icon: <Users size={24} color="#4CAF50" />, bg: "#E8F5E9" },
    { title: "Bookings", value: stats.bookings, icon: <ShoppingBag size={24} color="#9C27B0" />, bg: "#F3E5F5" },
    { title: "Revenue", value: `₹${stats.revenue}`, icon: <TrendingUp size={24} color="#FF9800" />, bg: "#FFF3E0" },
    { title: "Open Complaints", value: stats.complaints, icon: <AlertCircle size={24} color="#F44336" />, bg: "#FFEBEE" },
  ];

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto" }}>
      <h1 style={{ marginBottom: 24 }}>Dashboard</h1>

      <div className="dashboard-grid">
        {cards.map((card, index) => (
          <div key={index} className="stat-card">
            <div className="stat-icon" style={{ background: card.bg }}>
              {card.icon}
            </div>
            <div>
              <div className="stat-value">{card.value}</div>
              <div className="stat-label">{card.title}</div>
            </div>
          </div>
        ))}
      </div>

      <style>{`
        .dashboard-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: 20px;
        }
        .stat-card {
           background: white;
           padding: 24px;
           border-radius: var(--radius);
           border: 1px solid var(--border-color);
           display: flex;
           align-items: center;
           gap: 16px;
           box-shadow: var(--shadow-sm);
        }
        .stat-icon {
          width: 48px;
          height: 48px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .stat-value {
          font-size: 24px;
          font-weight: 700;
          color: var(--primary);
        }
        .stat-label {
          font-size: 14px;
          color: var(--secondary);
          margin-top: 4px;
        }
      `}</style>
    </div>
  );
};

export default Dashboard;
