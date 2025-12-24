import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../../api/axios";
import { Plus } from "lucide-react";
import PageHeader from "../../components/PageHeader";
import SearchBar from "../../components/SearchBar";
import Loader from "../../components/Loader";

const Bookings = () => {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const fetchBookings = async () => {
    try {
      const { data } = await api.get("/bookings");
      setBookings(data);
      setFilteredBookings(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchBookings(); }, []);

  useEffect(() => {
    if (!search) {
      setFilteredBookings(bookings);
    } else {
      const s = search.toLowerCase();
      setFilteredBookings(bookings.filter(b =>
        b.name.toLowerCase().includes(s) ||
        b.phone.includes(s) ||
        b.email?.toLowerCase().includes(s)
      ));
    }
  }, [search, bookings]);

  const handleCancel = async (id) => {
    if (window.confirm("Are you sure you want to cancel this booking?")) {
      try {
        await api.put(`/bookings/${id}/cancel`);
        fetchBookings();
      } catch (err) { console.error(err); }
    }
  };

  const handleCheckIn = (booking) => {
    navigate("/checkin", {
      state: {
        bookingData: {
          name: booking.name,
          phone: booking.phone,
          email: booking.email,
          joiningDate: booking.joiningDate,
          depositAmount: booking.amount,
          property: booking.property?._id,
          comments: booking.comments
        }
      }
    });
  };

  if (loading) return <Loader />;

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto" }}>
      <PageHeader
        title="Bookings"
        action={
          <div className="flex-gap">
            <button className="btn btn-secondary" onClick={fetchBookings}>Refresh</button>
            <button className="btn btn-primary" onClick={() => navigate("/bookings/new")}>
              <Plus size={16} /> New Booking
            </button>
          </div>
        }
      />

      <div className="filter-container">
        <SearchBar
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search bookings..."
        />
      </div>

      <div className="data-table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Booking Date</th>
              <th>Tenant</th>
              <th>Joining Date</th>
              <th>Comments</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredBookings.map((booking) => (
              <tr key={booking._id}>
                <td>
                  <div style={{ fontWeight: 500 }}>{new Date(booking.createdAt).toLocaleDateString('en-GB')}</div>
                  <div className="text-sm">Paid: ₹{booking.amount}</div>
                </td>
                <td>
                  <div style={{ fontWeight: 500 }}>{booking.name}</div>
                  <div className="text-sm">{booking.phone}</div>
                </td>
                <td>{new Date(booking.joiningDate).toDateString()}</td>
                <td style={{ maxWidth: 200 }} className="text-sm">{booking.comments || "-"}</td>
                <td>
                  <span className={`badge ${booking.status === 'booked' ? 'success' : 'neutral'}`}>
                    {booking.status.replace("_", " ")}
                  </span>
                </td>
                <td>
                  {booking.status === 'booked' && (
                    <div className="flex-gap">
                      <button className="btn btn-secondary" style={{ padding: '4px 8px', fontSize: 12 }} onClick={() => handleCheckIn(booking)}>
                        Check In
                      </button>
                      <button
                        style={{ background: 'none', border: 'none', color: 'var(--danger)', fontSize: 12, textDecoration: 'underline' }}
                        onClick={() => handleCancel(booking._id)}
                      >
                        Cancel
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
            {filteredBookings.length === 0 && (
              <tr><td colSpan="6" style={{ textAlign: "center", padding: 30, color: "var(--secondary)" }}>No bookings found.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      <style>{`
        .filter-container {
          display: flex;
          gap: 15px;
          margin-bottom: 24px;
          flex-wrap: wrap;
          align-items: center;
        }
      `}</style>
    </div>
  );
};

export default Bookings;
