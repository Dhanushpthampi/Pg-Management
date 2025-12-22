import Invoice from "../models/Invoice.js";

// @desc    Create Invoice
// @route   POST /api/invoices
// @access  Public
export const createInvoice = async (req, res) => {
    try {
        const invoice = await Invoice.create(req.body);
        res.status(201).json(invoice);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Get Invoices
// @route   GET /api/invoices
// @access  Public
export const getInvoices = async (req, res) => {
    try {
        const invoices = await Invoice.find()
            .populate("tenant", "name")
            .populate("property", "name")
            .sort({ createdAt: -1 });
        res.json(invoices);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get Invoice by ID
// @route   GET /api/invoices/:id
// @access  Public
export const getInvoiceById = async (req, res) => {
    try {
        const invoice = await Invoice.findById(req.params.id)
            .populate("tenant")
            .populate("property");
        if (invoice) {
            res.json(invoice);
        } else {
            res.status(404).json({ message: "Invoice not found" });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
