import express from "express";

import {
  getGallery,
  getAdminGallery,
  getGalleryItem,
  createGalleryItem,
  updateGalleryItem,
  deleteGalleryItem,
} from "../controllers/galleryController.js";

import protect from "../middleware/authMiddleware.js";
import authorize from "../middleware/roleMiddleware.js";
import uploadImage from "../middleware/uploadMiddleware.js";

const router = express.Router();

/*
|--------------------------------------------------------------------------
| Public Gallery
|--------------------------------------------------------------------------
*/

router.get("/", getGallery);

/*
|--------------------------------------------------------------------------
| Admin Gallery
|--------------------------------------------------------------------------
| IMPORTANT:
| This route MUST come before /:id
|--------------------------------------------------------------------------
*/

router.get(
  "/admin",
  protect,
  authorize("admin", "staff"),
  getAdminGallery
);

/*
|--------------------------------------------------------------------------
| Single Gallery Item
|--------------------------------------------------------------------------
*/

router.get(
  "/:id",
  protect,
  authorize("admin", "staff"),
  getGalleryItem
);

/*
|--------------------------------------------------------------------------
| Create Gallery Item
|--------------------------------------------------------------------------
*/

router.post(
  "/",
  protect,
  authorize("admin"),
  uploadImage.single("media"),
  createGalleryItem
);

/*
|--------------------------------------------------------------------------
| Update Gallery Item
|--------------------------------------------------------------------------
*/

router.put(
  "/:id",
  protect,
  authorize("admin"),
  uploadImage.single("media"),
  updateGalleryItem
);

/*
|--------------------------------------------------------------------------
| Delete Gallery Item
|--------------------------------------------------------------------------
*/

router.delete(
  "/:id",
  protect,
  authorize("admin"),
  deleteGalleryItem
);

export default router;