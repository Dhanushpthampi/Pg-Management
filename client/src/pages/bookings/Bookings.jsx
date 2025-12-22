import { useNavigate } from "react-router-dom";

const Bookings = () => {
  const navigate = useNavigate();

  return (
    <div>
      {/* Page Header */}
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 20 }}>
        <h1>Bookings</h1>
        <button onClick={() => navigate("/bookings/new")}>
          + New Booking
        </button>
      </div>

      {/* Table */}
      <table width="100%" border="1" cellPadding="10">
        <thead>
          <tr>
            <th>Name</th>
            <th>Phone</th>
            <th>Property</th>
            <th>Joining Date</th>
            <th>Amount Paid</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          <tr>
            <td>Amit</td>
            <td>9876501234</td>
            <td>GullyPG – Nagarbhavi</td>
            <td>15 Dec 2025</td>
            <td>₹1,000</td>
            <td>
              <button onClick={() => navigate("/checkin")}>
                Check-in
              </button>
              &nbsp;
              <button>
                Cancel
              </button>
            </td>
          </tr>

          <tr>
            <td>Sneha</td>
            <td>9123456789</td>
            <td>GullyPG – Kengeri</td>
            <td>20 Dec 2025</td>
            <td>₹2,000</td>
            <td>
              <button onClick={() => navigate("/checkin")}>
                Check-in
              </button>
              &nbsp;
              <button>
                Cancel
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default Bookings;
