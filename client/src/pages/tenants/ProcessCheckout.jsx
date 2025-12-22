import BackButton from "../../components/BackButton";

const ProcessCheckout = () => {
  return (
    <div>
      <BackButton />
      <h1>Process Checkout</h1>

      <label>
        <input type="checkbox" /> Keys Returned
      </label>
      <br />
      <label>
        <input type="checkbox" /> Dues Cleared
      </label>
      <br />
      <label>
        <input type="checkbox" /> Room Inspected
      </label>

      <br /><br />
      <button>Complete Checkout</button>
    </div>
  );
};

export default ProcessCheckout;
