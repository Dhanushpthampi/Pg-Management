import { useNavigate } from "react-router-dom";

const Invoices = () => {
  const navigate = useNavigate();

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
            <th>Invoice No</th>
            <th>Tenant</th>
            <th>Amount</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          <tr>
            <td>INV-001</td>
            <td>Rahul</td>
            <td>₹12,980</td>
            <td>Pending</td>
            <td>
              <button onClick={() => navigate("/invoices/1")}>
                View
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default Invoices;
