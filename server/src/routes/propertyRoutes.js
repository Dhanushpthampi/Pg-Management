import express from "express";
import {
  createProperty,
  getProperties,
  getPropertiesWithStats,
  getPropertyById,
  updateProperty,
  deleteProperty,
} from "../controllers/propertyController.js";

const router = express.Router();

router.get("/stats", getPropertiesWithStats);
router.route("/").post(createProperty).get(getProperties);
router.route("/:id").get(getPropertyById).put(updateProperty).delete(deleteProperty);

export default router;
