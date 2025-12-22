import mongoose from "mongoose";

const roomSchema = new mongoose.Schema(
    {
        number: { type: String, required: true },
        type: { type: String, enum: ["single", "double", "triple", "four"], default: "double" },
        rent: { type: Number, required: true },
        deposit: { type: Number, required: true },
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
    },
    { timestamps: true }
);

export default mongoose.model("Room", roomSchema);
