import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";
import { X } from "lucide-react";

const NewBooking = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [properties, setProperties] = useState([]);

    const [formData, setFormData] = useState({
        name: "",
        phone: "",
        email: "",
        joiningDate: "",
        amount: "",
        comments: "",
        property: "" // Keeping property selection
    });

    useEffect(() => {
        const fetchProperties = async () => {
            try {
                const { data } = await api.get("/properties");
                setProperties(data);
                if (data.length > 0) {
                    setFormData(prev => ({ ...prev, property: data[0]._id })); // Default to first property
                }
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
        setLoading(true);
        try {
            await api.post("/bookings", formData);
            alert("Booking created successfully");
            navigate("/bookings");
        } catch (error) {
            console.error(error);
            alert("Failed to create booking: " + (error.response?.data?.message || error.message));
        } finally {
            setLoading(false);
        }
    };

    // Styling to match "Modal-like" appearance from screenshot
    // Since it's a page, we simulate it with centered container or just clean form
    // Screenshot has "Name", "Mobile Number", "Email", "Joining date", "Booking Amount", "Comments", "Add" button, Close icon

    return (
        <div style={{ padding: 20, maxWidth: 600, margin: "0 auto", background: "white", borderRadius: 8, border: "1px solid #ddd", position: "relative" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 20 }}>
                <h2 style={{ margin: 0 }}>New Booking</h2>
                <X style={{ cursor: "pointer" }} onClick={() => navigate("/bookings")} />
            </div>

            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 15 }}>
                <div className="form-group">
                    <label>Name</label>
                    <input name="name" className="input-field" value={formData.name} onChange={handleChange} required />
                </div>

                <div className="form-group">
                    <label>Mobile Number</label>
                    <input name="phone" className="input-field" value={formData.phone} onChange={handleChange} required />
                </div>

                <div className="form-group">
                    <label>Email</label>
                    <input name="email" className="input-field" value={formData.email} onChange={handleChange} />
                </div>

                <div className="row">
                    <div className="form-group half">
                        <label>Joining date</label>
                        <input type="date" name="joiningDate" className="input-field" value={formData.joiningDate} onChange={handleChange} required />
                    </div>
                    <div className="form-group half">
                        <label>Booking Amount</label>
                        <input type="number" name="amount" className="input-field" value={formData.amount} onChange={handleChange} required />
                    </div>
                </div>
                <div className="form-group">
                    <label>Property (Internal)</label>
                    <select name="property" className="input-field" value={formData.property} onChange={handleChange} required>
                        <option value="">Select Property</option>
                        {properties.map(p => <option key={p._id} value={p._id}>{p.name}</option>)}
                    </select>
                </div>

                <div className="form-group">
                    <label>Comments</label>
                    <textarea name="comments" className="input-field" value={formData.comments} onChange={handleChange} rows={3} />
                </div>

                <div style={{ display: "flex", justifyContent: "center", marginTop: 10 }}>
                    <button type="submit" className="add-btn" disabled={loading}>{loading ? "Adding..." : "Add"}</button>
                </div>
            </form>

            <style>{`
                    .form-group { display: flex; flexDirection: column; gap: 5px; }
                    .row { display: flex; gap: 20px; }
                    .half { flex: 1; }
                    .input-field { padding: 10px; border: 1px solid #777; border-radius: 6px; outline: none; font-size: 14px; }
                    .input-field:focus { border-color: #333; }
                    .add-btn { background: #e0e0e0; border: 1px solid #999; padding: 8px 30px; border-radius: 4px; cursor: pointer; font-weight: bold; color: #333; }
                    .add-btn:hover { background: #d0d0d0; }
                    label { font-size: 14px; font-weight: bold; color: #333; }
                `}</style>
        </div>
    );
};

export default NewBooking;
