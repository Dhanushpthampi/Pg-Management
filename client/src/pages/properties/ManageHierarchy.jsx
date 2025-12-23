import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../api/axios";
import BackButton from "../../components/BackButton";

const ManageHierarchy = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [property, setProperty] = useState(null);

  const [blocks, setBlocks] = useState([]);
  const [floors, setFloors] = useState([]);
  const [rooms, setRooms] = useState([]);

  const [activeTab, setActiveTab] = useState("blocks");

  const [blockForm, setBlockForm] = useState({ name: "" });
  const [floorForm, setFloorForm] = useState({ name: "", blockId: "" });
  const [roomForm, setRoomForm] = useState({
    number: "",
    blockId: "",
    floorId: "",
    sharingType: "single"
  });
  const [bedForm, setBedForm] = useState({
    roomId: "",
    count: 1,
    startNumber: 1
  });

  /* ---------------- FETCH BASE DATA ---------------- */

  useEffect(() => {
    fetchProperty();
    fetchBlocks();
  }, [id]);

  const fetchProperty = async () => {
    const res = await api.get(`/properties/${id}`);
    setProperty(res.data);
  };

  const fetchBlocks = async () => {
    const res = await api.get(`/hierarchy/properties/${id}/blocks`);
    setBlocks(res.data);
  };

  const fetchFloors = async (blockId) => {
    if (!blockId) return;
    const res = await api.get(`/hierarchy/blocks/${blockId}/floors`);
    setFloors(res.data);
  };

  const fetchRooms = async (floorId) => {
    if (!floorId) return;
    const res = await api.get(`/hierarchy/floors/${floorId}/rooms`);
    setRooms(res.data);
  };

  /* ---------------- ADD ACTIONS ---------------- */

  const addBlock = async (e) => {
    e.preventDefault();
    await api.post("/hierarchy/blocks", {
      name: blockForm.name,
      property: id
    });
    setBlockForm({ name: "" });
    fetchBlocks();
    alert("Block added");
  };

  const addFloor = async (e) => {
    e.preventDefault();
    await api.post("/hierarchy/floors", {
      name: floorForm.name,
      block: floorForm.blockId
    });
    setFloorForm({ name: "", blockId: "" });
    setFloors([]);
    fetchBlocks();
    alert("Floor added");
  };

  const addRoom = async (e) => {
    e.preventDefault();
    await api.post("/hierarchy/rooms", {
      number: roomForm.number,
      sharingType: roomForm.sharingType,
      floor: roomForm.floorId
    });
    setRoomForm({
      number: "",
      blockId: "",
      floorId: "",
      sharingType: "single"
    });
    setRooms([]);
    alert("Room added");
  };

  const addBeds = async (e) => {
    e.preventDefault();
    await api.post("/hierarchy/beds/bulk", bedForm);
    setBedForm({ roomId: "", count: 1, startNumber: 1 });
    alert("Beds added");
  };

  /* ---------------- UI ---------------- */

  return (
    <div>
      <BackButton />
      <h1>Manage Hierarchy – {property?.name}</h1>

      <button onClick={() => navigate(`/properties/${id}/beds`)}>
        View Bed Structure
      </button>

      {/* Tabs */}
      <div style={{ display: "flex", gap: 10, margin: "20px 0" }}>
        {["blocks", "floors", "rooms", "beds"].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              fontWeight: activeTab === tab ? "bold" : "normal"
            }}
          >
            {tab.toUpperCase()}
          </button>
        ))}
      </div>

      {/* ---------------- BLOCKS ---------------- */}
      {activeTab === "blocks" && (
        <form onSubmit={addBlock}>
          <h2>Add Block</h2>
          <input
            placeholder="Block Name"
            value={blockForm.name}
            onChange={e => setBlockForm({ name: e.target.value })}
            required
          />
          <button>Add Block</button>

          <ul>
            {blocks.map(b => (
              <li key={b._id}>{b.name}</li>
            ))}
          </ul>
        </form>
      )}

      {/* ---------------- FLOORS ---------------- */}
      {activeTab === "floors" && (
        <form onSubmit={addFloor}>
          <h2>Add Floor</h2>

          <select
            value={floorForm.blockId}
            onChange={e => {
              setFloorForm({ ...floorForm, blockId: e.target.value });
              fetchFloors(e.target.value);
            }}
            required
          >
            <option value="">Select Block</option>
            {blocks.map(b => (
              <option key={b._id} value={b._id}>{b.name}</option>
            ))}
          </select>

          <input
            placeholder="Floor Name"
            value={floorForm.name}
            onChange={e => setFloorForm({ ...floorForm, name: e.target.value })}
            required
          />

          <button>Add Floor</button>

          <ul>
            {floors.map(f => (
              <li key={f._id}>{f.name}</li>
            ))}
          </ul>
        </form>
      )}

      {/* ---------------- ROOMS ---------------- */}
      {activeTab === "rooms" && (
        <form onSubmit={addRoom}>
          <h2>Add Room</h2>

          <select
            value={roomForm.blockId}
            onChange={e => {
              setRoomForm({ ...roomForm, blockId: e.target.value });
              fetchFloors(e.target.value);
            }}
            required
          >
            <option value="">Select Block</option>
            {blocks.map(b => (
              <option key={b._id} value={b._id}>{b.name}</option>
            ))}
          </select>

          <select
            value={roomForm.floorId}
            onChange={e => {
              setRoomForm({ ...roomForm, floorId: e.target.value });
              fetchRooms(e.target.value);
            }}
            required
          >
            <option value="">Select Floor</option>
            {floors.map(f => (
              <option key={f._id} value={f._id}>{f.name}</option>
            ))}
          </select>

          <input
            placeholder="Room Number"
            value={roomForm.number}
            onChange={e => setRoomForm({ ...roomForm, number: e.target.value })}
            required
          />

          <select
            value={roomForm.sharingType}
            onChange={e => setRoomForm({ ...roomForm, sharingType: e.target.value })}
          >
            <option value="single">Single</option>
            <option value="double">Double</option>
            <option value="triple">Triple</option>
            <option value="four">Four</option>
          </select>

          <button>Add Room</button>
        </form>
      )}

      {/* ---------------- BEDS ---------------- */}
      {activeTab === "beds" && (
        <form onSubmit={addBeds}>
          <h2>Add Beds</h2>

          <select
            value={bedForm.roomId}
            onChange={e => setBedForm({ ...bedForm, roomId: e.target.value })}
            required
          >
            <option value="">Select Room</option>
            {rooms.map(r => (
              <option key={r._id} value={r._id}>
                Room {r.number}
              </option>
            ))}
          </select>

          <input
            type="number"
            min="1"
            value={bedForm.count}
            onChange={e => setBedForm({ ...bedForm, count: +e.target.value })}
          />

          <input
            type="number"
            min="1"
            value={bedForm.startNumber}
            onChange={e => setBedForm({ ...bedForm, startNumber: +e.target.value })}
          />

          <button>Add Beds</button>
        </form>
      )}
    </div>
  );
};

export default ManageHierarchy;
