import express from "express";
import {
    createBooking,
    getBookings,
    cancelBooking,
} from "../controllers/bookingController.js";

const router = express.Router();

router.route("/").post(createBooking).get(getBookings);
router.route("/:id/cancel").put(cancelBooking);

export default router;
