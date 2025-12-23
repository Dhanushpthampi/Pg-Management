import Tenant from "../models/Tenant.js";
import Property from "../models/Property.js";
import Booking from "../models/Booking.js";
import Complaint from "../models/Complaint.js";
import Invoice from "../models/Invoice.js";

// @desc    Get Dashboard Statistics
// @route   GET /api/dashboard/stats
// @access  Public (Admin)
export const getDashboardStats = async (req, res) => {
    try {
        const totalProperties = await Property.countDocuments();
        const totalTenants = await Tenant.countDocuments({ status: 'active' });
        const totalBookings = await Booking.countDocuments({ status: 'booked' });
        const openComplaints = await Complaint.countDocuments({ status: { $ne: 'resolved' } });

        // Calculate Revenue (simple sum of paid invoices for current month logic or just total)
        // For simple MVP: sum of all paid invoices
        const revenueResult = await Invoice.aggregate([
            { $match: { status: 'Paid' } },
            { $group: { _id: null, total: { $sum: "$totalAmount" } } }
        ]);
        const totalRevenue = revenueResult.length > 0 ? revenueResult[0].total : 0;

        // Recent Activity (new tenants)
        const recentTenants = await Tenant.find().sort({ createdAt: -1 }).limit(5).select('name property status');

        res.json({
            stats: {
                properties: totalProperties,
                tenants: totalTenants,
                bookings: totalBookings,
                complaints: openComplaints,
                revenue: totalRevenue
            },
            recentTenants
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
