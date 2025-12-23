import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../../api/axios";
import { Plus } from "lucide-react";
import PageHeader from "../../components/PageHeader";
import SearchBar from "../../components/SearchBar";

const Complaints = () => {
  const navigate = useNavigate();
  const [allComplaints, setAllComplaints] = useState([]);
  const [complaints, setComplaints] = useState([]);
  const [query, setQuery] = useState({ search: "", status: "", category: "" });

  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        const { data } = await api.get("/complaints");
        setAllComplaints(data);
        setComplaints(data);
      } catch (error) {
        console.error("Failed to fetch complaints", error);
      }
    };
    fetchComplaints();
  }, []);

  useEffect(() => {
    let filtered = allComplaints;

    if (query.status) {
      filtered = filtered.filter(c => c.status === query.status);
    }
    if (query.category) {
      filtered = filtered.filter(c => c.category === query.category);
    }
    if (query.search) {
      const lowerSearch = query.search.toLowerCase();
      filtered = filtered.filter(c =>
        c.title.toLowerCase().includes(lowerSearch) ||
        (c.raisedBy?.name && c.raisedBy.name.toLowerCase().includes(lowerSearch))
      );
    }

    setComplaints(filtered);
  }, [query, allComplaints]);

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto" }}>
      <PageHeader
        title="Complaints"
        action={
          <button className="btn btn-primary" onClick={() => navigate("/complaints/new")}>
            <Plus size={18} /> New Complaint
          </button>
        }
      />

      <div className="filter-container">
        <SearchBar
          value={query.search}
          onChange={(e) => setQuery({ ...query, search: e.target.value })}
          placeholder="Search Complaint (Title, Raised By)"
        />

        <select
          value={query.category}
          onChange={(e) => setQuery({ ...query, category: e.target.value })}
          style={{ minWidth: 150 }}
        >
          <option value="">All Categories</option>
          <option value="Maintenance">Maintenance</option>
          <option value="Food">Food</option>
          <option value="Internet">Internet</option>
          <option value="Other">Other</option>
        </select>

        <select
          value={query.status}
          onChange={(e) => setQuery({ ...query, status: e.target.value })}
          style={{ minWidth: 150 }}
        >
          <option value="">All Status</option>
          <option value="open">Open</option>
          <option value="in_progress">In Progress</option>
          <option value="resolved">Resolved</option>
        </select>
      </div>

      <div className="data-table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Category</th>
              <th>Priority</th>
              <th>Status</th>
              <th>Raised By</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {complaints.map((complaint) => (
              <tr key={complaint._id}>
                <td>
                  <div style={{ fontWeight: 500 }}>{complaint.title}</div>
                  <div className="text-sm">{new Date(complaint.createdAt).toLocaleDateString()}</div>
                </td>
                <td>{complaint.category}</td>
                <td>
                  <span className={`badge ${complaint.priority === 'High' ? 'danger' :
                      complaint.priority === 'Medium' ? 'warning' : 'success'
                    }`}>
                    {complaint.priority}
                  </span>
                </td>
                <td>
                  <span className={`badge ${complaint.status === 'resolved' ? 'success' :
                      complaint.status === 'in_progress' ? 'warning' : 'neutral'
                    }`}>
                    {complaint.status.replace("_", " ")}
                  </span>
                </td>
                <td>{complaint.raisedBy?.name || "N/A"}</td>
                <td>
                  <button
                    className="btn btn-secondary"
                    style={{ padding: "4px 8px", fontSize: 12 }}
                    onClick={() => navigate(`/complaints/${complaint._id}`)}
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}
            {complaints.length === 0 && (
              <tr><td colSpan="6" style={{ textAlign: "center", padding: 30, color: "var(--secondary)" }}>No complaints found.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      <style>{`
        .filter-container {
          display: flex;
          gap: 15px;
          margin-bottom: 24px;
          flex-wrap: wrap;
          align-items: center;
        }
      `}</style>
    </div>
  );
};

export default Complaints;
