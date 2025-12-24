import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";
import PageHeader from "../../components/PageHeader";
import BackButton from "../../components/BackButton";

const NewBooking = () => {
    const navigate = useNavigate();
    const [properties, setProperties] = useState([]);
    const [formData, setFormData] = useState({
        name: "",
        phone: "",
        email: "",
        gender: "male",
        property: "",
        joiningDate: "",
        amount: "",
        comments: ""
    });

    useEffect(() => {
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

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post("/bookings", formData);
            navigate("/bookings");
        } catch (error) {
            console.error(error);
            alert("Failed to create booking");
        }
    };

    return (
        <div style={{ maxWidth: 600, margin: "0 auto" }}>
            <BackButton />

            <PageHeader title="New Booking" />

            <div className="card">
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Full Name</label>
                        <input
                            name="name"
                            placeholder="Enter full name"
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-row">
                        <div className="form-group half">
                            <label>Phone Number</label>
                            <input
                                name="phone"
                                placeholder="10-digit number"
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="form-group half">
                            <label>Email Address</label>
                            <input
                                name="email"
                                type="email"
                                placeholder="email@example.com"
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group half">
                            <label>Gender</label>
                            <select name="gender" onChange={handleChange} value={formData.gender}>
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                                <option value="other">Other</option>
                            </select>
                        </div>
                        <div className="form-group half">
                            <label>Property</label>
                            <select name="property" onChange={handleChange} required value={formData.property}>
                                <option value="">Select Property</option>
                                {properties.map(p => <option key={p._id} value={p._id}>{p.name}</option>)}
                            </select>
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group half">
                            <label>Joining Date</label>
                            <input
                                name="joiningDate"
                                type="date"
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="form-group half">
                            <label>Booking Amount (₹)</label>
                            <input
                                name="amount"
                                type="number"
                                placeholder="0"
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Comments (Optional)</label>
                        <textarea
                            name="comments"
                            placeholder="Any special requests or notes..."
                            rows="3"
                            onChange={handleChange}
                        />
                    </div>

                    <div style={{ marginTop: 30, textAlign: 'right' }}>
                        <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
                            Create Booking
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
        .form-group input, .form-group select, .form-group textarea {
          width: 100%;
          padding: 10px;
          border: 1px solid var(--border-color);
          border-radius: var(--radius);
          font-size: 14px;
          font-family: inherit;
        }
        .form-group input:focus, .form-group select:focus, .form-group textarea:focus {
           outline: none;
           border-color: var(--primary);
        }
        .form-row {
          display: flex;
          gap: 16px;
        }
        .half { flex: 1; }
      `}</style>
        </div>
    );
};

export default NewBooking;
