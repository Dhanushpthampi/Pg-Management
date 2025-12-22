import mongoose from "mongoose";

const staffSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        phone: { type: String, required: true },

        role: {
            type: String,
            enum: ["admin", "manager", "staff", "vendor"],
            default: "staff",
        },

        property: { type: mongoose.Schema.Types.ObjectId, ref: "Property" }, // Optional: Assign to specific property

        status: {
            type: String,
            enum: ["active", "inactive"],
            default: "active",
        },
    },
    { timestamps: true }
);

export default mongoose.model("Staff", staffSchema);
