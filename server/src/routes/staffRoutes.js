import express from "express";
import {
    createStaff,
    getStaff,
    updateStaff,
    deleteStaff,
} from "../controllers/staffController.js";

const router = express.Router();

router.route("/").post(createStaff).get(getStaff);
router.route("/:id").put(updateStaff).delete(deleteStaff);

export default router;
