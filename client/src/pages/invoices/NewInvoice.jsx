import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";
import BackButton from "../../components/BackButton";

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
      const payload = {
        tenant: formData.tenant,
        month: formData.month,
        year: formData.year,
        items: [
          { description: "Rent", amount: Number(formData.rentAmount) },
          { description: "Electricity", amount: Number(formData.electricityAmount) },
          { description: "Water", amount: Number(formData.waterAmount) },
          { description: "Internet", amount: Number(formData.internetAmount) },
        ]
      };
      await api.post("/invoices", payload);
      alert("Invoice created successfully");
      navigate("/invoices");
    } catch (error) {
      console.error(error);
      alert("Failed to create invoice");
    }
  };

  return (
    <div>
      <BackButton />
      <h1>Create Invoice</h1>

      <form onSubmit={handleSubmit} style={{ maxWidth: 500, display: "flex", flexDirection: "column", gap: 15 }}>
        <select name="tenant" onChange={handleChange} required>
          <option value="">Select Tenant</option>
          {tenants.map(t => <option key={t._id} value={t._id}>{t.name}</option>)}
        </select>

        <div style={{ display: "flex", gap: 10 }}>
          <input name="month" placeholder="Month" value={formData.month} onChange={handleChange} />
          <input name="year" placeholder="Year" value={formData.year} onChange={handleChange} />
        </div>

        <input type="number" name="rentAmount" placeholder="Rent Amount" onChange={handleChange} required />
        <input type="number" name="electricityAmount" placeholder="Electricity Charges" onChange={handleChange} />
        <input type="number" name="waterAmount" placeholder="Water Charges" onChange={handleChange} />
        <input type="number" name="internetAmount" placeholder="Internet Charges" onChange={handleChange} />

        <button type="submit">Create Invoice</button>
      </form>
    </div>
  );
};

export default NewInvoice;
