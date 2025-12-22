import mongoose from "mongoose";

const floorSchema = new mongoose.Schema(
    {
        name: { type: String, required: true }, // e.g., "1st Floor" or just "1"
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
    },
    { timestamps: true }
);

export default mongoose.model("Floor", floorSchema);
