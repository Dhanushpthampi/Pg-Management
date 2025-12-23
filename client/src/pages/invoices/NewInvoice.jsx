import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";
import PageHeader from "../../components/PageHeader";
import { ArrowLeft } from "lucide-react";

const NewInvoice = () => {
  const navigate = useNavigate();
  const [tenants, setTenants] = useState([]);
  const [formData, setFormData] = useState({
    tenant: "",
    month: new Date().toLocaleString('default', { month: 'long' }),
    year: new Date().getFullYear(),
    rentAmount: "",
    electricityAmount: 0,
    waterAmount: 0,
    internetAmount: 0
  });

  useEffect(() => {
    const fetchTenants = async () => {
      try {
        const { data } = await api.get("/tenants");
        setTenants(data);
      } catch (err) { console.error(err); }
    };
    fetchTenants();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Find the tenant to get the property ID
      const selectedTenant = tenants.find(t => t._id === formData.tenant);
      if (!selectedTenant || !selectedTenant.property) {
        alert("Selected tenant does not have a valid property assigned.");
        return;
      }

      // Calculate total amount
      const rent = Number(formData.rentAmount) || 0;
      const electricity = Number(formData.electricityAmount) || 0;
      const water = Number(formData.waterAmount) || 0;
      const internet = Number(formData.internetAmount) || 0;
      const totalAmount = rent + electricity + water + internet;

      // Construct payload matching the Mongoose schema
      const payload = {
        tenant: formData.tenant,
        property: selectedTenant.property._id,
        month: formData.month,
        year: formData.year,
        items: [
          { description: "Rent", amount: rent },
          { description: "Electricity", amount: electricity },
          { description: "Water", amount: water },
          { description: "Internet", amount: internet },
        ],
        totalAmount: totalAmount,
        status: "pending" // Default status (case-insensitive in some systems, but schema says lowercase)
      };

      await api.post("/invoices", payload);
      navigate("/invoices");
    } catch (error) {
      console.error(error);
      alert("Failed to create invoice: " + (error.response?.data?.message || "Unknown error"));
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

      <PageHeader title="Create Invoice" />

      <div className="card">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Tenant</label>
            <select name="tenant" onChange={handleChange} required value={formData.tenant}>
              <option value="">Select Tenant</option>
              {tenants.map(t => <option key={t._id} value={t._id}>{t.name} ({t.property?.name || 'No Property'})</option>)}
            </select>
          </div>

          <div className="form-row">
            <div className="form-group half">
              <label>Month</label>
              <input name="month" placeholder="Month" value={formData.month} onChange={handleChange} />
            </div>
            <div className="form-group half">
              <label>Year</label>
              <input name="year" placeholder="Year" value={formData.year} onChange={handleChange} />
            </div>
          </div>

          <div style={{ borderTop: '1px solid #eee', margin: '20px 0', paddingTop: 20 }}>
            <h4 style={{ marginBottom: 15, fontSize: 16 }}>Bill Items</h4>
            <div className="form-group">
              <label>Rent Amount (₹)</label>
              <input type="number" name="rentAmount" placeholder="0" onChange={handleChange} required />
            </div>

            <div className="form-row">
              <div className="form-group third">
                <label>Electricity (₹)</label>
                <input type="number" name="electricityAmount" placeholder="0" onChange={handleChange} />
              </div>
              <div className="form-group third">
                <label>Water (₹)</label>
                <input type="number" name="waterAmount" placeholder="0" onChange={handleChange} />
              </div>
              <div className="form-group third">
                <label>Internet (₹)</label>
                <input type="number" name="internetAmount" placeholder="0" onChange={handleChange} />
              </div>
            </div>
          </div>

          <div style={{ marginTop: 24, textAlign: 'right' }}>
            <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
              Generate Invoice
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
        .form-row {
          display: flex;
          gap: 16px;
        }
        .half { flex: 1; }
        .third { flex: 1; }
      `}</style>
    </div>
  );
};

export default NewInvoice;
