import mongoose from "mongoose";

const propertySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },

    pincode: { type: String, required: true },

    amenities: [{ type: String }],
    foodTypes: {
      type: [String],
      enum: ["veg", "non-veg", "both"],
      default: ["both"],
    },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },

    contactPerson: String,
    contactPhone: String,
    contactEmail: String,
  },
  { timestamps: true }
);

export default mongoose.model("Property", propertySchema);
