import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const BackButton = () => {
  const navigate = useNavigate();

  return (
    <button
      className="btn btn-secondary"
      onClick={() => navigate(-1)}
      style={{ marginBottom: 20 }}
    >
      <ArrowLeft size={16} /> Back
    </button>
  );
};

export default BackButton;
