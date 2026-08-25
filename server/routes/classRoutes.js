import express from "express";

import {
  getClasses,
  getClassById,
  createClass,
  updateClass,
  deleteClass,
} from "../controllers/classController.js";

import protect from "../middleware/authMiddleware.js";
import authorize from "../middleware/roleMiddleware.js";

const router = express.Router();

router.get("/", getClasses);

router.get(
  "/:id",
  protect,
  authorize("admin", "staff"),
  getClassById
);

router.post(
  "/",
  protect,
  authorize("admin"),
  createClass
);

router.put(
  "/:id",
  protect,
  authorize("admin"),
  updateClass
);

router.delete(
  "/:id",
  protect,
  authorize("admin"),
  deleteClass
);

export default router;