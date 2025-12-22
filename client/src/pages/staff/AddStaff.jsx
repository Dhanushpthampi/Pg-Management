import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";
import BackButton from "../../components/BackButton";

const AddStaff = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    role: "staff"
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/staff", formData);
      alert("Staff added successfully");
      navigate("/staff");
    } catch (error) {
      console.error(error);
      alert("Failed to add staff");
    }
  };

  return (
    <div>
      <BackButton />
      <h1>Add Staff</h1>

      <form onSubmit={handleSubmit} style={{ maxWidth: 400, display: "flex", flexDirection: "column", gap: 15 }}>
        <input name="name" placeholder="Full Name" onChange={handleChange} required />
        <input name="email" placeholder="Email" onChange={handleChange} required />
        <input name="phone" placeholder="Phone" onChange={handleChange} required />

        <select name="role" onChange={handleChange}>
          <option value="staff">Staff</option>
          <option value="manager">Manager</option>
          <option value="admin">Admin</option>
          <option value="vendor">Vendor</option>
        </select>

        <button type="submit">Add Staff</button>
      </form>
    </div>
  );
};

export default AddStaff;
