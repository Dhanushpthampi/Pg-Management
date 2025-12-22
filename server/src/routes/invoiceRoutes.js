import express from "express";
import {
    createInvoice,
    getInvoices,
    getInvoiceById,
} from "../controllers/invoiceController.js";

const router = express.Router();

router.route("/").post(createInvoice).get(getInvoices);
router.route("/:id").get(getInvoiceById);

export default router;
