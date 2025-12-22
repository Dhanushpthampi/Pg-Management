import BackButton from "../../components/BackButton";

const ComplaintDetails = () => {
  return (
    <div>
      <BackButton />
      <h1>Complaint Details</h1>

      <p><strong>Issue:</strong> Wi-Fi not working</p>
      <p><strong>Category:</strong> Internet</p>
      <p><strong>Priority:</strong> High</p>
      <p><strong>Status:</strong> In Progress</p>

      <select>
        <option>Open</option>
        <option>In Progress</option>
        <option>Resolved</option>
        <option>Closed</option>
      </select>

      <br /><br />
      <button>Update Status</button>
    </div>
  );
};

export default ComplaintDetails;
