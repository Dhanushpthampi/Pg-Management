import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import api from "../../api/axios";
import BackButton from "../../components/BackButton";

const ManageProperty = () => {
    const { id } = useParams();
    const [property, setProperty] = useState(null);
    const [hierarchy, setHierarchy] = useState([]);
    const [activeTab, setActiveTab] = useState("view");
    const [selectedBed, setSelectedBed] = useState(null);
    const [showBedModal, setShowBedModal] = useState(false);

    // Filters
    const [filters, setFilters] = useState({ sharing: "", status: "" });

    // Form states
    const [blockForm, setBlockForm] = useState({ name: "" });
    const [floorForm, setFloorForm] = useState({ name: "", blockId: "" });
    const [roomForm, setRoomForm] = useState({ number: "", floorId: "", sharingType: "single", blockId: "" });
    const [bedForm, setBedForm] = useState({ roomId: "", count: 1, startNumber: 1 });

    // Dropdown data
    const [blocks, setBlocks] = useState([]);
    const [floors, setFloors] = useState([]);
    const [rooms, setRooms] = useState([]);

    useEffect(() => {
        fetchData();
    }, [id]);

    const fetchData = async () => {
        try {
            const [propRes, hierRes, blocksRes] = await Promise.all([
                api.get(`/properties/${id}`),
                api.get(`/hierarchy/properties/${id}/hierarchy`),
                api.get(`/hierarchy/properties/${id}/blocks`)
            ]);
            setProperty(propRes.data);
            setHierarchy(hierRes.data);
            setBlocks(blocksRes.data);
        } catch (err) {
            console.error(err);
        }
    };

    const fetchFloors = async (blockId) => {
        try {
            const { data } = await api.get(`/hierarchy/blocks/${blockId}/floors`);
            setFloors(data);
        } catch (err) {
            console.error(err);
        }
    };

    const fetchRooms = async (floorId) => {
        try {
            const { data } = await api.get(`/hierarchy/floors/${floorId}/rooms`);
            setRooms(data);
        } catch (err) {
            console.error(err);
        }
    };

    // Add Block
    const addBlock = async (e) => {
        e.preventDefault();
        try {
            await api.post("/hierarchy/blocks", { ...blockForm, property: id });
            alert("Block added successfully");
            setBlockForm({ name: "" });
            fetchData();
        } catch (err) {
            console.error(err);
            alert("Failed to add block: " + (err.response?.data?.message || err.message));
        }
    };

    // Add Floor
    const addFloor = async (e) => {
        e.preventDefault();
        try {
            await api.post("/hierarchy/floors", { name: floorForm.name, block: floorForm.blockId });
            alert("Floor added successfully");
            setFloorForm({ name: "", blockId: "" });
            fetchData();
            if (floorForm.blockId) fetchFloors(floorForm.blockId);
        } catch (err) {
            console.error(err);
            alert("Failed to add floor: " + (err.response?.data?.message || err.message));
        }
    };

    // Add Room
    const addRoom = async (e) => {
        e.preventDefault();
        try {
            await api.post("/hierarchy/rooms", {
                number: roomForm.number,
                floor: roomForm.floorId,
                sharingType: roomForm.sharingType
            });
            alert("Room added successfully");
            setRoomForm({ number: "", floorId: "", sharingType: "single", blockId: "" });
            fetchData();
        } catch (err) {
            console.error(err);
            alert("Failed to add room: " + (err.response?.data?.message || err.message));
        }
    };

    // Add Beds
    const addBeds = async (e) => {
        e.preventDefault();
        try {
            await api.post("/hierarchy/beds/bulk", bedForm);
            alert(`${bedForm.count} beds added successfully`);
            setBedForm({ roomId: "", count: 1, startNumber: 1 });
            fetchData();
        } catch (err) {
            console.error(err);
            alert("Failed to add beds: " + (err.response?.data?.message || err.message));
        }
    };

    const getBedColor = (status) => {
        const colors = {
            available: "#4CAF50",
            occupied: "#F44336",
            booked: "#FFC107",
            notice: "#FF9800",
            maintenance: "#9E9E9E"
        };
        return colors[status] || "#ccc";
    };

    const handleBedClick = (bed, room) => {
        setSelectedBed({ ...bed, roomNumber: room.number });
        setShowBedModal(true);
    };

    const updateBedStatus = async (newStatus) => {
        try {
            await api.put(`/hierarchy/beds/${selectedBed._id}/status`, { status: newStatus });
            setShowBedModal(false);
            fetchData();
            alert("Bed status updated");
        } catch (err) {
            console.error(err);
            alert("Failed to update bed status");
        }
    };

    const getFilteredHierarchy = () => {
        if (!filters.sharing && !filters.status) return hierarchy;

        return hierarchy.map(block => ({
            ...block,
            floors: block.floors.map(floor => ({
                ...floor,
                rooms: floor.rooms.filter(room => {
                    const matchSharing = !filters.sharing || room.sharingType === filters.sharing;
                    const matchStatus = !filters.status || room.beds.some(bed => bed.status === filters.status);
                    return matchSharing && matchStatus;
                }).map(room => ({
                    ...room,
                    beds: !filters.status ? room.beds : room.beds.filter(bed => bed.status === filters.status)
                }))
            }))
        })).filter(block => block.floors.some(floor => floor.rooms.length > 0));
    };

    const filteredHierarchy = getFilteredHierarchy();

    const getStats = () => {
        let total = 0, available = 0, occupied = 0, booked = 0;
        hierarchy.forEach(block => {
            block.floors?.forEach(floor => {
                floor.rooms?.forEach(room => {
                    room.beds?.forEach(bed => {
                        total++;
                        if (bed.status === 'available') available++;
                        if (bed.status === 'occupied') occupied++;
                        if (bed.status === 'booked') booked++;
                    });
                });
            });
        });
        return { total, available, occupied, booked };
    };

    const stats = hierarchy.length > 0 ? getStats() : { total: 0, available: 0, occupied: 0, booked: 0 };

    return (
        <div>
            <BackButton />
            <h1>Manage Property - {property?.name}</h1>

            {/* Tabs */}
            <div style={{ display: "flex", gap: 10, marginBottom: 20, borderBottom: "2px solid #ddd", flexWrap: "wrap" }}>
                {["view", "blocks", "floors", "rooms", "beds"].map(tab => (
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
                        {tab === "view" ? "View Beds" : tab.charAt(0).toUpperCase() + tab.slice(1)}
                    </button>
                ))}
            </div>

            {/* VIEW BEDS TAB */}
            {activeTab === "view" && (
                <div>
                    {/* Stats Dashboard */}
                    <div style={{ display: "flex", gap: 20, marginBottom: 30, flexWrap: "wrap" }}>
                        <div style={{ padding: 20, border: "2px solid #2196F3", borderRadius: 8, minWidth: 150 }}>
                            <h3 style={{ margin: 0, color: "#2196F3" }}>Total Beds</h3>
                            <p style={{ fontSize: 32, fontWeight: "bold", margin: "10px 0 0 0" }}>{stats.total}</p>
                        </div>
                        <div style={{ padding: 20, border: "2px solid #4CAF50", borderRadius: 8, minWidth: 150 }}>
                            <h3 style={{ margin: 0, color: "#4CAF50" }}>Available</h3>
                            <p style={{ fontSize: 32, fontWeight: "bold", margin: "10px 0 0 0" }}>{stats.available}</p>
                        </div>
                        <div style={{ padding: 20, border: "2px solid #F44336", borderRadius: 8, minWidth: 150 }}>
                            <h3 style={{ margin: 0, color: "#F44336" }}>Occupied</h3>
                            <p style={{ fontSize: 32, fontWeight: "bold", margin: "10px 0 0 0" }}>{stats.occupied}</p>
                        </div>
                        <div style={{ padding: 20, border: "2px solid #FFC107", borderRadius: 8, minWidth: 150 }}>
                            <h3 style={{ margin: 0, color: "#FFC107" }}>Booked</h3>
                            <p style={{ fontSize: 32, fontWeight: "bold", margin: "10px 0 0 0" }}>{stats.booked}</p>
                        </div>
                    </div>

                    {/* Filters */}
                    <div style={{ display: "flex", gap: 15, marginBottom: 30 }}>
                        <select
                            value={filters.sharing}
                            onChange={(e) => setFilters({ ...filters, sharing: e.target.value })}
                            style={{ padding: 10, borderRadius: 4 }}
                        >
                            <option value="">All Sharing Types</option>
                            <option value="single">Single</option>
                            <option value="double">Double</option>
                            <option value="triple">Triple</option>
                            <option value="four">Four Sharing</option>
                        </select>
                        <select
                            value={filters.status}
                            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                            style={{ padding: 10, borderRadius: 4 }}
                        >
                            <option value="">All Status</option>
                            <option value="available">Available</option>
                            <option value="occupied">Occupied</option>
                            <option value="booked">Booked</option>
                            <option value="notice">On Notice</option>
                            <option value="maintenance">Maintenance</option>
                        </select>
                    </div>

                    {/* Hierarchy Visualization */}
                    {filteredHierarchy.map((block) => (
                        <div key={block._id} style={{ marginBottom: 40, border: "2px solid #ddd", padding: 20, borderRadius: 8 }}>
                            <h2 style={{ margin: "0 0 20px 0", color: "#333", borderBottom: "2px solid #2196F3", paddingBottom: 10 }}>
                                🏢 Block: {block.name}
                            </h2>

                            {block.floors?.map(floor => (
                                <div key={floor._id} style={{ marginLeft: 20, marginBottom: 30 }}>
                                    <h3 style={{ color: "#555", marginBottom: 15 }}>📍 {floor.name}</h3>

                                    <div style={{ display: "flex", flexWrap: "wrap", gap: 20 }}>
                                        {floor.rooms?.map(room => (
                                            <div
                                                key={room._id}
                                                style={{
                                                    border: "1px solid #ccc",
                                                    borderRadius: 8,
                                                    padding: 15,
                                                    backgroundColor: "#f9f9f9",
                                                    minWidth: 200
                                                }}
                                            >
                                                <h4 style={{ margin: "0 0 10px 0", color: "#333" }}>🚪 Room {room.number}</h4>
                                                <p style={{ margin: "0 0 10px 0", fontSize: 12, color: "#666" }}>
                                                    {room.sharingType || "N/A"} Sharing
                                                </p>

                                                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                                                    {room.beds?.map((bed) => (
                                                        <div
                                                            key={bed._id}
                                                            onClick={() => handleBedClick(bed, room)}
                                                            style={{
                                                                width: 70,
                                                                height: 70,
                                                                backgroundColor: getBedColor(bed.status),
                                                                color: "#fff",
                                                                display: "flex",
                                                                flexDirection: "column",
                                                                alignItems: "center",
                                                                justifyContent: "center",
                                                                cursor: "pointer",
                                                                fontSize: 14,
                                                                fontWeight: "bold",
                                                                borderRadius: 8,
                                                                border: "2px solid #fff",
                                                                boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
                                                                transition: "transform 0.2s",
                                                            }}
                                                            onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.1)"}
                                                            onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
                                                            title={`Bed ${bed.number} - ${bed.status}`}
                                                        >
                                                            <span>🛏️</span>
                                                            <span>{bed.number}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ))}

                    {/* Legend */}
                    <div style={{ marginTop: 40, padding: 20, backgroundColor: "#f5f5f5", borderRadius: 8 }}>
                        <strong style={{ fontSize: 18 }}>Legend:</strong>
                        <div style={{ display: "flex", gap: 20, marginTop: 15, flexWrap: "wrap" }}>
                            <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                <div style={{ width: 20, height: 20, backgroundColor: "#4CAF50", borderRadius: 4 }}></div>
                                Available
                            </span>
                            <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                <div style={{ width: 20, height: 20, backgroundColor: "#F44336", borderRadius: 4 }}></div>
                                Occupied
                            </span>
                            <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                <div style={{ width: 20, height: 20, backgroundColor: "#FFC107", borderRadius: 4 }}></div>
                                Booked
                            </span>
                            <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                <div style={{ width: 20, height: 20, backgroundColor: "#FF9800", borderRadius: 4 }}></div>
                                On Notice
                            </span>
                            <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                <div style={{ width: 20, height: 20, backgroundColor: "#9E9E9E", borderRadius: 4 }}></div>
                                Maintenance
                            </span>
                        </div>
                    </div>
                </div>
            )}

            {/* ADD BLOCKS TAB */}
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

            {/* ADD FLOORS TAB */}
            {activeTab === "floors" && (
                <div style={{ maxWidth: 500 }}>
                    <h2>Add Floor</h2>
                    <form onSubmit={addFloor} style={{ display: "flex", flexDirection: "column", gap: 15 }}>
                        <select
                            value={floorForm.blockId}
                            onChange={(e) => {
                                setFloorForm({ ...floorForm, blockId: e.target.value });
                                fetchFloors(e.target.value);
                            }}
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

                    {floorForm.blockId && (
                        <>
                            <h3 style={{ marginTop: 30 }}>Existing Floors in Selected Block:</h3>
                            <ul>
                                {floors.map(floor => <li key={floor._id}>{floor.name}</li>)}
                            </ul>
                        </>
                    )}
                </div>
            )}

            {/* ADD ROOMS TAB */}
            {activeTab === "rooms" && (
                <div style={{ maxWidth: 500 }}>
                    <h2>Add Room</h2>
                    <form onSubmit={addRoom} style={{ display: "flex", flexDirection: "column", gap: 15 }}>
                        <select
                            value={roomForm.blockId}
                            onChange={(e) => {
                                setRoomForm({ ...roomForm, blockId: e.target.value, floorId: "" });
                                fetchFloors(e.target.value);
                            }}
                            required
                        >
                            <option value="">Select Block First</option>
                            {blocks.map(block => <option key={block._id} value={block._id}>{block.name}</option>)}
                        </select>

                        {roomForm.blockId && (
                            <select
                                value={roomForm.floorId}
                                onChange={(e) => {
                                    setRoomForm({ ...roomForm, floorId: e.target.value });
                                    fetchRooms(e.target.value);
                                }}
                                required
                            >
                                <option value="">Select Floor</option>
                                {floors.map(floor => <option key={floor._id} value={floor._id}>{floor.name}</option>)}
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

                    {roomForm.floorId && (
                        <>
                            <h3 style={{ marginTop: 30 }}>Existing Rooms in Selected Floor:</h3>
                            <ul>
                                {rooms.map(room => <li key={room._id}>Room {room.number} ({room.sharingType})</li>)}
                            </ul>
                        </>
                    )}
                </div>
            )}

            {/* ADD BEDS TAB */}
            {activeTab === "beds" && (
                <div style={{ maxWidth: 500 }}>
                    <h2>Add Beds (Bulk)</h2>
                    <form onSubmit={addBeds} style={{ display: "flex", flexDirection: "column", gap: 15 }}>
                        <p style={{ color: "#666" }}>Select block, floor, and room to add beds</p>

                        <select
                            onChange={(e) => {
                                fetchFloors(e.target.value);
                                setBedForm({ ...bedForm, roomId: "" });
                            }}
                        >
                            <option value="">Select Block</option>
                            {blocks.map(block => <option key={block._id} value={block._id}>{block.name}</option>)}
                        </select>

                        <select
                            onChange={(e) => {
                                fetchRooms(e.target.value);
                                setBedForm({ ...bedForm, roomId: "" });
                            }}
                        >
                            <option value="">Select Floor</option>
                            {floors.map(floor => <option key={floor._id} value={floor._id}>{floor.name}</option>)}
                        </select>

                        <select
                            value={bedForm.roomId}
                            onChange={(e) => setBedForm({ ...bedForm, roomId: e.target.value })}
                            required
                        >
                            <option value="">Select Room</option>
                            {rooms.map(room => <option key={room._id} value={room._id}>Room {room.number}</option>)}
                        </select>

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

            {/* Bed Action Modal */}
            {showBedModal && selectedBed && (
                <div style={{
                    position: "fixed",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: "rgba(0,0,0,0.5)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    zIndex: 1000
                }}>
                    <div style={{
                        backgroundColor: "#fff",
                        padding: 30,
                        borderRadius: 12,
                        minWidth: 400,
                        boxShadow: "0 4px 20px rgba(0,0,0,0.3)"
                    }}>
                        <h2 style={{ marginTop: 0 }}>Bed {selectedBed.number} - Room {selectedBed.roomNumber}</h2>
                        <p><strong>Current Status:</strong> <span style={{ color: getBedColor(selectedBed.status), fontWeight: "bold" }}>{selectedBed.status.toUpperCase()}</span></p>
                        {selectedBed.tenant && <p><strong>Tenant:</strong> {selectedBed.tenant.name}</p>}

                        <h3 style={{ marginTop: 20 }}>Change Status:</h3>
                        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                            <button onClick={() => updateBedStatus("available")} style={{ padding: 10, backgroundColor: "#4CAF50", color: "#fff", border: "none", borderRadius: 4, cursor: "pointer" }}>
                                Mark as Available
                            </button>
                            <button onClick={() => updateBedStatus("booked")} style={{ padding: 10, backgroundColor: "#FFC107", color: "#fff", border: "none", borderRadius: 4, cursor: "pointer" }}>
                                Mark as Booked
                            </button>
                            <button onClick={() => updateBedStatus("maintenance")} style={{ padding: 10, backgroundColor: "#9E9E9E", color: "#fff", border: "none", borderRadius: 4, cursor: "pointer" }}>
                                Mark as Maintenance
                            </button>
                            <button onClick={() => setShowBedModal(false)} style={{ padding: 10, backgroundColor: "#666", color: "#fff", border: "none", borderRadius: 4, cursor: "pointer", marginTop: 10 }}>
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ManageProperty;
