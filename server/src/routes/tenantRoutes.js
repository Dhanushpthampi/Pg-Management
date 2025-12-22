import express from "express";
import {
    createTenant,
    getTenants,
    getTenantById,
    updateTenant,
} from "../controllers/tenantController.js";

const router = express.Router();

router.route("/").post(createTenant).get(getTenants);
router.route("/:id").get(getTenantById).put(updateTenant);

export default router;
