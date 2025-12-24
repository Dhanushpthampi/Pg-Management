import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../../api/axios";
import { UserPlus } from "lucide-react";
import PageHeader from "../../components/PageHeader";
import SearchBar from "../../components/SearchBar";
import Loader from "../../components/Loader";

const Staff = () => {
  const navigate = useNavigate();
  const [staffList, setStaffList] = useState([]);
  const [filteredStaff, setFilteredStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ search: "", role: "" });

  const fetchStaff = async () => {
    try {
      const { data } = await api.get("/staff");
      setStaffList(data);
      setFilteredStaff(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchStaff(); }, []);

  // Client-side filtering
  useEffect(() => {
    let result = staffList;
    if (filters.role) {
      result = result.filter(s => s.role === filters.role);
    }
    if (filters.search) {
      const search = filters.search.toLowerCase();
      result = result.filter(s =>
        s.name.toLowerCase().includes(search) ||
        s.email.toLowerCase().includes(search) ||
        s.phone.includes(search)
      );
    }
    setFilteredStaff(result);
  }, [filters, staffList]);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this staff member?")) {
      try {
        await api.delete(`/staff/${id}`);
        fetchStaff();
      } catch (err) {
        console.error(err);
        alert("Failed to delete staff");
      }
    }
  };

  if (loading) return <Loader />;

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto" }}>
      <PageHeader
        title="Staff"
        action={
          <button className="btn btn-primary" onClick={() => navigate("/staff/new")}>
            <UserPlus size={18} /> Add Staff
          </button>
        }
      />

      <div className="filter-container">
        <SearchBar
          value={filters.search}
          onChange={(e) => setFilters({ ...filters, search: e.target.value })}
          placeholder="Search Staff (Name, Email, Phone)"
        />

        <select
          value={filters.role}
          onChange={(e) => setFilters({ ...filters, role: e.target.value })}
          style={{ minWidth: 150 }}
        >
          <option value="">All Roles</option>
          <option value="admin">Admin</option>
          <option value="manager">Manager</option>
          <option value="staff">Staff</option>
          <option value="vendor">Vendor</option>
        </select>
      </div>

      <div className="data-table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Phone</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredStaff.map((staff) => (
              <tr key={staff._id}>
                <td style={{ fontWeight: 500 }}>{staff.name}</td>
                <td>{staff.email}</td>
                <td>
                  <span className="badge neutral" style={{ textTransform: 'capitalize' }}>
                    {staff.role}
                  </span>
                </td>
                <td>{staff.phone}</td>
                <td>
                  <div className="flex-gap">
                    <button
                      className="btn btn-secondary"
                      style={{ padding: "4px 8px", fontSize: 12 }}
                      onClick={() => navigate(`/staff/${staff._id}/edit`)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-danger"
                      style={{ padding: "4px 8px", fontSize: 12 }}
                      onClick={() => handleDelete(staff._id)}
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filteredStaff.length === 0 && (
              <tr><td colSpan="5" style={{ textAlign: "center", padding: 30, color: "var(--secondary)" }}>No staff found.</td></tr>
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

export default Staff;
