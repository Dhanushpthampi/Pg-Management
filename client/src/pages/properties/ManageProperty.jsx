import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import api from "../../api/axios";
import BackButton from "../../components/BackButton";

const ManageProperty = () => {
    const { id } = useParams();
    const [property, setProperty] = useState(null);
    const [hierarchy, setHierarchy] = useState([]);
    const [selectedSharing, setSelectedSharing] = useState("");
    const [selectedBed, setSelectedBed] = useState(null);
    const [showBedModal, setShowBedModal] = useState(false);
    const [showAddModal, setShowAddModal] = useState(null); // 'block', 'floor', 'room', 'bed'

    // Form states
    const [blockForm, setBlockForm] = useState({ name: "" });
    const [floorForm, setFloorForm] = useState({ name: "", blockId: "" });
    const [roomForm, setRoomForm] = useState({ number: "", floorId: "", sharingType: "single", blockId: "", rent: "", deposit: "" });
    const [bedForm, setBedForm] = useState({ roomId: "", count: 1, startNumber: 1, blockId: "", floorId: "" });

    // Dropdown data
    const [blocks, setBlocks] = useState([]);
    const [floors, setFloors] = useState([]);
    const [rooms, setRooms] = useState([]);

    // Selected filters
    const [selectedBlock, setSelectedBlock] = useState("");
    const [selectedFloor, setSelectedFloor] = useState("");
    const [selectedRoom, setSelectedRoom] = useState("");

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

    // Add handlers
    const addBlock = async (e) => {
        e.preventDefault();
        try {
            await api.post("/hierarchy/blocks", { ...blockForm, property: id });
            alert("Block added successfully");
            setBlockForm({ name: "" });
            setShowAddModal(null);
            fetchData();
        } catch (err) {
            console.error(err);
            alert("Failed to add block: " + (err.response?.data?.message || err.message));
        }
    };

    const addFloor = async (e) => {
        e.preventDefault();
        try {
            await api.post("/hierarchy/floors", {
                name: floorForm.name,
                block: floorForm.blockId,
                property: id
            });
            alert("Floor added successfully");

            // Auto-select the block we added to, so the user sees the new floor immediately
            setSelectedBlock(floorForm.blockId);
            fetchFloors(floorForm.blockId);

            setFloorForm({ name: "", blockId: "" });
            setShowAddModal(null);
            fetchData();
        } catch (err) {
            console.error(err);
            alert("Failed to add floor: " + (err.response?.data?.message || err.message));
        }
    };

    const addRoom = async (e) => {
        e.preventDefault();
        try {
            await api.post("/hierarchy/rooms", {
                number: roomForm.number,
                floor: roomForm.floorId,
                block: roomForm.blockId,
                property: id,
                rent: Number(roomForm.rent),
                deposit: Number(roomForm.deposit),
                sharingType: roomForm.sharingType
            });
            alert("Room added successfully");

            // Auto-select the floor we added to, so the user sees the new room immediately
            setSelectedFloor(roomForm.floorId);
            fetchRooms(roomForm.floorId);

            setRoomForm({ number: "", floorId: "", sharingType: "single", blockId: "", rent: "", deposit: "" });
            setShowAddModal(null);
            fetchData();
        } catch (err) {
            console.error(err);
            alert("Failed to add room: " + (err.response?.data?.message || err.message));
        }
    };

    const addBeds = async (e) => {
        e.preventDefault();
        try {
            await api.post("/hierarchy/beds/bulk", bedForm);
            alert(`${bedForm.count} beds added successfully`);

            // Auto-select the room we added to, so users see the beds
            setSelectedRoom(bedForm.roomId);
            // Fetch rooms to get updated bed data
            // We need to know the floor of the room to fetchRooms(floorId)
            // But bedForm doesn't have floorId easily available unless we looked it up.
            // But we can just use selectedFloor if it's set? No, user might have changed it in modal.

            // For now, let's just refresh current view if possible.
            if (selectedFloor) fetchRooms(selectedFloor);


            setBedForm({ roomId: "", count: 1, startNumber: 1 });
            setShowAddModal(null);
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
            booked: "#2196F3",
            notice: "#FFC107",
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

    const sharingTypes = ["No sharing", "1 sharing", "2 sharing", "3 sharing", "4 sharing", "5 sharing", "6 sharing"];

    const buttonStyle = (isActive) => ({
        padding: "10px 20px",
        border: "1px solid #ddd",
        borderRadius: "20px",
        backgroundColor: isActive ? "#2196F3" : "#fff",
        color: isActive ? "#fff" : "#333",
        cursor: "pointer",
        fontSize: "14px"
    });

    const cardStyle = {
        border: "1px solid #ddd",
        borderRadius: "12px",
        padding: "20px",
        backgroundColor: "#fff",
        minWidth: "160px"
    };

    const getGridItemStyle = (isActive) => ({
        border: isActive ? "2px solid #2196F3" : "1px solid #333",
        borderRadius: "8px",
        padding: "15px 20px",
        textAlign: "center",
        cursor: "pointer",
        fontSize: "16px",
        fontWeight: "500",
        backgroundColor: isActive ? "#E3F2FD" : "#fff",
        minWidth: "60px",
        color: isActive ? "#1565C0" : "inherit"
    });

    const addButtonStyle = {
        width: "40px",
        height: "40px",
        borderRadius: "50%",
        border: "2px solid #333",
        backgroundColor: "#fff",
        fontSize: "24px",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
    };

    return (
        <div style={{ padding: "20px", maxWidth: "1200px", margin: "0 auto" }}>
            <BackButton />
            <h1 style={{ paddingBottom: "20px" }}>Bed Availability - {property?.name}</h1>

            {/* Sharing Type Filters */}

            {/* <div style={{ display: "flex", gap: "10px", marginBottom: "20px", flexWrap: "wrap" }}>
                {sharingTypes.map(type => (
                    <button
                        key={type}
                        onClick={() => setSelectedSharing(selectedSharing === type ? "" : type)}
                        style={buttonStyle(selectedSharing === type)}
                    >
                        {type}
                    </button>
                ))}
            </div> */}

            {/* Status Legend */}
            <div style={{ display: "flex", gap: "20px", marginBottom: "30px", alignItems: "center" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <div style={{ width: "16px", height: "16px", backgroundColor: "#4CAF50", borderRadius: "50%" }}></div>
                    <span>Available</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <div style={{ width: "16px", height: "16px", backgroundColor: "#F44336", borderRadius: "50%" }}></div>
                    <span>Occupied</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <div style={{ width: "16px", height: "16px", backgroundColor: "#FFC107", borderRadius: "50%" }}></div>
                    <span>Notice</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <div style={{ width: "16px", height: "16px", backgroundColor: "#2196F3", borderRadius: "50%" }}></div>
                    <span>Booked</span>
                </div>
            </div>

            {/* Dropdown Selectors */}
            {/* <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "20px", marginBottom: "40px" }}>
                <div style={cardStyle}>
                    <h3 style={{ margin: "0 0 10px 0", fontSize: "16px" }}>Blocks</h3>
                    <select
                        value={selectedBlock}
                        onChange={(e) => {
                            setSelectedBlock(e.target.value);
                            setSelectedFloor("");
                            setSelectedRoom("");
                            if (e.target.value) fetchFloors(e.target.value);
                        }}
                        style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #ddd" }}
                    >
                        <option value="">Select a block</option>
                        {blocks.map(block => <option key={block._id} value={block._id}>{block.name}</option>)}
                    </select>
                </div>

                <div style={cardStyle}>
                    <h3 style={{ margin: "0 0 10px 0", fontSize: "16px" }}>Floors</h3>
                    <select
                        value={selectedFloor}
                        onChange={(e) => {
                            setSelectedFloor(e.target.value);
                            setSelectedRoom("");
                            if (e.target.value) fetchRooms(e.target.value);
                        }}
                        style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #ddd" }}
                        disabled={!selectedBlock}
                    >
                        <option value="">Select a floor</option>
                        {floors.map(floor => <option key={floor._id} value={floor._id}>{floor.name}</option>)}
                    </select>
                </div>

                <div style={cardStyle}>
                    <h3 style={{ margin: "0 0 10px 0", fontSize: "16px" }}>Rooms</h3>
                    <select
                        value={selectedRoom}
                        onChange={(e) => setSelectedRoom(e.target.value)}
                        style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #ddd" }}
                        disabled={!selectedFloor}
                    >
                        <option value="">Select a room</option>
                        {rooms.map(room => <option key={room._id} value={room._id}>Room {room.number}</option>)}
                    </select>
                </div>

                <div style={cardStyle}>
                    <h3 style={{ margin: "0 0 10px 0", fontSize: "16px" }}>Beds</h3>
                    <select
                        style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #ddd" }}
                        disabled={!selectedRoom}
                    >
                        <option value="">Select a room</option>
                    </select>
                </div>
            </div> */}

            {/* Grid Views */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "30px" }}>
                {/* Blocks Grid */}
                <div style={cardStyle}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "15px" }}>
                        <h3 style={{ margin: 0, fontSize: "18px" }}>Blocks</h3>
                        <button onClick={() => setShowAddModal('block')} style={addButtonStyle}>+</button>
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(100px, 1fr))", gap: "10px" }}>
                        {blocks.map(block => (
                            <div key={block._id} style={getGridItemStyle(selectedBlock === block._id)} onClick={() => {
                                setSelectedBlock(block._id);
                                setSelectedFloor(""); // Clear selected floor
                                setSelectedRoom(""); // Clear selected room
                                setRooms([]); // Clear rooms list
                                fetchFloors(block._id);
                            }}>
                                {block.name}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Floors Grid */}
                <div style={cardStyle}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "15px" }}>
                        <h3 style={{ margin: 0, fontSize: "18px" }}>Floors</h3>
                        <button onClick={() => {
                            setFloorForm(prev => ({ ...prev, blockId: selectedBlock }));
                            setShowAddModal('floor');
                        }} style={addButtonStyle}>+</button>
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "10px" }}>
                        {floors.map(floor => (
                            <div key={floor._id} style={getGridItemStyle(selectedFloor === floor._id)} onClick={() => {
                                setSelectedFloor(floor._id);
                                setSelectedRoom(""); // Clear selected room
                                fetchRooms(floor._id);
                            }}>
                                {floor.name}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Rooms Grid */}
                <div style={cardStyle}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "15px" }}>
                        <h3 style={{ margin: 0, fontSize: "18px" }}>Rooms</h3>
                        <button onClick={() => {
                            setRoomForm(prev => ({ ...prev, blockId: selectedBlock, floorId: selectedFloor }));
                            setShowAddModal('room');
                        }} style={addButtonStyle}>+</button>
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "10px" }}>
                        {rooms.map(room => (
                            <div key={room._id} style={getGridItemStyle(selectedRoom === room._id)} onClick={() => setSelectedRoom(room._id)}>
                                {room.number}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Beds Grid */}
                <div style={cardStyle}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "15px" }}>
                        <h3 style={{ margin: 0, fontSize: "18px" }}>Beds</h3>
                        <button onClick={() => {
                            setBedForm(prev => ({ ...prev, blockId: selectedBlock, floorId: selectedFloor, roomId: selectedRoom }));
                            setShowAddModal('bed');
                        }} style={addButtonStyle}>+</button>
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "10px" }}>
                        {selectedRoom && rooms.find(r => r._id === selectedRoom)?.beds?.map(bed => (
                            <div
                                key={bed._id}
                                style={{ ...getGridItemStyle(false), backgroundColor: getBedColor(bed.status), color: "#fff", border: "none" }}
                                onClick={() => handleBedClick(bed, rooms.find(r => r._id === selectedRoom))}
                            >
                                {bed.number}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Add Block Modal */}
            {showAddModal === 'block' && (
                <div style={{
                    position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
                    backgroundColor: "rgba(0,0,0,0.5)", display: "flex",
                    alignItems: "center", justifyContent: "center", zIndex: 1000
                }}>
                    <div style={{ backgroundColor: "#fff", padding: 30, borderRadius: 12, width: "90%", maxWidth: 400 }}>
                        <h2>Add Block</h2>
                        <form onSubmit={addBlock} style={{ display: "flex", flexDirection: "column", gap: 15 }}>
                            <input
                                type="text"
                                placeholder="Block Name (e.g., A, B, Main)"
                                value={blockForm.name}
                                onChange={(e) => setBlockForm({ name: e.target.value })}
                                required
                                style={{ padding: 10, borderRadius: 4, border: "1px solid #ddd" }}
                            />
                            <div style={{ display: "flex", gap: 10 }}>
                                <button type="submit" style={{ flex: 1, padding: 10, backgroundColor: "#2196F3", color: "#fff", border: "none", borderRadius: 4, cursor: "pointer" }}>Add</button>
                                <button type="button" onClick={() => setShowAddModal(null)} style={{ flex: 1, padding: 10, backgroundColor: "#666", color: "#fff", border: "none", borderRadius: 4, cursor: "pointer" }}>Cancel</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Add Floor Modal */}
            {showAddModal === 'floor' && (
                <div style={{
                    position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
                    backgroundColor: "rgba(0,0,0,0.5)", display: "flex",
                    alignItems: "center", justifyContent: "center", zIndex: 1000
                }}>
                    <div style={{ backgroundColor: "#fff", padding: 30, borderRadius: 12, minWidth: 400 }}>
                        <h2>Add Floor</h2>
                        <form onSubmit={addFloor} style={{ display: "flex", flexDirection: "column", gap: 15 }}>
                            <select
                                value={floorForm.blockId}
                                onChange={(e) => setFloorForm({ ...floorForm, blockId: e.target.value })}
                                required
                                style={{ padding: 10, borderRadius: 4, border: "1px solid #ddd" }}
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
                                style={{ padding: 10, borderRadius: 4, border: "1px solid #ddd" }}
                            />
                            <div style={{ display: "flex", gap: 10 }}>
                                <button type="submit" style={{ flex: 1, padding: 10, backgroundColor: "#2196F3", color: "#fff", border: "none", borderRadius: 4, cursor: "pointer" }}>Add</button>
                                <button type="button" onClick={() => setShowAddModal(null)} style={{ flex: 1, padding: 10, backgroundColor: "#666", color: "#fff", border: "none", borderRadius: 4, cursor: "pointer" }}>Cancel</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Add Room Modal */}
            {showAddModal === 'room' && (
                <div style={{
                    position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
                    backgroundColor: "rgba(0,0,0,0.5)", display: "flex",
                    alignItems: "center", justifyContent: "center", zIndex: 1000
                }}>
                    <div style={{ backgroundColor: "#fff", padding: 30, borderRadius: 12, minWidth: 400 }}>
                        <h2>Add Room</h2>
                        <form onSubmit={addRoom} style={{ display: "flex", flexDirection: "column", gap: 15 }}>
                            <select
                                value={roomForm.blockId}
                                onChange={(e) => {
                                    setRoomForm({ ...roomForm, blockId: e.target.value, floorId: "" });
                                    fetchFloors(e.target.value);
                                }}
                                required
                                style={{ padding: 10, borderRadius: 4, border: "1px solid #ddd" }}
                            >
                                <option value="">Select Block</option>
                                {blocks.map(block => <option key={block._id} value={block._id}>{block.name}</option>)}
                            </select>
                            {roomForm.blockId && (
                                <select
                                    value={roomForm.floorId}
                                    onChange={(e) => setRoomForm({ ...roomForm, floorId: e.target.value })}
                                    required
                                    style={{ padding: 10, borderRadius: 4, border: "1px solid #ddd" }}
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
                                style={{ padding: 10, borderRadius: 4, border: "1px solid #ddd" }}
                            />
                            <div style={{ display: "flex", gap: 10 }}>
                                <input
                                    type="number"
                                    placeholder="Rent"
                                    value={roomForm.rent}
                                    onChange={(e) => setRoomForm({ ...roomForm, rent: e.target.value })}
                                    required
                                    style={{ padding: 10, borderRadius: 4, border: "1px solid #ddd", flex: 1 }}
                                />
                                <input
                                    type="number"
                                    placeholder="Deposit"
                                    value={roomForm.deposit}
                                    onChange={(e) => setRoomForm({ ...roomForm, deposit: e.target.value })}
                                    required
                                    style={{ padding: 10, borderRadius: 4, border: "1px solid #ddd", flex: 1 }}
                                />
                            </div>
                            <select
                                value={roomForm.sharingType}
                                onChange={(e) => setRoomForm({ ...roomForm, sharingType: e.target.value })}
                                style={{ padding: 10, borderRadius: 4, border: "1px solid #ddd" }}
                            >
                                <option value="single">Single</option>
                                <option value="double">Double</option>
                                <option value="triple">Triple</option>
                                <option value="four">Four Sharing</option>
                            </select>
                            <div style={{ display: "flex", gap: 10 }}>
                                <button type="submit" style={{ flex: 1, padding: 10, backgroundColor: "#2196F3", color: "#fff", border: "none", borderRadius: 4, cursor: "pointer" }}>Add</button>
                                <button type="button" onClick={() => setShowAddModal(null)} style={{ flex: 1, padding: 10, backgroundColor: "#666", color: "#fff", border: "none", borderRadius: 4, cursor: "pointer" }}>Cancel</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Add Beds Modal */}
            {showAddModal === 'bed' && (
                <div style={{
                    position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
                    backgroundColor: "rgba(0,0,0,0.5)", display: "flex",
                    alignItems: "center", justifyContent: "center", zIndex: 1000
                }}>
                    <div style={{ backgroundColor: "#fff", padding: 30, borderRadius: 12, minWidth: 400 }}>
                        <h2>Add Beds (Bulk)</h2>
                        <form onSubmit={addBeds} style={{ display: "flex", flexDirection: "column", gap: 15 }}>
                            <select
                                value={bedForm.blockId}
                                onChange={(e) => {
                                    fetchFloors(e.target.value);
                                    setBedForm({ ...bedForm, blockId: e.target.value, floorId: "", roomId: "" });
                                }}
                                style={{ padding: 10, borderRadius: 4, border: "1px solid #ddd" }}
                            >
                                <option value="">Select Block</option>
                                {blocks.map(block => <option key={block._id} value={block._id}>{block.name}</option>)}
                            </select>
                            <select
                                value={bedForm.floorId}
                                onChange={(e) => {
                                    fetchRooms(e.target.value);
                                    setBedForm({ ...bedForm, floorId: e.target.value, roomId: "" });
                                }}
                                style={{ padding: 10, borderRadius: 4, border: "1px solid #ddd" }}
                            >
                                <option value="">Select Floor</option>
                                {floors.map(floor => <option key={floor._id} value={floor._id}>{floor.name}</option>)}
                            </select>
                            <select
                                value={bedForm.roomId}
                                onChange={(e) => setBedForm({ ...bedForm, roomId: e.target.value })}
                                required
                                style={{ padding: 10, borderRadius: 4, border: "1px solid #ddd" }}
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
                                style={{ padding: 10, borderRadius: 4, border: "1px solid #ddd" }}
                            />
                            <input
                                type="number"
                                placeholder="Start Bed Number"
                                value={bedForm.startNumber}
                                onChange={(e) => setBedForm({ ...bedForm, startNumber: parseInt(e.target.value) })}
                                min="1"
                                required
                                style={{ padding: 10, borderRadius: 4, border: "1px solid #ddd" }}
                            />
                            <div style={{ display: "flex", gap: 10 }}>
                                <button type="submit" style={{ flex: 1, padding: 10, backgroundColor: "#2196F3", color: "#fff", border: "none", borderRadius: 4, cursor: "pointer" }}>Add</button>
                                <button type="button" onClick={() => setShowAddModal(null)} style={{ flex: 1, padding: 10, backgroundColor: "#666", color: "#fff", border: "none", borderRadius: 4, cursor: "pointer" }}>Cancel</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Bed Action Modal */}
            {showBedModal && selectedBed && (
                <div style={{
                    position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
                    backgroundColor: "rgba(0,0,0,0.5)", display: "flex",
                    alignItems: "center", justifyContent: "center", zIndex: 1000
                }}>
                    <div style={{ backgroundColor: "#fff", padding: 30, borderRadius: 12, minWidth: 400 }}>
                        <h2>Bed {selectedBed.number} - Room {selectedBed.roomNumber}</h2>
                        <p><strong>Current Status:</strong> <span style={{ color: getBedColor(selectedBed.status), fontWeight: "bold" }}>{selectedBed.status.toUpperCase()}</span></p>
                        {selectedBed.tenant && <p><strong>Tenant:</strong> {selectedBed.tenant.name}</p>}

                        <h3 style={{ marginTop: 20 }}>Change Status:</h3>
                        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                            <button onClick={() => updateBedStatus("available")} style={{ padding: 10, backgroundColor: "#4CAF50", color: "#fff", border: "none", borderRadius: 4, cursor: "pointer" }}>
                                Mark as Available
                            </button>
                            <button onClick={() => updateBedStatus("booked")} style={{ padding: 10, backgroundColor: "#2196F3", color: "#fff", border: "none", borderRadius: 4, cursor: "pointer" }}>
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
