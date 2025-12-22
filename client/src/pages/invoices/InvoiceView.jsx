import BackButton from "../../components/BackButton";

const InvoiceView = () => {
  return (
    <div>
      <BackButton />
      <h1>Invoice INV-001</h1>

      <p><strong>Tenant:</strong> Rahul</p>
      <p><strong>Amount:</strong> ₹12,980</p>
      <p><strong>Status:</strong> Pending</p>

      <button>Download PDF</button>
    </div>
  );
};

export default InvoiceView;
