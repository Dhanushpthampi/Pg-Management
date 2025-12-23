import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./src/config/db.js";
import propertyRoutes from "./src/routes/propertyRoutes.js";
import hierarchyRoutes from "./src/routes/hierarchyRoutes.js";
import tenantRoutes from "./src/routes/tenantRoutes.js";
import bookingRoutes from "./src/routes/bookingRoutes.js";
import staffRoutes from "./src/routes/staffRoutes.js";
import complaintRoutes from "./src/routes/complaintRoutes.js";
import invoiceRoutes from "./src/routes/invoiceRoutes.js";
import checkoutRoutes from "./src/routes/checkoutRoutes.js";
import dashboardRoutes from "./src/routes/dashboardRoutes.js";

import authRoutes from "./src/routes/authRoutes.js";
import { protect } from "./src/middleware/authMiddleware.js";
import User from "./src/models/User.js";

dotenv.config();

const app = express();

app.use(
  cors({
    origin: ["http://localhost:5173", "https://gullypg.vercel.app"],
    credentials: true,
  })
);

app.use(express.json());
app.use("/uploads", express.static("uploads"));

app.get("/", (req, res) => {
  res.send("PG Management Backend Running 🚀");
});

app.use("/api/auth", authRoutes);

// Protect all other routes
app.use("/api/properties", protect, propertyRoutes);
app.use("/api/hierarchy", protect, hierarchyRoutes);
app.use("/api/tenants", protect, tenantRoutes);
app.use("/api/bookings", protect, bookingRoutes);
app.use("/api/staff", protect, staffRoutes);
app.use("/api/complaints", protect, complaintRoutes);
app.use("/api/invoices", protect, invoiceRoutes);
app.use("/api/checkouts", protect, checkoutRoutes);
app.use("/api/dashboard", protect, dashboardRoutes);

const seedAdmin = async () => {
  try {
    const adminExists = await User.findOne({ email: "admin@gullypg.com" });
    if (!adminExists) {
      await User.create({
        name: "Admin",
        email: "admin@gullypg.com",
        password: "admin123", // Will be hashed by pre-save hook
        role: "admin"
      });
      console.log("Default Admin created: admin@gullypg.com / admin123");
    }
  } catch (error) {
    console.error("Seeding error:", error);
  }
};

connectDB().then(() => {
  seedAdmin();
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
