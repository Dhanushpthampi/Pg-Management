import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../api/axios";
import BackButton from "../../components/BackButton";

const EditProperty = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [formData, setFormData] = useState({
        name: "",
        address: "",
        city: "",
        state: "",
        pincode: "",
        contactPerson: "",
        contactPhone: "",
        status: "active"
    });

    useEffect(() => {
        const fetchProperty = async () => {
            try {
                const { data } = await api.get(`/properties/${id}`);
                setFormData(data);
            } catch (err) {
                console.error(err);
                alert("Failed to fetch property details");
            }
        };
        fetchProperty();
    }, [id]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.put(`/properties/${id}`, formData);
            alert("Property updated successfully");
            navigate("/properties");
        } catch (error) {
            console.error(error);
            alert("Failed to update property");
        }
    };

    const handleDelete = async () => {
        if (window.confirm("Are you sure you want to deactivate this property?")) {
            try {
                await api.delete(`/properties/${id}`);
                alert("Property deactivated");
                navigate("/properties");
            } catch (err) {
                console.error(err);
                alert("Failed to delete property");
            }
        }
    };

    return (
        <div>
            <BackButton />
            <h1>Edit Property</h1>

            <form onSubmit={handleSubmit} style={{ maxWidth: 500, display: "flex", flexDirection: "column", gap: 15 }}>
                <input name="name" placeholder="Property Name" value={formData.name} onChange={handleChange} required />
                <input name="address" placeholder="Address" value={formData.address} onChange={handleChange} required />
                <input name="city" placeholder="City" value={formData.city} onChange={handleChange} required />
                <input name="state" placeholder="State" value={formData.state} onChange={handleChange} required />
                <input name="pincode" placeholder="Pincode" value={formData.pincode} onChange={handleChange} required />
                <input name="contactPerson" placeholder="Contact Person" value={formData.contactPerson} onChange={handleChange} />
                <input name="contactPhone" placeholder="Contact Phone" value={formData.contactPhone} onChange={handleChange} />

                <select name="status" value={formData.status} onChange={handleChange}>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                </select>

                <div style={{ display: 'flex', gap: '10px' }}>
                    <button type="submit">Update Property</button>
                    <button type="button" onClick={handleDelete} style={{ backgroundColor: '#ff4444', color: 'white' }}>
                        Delete Property
                    </button>
                </div>
            </form>
        </div>
    );
};

export default EditProperty;
