import { useState } from "react";
import BackButton from "../../components/BackButton.jsx";

const AddProperty = () => {
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    contactPerson: "",
    contactPhone: "",
    contactEmail: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
  };

  return (
    <div style={{ maxWidth: 700 }}>
      <BackButton />
      <h1>Add New Property</h1>

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 15 }}>
        <input name="name" placeholder="Property Name" onChange={handleChange} />
        <input name="address" placeholder="Address" onChange={handleChange} />

        <select name="city" onChange={handleChange}>
          <option value="">Select City</option>
          <option value="Bangalore">Bangalore</option>
        </select>

        <select name="state" onChange={handleChange}>
          <option value="">Select State</option>
          <option value="Karnataka">Karnataka</option>
        </select>

        <input name="pincode" placeholder="Pincode" onChange={handleChange} />
        <input name="contactPerson" placeholder="Contact Person" onChange={handleChange} />
        <input name="contactPhone" placeholder="Contact Phone" onChange={handleChange} />
        <input name="contactEmail" placeholder="Contact Email" onChange={handleChange} />

        <button type="submit">Create Property</button>
      </form>
    </div>
  );
};

export default AddProperty;
