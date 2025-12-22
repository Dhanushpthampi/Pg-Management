import Tenant from "../models/Tenant.js";
import Bed from "../models/Bed.js";
import Property from "../models/Property.js";

// @desc    Create a new tenant (Check-In)
// @route   POST /api/tenants
// @access  Public
export const createTenant = async (req, res) => {
    const session = await Tenant.startSession();
    session.startTransaction();
    try {
        const { bed: bedId, property: propertyId, ...tenantData } = req.body;

        // 1. Validate Property
        const property = await Property.findById(propertyId).session(session);
        if (!property) {
            throw new Error("Property not found");
        }

        // 2. Validate Bed and Update Status
        const bed = await Bed.findById(bedId).session(session);
        if (!bed) {
            throw new Error("Bed not found");
        }
        if (bed.status !== "available") {
            throw new Error("Bed is not available");
        }

        // 3. Create Tenant
        const tenant = await Tenant.create(
            [
                {
                    ...tenantData,
                    bed: bedId,
                    property: propertyId,
                    status: "active",
                },
            ],
            { session }
        );

        // 4. Link Tenant to Bed & Mark Occupied
        bed.status = "occupied";
        bed.tenant = tenant[0]._id;
        await bed.save({ session });

        await session.commitTransaction();
        session.endSession();

        res.status(201).json(tenant[0]);
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        res.status(400).json({ message: error.message });
    }
};

// @desc    Get all tenants
// @route   GET /api/tenants
// @access  Public
export const getTenants = async (req, res) => {
    try {
        const { property, status, search } = req.query;
        let query = {};

        if (property) query.property = property;
        if (status) query.status = status;
        if (search) {
            query.$or = [
                { name: { $regex: search, $options: "i" } },
                { phone: { $regex: search, $options: "i" } },
            ];
        }

        const tenants = await Tenant.find(query)
            .populate("room")
            .populate("bed")
            .sort({ createdAt: -1 });
        res.json(tenants);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get tenant details
// @route   GET /api/tenants/:id
// @access  Public
export const getTenantById = async (req, res) => {
    try {
        const tenant = await Tenant.findById(req.params.id)
            .populate("property")
            .populate("block")
            .populate("floor")
            .populate("room")
            .populate("bed");

        if (tenant) {
            res.json(tenant);
        } else {
            res.status(404).json({ message: "Tenant not found" });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update tenant
// @route   PUT /api/tenants/:id
// @access  Public
export const updateTenant = async (req, res) => {
    try {
        const tenant = await Tenant.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
        });
        res.json(tenant);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};
