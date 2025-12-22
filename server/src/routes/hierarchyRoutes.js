import express from "express";
import {
    addBlock,
    getBlocksByProperty,
    addFloor,
    getFloorsByBlock,
    addRoom,
    getRoomsByFloor,
    addBed,
    updateBedStatus,
    createBulkBeds,
    getPropertyHierarchy,
} from "../controllers/hierarchyController.js";

const router = express.Router();

// Property Hierarchy
router.get("/properties/:id/hierarchy", getPropertyHierarchy);

// Blocks
router.post("/blocks", addBlock);
router.get("/properties/:propertyId/blocks", getBlocksByProperty);

// Floors
router.post("/floors", addFloor);
router.get("/blocks/:blockId/floors", getFloorsByBlock);

// Rooms
router.post("/rooms", addRoom);
router.get("/floors/:floorId/rooms", getRoomsByFloor);

// Beds
router.post("/beds", addBed);
router.post("/beds/bulk", createBulkBeds);
router.put("/beds/:id/status", updateBedStatus);

export default router;
