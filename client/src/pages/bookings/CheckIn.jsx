import BackButton from "../../components/BackButton";

const CheckIn = () => {
  return (
    <div>
      <BackButton />
      <h1>Tenant Check-In</h1>

      <p>Step 1: Personal Details</p>

      <form style={{ maxWidth: 400, display: "flex", flexDirection: "column", gap: 15 }}>
        <input placeholder="Full Name" />
        <input placeholder="Phone" />
        <input placeholder="Email" />
        <button>Next</button>
      </form>

      <p style={{ marginTop: 30 }}>
        (Documents & payment steps will be added later)
      </p>
    </div>
  );
};

export default CheckIn;
