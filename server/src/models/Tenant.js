import mongoose from "mongoose";

const tenantSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        email: { type: String, required: true },
        phone: { type: String, required: true },
        gender: { type: String, enum: ["male", "female", "other"], required: true },

        // Guardian / Emergency Contact
        guardianName: String,
        guardianPhone: String,

        // Address & KYC
        permanentAddress: String,
        idProofType: { type: String, enum: ["aadhaar", "passport", "pan", "driving_license"] },
        idProofNumber: String,
        idProofUrl: String,
        photoUrl: String,

        // Assignment
        property: { type: mongoose.Schema.Types.ObjectId, ref: "Property", required: true },
        block: { type: mongoose.Schema.Types.ObjectId, ref: "Block" },
        floor: { type: mongoose.Schema.Types.ObjectId, ref: "Floor" },
        room: { type: mongoose.Schema.Types.ObjectId, ref: "Room" },
        bed: { type: mongoose.Schema.Types.ObjectId, ref: "Bed", required: true },

        // Financials
        rentAmount: { type: Number, required: true },
        depositAmount: { type: Number, required: true },
        dueDay: { type: Number, default: 5 }, // Rent due on 5th of every month

        // Status & Dates
        status: {
            type: String,
            enum: ["active", "on_notice", "vacated"],
            default: "active",
        },
        joiningDate: { type: Date, required: true },
        lastRentPaidDate: Date,
        noticeDate: Date,
        vacatingDate: Date,
    },
    { timestamps: true }
);

export default mongoose.model("Tenant", tenantSchema);
