import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";
import BackButton from "../../components/BackButton";

const CheckIn = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    gender: "male",
    joiningDate: "",
    rentAmount: "",
    depositAmount: "",
    property: "",
    bed: ""
  });

  const [properties, setProperties] = useState([]);
  const [beds, setBeds] = useState([]); // In a real app, this would be hierarchical (Block->Floor->Room->Bed)

  useEffect(() => {
    // Fetch properties for dropdown
    const fetchProperties = async () => {
      try {
        const { data } = await api.get("/properties");
        setProperties(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchProperties();
  }, []);

  // Fetch beds when property changes (Simplified: Fetch ALL beds and filter or just fetch structure)
  // Ideally, we have an API to get available beds for a property
  useEffect(() => {
    if (formData.property) {
      const fetchHierarchy = async () => {
        try {
          // Flatten hierarchy to find available beds (simplified for this demo)
          // In production, we'd have a specific endpoint /api/properties/:id/available-beds
          // For now, let's just use the hierarchy endpoint
          const { data } = await api.get(`/properties/${formData.property}/hierarchy`);

          // Extract beds from hierarchy (Block -> Floor -> Room -> Bed)
          let availableBeds = [];
          data.forEach(block => {
            block.floors.forEach(floor => {
              floor.rooms.forEach(room => {
                room.beds.forEach(bed => {
                  if (bed.status === "available") {
                    availableBeds.push({
                      id: bed._id,
                      label: `${block.name} - ${floor.name} - ${room.number} - ${bed.number}`
                    });
                  }
                });
              });
            });
          });
          setBeds(availableBeds);
        } catch (err) {
          console.error(err);
        }
      };
      fetchHierarchy();
    }
  }, [formData.property]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/tenants", formData);
      alert("Check-in Successful!");
      navigate("/tenants");
    } catch (error) {
      console.error(error);
      alert("Check-in Failed: " + (error.response?.data?.message || error.message));
    }
  };

  return (
    <div>
      <BackButton />
      <h1>Tenant Check-In</h1>

      <form onSubmit={handleSubmit} style={{ maxWidth: 500, display: "flex", flexDirection: "column", gap: 15 }}>
        <h3>Personal Details</h3>
        <input name="name" placeholder="Full Name" onChange={handleChange} required />
        <input name="phone" placeholder="Phone" onChange={handleChange} required />
        <input name="email" placeholder="Email" onChange={handleChange} required />
        <select name="gender" onChange={handleChange} required>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="other">Other</option>
        </select>
        <input name="joiningDate" type="date" placeholder="Joining Date" onChange={handleChange} required />

        <h3>Allocation</h3>
        <select name="property" onChange={handleChange} required>
          <option value="">Select Property</option>
          {properties.map(p => <option key={p._id} value={p._id}>{p.name}</option>)}
        </select>

        <select name="bed" onChange={handleChange} required disabled={!formData.property}>
          <option value="">Select Bed</option>
          {beds.map(b => <option key={b.id} value={b.id}>{b.label}</option>)}
        </select>

        <h3>Financials</h3>
        <input name="rentAmount" type="number" placeholder="Rent Amount" onChange={handleChange} required />
        <input name="depositAmount" type="number" placeholder="Deposit Amount" onChange={handleChange} required />

        <button type="submit" style={{ marginTop: 10, padding: 10, cursor: "pointer" }}>Check-In Tenant</button>
      </form>
    </div>
  );
};

export default CheckIn;
