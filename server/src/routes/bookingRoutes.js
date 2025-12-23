import express from "express";
import {
    createBooking,
    getBookings,
    cancelBooking,
    updateBooking,
} from "../controllers/bookingController.js";

const router = express.Router();

router.route("/").post(createBooking).get(getBookings);
router.route("/:id").put(updateBooking);
router.route("/:id/cancel").put(cancelBooking);

export default router;
