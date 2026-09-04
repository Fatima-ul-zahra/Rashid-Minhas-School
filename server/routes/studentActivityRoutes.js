import express from "express";

import {
  getPublicStudentActivities,
  getStudentActivities,
  createStudentActivity,
  deleteStudentActivity,
} from "../controllers/studentDailyActivityController.js";

import protect from "../middleware/authMiddleware.js";
import authorize from "../middleware/roleMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";

const router = express.Router();

/*
|--------------------------------------------------------------------------
| Public Student Activities
|--------------------------------------------------------------------------
*/

router.get(
  "/public",
  getPublicStudentActivities
);

/*
|--------------------------------------------------------------------------
| Admin / Staff - Student Activities
|--------------------------------------------------------------------------
*/

router.get(
  "/student/:studentId",
  protect,
  authorize("admin", "staff"),
  getStudentActivities
);

/*
|--------------------------------------------------------------------------
| Admin - Create Student Activity
|--------------------------------------------------------------------------
*/

router.post(
  "/student/:studentId",
  protect,
  authorize("admin"),
  upload.single("media"),
  createStudentActivity
);

/*
|--------------------------------------------------------------------------
| Admin - Delete Student Activity
|--------------------------------------------------------------------------
*/

router.delete(
  "/:id",
  protect,
  authorize("admin"),
  deleteStudentActivity
);

export default router;