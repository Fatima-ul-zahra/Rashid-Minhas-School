import express from "express";

import {
  getTeachers,
  getTeacherById,
  createTeacher,
  updateTeacher,
  deleteTeacher,
} from "../controllers/teacherController.js";

import protect from "../middleware/authMiddleware.js";
import authorize from "../middleware/roleMiddleware.js";
import uploadImage from "../middleware/uploadMiddleware.js";

const router = express.Router();

router.get(
  "/",
  protect,
  authorize("admin", "staff"),
  getTeachers
);

router.get(
  "/:id",
  protect,
  authorize("admin", "staff"),
  getTeacherById
);

router.post(
  "/",
  protect,
  authorize("admin"),
  uploadImage.single("photo"),
  createTeacher
);

router.put(
  "/:id",
  protect,
  authorize("admin"),
  uploadImage.single("photo"),
  updateTeacher
);

router.delete(
  "/:id",
  protect,
  authorize("admin"),
  deleteTeacher
);

export default router;