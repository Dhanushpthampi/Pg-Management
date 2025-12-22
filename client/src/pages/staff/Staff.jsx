import { useNavigate } from "react-router-dom";

const Staff = () => {
  const navigate = useNavigate();

  return (
    <div>
      {/* Page Header */}
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 20 }}>
        <h1>Staff</h1>
        <button onClick={() => navigate("/staff/new")}>
          + Add Staff
        </button>
      </div>

      {/* Table */}
      <table width="100%" border="1" cellPadding="10">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          <tr>
            <td>John</td>
            <td>john@gmail.com</td>
            <td>Admin</td>
            <td>
              <button onClick={() => navigate("/staff/1/edit")}>
                Edit
              </button>
            </td>
          </tr>

          <tr>
            <td>Anusha</td>
            <td>anusha@gmail.com</td>
            <td>Manager</td>
            <td>
              <button onClick={() => navigate("/staff/2/edit")}>
                Edit
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default Staff;
