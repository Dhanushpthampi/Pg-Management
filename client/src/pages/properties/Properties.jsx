import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../../api/axios";
import FilterBar from "../../components/FilterBar";

const Properties = () => {
  const navigate = useNavigate();
  const [properties, setProperties] = useState([]);
  const [query, setQuery] = useState({ search: "", city: "", status: "" });

  const fetchProperties = async () => {
    try {
      const params = new URLSearchParams(query);
      // Remove empty params
      for (const [key, value] of params.entries()) {
        if (!value) params.delete(key);
      }

      const { data } = await api.get(`/properties?${params.toString()}`);
      setProperties(data);
    } catch (error) {
      console.error("Failed to fetch properties", error);
    }
  };

  useEffect(() => {
    const debounce = setTimeout(() => {
      fetchProperties();
    }, 500); // 500ms debounce for search
    return () => clearTimeout(debounce);
  }, [query]);

  const handleFilterChange = (key, value) => {
    setQuery({ ...query, [key]: value });
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to deactivate this property?")) {
      try {
        await api.delete(`/properties/${id}`);
        fetchProperties(); // Refresh list
      } catch (err) {
        console.error(err);
        alert("Failed to delete property");
      }
    }
  };

  const filterConfig = [
    {
      key: "city",
      label: "All Cities",
      options: [
        { value: "Bangalore", label: "Bangalore" },
        { value: "Mysore", label: "Mysore" }
      ]
    },
    {
      key: "status",
      label: "All Status",
      options: [
        { value: "active", label: "Active" },
        { value: "inactive", label: "Inactive" }
      ]
    }
  ];

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 20 }}>
        <h1>Properties</h1>
        <button onClick={() => navigate("/properties/new")}>+ Add Property</button>
      </div>

      <FilterBar
        searchPlaceholder="Search Property (Name, Address)"
        onSearch={(val) => setQuery({ ...query, search: val })}
        filters={filterConfig}
        onFilterChange={handleFilterChange}
      />

      <table width="100%" border="1" cellPadding="10">
        <thead>
          <tr>
            <th>Property Name</th>
            <th>City</th>
            <th>Contact Person</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {properties.map((property) => (
            <tr key={property._id}>
              <td>{property.name}</td>
              <td>{property.city}</td>
              <td>{property.contactPerson || "N/A"}</td>
              <td>
                <span style={{
                  color: property.status === 'active' ? 'green' : 'red',
                  fontWeight: 'bold'
                }}>
                  {property.status.toUpperCase()}
                </span>
              </td>
              <td>
                <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap' }}>
                  <button onClick={() => navigate(`/properties/${property._id}/manage`)} style={{ backgroundColor: '#2196F3', color: 'white' }}>Manage</button>
                  <button onClick={() => navigate(`/properties/${property._id}/edit`)}>Edit</button>
                  <button onClick={() => handleDelete(property._id)} style={{ backgroundColor: '#ff4444', color: 'white' }}>Delete</button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
export default Properties;
