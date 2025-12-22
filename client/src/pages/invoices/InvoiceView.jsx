import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import api from "../../api/axios";
import BackButton from "../../components/BackButton";

const InvoiceView = () => {
  const { id } = useParams();
  const [invoice, setInvoice] = useState(null);

  useEffect(() => {
    const fetchInvoice = async () => {
      try {
        const { data } = await api.get(`/invoices/${id}`);
        setInvoice(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchInvoice();
  }, [id]);

  if (!invoice) return <p>Loading...</p>;

  return (
    <div>
      <BackButton />
      <h1>Invoice Details</h1>

      <p><strong>Tenant:</strong> {invoice.tenant?.name || "N/A"}</p>
      <p><strong>Total Amount:</strong> ₹{invoice.totalAmount}</p>
      <p><strong>Month/Year:</strong> {invoice.month} {invoice.year}</p>
      <p><strong>Status:</strong> {invoice.status}</p>

      <h3>Line Items</h3>
      <ul>
        {invoice.items.map((item, index) => (
          <li key={index}>{item.description}: ₹{item.amount}</li>
        ))}
      </ul>

      <button>Download PDF (Coming Soon)</button>
    </div>
  );
};

export default InvoiceView;
