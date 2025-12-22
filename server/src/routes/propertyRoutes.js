import express from "express";
import {
  createProperty,
  getProperties,
  getPropertyById,
  updateProperty,
  deleteProperty,
} from "../controllers/propertyController.js";

const router = express.Router();

router.route("/").post(createProperty).get(getProperties);
router.route("/:id").get(getPropertyById).put(updateProperty).delete(deleteProperty);

export default router;
