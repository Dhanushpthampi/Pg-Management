import mongoose from "mongoose";

const bedSchema = new mongoose.Schema(
    {
        number: { type: String, required: true }, // e.g., "A", "B", "1", "2"
        status: {
            type: String,
            enum: ["available", "occupied", "booked", "notice"],
            default: "available",
        },
        room: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Room",
            required: true,
        },
        floor: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Floor",
            required: true,
        },
        block: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Block",
            required: true,
        },
        property: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Property",
            required: true,
        },
        // If occupied or booked, link to tenant/booking might be useful here or in logical layer
        tenant: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Tenant",
            default: null
        }
    },
    { timestamps: true }
);

export default mongoose.model("Bed", bedSchema);
