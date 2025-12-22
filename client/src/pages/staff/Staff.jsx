import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../../api/axios";
import FilterBar from "../../components/FilterBar";

const Staff = () => {
  const navigate = useNavigate();
  const [staffList, setStaffList] = useState([]);
  const [filteredStaff, setFilteredStaff] = useState([]);
  const [filters, setFilters] = useState({ search: "", role: "" });

  const fetchStaff = async () => {
    try {
      const { data } = await api.get("/staff");
      setStaffList(data);
      setFilteredStaff(data);
    } catch (error) {
      console.error(error);
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

  const filterConfig = [
    {
      key: "role",
      label: "All Roles",
      options: [
        { value: "admin", label: "Admin" },
        { value: "manager", label: "Manager" },
        { value: "staff", label: "Staff" },
        { value: "vendor", label: "Vendor" }
      ]
    }
  ];

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 20 }}>
        <h1>Staff</h1>
        <button onClick={() => navigate("/staff/new")}>+ Add Staff</button>
      </div>

      <FilterBar
        searchPlaceholder="Search Staff (Name, Email, Phone)"
        onSearch={(val) => setFilters({ ...filters, search: val })}
        filters={filterConfig}
        onFilterChange={(key, val) => setFilters({ ...filters, [key]: val })}
      />

      <table width="100%" border="1" cellPadding="10">
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
              <td>{staff.name}</td>
              <td>{staff.email}</td>
              <td>{staff.role}</td>
              <td>{staff.phone}</td>
              <td>
                <div style={{ display: 'flex', gap: '5px' }}>
                  <button onClick={() => navigate(`/staff/${staff._id}/edit`)}>Edit</button>
                  <button onClick={() => handleDelete(staff._id)} style={{ backgroundColor: '#ff4444', color: 'white' }}>Delete</button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Staff;
