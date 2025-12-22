import BackButton from "../../components/BackButton";

const NewInvoice = () => {
  return (
    <div>
      <BackButton />
      <h1>Create Invoice</h1>

      <form style={{ maxWidth: 500, display: "flex", flexDirection: "column", gap: 15 }}>
        <input placeholder="Tenant Name" />
        <input placeholder="Amount" />
        <select>
          <option>Status</option>
          <option>Paid</option>
          <option>Pending</option>
        </select>

        <button>Create Invoice</button>
      </form>
    </div>
  );
};

export default NewInvoice;
