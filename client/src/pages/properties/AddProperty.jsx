import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";
import PageHeader from "../../components/PageHeader";
import { X } from "lucide-react";
import BackButton from "../../components/BackButton";

const AddProperty = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    contactPerson: "",
    contactPhone: "",
    contactEmail: "",
    amenities: [],
    mealTypes: []
  });

  const availableAmenities = [
    "Food", "Internet", "Television", "Washing Machine",
    "Refrigerator", "AC", "Gym", "Bike Parking", "Car Parking"
  ];

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const toggleAmenity = (amenity) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity]
    }));
  };

  const toggleMealType = (mealType) => {
    setFormData(prev => ({
      ...prev,
      mealTypes: prev.mealTypes.includes(mealType)
        ? prev.mealTypes.filter(m => m !== mealType)
        : [...prev.mealTypes, mealType]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/properties", formData);
      navigate("/properties");
    } catch (error) {
      console.error(error);
      alert("Failed to create property");
    }
  };

  return (
    <div style={{ maxWidth: 600, margin: "0 auto" }}>
      <BackButton />

      <PageHeader title="Add New Property" />

      <div className="card">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Property Name</label>
            <input name="name" placeholder="Enter property name" onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label>Address</label>
            <input name="address" placeholder="Enter full address" onChange={handleChange} required />
          </div>

          <div className="form-row">
            <div className="form-group half">
              <label>City</label>
              <input name="city" placeholder="City" onChange={handleChange} required />
            </div>
            <div className="form-group half">
              <label>State</label>
              <input name="state" placeholder="State" onChange={handleChange} required />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group half">
              <label>Pincode</label>
              <input name="pincode" placeholder="Pincode" onChange={handleChange} required />
            </div>
            <div className="form-group half">
              <label>Contact Person</label>
              <input name="contactPerson" placeholder="Manager name" onChange={handleChange} />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group half">
              <label>Contact Phone</label>
              <input name="contactPhone" placeholder="Phone number" onChange={handleChange} />
            </div>
            <div className="form-group half">
              <label>Contact Email</label>
              <input name="contactEmail" type="email" placeholder="Email" onChange={handleChange} />
            </div>
          </div>

          <div style={{ borderTop: '1px solid #eee', margin: '20px 0', paddingTop: 20 }}>
            <h4 style={{ marginBottom: 15, fontSize: 15, fontWeight: 600 }}>Amenities and Food type</h4>
            <div className="tag-container">
              {availableAmenities.map(amenity => (
                <button
                  key={amenity}
                  type="button"
                  className={`tag-btn ${formData.amenities.includes(amenity) ? 'active' : ''}`}
                  onClick={() => toggleAmenity(amenity)}
                >
                  {formData.amenities.includes(amenity) && <X size={14} />}
                  {amenity}
                </button>
              ))}
            </div>
          </div>

          <div style={{ marginTop: 20 }}>
            <h4 style={{ marginBottom: 15, fontSize: 15, fontWeight: 600 }}>Meal Type</h4>
            <div className="tag-container">
              <button
                type="button"
                className={`tag-btn ${formData.mealTypes.includes('veg') ? 'active' : ''}`}
                onClick={() => toggleMealType('veg')}
              >
                {formData.mealTypes.includes('veg') && <X size={14} />}
                Veg
              </button>
              <button
                type="button"
                className={`tag-btn ${formData.mealTypes.includes('non-veg') ? 'active' : ''}`}
                onClick={() => toggleMealType('non-veg')}
              >
                {formData.mealTypes.includes('non-veg') && <X size={14} />}
                Non-Veg
              </button>
            </div>
          </div>

          <div style={{ marginTop: 30, textAlign: 'right' }}>
            <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
              Create Property
            </button>
          </div>
        </form>
      </div>

      <style>{`
        .card {
           background: white;
           padding: 30px;
           border-radius: var(--radius);
           border: 1px solid var(--border-color);
           box-shadow: var(--shadow-sm);
        }
        .form-group {
          margin-bottom: 16px;
        }
        .form-group label {
          display: block;
          margin-bottom: 6px;
          font-weight: 500;
          color: var(--secondary);
          font-size: 14px;
        }
        .form-group input, .form-group select {
          width: 100%;
          padding: 10px;
          border: 1px solid var(--border-color);
          border-radius: var(--radius);
          font-size: 14px;
        }
        .form-group input:focus, .form-group select:focus {
           outline: none;
           border-color: var(--primary);
        }
        .form-row {
          display: flex;
          gap: 16px;
        }
        .half { flex: 1; }
        
        .tag-container {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
        }
        .tag-btn {
          padding: 8px 16px;
          border: 1px solid #d1d5db;
          border-radius: 6px;
          background: white;
          cursor: pointer;
          font-size: 13px;
          display: flex;
          align-items: center;
          gap: 6px;
          transition: all 0.2s;
        }
        .tag-btn:hover {
          border-color: var(--primary);
          background: #f9fafb;
        }
        .tag-btn.active {
          background: var(--primary);
          color: white;
          border-color: var(--primary);
        }
      `}</style>
    </div>
  );
};

export default AddProperty;
