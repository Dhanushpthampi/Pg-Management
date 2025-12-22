import mongoose from "mongoose";

const timelineEventSchema = new mongoose.Schema({
    status: String,
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "Staff" }, // or Tenant if they reply
    comment: String,
    timestamp: { type: Date, default: Date.now },
});

const complaintSchema = new mongoose.Schema(
    {
        title: { type: String, required: true },
        description: String,

        category: {
            type: String,
            enum: ["plumbing", "electrical", "food", "hygiene", "internet", "other"],
            required: true,
        },
        priority: {
            type: String,
            enum: ["low", "medium", "high"],
            default: "medium",
        },

        status: {
            type: String,
            enum: ["open", "in_progress", "resolved", "closed"],
            default: "open",
        },

        // Location
        property: { type: mongoose.Schema.Types.ObjectId, ref: "Property", required: true },
        room: { type: mongoose.Schema.Types.ObjectId, ref: "Room" },
        bed: { type: mongoose.Schema.Types.ObjectId, ref: "Bed" },

        // People
        raisedBy: { type: mongoose.Schema.Types.ObjectId, ref: "Tenant", required: true },
        assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: "Staff" },

        photos: [String], // URLs

        timeline: [timelineEventSchema],
    },
    { timestamps: true }
);

export default mongoose.model("Complaint", complaintSchema);
