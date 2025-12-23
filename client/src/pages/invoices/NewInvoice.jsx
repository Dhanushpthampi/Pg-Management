import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";
import PageHeader from "../../components/PageHeader";
import { ArrowLeft, Plus, Trash2 } from "lucide-react";

const NewInvoice = () => {
  const navigate = useNavigate();
  const [tenants, setTenants] = useState([]);

  const [formData, setFormData] = useState({
    tenantName: "",
    mobileNumber: "",
    emailAddress: "",
    idProofNumber: "",
    propertyName: "",
    blockFloor: "",
    roomBedNo: "",
    occupancyType: "",
    subtotal: 0,
    cgst: 0,
    sgst: 0,
    totalPayable: 0
  });

  const [invoiceItems, setInvoiceItems] = useState([
    { description: "Monthly Rent", qty: 1, rate: 0, amount: 0 },
    { description: "Maintenance & Amenities", qty: 1, rate: 0, amount: 0 }
  ]);

  const [selectedTenant, setSelectedTenant] = useState(null);

  useEffect(() => {
    fetchTenants();
  }, []);

  const fetchTenants = async () => {
    try {
      const { data } = await api.get("/tenants");
      setTenants(data);
    } catch (error) {
      console.error("Failed to fetch tenants", error);
    }
  };

  const handleTenantSelect = (e) => {
    const tenantId = e.target.value;
    const tenant = tenants.find(t => t._id === tenantId);

    if (tenant) {
      setSelectedTenant(tenant);
      setFormData({
        ...formData,
        tenantName: tenant.name,
        mobileNumber: tenant.phone,
        emailAddress: tenant.email || "",
        idProofNumber: tenant.idProofNumber || "",
        propertyName: tenant.property?.name || "",
        blockFloor: `${tenant.block?.name || ""} / ${tenant.floor?.name || ""}`,
        roomBedNo: `${tenant.room?.number || ""} / ${tenant.bed?.number || ""}`,
        occupancyType: tenant.room?.type || ""
      });
    }
  };

  const handleItemChange = (index, field, value) => {
    const newItems = [...invoiceItems];
    newItems[index][field] = value;

    // Calculate amount
    if (field === 'qty' || field === 'rate') {
      newItems[index].amount = (parseFloat(newItems[index].qty) || 0) * (parseFloat(newItems[index].rate) || 0);
    }

    setInvoiceItems(newItems);
    calculateTotals(newItems);
  };

  const addItem = () => {
    setInvoiceItems([...invoiceItems, { description: "", qty: 1, rate: 0, amount: 0 }]);
  };

  const removeItem = (index) => {
    const newItems = invoiceItems.filter((_, i) => i !== index);
    setInvoiceItems(newItems);
    calculateTotals(newItems);
  };

  const calculateTotals = (items) => {
    const subtotal = items.reduce((sum, item) => sum + (parseFloat(item.amount) || 0), 0);
    const cgst = subtotal * 0.09; // 9% CGST
    const sgst = subtotal * 0.09; // 9% SGST
    const totalPayable = subtotal + cgst + sgst;

    setFormData(prev => ({
      ...prev,
      subtotal: subtotal.toFixed(2),
      cgst: cgst.toFixed(2),
      sgst: sgst.toFixed(2),
      totalPayable: totalPayable.toFixed(2)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedTenant) {
      alert("Please select a tenant");
      return;
    }

    try {
      const payload = {
        tenant: selectedTenant._id,
        property: selectedTenant.property._id,
        month: new Date().toLocaleString('default', { month: 'long' }),
        year: new Date().getFullYear(),
        items: invoiceItems.map(item => ({
          description: item.description,
          amount: parseFloat(item.amount) || 0
        })),
        totalAmount: parseFloat(formData.totalPayable),
        subtotal: parseFloat(formData.subtotal),
        cgst: parseFloat(formData.cgst),
        sgst: parseFloat(formData.sgst),
        status: "pending"
      };

      await api.post("/invoices", payload);
      navigate("/invoices");
    } catch (error) {
      console.error(error);
      alert("Failed to create invoice: " + (error.response?.data?.message || "Unknown error"));
    }
  };

  return (
    <div style={{ maxWidth: 700, margin: "0 auto" }}>
      <button
        className="btn btn-secondary"
        onClick={() => navigate(-1)}
        style={{ marginBottom: 20 }}
      >
        <ArrowLeft size={16} /> Back
      </button>

      <PageHeader title="Create Invoice" />

      <form onSubmit={handleSubmit}>
        {/* Tenant Details */}
        <div className="invoice-section">
          <h3 className="section-title">Tenant Details</h3>

          <div className="form-group">
            <label>Select Tenant</label>
            <select onChange={handleTenantSelect} required>
              <option value="">-- Select Tenant --</option>
              {tenants.map(tenant => (
                <option key={tenant._id} value={tenant._id}>
                  {tenant.name} - {tenant.phone}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Tenant Name</label>
            <input value={formData.tenantName} readOnly />
          </div>

          <div className="form-group">
            <label>Mobile Number</label>
            <input value={formData.mobileNumber} readOnly />
          </div>

          <div className="form-group">
            <label>Email Address</label>
            <input value={formData.emailAddress} readOnly />
          </div>

          <div className="form-group">
            <label>ID Proof Number</label>
            <input value={formData.idProofNumber} readOnly />
          </div>
        </div>

        {/* Property & Room Details */}
        <div className="invoice-section">
          <h3 className="section-title">Property & Room Details</h3>

          <div className="form-group">
            <label>Property Name</label>
            <input value={formData.propertyName} readOnly />
          </div>

          <div className="form-group">
            <label>Block / Floor</label>
            <input value={formData.blockFloor} readOnly />
          </div>

          <div className="form-group">
            <label>Room & Bed No</label>
            <input value={formData.roomBedNo} readOnly />
          </div>

          <div className="form-group">
            <label>Occupancy Type</label>
            <input value={formData.occupancyType} readOnly />
          </div>
        </div>

        {/* Invoice Items */}
        <div className="invoice-section">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 }}>
            <h3 className="section-title" style={{ margin: 0 }}>Invoice Items</h3>
            <button type="button" className="btn btn-secondary" onClick={addItem} style={{ padding: '6px 12px', fontSize: 13 }}>
              <Plus size={16} /> Add Item
            </button>
          </div>

          <div className="items-table">
            <div className="items-header">
              <div style={{ width: '40px' }}>#</div>
              <div style={{ flex: 2 }}>Description</div>
              <div style={{ width: '80px' }}>Qty</div>
              <div style={{ width: '100px' }}>Rate (₹)</div>
              <div style={{ width: '100px' }}>Amount (₹)</div>
              <div style={{ width: '40px' }}></div>
            </div>

            {invoiceItems.map((item, index) => (
              <div key={index} className="items-row">
                <div style={{ width: '40px' }}>{index + 1}</div>
                <div style={{ flex: 2 }}>
                  <input
                    value={item.description}
                    onChange={(e) => handleItemChange(index, 'description', e.target.value)}
                    placeholder="Description"
                  />
                </div>
                <div style={{ width: '80px' }}>
                  <input
                    type="number"
                    value={item.qty}
                    onChange={(e) => handleItemChange(index, 'qty', e.target.value)}
                    min="1"
                  />
                </div>
                <div style={{ width: '100px' }}>
                  <input
                    type="number"
                    value={item.rate}
                    onChange={(e) => handleItemChange(index, 'rate', e.target.value)}
                    min="0"
                  />
                </div>
                <div style={{ width: '100px' }}>
                  <input value={item.amount.toFixed(2)} readOnly />
                </div>
                <div style={{ width: '40px' }}>
                  {invoiceItems.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeItem(index)}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#dc3545' }}
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Payment Summary */}
        <div className="invoice-section">
          <h3 className="section-title">Payment Summary</h3>

          <div className="form-group">
            <label>Subtotal</label>
            <input value={`₹ ${formData.subtotal}`} readOnly />
          </div>

          <div className="form-group">
            <label>CGST (9%)</label>
            <input value={`₹ ${formData.cgst}`} readOnly />
          </div>

          <div className="form-group">
            <label>SGST (9%)</label>
            <input value={`₹ ${formData.sgst}`} readOnly />
          </div>

          <div className="form-group">
            <label style={{ fontWeight: 600 }}>Total Payable</label>
            <input
              value={`₹ ${formData.totalPayable}`}
              readOnly
              style={{ fontWeight: 600, fontSize: 16 }}
            />
          </div>
        </div>

        <div style={{ marginTop: 30, textAlign: 'right' }}>
          <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '12px' }}>
            Generate Invoice
          </button>
        </div>
      </form>

      <style>{`
        .invoice-section {
          background: white;
          padding: 24px;
          border-radius: var(--radius);
          border: 1px solid var(--border-color);
          margin-bottom: 20px;
        }
        .section-title {
          font-size: 16px;
          font-weight: 600;
          margin-bottom: 16px;
          color: #333;
        }
        .form-group {
          margin-bottom: 14px;
        }
        .form-group label {
          display: block;
          margin-bottom: 6px;
          font-weight: 500;
          color: var(--secondary);
          font-size: 13px;
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
        .form-group input[readOnly] {
          background: #f9fafb;
          color: #666;
        }
        .items-table {
          margin-top: 10px;
        }
        .items-header {
          display: flex;
          gap: 10px;
          padding: 10px;
          background: #f5f5f5;
          border-radius: 4px;
          font-weight: 600;
          font-size: 13px;
          margin-bottom: 8px;
        }
        .items-row {
          display: flex;
          gap: 10px;
          padding: 8px 10px;
          align-items: center;
          border-bottom: 1px solid #eee;
        }
        .items-row input {
          padding: 8px;
          border: 1px solid var(--border-color);
          border-radius: 4px;
          font-size: 13px;
          width: 100%;
        }
      `}</style>
    </div>
  );
};

export default NewInvoice;
