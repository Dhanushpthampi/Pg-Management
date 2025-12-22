import BackButton from "../../components/BackButton";

const AddStaff = () => {
  return (
    <div>
      <BackButton />
      <h1>Add Staff</h1>

      <form style={{ maxWidth: 400, display: "flex", flexDirection: "column", gap: 15 }}>
        <input placeholder="Full Name" />
        <input placeholder="Email" />
        <input placeholder="Phone" />

        <select>
          <option>Select Role</option>
          <option>Admin</option>
          <option>Manager</option>
          <option>Staff</option>
        </select>

        <button>Add Staff</button>
      </form>
    </div>
  );
};

export default AddStaff;
