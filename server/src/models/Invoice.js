import mongoose from "mongoose";

const invoiceSchema = new mongoose.Schema(
    {
        tenant: { type: mongoose.Schema.Types.ObjectId, ref: "Tenant", required: true },
        property: { type: mongoose.Schema.Types.ObjectId, ref: "Property", required: true },

        // Billing Period
        month: String, // e.g., "October 2023"
        year: Number,

        items: [
            {
                description: String,
                amount: Number,
            },
        ],

        totalAmount: { type: Number, required: true },

        status: {
            type: String,
            enum: ["pending", "paid", "overdue"],
            default: "pending",
        },

        dueDate: Date,
        paidDate: Date,
    },
    { timestamps: true }
);

export default mongoose.model("Invoice", invoiceSchema);
