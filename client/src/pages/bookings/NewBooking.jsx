import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";
import BackButton from "../../components/BackButton";

const NewBooking = () => {
    const navigate = useNavigate();
    const [properties, setProperties] = useState([]);
    const [formData, setFormData] = useState({
        name: "",
        phone: "",
        email: "",
        property: "",
        joiningDate: "",
        amount: ""
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
            alert("Booking created successfully");
            navigate("/bookings");
        } catch (error) {
            console.error(error);
            alert("Failed to create booking");
        }
    };

    return (
        <div>
            <BackButton />
            <h1>New Booking</h1>

            <form onSubmit={handleSubmit} style={{ maxWidth: 400, display: "flex", flexDirection: "column", gap: 15 }}>
                <input name="name" placeholder="Name" onChange={handleChange} required />
                <input name="phone" placeholder="Phone" onChange={handleChange} required />
                <input name="email" placeholder="Email" onChange={handleChange} />

                <select name="property" onChange={handleChange} required>
                    <option value="">Select Property</option>
                    {properties.map(p => <option key={p._id} value={p._id}>{p.name}</option>)}
                </select>

                <label>Joining Date</label>
                <input type="date" name="joiningDate" onChange={handleChange} required />

                <input type="number" name="amount" placeholder="Advance Amount" onChange={handleChange} required />

                <button type="submit">Create Booking</button>
            </form>
        </div>
    );
};

export default NewBooking;
