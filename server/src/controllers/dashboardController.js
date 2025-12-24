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

        // Calculate Revenue (sum of all paid invoices)
        const revenueResult = await Invoice.aggregate([
            { $match: { status: 'paid' } },
            { $group: { _id: null, total: { $sum: "$totalAmount" } } }
        ]);
        const totalRevenue = revenueResult.length > 0 ? revenueResult[0].total : 0;

        // Recent Activity (new tenants)
        const recentTenants = await Tenant.find().sort({ createdAt: -1 }).limit(5).select('name property status');

        // --- Graph Data Aggregations ---

        // 1. Revenue Trend (Last 6 Months)
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

        const revenueTrend = await Invoice.aggregate([
            {
                $match: {
                    status: 'paid',
                    createdAt: { $gte: sixMonthsAgo }
                }
            },
            {
                $group: {
                    _id: {
                        month: { $month: "$createdAt" },
                        year: { $year: "$createdAt" }
                    },
                    amount: { $sum: "$totalAmount" }
                }
            },
            { $sort: { "_id.year": 1, "_id.month": 1 } }
        ]);

        // Format for frontend: "Jan 2024", etc.
        const formattedRevenueTrend = revenueTrend.map(item => {
            const date = new Date(item._id.year, item._id.month - 1);
            return {
                name: date.toLocaleString('default', { month: 'short', year: 'numeric' }),
                amount: item.amount
            };
        });

        // 2. Booking Trend (Last 6 Months)
        const bookingTrend = await Booking.aggregate([
            {
                $match: {
                    status: { $in: ['booked', 'checked_in'] },
                    createdAt: { $gte: sixMonthsAgo }
                }
            },
            {
                $group: {
                    _id: {
                        month: { $month: "$createdAt" },
                        year: { $year: "$createdAt" }
                    },
                    bookings: { $sum: 1 }
                }
            },
            { $sort: { "_id.year": 1, "_id.month": 1 } }
        ]);

        const formattedBookingTrend = bookingTrend.map(item => {
            const date = new Date(item._id.year, item._id.month - 1);
            return {
                name: date.toLocaleString('default', { month: 'short', year: 'numeric' }),
                bookings: item.bookings
            };
        });


        // 3. Complaint Status Distribution
        const complaintStats = await Complaint.aggregate([
            {
                $group: {
                    _id: "$status",
                    count: { $sum: 1 }
                }
            }
        ]);
        // Schema enum: ["open", "in_progress", "resolved", "closed"]
        // Map to frontend friendly format if needed, or send as is.
        // Let's standardise the casing just in case
        const formattedComplaintStats = complaintStats.map(item => ({
            name: item._id.replace('_', ' ').toUpperCase(),
            value: item.count
        }));


        // 4. Occupancy Status (Bed Status)
        // Schema Bed: status enum ["available", "occupied", "booked", "notice"]
        const _Bed = (await import("../models/Bed.js")).default; // Dynamic import to avoid circular dependency issues or just ensuring import
        const occupancyStats = await _Bed.aggregate([
            {
                $group: {
                    _id: "$status",
                    count: { $sum: 1 }
                }
            }
        ]);
        const formattedOccupancyStats = occupancyStats.map(item => ({
            name: item._id.charAt(0).toUpperCase() + item._id.slice(1),
            value: item.count
        }));


        res.json({
            stats: {
                properties: totalProperties,
                tenants: totalTenants,
                bookings: totalBookings,
                complaints: openComplaints,
                revenue: totalRevenue,
                graphs: {
                    revenue: formattedRevenueTrend,
                    bookings: formattedBookingTrend,
                    complaints: formattedComplaintStats,
                    occupancy: formattedOccupancyStats
                }
            },
            recentTenants
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
