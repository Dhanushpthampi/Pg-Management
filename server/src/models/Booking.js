import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        phone: { type: String, required: true },
        email: String,
        gender: { type: String, enum: ["male", "female", "other"] },

        property: { type: mongoose.Schema.Types.ObjectId, ref: "Property", required: true },
        roomType: { type: String }, // e.g. "single", "double"
        bed: { type: mongoose.Schema.Types.ObjectId, ref: "Bed" }, // Optional, can be assigned later

        joiningDate: { type: Date, required: true },
        amount: { type: Number, required: true },
        comments: String, // Added field

        status: {
            type: String,
            enum: ["booked", "checked_in", "cancelled"],
            default: "booked",
        },
    },
    { timestamps: true }
);

export default mongoose.model("Booking", bookingSchema);
