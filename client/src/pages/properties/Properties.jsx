import { useNavigate } from "react-router-dom";

const Properties = () => {
      const navigate = useNavigate();

  return (
    <div>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 20 }}>
        <h1>Properties</h1>
        <button onClick={() => navigate("/properties/new")}>
          + Add Property
        </button>
      </div>


      {/* Filters */}
      <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
        <select>
          <option>All Cities</option>
          <option>Bangalore</option>
        </select>

        <select>
          <option>All Status</option>
          <option>Active</option>
          <option>Inactive</option>
        </select>
      </div>

      {/* Table */}
      <table width="100%" border="1" cellPadding="10">
        <thead>
          <tr>
            <th>Property Name</th>
            <th>City</th>
            <th>Floors</th>
            <th>Total Beds</th>
            <th>Occupied</th>
            <th>Manager</th>
            <th>Action</th>
          </tr>
        </thead>

<tbody>
  <tr>
    <td>GullyPG – Nagarbhavi</td>
    <td>Bangalore</td>
    <td>12</td>
    <td>80</td>
    <td>70</td>
    <td>Ramesh</td>
    <td>
      <button onClick={() => navigate("/properties/1/beds")}>
        Manage Beds
      </button>
    </td>
  </tr>

  <tr>
    <td>GullyPG – Kengeri</td>
    <td>Bangalore</td>
    <td>4</td>
    <td>60</td>
    <td>55</td>
    <td>Ravi</td>
    <td>
      <button onClick={() => navigate("/properties/2/beds")}>
        Manage Beds
      </button>
    </td>
  </tr>
</tbody>

      </table>
    </div>
  );
};

export default Properties;
