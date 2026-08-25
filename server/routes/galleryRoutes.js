import express from "express";

import {
  getGallery,
  getGalleryItem,
  createGalleryItem,
  updateGalleryItem,
  deleteGalleryItem,
} from "../controllers/galleryController.js";

import protect from "../middleware/authMiddleware.js";
import authorize from "../middleware/roleMiddleware.js";

const router = express.Router();

// Public
router.get("/", getGallery);

// Admin
router.get(
  "/admin",
  protect,
  authorize("admin", "staff"),
  getGallery
);

router.get(
  "/:id",
  protect,
  authorize("admin", "staff"),
  getGalleryItem
);

router.post(
  "/",
  protect,
  authorize("admin"),
  createGalleryItem
);

router.put(
  "/:id",
  protect,
  authorize("admin"),
  updateGalleryItem
);

router.delete(
  "/:id",
  protect,
  authorize("admin"),
  deleteGalleryItem
);

export default router;