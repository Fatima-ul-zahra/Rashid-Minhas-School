import express from "express";

import {
  getAdmissions,
  getAdmissionById,
  createAdmission,
  updateAdmission,
  deleteAdmission,
} from "../controllers/admissionController.js";

import protect from "../middleware/authMiddleware.js";
import authorize from "../middleware/roleMiddleware.js";

const router = express.Router();

// Public admission submission
router.post("/", createAdmission);

// Admin/staff access
router.get(
  "/",
  protect,
  authorize("admin", "staff"),
  getAdmissions
);

router.get(
  "/:id",
  protect,
  authorize("admin", "staff"),
  getAdmissionById
);

router.put(
  "/:id",
  protect,
  authorize("admin"),
  updateAdmission
);

router.delete(
  "/:id",
  protect,
  authorize("admin"),
  deleteAdmission
);

export default router;