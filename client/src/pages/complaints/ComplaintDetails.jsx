import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import api from "../../api/axios";
import BackButton from "../../components/BackButton";

const ComplaintDetails = () => {
  const { id } = useParams();
  const [complaint, setComplaint] = useState(null);
  const [status, setStatus] = useState("");

  useEffect(() => {
    const fetchComplaint = async () => {
      try {
        const { data } = await api.get(`/complaints/${id}`);
        setComplaint(data);
        setStatus(data.status);
      } catch (err) {
        console.error(err);
      }
    };
    fetchComplaint();
  }, [id]);

  const handleUpdate = async () => {
    try {
      await api.put(`/complaints/${id}/status`, { status });
      alert("Status updated");
      setComplaint({ ...complaint, status });
    } catch (err) {
      console.error(err);
      alert("Failed to update status");
    }
  };

  if (!complaint) return <p>Loading...</p>;

  return (
    <div>
      <BackButton />
      <h1>Complaint Details</h1>

      <p><strong>Title:</strong> {complaint.title}</p>
      <p><strong>Description:</strong> {complaint.description}</p>
      <p><strong>Category:</strong> {complaint.category}</p>
      <p><strong>Priority:</strong> {complaint.priority}</p>
      <p><strong>Status:</strong> {complaint.status}</p>
      <p><strong>Raised By:</strong> {complaint.raisedBy?.name || "N/A"}</p>

      <label>Update Status: </label>
      <select value={status} onChange={(e) => setStatus(e.target.value)}>
        <option value="open">Open</option>
        <option value="in_progress">In Progress</option>
        <option value="resolved">Resolved</option>
        <option value="closed">Closed</option>
      </select>

      <br /><br />
      <button onClick={handleUpdate}>Update Status</button>
    </div>
  );
};

export default ComplaintDetails;
