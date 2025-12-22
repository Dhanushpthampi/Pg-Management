import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./src/config/db.js";

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

connectDB();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
