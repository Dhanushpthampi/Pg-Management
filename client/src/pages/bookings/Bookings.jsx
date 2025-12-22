import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../../api/axios";
import FilterBar from "../../components/FilterBar";

const Bookings = () => {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [filters, setFilters] = useState({ search: "", status: "" });

  const fetchBookings = async () => {
    try {
      const { data } = await api.get("/bookings");
      setBookings(data);
      setFilteredBookings(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => { fetchBookings(); }, []);

  // Client-side filtering as Booking API is simple for now
  useEffect(() => {
    let result = bookings;
    if (filters.status) {
      result = result.filter(b => b.status === filters.status);
    }
    if (filters.search) {
      const s = filters.search.toLowerCase();
      result = result.filter(b =>
        b.name.toLowerCase().includes(s) ||
        b.phone.includes(s)
      );
    }
    setFilteredBookings(result);
  }, [filters, bookings]);

  const handleCancel = async (id) => {
    if (window.confirm("Are you sure you want to cancel this booking?")) {
      try {
        await api.put(`/bookings/${id}/cancel`);
        fetchBookings();
      } catch (err) { console.error(err); }
    }
  };

  const filterConfig = [
    {
      key: "status",
      label: "All Status",
      options: [
        { value: "booked", label: "Booked" },
        { value: "checked_in", label: "Checked In" },
        { value: "cancelled", label: "Cancelled" }
      ]
    }
  ];

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 20 }}>
        <h1>Bookings</h1>
        <button onClick={() => navigate("/bookings/new")}>+ New Booking</button>
      </div>

      <FilterBar
        searchPlaceholder="Search Booking (Name, Phone)"
        onSearch={(val) => setFilters({ ...filters, search: val })}
        filters={filterConfig}
        onFilterChange={(key, val) => setFilters({ ...filters, [key]: val })}
      />

      <table width="100%" border="1" cellPadding="10">
        <thead>
          <tr>
            <th>Name</th>
            <th>Phone</th>
            <th>Property</th>
            <th>Joining Date</th>
            <th>Amount Paid</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {filteredBookings.map((booking) => (
            <tr key={booking._id}>
              <td>{booking.name}</td>
              <td>{booking.phone}</td>
              <td>{booking.property?.name || "N/A"}</td>
              <td>{new Date(booking.joiningDate).toLocaleDateString()}</td>
              <td>₹{booking.amount}</td>
              <td>{booking.status}</td>
              <td>
                {booking.status === 'booked' && (
                  <>
                    <button onClick={() => navigate("/checkin")}>Check-in</button>
                    &nbsp;
                    <button onClick={() => handleCancel(booking._id)} style={{ color: 'red' }}>Cancel</button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Bookings;
