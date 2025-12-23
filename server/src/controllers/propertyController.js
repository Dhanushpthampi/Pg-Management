import Property from "../models/Property.js";
import Floor from "../models/Floor.js";
import Bed from "../models/Bed.js";

// @desc    Create a new property
// @route   POST /api/properties
// @access  Public
export const createProperty = async (req, res) => {
    try {
        const property = await Property.create(req.body);
        res.status(201).json(property);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Get all properties
// @route   GET /api/properties
// @access  Public
export const getProperties = async (req, res) => {
    try {
        const { city, status, search } = req.query;
        let query = {};

        if (city) query.city = city;
        if (status) query.status = status;
        if (search) {
            query.$or = [
                { name: { $regex: search, $options: "i" } },
                { address: { $regex: search, $options: "i" } },
            ];
        }

        const properties = await Property.find(query).sort({ createdAt: -1 });
        res.json(properties);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
};

// @desc    Get all properties with statistics
// @route   GET /api/properties/stats
// @access  Public
export const getPropertiesWithStats = async (req, res) => {
    try {
        const properties = await Property.find().sort({ createdAt: -1 });

        // Get stats for each property
        const propertiesWithStats = await Promise.all(properties.map(async (property) => {
            // Count floors for this property
            const floorCount = await Floor.countDocuments({ property: property._id });

            // Count total beds for this property
            const totalBeds = await Bed.countDocuments({ property: property._id });

            // Count occupied beds for this property
            const occupiedBeds = await Bed.countDocuments({
                property: property._id,
                status: 'occupied'
            });

            return {
                ...property.toObject(),
                stats: {
                    totalFloors: floorCount,
                    totalBeds: totalBeds,
                    occupiedBeds: occupiedBeds
                }
            };
        }));

        res.json(propertiesWithStats);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
};

// @desc    Get property by ID
// @route   GET /api/properties/:id
// @access  Public
export const getPropertyById = async (req, res) => {
    try {
        const property = await Property.findById(req.params.id);
        if (property) {
            res.json(property);
        } else {
            res.status(404).json({ message: "Property not found" });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update property
// @route   PUT /api/properties/:id
// @access  Public
export const updateProperty = async (req, res) => {
    try {
        const property = await Property.findById(req.params.id);
        if (property) {
            Object.assign(property, req.body);
            const updatedProperty = await property.save();
            res.json(updatedProperty);
        } else {
            res.status(404).json({ message: "Property not found" });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Soft delete property (mark inactive)
// @route   DELETE /api/properties/:id
// @access  Public
export const deleteProperty = async (req, res) => {
    try {
        const property = await Property.findById(req.params.id);
        if (property) {
            property.status = "inactive";
            await property.save();
            res.json({ message: "Property marked as inactive" });
        } else {
            res.status(404).json({ message: "Property not found" });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
