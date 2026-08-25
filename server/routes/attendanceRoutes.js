import express from "express";

import {
  getAttendance,
  getStudentsForAttendance,
  saveAttendance,
} from "../controllers/attendanceController.js";

import protect from "../middleware/authMiddleware.js";
import authorize from "../middleware/roleMiddleware.js";

const router = express.Router();

router.get(
  "/",
  protect,
  authorize("admin", "staff"),
  getAttendance
);

router.get(
  "/students",
  protect,
  authorize("admin", "staff"),
  getStudentsForAttendance
);

router.post(
  "/",
  protect,
  authorize("admin", "staff"),
  saveAttendance
);

export default router;