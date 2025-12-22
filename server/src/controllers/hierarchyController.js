import Block from "../models/Block.js";
import Floor from "../models/Floor.js";
import Room from "../models/Room.js";
import Bed from "../models/Bed.js";
import Property from "../models/Property.js";

// --- Block Controller ---
export const addBlock = async (req, res) => {
    try {
        const { propertyId } = req.body; // or req.params
        const block = await Block.create(req.body);
        res.status(201).json(block);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const getBlocksByProperty = async (req, res) => {
    try {
        const blocks = await Block.find({ property: req.params.propertyId });
        res.json(blocks);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// --- Floor Controller ---
export const addFloor = async (req, res) => {
    try {
        const floor = await Floor.create(req.body);
        res.status(201).json(floor);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const getFloorsByBlock = async (req, res) => {
    try {
        const floors = await Floor.find({ block: req.params.blockId });
        res.json(floors);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// --- Room Controller ---
export const addRoom = async (req, res) => {
    try {
        const room = await Room.create(req.body);
        res.status(201).json(room);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const getRoomsByFloor = async (req, res) => {
    try {
        const rooms = await Room.find({ floor: req.params.floorId });
        res.json(rooms);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// --- Bed Controller ---
export const addBed = async (req, res) => {
    try {
        const bed = await Bed.create(req.body);
        res.status(201).json(bed);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Update Bed Status
export const updateBedStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const bed = await Bed.findByIdAndUpdate(
            id,
            { status },
            { new: true }
        ).populate('tenant');

        if (!bed) {
            return res.status(404).json({ message: 'Bed not found' });
        }

        res.json(bed);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Create Multiple Beds at Once
export const createBulkBeds = async (req, res) => {
    try {
        const { roomId, count, startNumber } = req.body;
        const beds = [];

        for (let i = 0; i < count; i++) {
            beds.push({
                room: roomId,
                number: startNumber + i,
                status: 'available'
            });
        }

        const createdBeds = await Bed.insertMany(beds);
        res.status(201).json(createdBeds);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Get Full Hierarchy for a Property (Tree Structure)
export const getPropertyHierarchy = async (req, res) => {
    try {
        const propertyId = req.params.id;

        // Optimisation: We could use aggregation, but for simplicity/readability we fetch linked data.
        // However, for a production app, robust aggregation is better. 
        // Given the constraints and likely size, manual population or aggregation.

        // Aggregation pipeline to build the tree
        // Property -> Blocks -> Floors -> Rooms -> Beds

        // Let's do it simply by fetching Blocks for property, then Floors, etc.
        // Or just simple aggregation.
        // Actually, "Fetch full bed structure" is required.

        const blocks = await Block.find({ property: propertyId });

        // This can be N+1 generic but let's try to be efficient or simple.
        // Use aggregation to get everything in one go.

        const hierarchy = await Block.aggregate([
            { $match: { property: new mongoose.Types.ObjectId(propertyId) } },
            {
                $lookup: {
                    from: "floors",
                    localField: "_id",
                    foreignField: "block",
                    as: "floors",
                    pipeline: [
                        {
                            $lookup: {
                                from: "rooms",
                                localField: "_id",
                                foreignField: "floor",
                                as: "rooms",
                                pipeline: [
                                    {
                                        $lookup: {
                                            from: "beds",
                                            localField: "_id",
                                            foreignField: "room",
                                            as: "beds"
                                        }
                                    }
                                ]
                            }
                        }
                    ]
                }
            }
        ]);

        res.json(hierarchy);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
};

import mongoose from "mongoose";
