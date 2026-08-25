import express from "express";

import {
  getAnnouncements,
  getAnnouncementById,
  createAnnouncement,
  updateAnnouncement,
  deleteAnnouncement,
} from "../controllers/announcementController.js";

import protect from "../middleware/authMiddleware.js";
import authorize from "../middleware/roleMiddleware.js";

const router = express.Router();

// Public
router.get("/", getAnnouncements);

// Admin/staff
router.get(
  "/admin",
  protect,
  authorize("admin", "staff"),
  getAnnouncements
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
  createAnnouncement
);

router.put(
  "/:id",
  protect,
  authorize("admin"),
  updateAnnouncement
);

router.delete(
  "/:id",
  protect,
  authorize("admin"),
  deleteAnnouncement
);

export default router;