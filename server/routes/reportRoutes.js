import express from "express";

import {
  getAttendanceReport,
  getStudentAttendanceReport,
} from "../controllers/reportController.js";

import protect from "../middleware/authMiddleware.js";
import authorize from "../middleware/roleMiddleware.js";

const router = express.Router();

router.get(
  "/attendance",
  protect,
  authorize("admin", "staff"),
  getAttendanceReport
);

router.get(
  "/attendance/student/:studentId",
  protect,
  authorize("admin", "staff"),
  getStudentAttendanceReport
);

export default router;