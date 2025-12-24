import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../api/axios";
import PageHeader from "../../components/PageHeader";
import BackButton from "../../components/BackButton";

const EditStaff = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    role: ""
  });

  useEffect(() => {
    const fetchStaff = async () => {
      try {
        const { data } = await api.get("/staff");
        const staff = data.find(s => s._id === id);
        if (staff) {
          setFormData({
            name: staff.name,
            email: staff.email,
            phone: staff.phone,
            address: staff.address || "",
            role: staff.role
          });
        }
      } catch (error) {
        console.error(error);
      }
    };
    fetchStaff();
  }, [id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/staff/${id}`, formData);
      navigate("/staff");
    } catch (error) {
      console.error(error);
      alert("Failed to update staff");
    }
  };

  return (
    <div style={{ maxWidth: 600, margin: "0 auto" }}>
      <BackButton />

      <PageHeader title="Edit Staff" />

      <div className="card">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Full Name</label>
            <input
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Phone Number</label>
            <input
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Email Address</label>
            <input
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Address</label>
            <input
              name="address"
              value={formData.address}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Role</label>
            <select name="role" value={formData.role} onChange={handleChange}>
              <option value="staff">Staff</option>
              <option value="manager">Manager</option>
              <option value="admin">Admin</option>
              <option value="vendor">Vendor</option>
            </select>
          </div>

          <div style={{ marginTop: 24, textAlign: 'right' }}>
            <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
              Update Staff
            </button>
          </div>
        </form>
      </div>

      <style>{`
        .card {
           background: white;
           padding: 24px;
           border-radius: var(--radius);
           border: 1px solid var(--border-color);
           box-shadow: var(--shadow-sm);
        }
        .form-group {
          margin-bottom: 16px;
        }
        .form-group label {
          display: block;
          margin-bottom: 6px;
          font-weight: 500;
          color: var(--secondary);
          font-size: 14px;
        }
        .form-group input, .form-group select {
          width: 100%;
          padding: 10px;
          border: 1px solid var(--border-color);
          border-radius: var(--radius);
          font-size: 14px;
        }
         .form-group input:focus, .form-group select:focus {
           outline: none;
           border-color: var(--primary);
        }
      `}</style>
    </div>
  );
};

export default EditStaff;
