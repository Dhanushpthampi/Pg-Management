import express from "express";
import {
    createComplaint,
    getComplaints,
    updateComplaint,
} from "../controllers/complaintController.js";

const router = express.Router();

router.route("/").post(createComplaint).get(getComplaints);
router.route("/:id").put(updateComplaint);

export default router;
