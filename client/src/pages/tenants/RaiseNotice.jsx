import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import PageHeader from "../../components/PageHeader";
import { ArrowLeft } from "lucide-react";

const RaiseNotice = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [reason, setReason] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    // Placeholder for submit logic
    console.log("Notice raised for ID:", id, "Reason:", reason);
    alert("Notice raised successfully");
    navigate(-1);
  };

  return (
    <div style={{ maxWidth: 600, margin: "0 auto" }}>
      <button
        className="btn btn-secondary"
        onClick={() => navigate(-1)}
        style={{ marginBottom: 20 }}
      >
        <ArrowLeft size={16} /> Back
      </button>

      <PageHeader title="Raise Notice" />

      <div className="card">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Reason for Leaving</label>
            <textarea
              rows="5"
              placeholder="Please explain why you are leaving (e.g., Job change, Relocation)..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              required
            />
          </div>

          <div style={{ marginTop: 24, textAlign: 'right' }}>
            <button type="submit" className="btn btn-danger" style={{ width: '100%' }}>
              Submit Notice
            </button>
          </div>
        </form>
      </div>

      <style>{`
        .card {
           background: white;
           padding: 24px;
           border-radius: var(--radius);
           border: 1px solid var(--border-color);
           box-shadow: var(--shadow-sm);
        }
        .form-group {
          margin-bottom: 16px;
        }
        .form-group label {
          display: block;
          margin-bottom: 8px;
          font-weight: 500;
          color: var(--secondary);
          font-size: 14px;
        }
        .form-group textarea {
          width: 100%;
          padding: 12px;
          border: 1px solid var(--border-color);
          border-radius: var(--radius);
          font-size: 14px;
          font-family: inherit;
          resize: vertical;
        }
        .form-group textarea:focus {
           outline: none;
           border-color: var(--primary);
           box-shadow: 0 0 0 2px rgba(0,0,0,0.05);
        }
      `}</style>
    </div>
  );
};

export default RaiseNotice;
