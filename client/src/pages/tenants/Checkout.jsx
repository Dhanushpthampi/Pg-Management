import { useNavigate } from "react-router-dom";

const Checkout = () => {
  const navigate = useNavigate();

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 20 }}>
        <h1>Checkout & Notice</h1>
      </div>

      <table width="100%" border="1" cellPadding="10">
        <thead>
          <tr>
            <th>Tenant</th>
            <th>Property</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          <tr>
            <td>Rahul</td>
            <td>GullyPG – Nagarbhavi</td>
            <td>On Notice</td>
            <td>
              <button onClick={() => navigate("/checkout/1/process")}>
                Process Checkout
              </button>
            </td>
          </tr>

          <tr>
            <td>Priya</td>
            <td>GullyPG – Kengeri</td>
            <td>Active</td>
            <td>
              <button onClick={() => navigate("/notice/2")}>
                Raise Notice
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default Checkout;
