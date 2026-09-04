import express from "express";

import {
  createFeeStructure,
  getFeeStructures,
  getFeeStructureById,
  updateFeeStructure,
  deleteFeeStructure,
} from "../controllers/feeStructureController.js";

import protect from "../middleware/authMiddleware.js";
import authorize from "../middleware/roleMiddleware.js";

const router = express.Router();

/*
|--------------------------------------------------------------------------
| Get All Fee Structures
|--------------------------------------------------------------------------
*/

router.get(
  "/",
  protect,
  authorize("admin", "staff"),
  getFeeStructures
);

/*
|--------------------------------------------------------------------------
| Get Single Fee Structure
|--------------------------------------------------------------------------
*/

router.get(
  "/:id",
  protect,
  authorize("admin", "staff"),
  getFeeStructureById
);

/*
|--------------------------------------------------------------------------
| Create Fee Structure
|--------------------------------------------------------------------------
*/

router.post(
  "/",
  protect,
  authorize("admin"),
  createFeeStructure
);

/*
|--------------------------------------------------------------------------
| Update Fee Structure
|--------------------------------------------------------------------------
*/

router.put(
  "/:id",
  protect,
  authorize("admin"),
  updateFeeStructure
);

/*
|--------------------------------------------------------------------------
| Delete Fee Structure
|--------------------------------------------------------------------------
*/

router.delete(
  "/:id",
  protect,
  authorize("admin"),
  deleteFeeStructure
);

export default router;