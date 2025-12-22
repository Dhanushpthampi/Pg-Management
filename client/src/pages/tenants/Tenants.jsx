import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../../api/axios";
import FilterBar from "../../components/FilterBar";

const Tenants = () => {
  const navigate = useNavigate();
  const [tenants, setTenants] = useState([]);
  const [query, setQuery] = useState({ search: "", status: "", property: "" });
  const [properties, setProperties] = useState([]);

  const fetchTenants = async () => {
    try {
      const params = new URLSearchParams(query);
      for (const [key, value] of params.entries()) {
        if (!value) params.delete(key);
      }
      const { data } = await api.get(`/tenants?${params.toString()}`);
      setTenants(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const fetchProps = async () => {
      try {
        const { data } = await api.get("/properties");
        setProperties(data.map(p => ({ label: p.name, value: p._id })));
      } catch (err) { console.error(err); }
    };
    fetchProps();
  }, []);

  useEffect(() => {
    const debounce = setTimeout(fetchTenants, 500);
    return () => clearTimeout(debounce);
  }, [query]);

  const handleFilterChange = (key, value) => {
    setQuery({ ...query, [key]: value });
  };

  const filterConfig = [
    {
      key: "property",
      label: "All Properties",
      options: properties
    },
    {
      key: "status",
      label: "All Status",
      options: [
        { value: "active", label: "Active" },
        { value: "vacated", label: "Vacated" },
        { value: "on_notice", label: "On Notice" }
      ]
    }
  ];

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 20 }}>
        <h1>Tenants</h1>
        <button onClick={() => navigate("/checkin")}>+ New Check-in</button>
      </div>

      <FilterBar
        searchPlaceholder="Search Tenant (Name, Phone)"
        onSearch={(val) => setQuery({ ...query, search: val })}
        filters={filterConfig}
        onFilterChange={handleFilterChange}
      />

      <table width="100%" border="1" cellPadding="10">
        <thead>
          <tr>
            <th>Name</th>
            <th>Phone</th>
            <th>Property</th>
            <th>Room / Bed</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {tenants.map((tenant) => (
            <tr key={tenant._id}>
              <td>{tenant.name}</td>
              <td>{tenant.phone}</td>
              <td>{tenant.property?.name || "N/A"}</td>
              <td>{tenant.room?.number || "?"} / {tenant.bed?.number || "?"}</td>
              <td>{tenant.status}</td>
              <td>
                <button onClick={() => navigate(`/tenants/${tenant._id}`)}>View</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Tenants;
