import express from "express";

import {
  createFee,
  getFees,
  getFeeById,
  getStudentFees,
  updateFee,
  deleteFee,
} from "../controllers/feeController.js";

import protect from "../middleware/authMiddleware.js";
import authorize from "../middleware/roleMiddleware.js";

const router = express.Router();

/*
|--------------------------------------------------------------------------
| Fee Routes
|--------------------------------------------------------------------------
*/

/*
| Get all fees
| Admin / Staff
*/

router.get(
  "/",
  protect,
  authorize("admin", "staff"),
  getFees
);

/*
| Get fees for one student
| Admin / Staff
*/

router.get(
  "/student/:studentId",
  protect,
  authorize("admin", "staff"),
  getStudentFees
);

/*
| Get single fee
| Admin / Staff
*/

router.get(
  "/:id",
  protect,
  authorize("admin", "staff"),
  getFeeById
);

/*
| Create fee
| Admin only
*/

router.post(
  "/",
  protect,
  authorize("admin"),
  createFee
);

/*
| Update fee
| Admin only
*/

router.put(
  "/:id",
  protect,
  authorize("admin"),
  updateFee
);

/*
| Delete fee
| Admin only
*/

router.delete(
  "/:id",
  protect,
  authorize("admin"),
  deleteFee
);

export default router;