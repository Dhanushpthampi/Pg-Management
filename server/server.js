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

dotenv.config();

const app = express();

app.use(
  cors({
    origin: ["http://localhost:5173", "https://gullypg.vercel.app/"],
    credentials: true,
  })
);

app.use(express.json());

app.get("/", (req, res) => {
  res.send("PG Management Backend Running 🚀");
});

app.use("/api/properties", propertyRoutes);
app.use("/api/hierarchy", hierarchyRoutes);
app.use("/api/tenants", tenantRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/staff", staffRoutes);
app.use("/api/complaints", complaintRoutes);
app.use("/api/invoices", invoiceRoutes);
app.use("/api/checkouts", checkoutRoutes);
connectDB();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
