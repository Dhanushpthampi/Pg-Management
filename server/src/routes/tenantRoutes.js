import express from "express";
import {
    createTenant,
    getTenants,
    getTenantById,
    updateTenant,
} from "../controllers/tenantController.js";

import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
    destination(req, file, cb) {
        cb(null, "uploads/");
    },
    filename(req, file, cb) {
        cb(
            null,
            `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`
        );
    },
});

const upload = multer({ storage });

const router = express.Router();

router.route("/")
    .post(
        upload.fields([
            { name: "idProof", maxCount: 1 },
            { name: "addressProof", maxCount: 1 },
            { name: "addressPhoto", maxCount: 1 },
        ]),
        createTenant
    )
    .get(getTenants);

router.route("/:id").get(getTenantById).put(updateTenant);

export default router;
