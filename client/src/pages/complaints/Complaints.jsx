import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../../api/axios";

const Complaints = () => {
  const navigate = useNavigate();
  const [complaints, setComplaints] = useState([]);

  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        const { data } = await api.get("/complaints");
        setComplaints(data);
      } catch (error) {
        console.error("Failed to fetch complaints", error);
      }
    };
    fetchComplaints();
  }, []);

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
            <th>Title</th>
            <th>Category</th>
            <th>Priority</th>
            <th>Status</th>
            <th>Raised By</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {complaints.map((complaint) => (
            <tr key={complaint._id}>
              <td>{complaint.title}</td>
              <td>{complaint.category}</td>
              <td>{complaint.priority}</td>
              <td>{complaint.status}</td>
              <td>{complaint.raisedBy?.name || "N/A"}</td>
              <td>
                <button onClick={() => navigate(`/complaints/${complaint._id}`)}>
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

export default Complaints;
