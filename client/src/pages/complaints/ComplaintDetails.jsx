import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../api/axios";
import PageHeader from "../../components/PageHeader";
import BackButton from "../../components/BackButton";

const ComplaintDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [complaint, setComplaint] = useState(null);
  const [status, setStatus] = useState("");
  const [comment, setComment] = useState("");

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
      await api.put(`/complaints/${id}`, { status, comment });
      alert("Status updated");
      // Refresh logic or simple state update
      const { data } = await api.get(`/complaints/${id}`);
      setComplaint(data);
      setComment(""); // clear comment
    } catch (err) {
      console.error(err);
      alert("Failed to update status");
    }
  };

  if (!complaint) return <div style={{ padding: 20 }}>Loading...</div>;

  return (
    <div style={{ maxWidth: 800, margin: "0 auto" }}>
      <BackButton />

      <PageHeader title={`Complaint #${complaint._id.slice(-6)}`} />

      <div style={{ display: 'grid', gap: 20, marginBottom: 30 }}>
        {/* Details Card */}
        <div className="card">
          <h3 style={{ marginBottom: 15, borderBottom: '1px solid #eee', paddingBottom: 10 }}>Details</h3>
          <div className="detail-row">
            <label>Title:</label>
            <span>{complaint.title}</span>
          </div>
          <div className="detail-row">
            <label>Description:</label>
            <span>{complaint.description}</span>
          </div>
          <div className="detail-row">
            <label>Category:</label>
            <span>{complaint.category}</span>
          </div>
          <div className="detail-row">
            <label>Priority:</label>
            <span className={`badge ${complaint.priority === 'High' ? 'danger' : complaint.priority === 'Medium' ? 'warning' : 'success'}`}>{complaint.priority}</span>
          </div>
          <div className="detail-row">
            <label>Raised By:</label>
            <span>{complaint.raisedBy?.name || "N/A"}</span>
          </div>
          <div className="detail-row">
            <label>Current Status:</label>
            <span className={`badge ${complaint.status === 'resolved' ? 'success' : 'warning'}`}>{complaint.status.replace("_", " ")}</span>
          </div>
        </div>

        {/* Update Card */}
        <div className="card">
          <h3 style={{ marginBottom: 15, borderBottom: '1px solid #eee', paddingBottom: 10 }}>Update Status</h3>
          <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap', marginBottom: 15 }}>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', marginBottom: 5, fontSize: 13, color: 'var(--secondary)' }}>New Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                style={{ width: '100%' }}
              >
                <option value="open">Open</option>
                <option value="in_progress">In Progress</option>
                <option value="resolved">Resolved</option>
              </select>
            </div>
            <div style={{ flex: 2 }}>
              <label style={{ display: 'block', marginBottom: 5, fontSize: 13, color: 'var(--secondary)' }}>Comment (Optional)</label>
              <input
                type="text"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Add a remark..."
                style={{ width: '100%' }}
              />
            </div>
          </div>
          <button className="btn btn-primary" onClick={handleUpdate}>Update Status</button>
        </div>

        {/* Timeline */}
        <div className="card">
          <h3 style={{ marginBottom: 15, borderBottom: '1px solid #eee', paddingBottom: 10 }}>Timeline</h3>
          <div className="timeline">
            {complaint.timeline?.map((event, idx) => (
              <div key={idx} className="timeline-item">
                <div className="timeline-time">{new Date(event.timestamp).toLocaleString()}</div>
                <div className="timeline-content">
                  <span style={{ fontWeight: 600 }}>{event.status.replace("_", " ")}</span>
                  {event.comment && <span style={{ color: 'var(--secondary)' }}> - {event.comment}</span>}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        .card {
           background: white;
           padding: 24px;
           border-radius: var(--radius);
           border: 1px solid var(--border-color);
           box-shadow: var(--shadow-sm);
        }
        .detail-row {
          display: flex;
          margin-bottom: 10px;
        }
        .detail-row label {
           width: 120px;
           color: var(--secondary);
           font-weight: 500;
        }
        .timeline-item {
           padding: 10px 0;
           border-bottom: 1px solid #eee;
        }
        .timeline-item:last-child { border-bottom: none; }
        .timeline-time {
           font-size: 11px;
           color: #999;
           margin-bottom: 4px;
        }
      `}</style>
    </div>
  );
};

export default ComplaintDetails;
