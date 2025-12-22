import Tenant from "../models/Tenant.js";
import Bed from "../models/Bed.js";

// @desc    Raise Notice
// @route   POST /api/checkouts/notice
// @access  Public (Tenant)
export const raiseNotice = async (req, res) => {
    try {
        const { tenantId, vacatingDate } = req.body;
        const tenant = await Tenant.findById(tenantId);

        if (!tenant) {
            return res.status(404).json({ message: "Tenant not found" });
        }

        tenant.status = "on_notice";
        tenant.noticeDate = new Date();
        tenant.vacatingDate = vacatingDate;

        await tenant.save();
        res.json({ message: "Notice raised successfully", tenant });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    List Pending Checkouts (Tenants on notice)
// @route   GET /api/checkouts/pending
// @access  Public (Admin)
export const getPendingCheckouts = async (req, res) => {
    try {
        const tenants = await Tenant.find({ status: "on_notice" })
            .populate("property")
            .populate("room")
            .populate("bed");
        res.json(tenants);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Finalize Checkout (Vacate)
// @route   POST /api/checkouts/finalize
// @access  Public (Admin)
export const finalizeCheckout = async (req, res) => {
    const session = await Tenant.startSession();
    session.startTransaction();
    try {
        const { tenantId, exitDate, refundAmount, damageCharges } = req.body;

        const tenant = await Tenant.findById(tenantId).session(session);
        if (!tenant) throw new Error("Tenant not found");

        // 1. Update Tenant
        tenant.status = "vacated";
        tenant.vacatingDate = exitDate || new Date();
        // In a real app, we might store refund details here or in a separate transaction log
        await tenant.save({ session });

        // 2. Free up the Bed
        const bed = await Bed.findById(tenant.bed).session(session);
        if (bed) {
            bed.status = "available";
            bed.tenant = null;
            await bed.save({ session });
        }

        await session.commitTransaction();
        session.endSession();

        res.json({ message: "Checkout finalized", tenant });
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        res.status(400).json({ message: error.message });
    }
};
