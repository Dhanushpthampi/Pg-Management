import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../../api/axios";
import { UserPlus } from "lucide-react";
import PageHeader from "../../components/PageHeader";
import SearchBar from "../../components/SearchBar";

import Loader from "../../components/Loader";

const Tenants = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [allTenants, setAllTenants] = useState([]);
  const [tenants, setTenants] = useState([]);
  const [query, setQuery] = useState({ search: "", status: "", property: "" });
  const [properties, setProperties] = useState([]);

  // Fetch all tenants once
  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const [tenantsRes, propsRes] = await Promise.all([
          api.get("/tenants"),
          api.get("/properties")
        ]);
        setAllTenants(tenantsRes.data);
        setTenants(tenantsRes.data);
        setProperties(propsRes.data);
      } catch (error) {
        console.error("Failed to fetch data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAllData();
  }, []);

  // Filter locally when query changes
  useEffect(() => {
    let filtered = allTenants;

    if (query.property) {
      filtered = filtered.filter(t => t.property?._id === query.property);
    }
    if (query.status) {
      filtered = filtered.filter(t => t.status === query.status);
    }
    if (query.search) {
      const lowerSearch = query.search.toLowerCase();
      filtered = filtered.filter(t =>
        t.name.toLowerCase().includes(lowerSearch) ||
        t.phone.includes(lowerSearch)
      );
    }

    setTenants(filtered);
  }, [query, allTenants]);

  if (loading) return <Loader />;

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto" }}>
      <PageHeader
        title="Tenants"
        action={
          <button className="btn btn-primary" onClick={() => navigate("/checkin")}>
            <UserPlus size={18} /> New Check-in
          </button>
        }
      />

      <div className="filter-container">
        <SearchBar
          value={query.search}
          onChange={(e) => setQuery({ ...query, search: e.target.value })}
          placeholder="Search Tenant (Name, Phone)"
        />

        <select
          value={query.property}
          onChange={(e) => setQuery({ ...query, property: e.target.value })}
          style={{ minWidth: 150 }}
        >
          <option value="">All Properties</option>
          {properties.map(p => <option key={p._id} value={p._id}>{p.name}</option>)}
        </select>

        <select
          value={query.status}
          onChange={(e) => setQuery({ ...query, status: e.target.value })}
          style={{ minWidth: 150 }}
        >
          <option value="">All Status</option>
          <option value="active">Active</option>
          <option value="vacated">Vacated</option>
          <option value="on_notice">On Notice</option>
        </select>
      </div>

      <div className="data-table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Phone</th>
              <th>Property</th>
              <th>Allocated</th>
              <th>Status</th>
              <th>Created At</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {tenants.map((tenant) => (
              <tr key={tenant._id}>
                <td style={{ fontWeight: 500 }}>{tenant.name}</td>
                <td>{tenant.phone}</td>
                <td>{tenant.property?.name || "N/A"}</td>
                <td>
                  {tenant.room ? `Room ${tenant.room.number}` : "-"}
                  <span style={{ color: "var(--secondary)", fontSize: 13 }}>
                    {tenant.bed ? ` / Bed ${tenant.bed.number}` : ""}
                  </span>
                </td>
                <td>
                  <span className={`badge ${tenant.status === "active" ? "success" :
                    tenant.status === "vacated" ? "danger" : "warning"
                    }`}>
                    {tenant.status.replace("_", " ")}
                  </span>
                </td>
                <td>{new Date(tenant.createdAt).toLocaleDateString('en-GB')}</td>
                <td>
                  <button
                    className="btn btn-secondary"
                    style={{ padding: "4px 8px", fontSize: 12 }}
                    onClick={() => navigate(`/tenants/${tenant._id}`)}
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}
            {tenants.length === 0 && (
              <tr>
                <td colSpan="7" style={{ textAlign: "center", padding: 30, color: "var(--secondary)" }}>No tenants found.</td>
              </tr>
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

export default Tenants;
