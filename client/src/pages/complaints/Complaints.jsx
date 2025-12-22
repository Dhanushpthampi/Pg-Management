import { useNavigate } from "react-router-dom";

const Complaints = () => {
  const navigate = useNavigate();

  return (
    <div>
      {/* Page Header */}
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 20 }}>
        <h1>Complaints</h1>
        <button onClick={() => navigate("/complaints/new")}>
          + New Complaint
        </button>
      </div>

      <table width="100%" border="1" cellPadding="10">
        <thead>
          <tr>
            <th>Issue</th>
            <th>Category</th>
            <th>Priority</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          <tr>
            <td>Wi-Fi not working</td>
            <td>Internet</td>
            <td>High</td>
            <td>Open</td>
            <td>
              <button onClick={() => navigate("/complaints/1")}>
                View
              </button>
            </td>
          </tr>

          <tr>
            <td>Leaking Tap</td>
            <td>Plumbing</td>
            <td>Medium</td>
            <td>In Progress</td>
            <td>
              <button onClick={() => navigate("/complaints/2")}>
                View
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default Complaints;
