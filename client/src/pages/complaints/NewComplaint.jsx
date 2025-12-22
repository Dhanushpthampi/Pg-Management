import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";
import BackButton from "../../components/BackButton";

const NewComplaint = () => {
  const navigate = useNavigate();
  const [properties, setProperties] = useState([]);
  const [tenants, setTenants] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    category: "plumbing",
    priority: "medium",
    property: "",
    raisedBy: "",
    description: "" // Fixed typo from 'desc' if any
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [propsRes, tenantsRes] = await Promise.all([
          api.get("/properties"),
          api.get("/tenants")
        ]);
        setProperties(propsRes.data);
        setTenants(tenantsRes.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/complaints", formData);
      alert("Complaint raised successfully");
      navigate("/complaints");
    } catch (error) {
      console.error(error);
      alert("Failed to raise complaint");
    }
  };

  return (
    <div>
      <BackButton />
      <h1>Raise Complaint</h1>

      <form onSubmit={handleSubmit} style={{ maxWidth: 500, display: "flex", flexDirection: "column", gap: 15 }}>

        <input name="title" placeholder="Complaint Title (e.g. Leaky Tap)" onChange={handleChange} required />

        <select name="property" onChange={handleChange} required>
          <option value="">Select Property</option>
          {properties.map(p => <option key={p._id} value={p._id}>{p.name}</option>)}
        </select>

        <select name="raisedBy" onChange={handleChange} required>
          <option value="">Select Tenant</option>
          {tenants.map(t => <option key={t._id} value={t._id}>{t.name}</option>)}
        </select>

        <select name="category" onChange={handleChange}>
          <option value="plumbing">Plumbing</option>
          <option value="electrical">Electrical</option>
          <option value="internet">Internet</option>
          <option value="food">Food</option>
          <option value="hygiene">Hygiene</option>
          <option value="other">Other</option>
        </select>

        <select name="priority" onChange={handleChange}>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>

        <textarea name="description" placeholder="Describe the issue" rows="4" onChange={handleChange} />

        <button type="submit">Submit Complaint</button>
      </form>
    </div>
  );
};

export default NewComplaint;
