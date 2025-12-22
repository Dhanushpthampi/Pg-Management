import Staff from "../models/Staff.js";

// @desc    Create staff
// @route   POST /api/staff
// @access  Public
export const createStaff = async (req, res) => {
    try {
        const staff = await Staff.create(req.body);
        res.status(201).json(staff);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Get all staff
// @route   GET /api/staff
// @access  Public
export const getStaff = async (req, res) => {
    try {
        const staff = await Staff.find().populate("property"); // if assigned to property
        res.json(staff);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update staff
// @route   PUT /api/staff/:id
// @access  Public
export const updateStaff = async (req, res) => {
    try {
        const staff = await Staff.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(staff);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Delete staff
// @route   DELETE /api/staff/:id
// @access  Public
export const deleteStaff = async (req, res) => {
    try {
        await Staff.findByIdAndDelete(req.params.id);
        res.json({ message: "Staff removed" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
