import express from "express";

import {
  getStudents,
  getStudentById,
  createStudent,
  updateStudent,
  deleteStudent,
} from "../controllers/studentController.js";

import protect from "../middleware/authMiddleware.js";
import authorize from "../middleware/roleMiddleware.js";

const router = express.Router();

router.get(
  "/",
  protect,
  authorize("admin", "staff"),
  getStudents
);

router.get(
  "/:id",
  protect,
  authorize("admin", "staff"),
  getStudentById
);

router.post(
  "/",
  protect,
  authorize("admin"),
  createStudent
);

router.put(
  "/:id",
  protect,
  authorize("admin"),
  updateStudent
);

router.delete(
  "/:id",
  protect,
  authorize("admin"),
  deleteStudent
);

export default router;