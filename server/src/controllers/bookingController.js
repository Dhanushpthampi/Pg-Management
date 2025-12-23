import Booking from "../models/Booking.js";
import Bed from "../models/Bed.js";

// @desc    Create a booking
// @route   POST /api/bookings
// @access  Public
// @desc    Update booking
// @route   PUT /api/bookings/:id
// @access  Public
export const updateBooking = async (req, res) => {
    try {
        const booking = await Booking.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
        });
        res.json(booking);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const createBooking = async (req, res) => {
    try {
        const { bed } = req.body;

        // If bed is selected, check availability first
        if (bed) {
            const selectedBed = await Bed.findById(bed);
            if (selectedBed && selectedBed.status !== "available") {
                return res.status(400).json({ message: "Selected bed is not available" });
            }

            // Update bed status to booked
            selectedBed.status = "booked";
            await selectedBed.save();
        }

        const booking = await Booking.create(req.body);
        res.status(201).json(booking);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Get all bookings
// @route   GET /api/bookings
// @access  Public
export const getBookings = async (req, res) => {
    try {
        const bookings = await Booking.find()
            .populate("property")
            .populate("bed")
            .sort({ createdAt: -1 });
        res.json(bookings);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Cancel booking
// @route   PUT /api/bookings/:id/cancel
// @access  Public
export const cancelBooking = async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id);
        if (!booking) {
            return res.status(404).json({ message: "Booking not found" });
        }

        if (booking.bed) {
            const bed = await Bed.findById(booking.bed);
            if (bed) {
                bed.status = "available";
                await bed.save();
            }
        }

        booking.status = "cancelled";
        await booking.save();
        res.json({ message: "Booking cancelled" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
