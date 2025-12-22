import { useNavigate } from "react-router-dom";

const Tenants = () => {
  const navigate = useNavigate();

  return (
    <div>
      {/* Page Header */}
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 20 }}>
        <h1>Tenants</h1>
        <button onClick={() => navigate("/checkin")}>
          + New Check-in
        </button>
      </div>

      {/* Table */}
      <table width="100%" border="1" cellPadding="10">
        <thead>
          <tr>
            <th>Name</th>
            <th>Phone</th>
            <th>Property</th>
            <th>Room / Bed</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          <tr>
            <td>Rahul</td>
            <td>9876543210</td>
            <td>GullyPG – Nagarbhavi</td>
            <td>101 / Bed 2</td>
            <td>Active</td>
            <td>
              <button onClick={() => navigate("/tenants/1")}>
                View
              </button>
            </td>
          </tr>

          <tr>
            <td>Priya</td>
            <td>9988776655</td>
            <td>GullyPG – Kengeri</td>
            <td>102 / Bed 1</td>
            <td>On Notice</td>
            <td>
              <button onClick={() => navigate("/tenants/2")}>
                View
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default Tenants;
