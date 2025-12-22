import BackButton from "../../components/BackButton";

const TenantDetails = () => {
  return (
    <div>
      <BackButton />
      <h1>Tenant Details</h1>

      <p><strong>Name:</strong> Rahul</p>
      <p><strong>Phone:</strong> 9876543210</p>
      <p><strong>Property:</strong> GullyPG – Nagarbhavi</p>
      <p><strong>Room / Bed:</strong> 101 / Bed 2</p>
      <p><strong>Status:</strong> Active</p>

      <h3>Payments</h3>
      <p>Monthly Rent: ₹8,000</p>
      <p>Deposit: ₹16,000</p>
    </div>
  );
};

export default TenantDetails;
