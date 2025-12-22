import express from "express";
import {
    raiseNotice,
    getPendingCheckouts,
    finalizeCheckout,
} from "../controllers/checkoutController.js";

const router = express.Router();

router.post("/notice", raiseNotice);
router.get("/pending", getPendingCheckouts);
router.post("/finalize", finalizeCheckout);

export default router;
