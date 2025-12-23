import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";
import PageHeader from "../../components/PageHeader";
import { ArrowLeft } from "lucide-react";

const AddStaff = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    role: "staff"
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/staff", formData);
      // alert("Staff added successfully"); // Optional, but usually better to just redirect
      navigate("/staff");
    } catch (error) {
      console.error(error);
      alert("Failed to add staff");
    }
  }; 
  return (
    <div style={{ maxWidth: 600, margin: "0 auto" }}>
      <button
        className="btn btn-secondary"
        onClick={() => navigate(-1)}
        style={{ marginBottom: 20 }}
      >
        <ArrowLeft size={16} /> Back
      </button>

      <PageHeader title="Add Staff" />

      <div className="card">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Full Name</label>
            <input
              name="name"
              placeholder="Ex: John Doe"
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Phone Number</label>
            <input
              name="phone"
              placeholder="Ex: 9876543210"
              onChange={handleChange}
              required 
            />
          </div>

          <div className="form-group">
            <label>Email Address</label>
            <input
              name="email"
              type="email"
              placeholder="Ex: john@example.com"
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Address</label>
            <input
              name="address"
              placeholder="Type here"
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Role</label>
            <select name="role" onChange={handleChange} value={formData.role}>
              <option value="staff">Staff</option>
              <option value="manager">Manager</option>
              <option value="admin">Admin</option>
              <option value="vendor">Vendor</option>
            </select>
          </div>

          <div style={{ marginTop: 24, textAlign: 'right' }}>
            <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
              Add Staff Member
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

export default AddStaff;
