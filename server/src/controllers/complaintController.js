import Complaint from "../models/Complaint.js";

// @desc    Raise a complaint
// @route   POST /api/complaints
// @access  Public (Tenant)
export const createComplaint = async (req, res) => {
    try {
        const complaint = await Complaint.create({
            ...req.body,
            timeline: [{ status: "open", comment: "Complaint raised" }],
        });
        res.status(201).json(complaint);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Get all complaints
// @route   GET /api/complaints
// @access  Public (Admin)
export const getComplaints = async (req, res) => {
    try {
        const { status, category } = req.query;
        let query = {};
        if (status) query.status = status;
        if (category) query.category = category;

        const complaints = await Complaint.find(query)
            .populate("property")
            .populate("room")
            .populate("bed")
            .populate("raisedBy", "name phone")
            .populate("assignedTo", "name role")
            .sort({ createdAt: -1 });
        res.json(complaints);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update complaint status/assignment
// @route   PUT /api/complaints/:id
// @access  Public (Admin/Staff)
export const updateComplaint = async (req, res) => {
    try {
        const { status, assignedTo, comment } = req.body;
        const complaint = await Complaint.findById(req.params.id);

        if (!complaint) {
            return res.status(404).json({ message: "Complaint not found" });
        }

        if (status) complaint.status = status;
        if (assignedTo) complaint.assignedTo = assignedTo;

        // Add to timeline
        if (status || comment) {
            complaint.timeline.push({
                status: status || complaint.status,
                comment: comment || "Status updated",
                timestamp: new Date(),
            });
        }

        await complaint.save();
        res.json(complaint);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};
