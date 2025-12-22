import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../../api/axios";

const Invoices = () => {
  const navigate = useNavigate();
  const [invoices, setInvoices] = useState([]);

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const { data } = await api.get("/invoices");
        setInvoices(data);
      } catch (error) {
        console.error("Failed to fetch invoices", error);
      }
    };
    fetchInvoices();
  }, []);

  return (
    <div>
      {/* Page Header */}
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 20 }}>
        <h1>Invoices</h1>
        <button onClick={() => navigate("/invoices/new")}>
          + Create Invoice
        </button>
      </div>

      <table width="100%" border="1" cellPadding="10">
        <thead>
          <tr>
            <th>Month</th>
            <th>Tenant</th>
            <th>Amount</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {invoices.map((invoice) => (
            <tr key={invoice._id}>
              <td>{invoice.month} {invoice.year}</td>
              <td>{invoice.tenant?.name || "N/A"}</td>
              <td>₹{invoice.totalAmount}</td>
              <td>{invoice.status}</td>
              <td>
                <button onClick={() => navigate(`/invoices/${invoice._id}`)}>
                  View
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Invoices;
