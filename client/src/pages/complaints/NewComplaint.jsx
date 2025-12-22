import BackButton from "../../components/BackButton";

const NewComplaint = () => {
  return (
    <div>
      <BackButton />
      <h1>Raise Complaint</h1>

      <form style={{ maxWidth: 500, display: "flex", flexDirection: "column", gap: 15 }}>
        <select>
          <option>Select Category</option>
          <option>Plumbing</option>
          <option>Electrical</option>
          <option>Internet</option>
        </select>

        <select>
          <option>Select Priority</option>
          <option>Low</option>
          <option>Medium</option>
          <option>High</option>
        </select>

        <textarea placeholder="Describe the issue" rows="4" />

        <button>Submit Complaint</button>
      </form>
    </div>
  );
};

export default NewComplaint;
