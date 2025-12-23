import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../../api/axios";
import { Plus, Download } from "lucide-react";
import PageHeader from "../../components/PageHeader";
import SearchBar from "../../components/SearchBar";
import { generateInvoiceHTML } from "../../utils/invoiceTemplate";

const Invoices = () => {
  const navigate = useNavigate();
  const [allInvoices, setAllInvoices] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const { data } = await api.get("/invoices");
        setAllInvoices(data);
        setInvoices(data);
      } catch (error) {
        console.error("Failed to fetch invoices", error);
      }
    };
    fetchInvoices();
  }, []);

  useEffect(() => {
    if (!search) {
      setInvoices(allInvoices);
    } else {
      const s = search.toLowerCase();
      setInvoices(allInvoices.filter(i =>
        (i.tenant?.name && i.tenant.name.toLowerCase().includes(s)) ||
        (i.property?.name && i.property.name.toLowerCase().includes(s))
      ));
    }
  }, [search, allInvoices]);

const handleDownload = (invoice) => {
  const win = window.open("", "", "width=900,height=800");
  win.document.write(generateInvoiceHTML(invoice));
  win.document.close();
};


  return (
    <div style={{ maxWidth: 1200, margin: "0 auto" }}>
      <PageHeader
        title="Invoices"
        action={
          <button className="btn btn-primary" onClick={() => navigate("/invoices/new")}>
            <Plus size={18} /> Create Invoice
          </button>
        }
      />

      <div className="filter-container">
        <SearchBar
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search Invoice (Tenant, Property)"
        />
      </div>

      <div className="data-table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Invoice Date</th>
              <th>Tenant</th>
              <th>Period</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {invoices.map((invoice) => (
              <tr key={invoice._id}>
                <td>{new Date(invoice.createdAt).toLocaleDateString()}</td>
                <td>
                  <div style={{ fontWeight: 500 }}>{invoice.tenant?.name || "N/A"}</div>
                  <div className="text-sm">{invoice.property?.name}</div>
                </td>
                <td>{invoice.month} {invoice.year}</td>
                <td style={{ fontWeight: "bold" }}>₹{invoice.totalAmount}</td>
                <td>
                  <span className={`badge ${invoice.status === 'Paid' ? 'success' : 'warning'}`}>
                    {invoice.status}
                  </span>
                </td>
                <td>
                  <div className="flex-gap">
                    <button
                      className="btn btn-secondary"
                      style={{ padding: "4px 8px", fontSize: 12 }}
                      onClick={() => handleDownload(invoice)}
                    >
                      <Download size={12} /> Download
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {invoices.length === 0 && (
              <tr><td colSpan="6" style={{ textAlign: "center", padding: 30, color: "var(--secondary)" }}>No invoices found.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      <style>{`
        .filter-container {
          display: flex;
          gap: 15px;
          margin-bottom: 24px;
          flex-wrap: wrap;
          align-items: center;
        }
      `}</style>
    </div>
  );
};

export default Invoices;
