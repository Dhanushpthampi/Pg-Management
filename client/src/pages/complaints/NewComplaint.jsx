import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";
import PageHeader from "../../components/PageHeader";
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
    description: ""
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
      navigate("/complaints");
    } catch (error) {
      console.error(error);
      alert("Failed to raise complaint");
    }
  };

  return (
    <div style={{ maxWidth: 600, margin: "0 auto" }}>
      <BackButton />

      <PageHeader title="Raise Complaint" />

      <div className="card">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Complaint Title</label>
            <input
              name="title"
              placeholder="e.g. Leaky Tap"
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Property</label>
            <select name="property" onChange={handleChange} required value={formData.property}>
              <option value="">Select Property</option>
              {properties.map(p => <option key={p._id} value={p._id}>{p.name}</option>)}
            </select>
          </div>

          <div className="form-group">
            <label>Tenant</label>
            <select name="raisedBy" onChange={handleChange} required value={formData.raisedBy}>
              <option value="">Select Tenant</option>
              {tenants.map(t => <option key={t._id} value={t._id}>{t.name}</option>)}
            </select>
          </div>

          <div className="form-row">
            <div className="form-group half">
              <label>Category</label>
              <select name="category" onChange={handleChange} value={formData.category}>
                <option value="plumbing">Plumbing</option>
                <option value="electrical">Electrical</option>
                <option value="internet">Internet</option>
                <option value="food">Food</option>
                <option value="hygiene">Hygiene</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div className="form-group half">
              <label>Priority</label>
              <select name="priority" onChange={handleChange} value={formData.priority}>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea
              name="description"
              placeholder="Describe the issue detailedly..."
              rows="4"
              onChange={handleChange}
            />
          </div>

          <div style={{ marginTop: 24, textAlign: 'right' }}>
            <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
              Submit Complaint
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
        .form-group input, .form-group select, .form-group textarea {
          width: 100%;
          padding: 10px;
          border: 1px solid var(--border-color);
          border-radius: var(--radius);
          font-size: 14px;
          font-family: inherit;
        }
        .form-group input:focus, .form-group select:focus, .form-group textarea:focus {
           outline: none;
           border-color: var(--primary);
        }
        .form-row {
          display: flex;
          gap: 16px;
        }
        .half {
          flex: 1;
        }
      `}</style>
    </div>
  );
};

export default NewComplaint;
