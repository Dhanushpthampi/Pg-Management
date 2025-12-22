import BackButton from "../../components/BackButton";

const EditStaff = () => {
  return (
    <div>
      <BackButton />
      <h1>Edit Staff</h1>

      <form style={{ maxWidth: 400, display: "flex", flexDirection: "column", gap: 15 }}>
        <input defaultValue="John" />
        <input defaultValue="john@gmail.com" />
        <input defaultValue="9876543210" />

        <select defaultValue="Admin">
          <option>Admin</option>
          <option>Manager</option>
          <option>Staff</option>
        </select>

        <button>Update Staff</button>
      </form>
    </div>
  );
};

export default EditStaff;
