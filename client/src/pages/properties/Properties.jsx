import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../../api/axios";
import { Plus, Building } from "lucide-react";
import PageHeader from "../../components/PageHeader";
import SearchBar from "../../components/SearchBar";

import Loader from "../../components/Loader";

const Properties = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [allProperties, setAllProperties] = useState([]);
  const [properties, setProperties] = useState([]);
  const [query, setQuery] = useState({ search: "", city: "", status: "" });

  const fetchProperties = async () => {
    try {
      const { data } = await api.get("/properties/stats");
      setAllProperties(data);
      setProperties(data);
    } catch (error) {
      console.error("Failed to fetch properties", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  // Filter local data
  useEffect(() => {
    let filtered = allProperties;

    if (query.city) {
      filtered = filtered.filter(p => p.city === query.city);
    }
    if (query.status) {
      filtered = filtered.filter(p => p.status === query.status);
    }
    if (query.search) {
      const lowerSearch = query.search.toLowerCase();
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(lowerSearch) ||
        (p.address && p.address.toLowerCase().includes(lowerSearch))
      );
    }

    setProperties(filtered);
  }, [query, allProperties]);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to deactivate this property?")) {
      try {
        await api.delete(`/properties/${id}`);
        fetchProperties();
      } catch (err) {
        console.error(err);
        alert("Failed to delete property");
      }
    }
  };

  if (loading) return <Loader />;

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto" }}>
      <PageHeader
        title="Properties"
        action={
          <button className="btn btn-primary" onClick={() => navigate("/properties/new")}>
            <Plus size={18} /> Add Property
          </button>
        }
      />

      <div className="filter-container">
        <SearchBar
          value={query.search}
          onChange={(e) => setQuery({ ...query, search: e.target.value })}
          placeholder="Search Property..."
        />

        <select
          value={query.city}
          onChange={(e) => setQuery({ ...query, city: e.target.value })}
          style={{ minWidth: 150 }}
        >
          <option value="">All Cities</option>
          <option value="Bangalore">Bangalore</option>
          <option value="Mysore">Mysore</option>
        </select>

        <select
          value={query.status}
          onChange={(e) => setQuery({ ...query, status: e.target.value })}
          style={{ minWidth: 150 }}
        >
          <option value="">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>

      <div className="data-table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Property</th>
              <th>City</th>
              <th>Number of Floors</th>
              <th>Total Beds</th>
              <th>Occupied</th>
              <th>Manager</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {properties.map((property) => {
              const stats = property.stats || { totalFloors: 0, totalBeds: 0, occupiedBeds: 0 };
              return (
                <tr key={property._id}>
                  <td>
                    <div style={{ fontWeight: 500, display: "flex", alignItems: "center", gap: 8 }}>
                      <Building size={16} color="var(--secondary)" />
                      {property.name}
                    </div>
                    <div className="text-sm">{property.address}</div>
                  </td>
                  <td>{property.city}</td>
                  <td>{stats.totalFloors}</td>
                  <td>{stats.totalBeds}</td>
                  <td>
                    <span style={{ fontWeight: 600, color: stats.occupiedBeds > 0 ? 'var(--primary)' : 'var(--secondary)' }}>
                      {stats.occupiedBeds}
                    </span>
                    <span style={{ color: 'var(--secondary)', fontSize: 12 }}> / {stats.totalBeds}</span>
                  </td>
                  <td>{property.contactPerson || "N/A"}</td>
                  <td>
                    <div className="flex-gap">
                      <button className="btn btn-secondary" style={{ padding: "4px 8px", fontSize: 12 }} onClick={() => navigate(`/properties/${property._id}/manage`)}>Manage</button>
                      <button className="btn btn-secondary" style={{ padding: "4px 8px", fontSize: 12 }} onClick={() => navigate(`/properties/${property._id}/edit`)}>Edit</button>
                      <button
                        className="btn btn-danger"
                        style={{ padding: "4px 8px", fontSize: 12 }}
                        onClick={() => handleDelete(property._id)}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
            {properties.length === 0 && (
              <tr><td colSpan="7" style={{ textAlign: "center", padding: 30, color: "var(--secondary)" }}>No properties found.</td></tr>
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
export default Properties;
