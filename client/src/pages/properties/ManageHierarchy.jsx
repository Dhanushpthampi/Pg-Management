import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../api/axios";
import BackButton from "../../components/BackButton";

const ManageHierarchy = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [property, setProperty] = useState(null);
    const [blocks, setBlocks] = useState([]);
    const [activeTab, setActiveTab] = useState("blocks");

    // Form states
    const [blockForm, setBlockForm] = useState({ name: "" });
    const [floorForm, setFloorForm] = useState({ name: "", blockId: "" });
    const [roomForm, setRoomForm] = useState({ number: "", floorId: "", sharingType: "single" });
    const [bedForm, setBedForm] = useState({ roomId: "", count: 1, startNumber: 1 });

    useEffect(() => {
        fetchData();
    }, [id]);

    const fetchData = async () => {
        try {
            const [propRes, blocksRes] = await Promise.all([
                api.get(`/properties/${id}`),
                api.get(`/hierarchy/properties/${id}/blocks`)
            ]);
            setProperty(propRes.data);
            setBlocks(blocksRes.data);
        } catch (err) {
            console.error(err);
        }
    };

    const addBlock = async (e) => {
        e.preventDefault();
        try {
            await api.post("/hierarchy/blocks", { ...blockForm, property: id });
            alert("Block added successfully");
            setBlockForm({ name: "" });
            fetchData();
        } catch (err) {
            console.error(err);
            alert("Failed to add block");
        }
    };

    const addFloor = async (e) => {
        e.preventDefault();
        try {
            await api.post("/hierarchy/floors", { ...floorForm, block: floorForm.blockId });
            alert("Floor added successfully");
            setFloorForm({ name: "", blockId: "" });
            fetchData();
        } catch (err) {
            console.error(err);
            alert("Failed to add floor");
        }
    };

    const addRoom = async (e) => {
        e.preventDefault();
        try {
            await api.post("/hierarchy/rooms", { ...roomForm, floor: roomForm.floorId });
            alert("Room added successfully");
            setRoomForm({ number: "", floorId: "", sharingType: "single" });
            fetchData();
        } catch (err) {
            console.error(err);
            alert("Failed to add room");
        }
    };

    const addBeds = async (e) => {
        e.preventDefault();
        try {
            await api.post("/hierarchy/beds/bulk", bedForm);
            alert(`${bedForm.count} beds added successfully`);
            setBedForm({ roomId: "", count: 1, startNumber: 1 });
            fetchData();
        } catch (err) {
            console.error(err);
            alert("Failed to add beds");
        }
    };

    return (
        <div>
            <BackButton />
            <h1>Manage Hierarchy - {property?.name}</h1>

            <div style={{ marginBottom: 20 }}>
                <button onClick={() => navigate(`/properties/${id}/beds`)} style={{ padding: 10, marginRight: 10 }}>
                    View Bed Structure
                </button>
            </div>

            {/* Tabs */}
            <div style={{ display: "flex", gap: 10, marginBottom: 20, borderBottom: "2px solid #ddd" }}>
                {["blocks", "floors", "rooms", "beds"].map(tab => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        style={{
                            padding: "10px 20px",
                            border: "none",
                            borderBottom: activeTab === tab ? "3px solid #2196F3" : "none",
                            backgroundColor: activeTab === tab ? "#e3f2fd" : "transparent",
                            cursor: "pointer",
                            fontWeight: activeTab === tab ? "bold" : "normal"
                        }}
                    >
                        {tab.charAt(0).toUpperCase() + tab.slice(1)}
                    </button>
                ))}
            </div>

            {/* Add Block */}
            {activeTab === "blocks" && (
                <div style={{ maxWidth: 500 }}>
                    <h2>Add Block</h2>
                    <form onSubmit={addBlock} style={{ display: "flex", flexDirection: "column", gap: 15 }}>
                        <input
                            type="text"
                            placeholder="Block Name (e.g., A, B, Main)"
                            value={blockForm.name}
                            onChange={(e) => setBlockForm({ name: e.target.value })}
                            required
                        />
                        <button type="submit">Add Block</button>
                    </form>

                    <h3 style={{ marginTop: 30 }}>Existing Blocks:</h3>
                    <ul>
                        {blocks.map(block => <li key={block._id}>{block.name}</li>)}
                    </ul>
                </div>
            )}

            {/* Add Floor */}
            {activeTab === "floors" && (
                <div style={{ maxWidth: 500 }}>
                    <h2>Add Floor</h2>
                    <form onSubmit={addFloor} style={{ display: "flex", flexDirection: "column", gap: 15 }}>
                        <select
                            value={floorForm.blockId}
                            onChange={(e) => setFloorForm({ ...floorForm, blockId: e.target.value })}
                            required
                        >
                            <option value="">Select Block</option>
                            {blocks.map(block => <option key={block._id} value={block._id}>{block.name}</option>)}
                        </select>
                        <input
                            type="text"
                            placeholder="Floor Name (e.g., Ground Floor, 1st Floor)"
                            value={floorForm.name}
                            onChange={(e) => setFloorForm({ ...floorForm, name: e.target.value })}
                            required
                        />
                        <button type="submit">Add Floor</button>
                    </form>
                </div>
            )}

            {/* Add Room */}
            {activeTab === "rooms" && (
                <div style={{ maxWidth: 500 }}>
                    <h2>Add Room</h2>
                    <form onSubmit={addRoom} style={{ display: "flex", flexDirection: "column", gap: 15 }}>
                        <select
                            value={floorForm.blockId}
                            onChange={(e) => setFloorForm({ ...floorForm, blockId: e.target.value })}
                            required
                        >
                            <option value="">Select Block First</option>
                            {blocks.map(block => <option key={block._id} value={block._id}>{block.name}</option>)}
                        </select>

                        {floorForm.blockId && (
                            <select
                                value={roomForm.floorId}
                                onChange={(e) => setRoomForm({ ...roomForm, floorId: e.target.value })}
                                required
                            >
                                <option value="">Select Floor</option>
                                {/* You'd need to fetch floors for selected block */}
                            </select>
                        )}

                        <input
                            type="text"
                            placeholder="Room Number (e.g., 101, 102)"
                            value={roomForm.number}
                            onChange={(e) => setRoomForm({ ...roomForm, number: e.target.value })}
                            required
                        />

                        <select
                            value={roomForm.sharingType}
                            onChange={(e) => setRoomForm({ ...roomForm, sharingType: e.target.value })}
                        >
                            <option value="single">Single</option>
                            <option value="double">Double</option>
                            <option value="triple">Triple</option>
                            <option value="four">Four Sharing</option>
                        </select>

                        <button type="submit">Add Room</button>
                    </form>
                </div>
            )}

            {/* Add Beds */}
            {activeTab === "beds" && (
                <div style={{ maxWidth: 500 }}>
                    <h2>Add Beds (Bulk)</h2>
                    <form onSubmit={addBeds} style={{ display: "flex", flexDirection: "column", gap: 15 }}>
                        <p style={{ color: "#666" }}>Select a room and specify how many beds to create</p>

                        <input
                            type="text"
                            placeholder="Room ID (get from hierarchy)"
                            value={bedForm.roomId}
                            onChange={(e) => setBedForm({ ...bedForm, roomId: e.target.value })}
                            required
                        />

                        <input
                            type="number"
                            placeholder="Number of Beds"
                            value={bedForm.count}
                            onChange={(e) => setBedForm({ ...bedForm, count: parseInt(e.target.value) })}
                            min="1"
                            required
                        />

                        <input
                            type="number"
                            placeholder="Start Bed Number"
                            value={bedForm.startNumber}
                            onChange={(e) => setBedForm({ ...bedForm, startNumber: parseInt(e.target.value) })}
                            min="1"
                            required
                        />

                        <button type="submit">Add Beds</button>
                    </form>
                </div>
            )}
        </div>
    );
};

export default ManageHierarchy;
