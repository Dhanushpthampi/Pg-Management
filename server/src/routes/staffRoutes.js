import express from "express";
import {
    createStaff,
    getStaff,
    getStaffById,
    updateStaff,
    deleteStaff,
} from "../controllers/staffController.js";

const router = express.Router();

router.route("/").post(createStaff).get(getStaff);
router.route("/:id").get(getStaffById).put(updateStaff).delete(deleteStaff);

export default router;
