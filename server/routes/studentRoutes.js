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
import uploadStudentPhoto from "../middleware/uploadMiddleware.js";

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
  uploadStudentPhoto.single("photo"),
  createStudent
);

router.put(
  "/:id",
  protect,
  authorize("admin"),
  uploadStudentPhoto.single("photo"),
  updateStudent
);

router.delete(
  "/:id",
  protect,
  authorize("admin"),
  deleteStudent
);

export default router;