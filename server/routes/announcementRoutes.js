import express from "express";

import {
  getPublicAnnouncements,
  getAdminAnnouncements,
  getAnnouncementById,
  createAnnouncement,
  updateAnnouncement,
  deleteAnnouncement,
} from "../controllers/announcementController.js";

import protect from "../middleware/authMiddleware.js";
import authorize from "../middleware/roleMiddleware.js";
import uploadImage from "../middleware/uploadMiddleware.js";

const router = express.Router();

// Public
router.get("/", getPublicAnnouncements);

// Admin
router.get(
  "/admin",
  protect,
  authorize("admin", "staff"),
  getAdminAnnouncements
);

router.get(
  "/:id",
  protect,
  authorize("admin", "staff"),
  getAnnouncementById
);

router.post(
  "/",
  protect,
  authorize("admin"),
  uploadImage.single("image"),
  createAnnouncement
);

router.put(
  "/:id",
  protect,
  authorize("admin"),
  uploadImage.single("image"),
  updateAnnouncement
);

router.delete(
  "/:id",
  protect,
  authorize("admin"),
  deleteAnnouncement
);

export default router;