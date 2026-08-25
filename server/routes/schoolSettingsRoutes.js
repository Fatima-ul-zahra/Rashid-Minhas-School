import express from "express";

import {
  getSchoolSettings,
  createSchoolSettings,
  updateSchoolSettings,
} from "../controllers/schoolSettingsController.js";

import asyncHandler from "../utils/asyncHandler.js";
import protect from "../middleware/authMiddleware.js";
import authorize from "../middleware/roleMiddleware.js";

const router = express.Router();

router.get(
  "/",
  asyncHandler(getSchoolSettings)
);

router.post(
  "/",
  protect,
  authorize("admin"),
  asyncHandler(createSchoolSettings)
);

router.put(
  "/",
  protect,
  authorize("admin"),
  asyncHandler(updateSchoolSettings)
);

export default router;