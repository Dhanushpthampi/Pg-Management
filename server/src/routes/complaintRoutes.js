import express from "express";
import {
    createComplaint,
    getComplaints,
    updateComplaint,
    getComplaintById,
} from "../controllers/complaintController.js";

const router = express.Router();

router.route("/").post(createComplaint).get(getComplaints);
router.route("/:id").get(getComplaintById).put(updateComplaint);

export default router;
