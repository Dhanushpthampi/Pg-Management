import BackButton from "../../components/BackButton";

const BedStructure = () => {
  // Dummy data (later comes from backend)
  const rooms = [
    {
      roomNo: "101",
      beds: [
        { id: 1, status: "occupied" },
        { id: 2, status: "available" },
        { id: 3, status: "booked" },
      ],
    },
    {
      roomNo: "102",
      beds: [
        { id: 1, status: "available" },
        { id: 2, status: "available" },
      ],
    },
    {
      roomNo: "103",
      beds: [
        { id: 1, status: "occupied" },
        { id: 2, status: "occupied" },
        { id: 3, status: "available" },
      ],
    },
  ];

  const getBedColor = (status) => {
    if (status === "available") return "#4CAF50"; // green
    if (status === "occupied") return "#F44336"; // red
    if (status === "booked") return "#FFC107"; // yellow
  };

  return (
    <div>
      <BackButton />
      <h1>Bed Availability</h1>

      {/* Filters */}
      <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
        <select>
          <option>All Sharing</option>
          <option>1 Sharing</option>
          <option>2 Sharing</option>
          <option>3 Sharing</option>
          <option>4 Sharing</option>
        </select>

        <select>
          <option>All Status</option>
          <option>Available</option>
          <option>Occupied</option>
          <option>Booked</option>
        </select>
      </div>

      {/* Rooms */}
      {rooms.map((room) => (
        <div
          key={room.roomNo}
          style={{
            border: "1px solid #ccc",
            padding: 15,
            marginBottom: 15,
          }}
        >
          <h3>Room {room.roomNo}</h3>

          <div style={{ display: "flex", gap: 10 }}>
            {room.beds.map((bed) => (
              <div
                key={bed.id}
                style={{
                  width: 60,
                  height: 60,
                  backgroundColor: getBedColor(bed.status),
                  color: "#fff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                }}
                title={bed.status}
              >
                Bed {bed.id}
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* Legend */}
      <div style={{ marginTop: 30 }}>
        <strong>Legend:</strong>
        <div style={{ display: "flex", gap: 15, marginTop: 10 }}>
          <span style={{ color: "#4CAF50" }}>■ Available</span>
          <span style={{ color: "#F44336" }}>■ Occupied</span>
          <span style={{ color: "#FFC107" }}>■ Booked</span>
        </div>
      </div>
    </div>
  );
};

export default BedStructure;
