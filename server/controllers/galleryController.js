import Gallery from "../models/Gallery.js";
import ApiError from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";

/*
|--------------------------------------------------------------------------
| Get Public Gallery
|--------------------------------------------------------------------------
*/

const getGallery = asyncHandler(async (req, res) => {
  const filter = {
    status: "published",
  };

  const gallery = await Gallery.find(filter)
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    data: gallery,
  });
});

/*
|--------------------------------------------------------------------------
| Get Single Gallery Item
|--------------------------------------------------------------------------
*/

const getGalleryItem = asyncHandler(async (req, res) => {
  const item = await Gallery.findById(req.params.id);

  if (!item) {
    throw new ApiError(
      404,
      "Gallery item not found."
    );
  }

  res.status(200).json({
    success: true,
    data: item,
  });
});


const getAdminGallery = asyncHandler(async (req, res) => {
  const gallery = await Gallery.find({})
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    data: gallery,
  });
});

/*
|--------------------------------------------------------------------------
| Create Gallery Item
|--------------------------------------------------------------------------
*/

const createGalleryItem = asyncHandler(async (req, res) => {
  const {
    title,
    caption,
    category,
    status,
  } = req.body;

  if (!title || !title.trim()) {
    throw new ApiError(
      400,
      "Gallery title is required."
    );
  }

  /*
  |--------------------------------------------------------------------------
  | Uploaded media is required
  |--------------------------------------------------------------------------
  */

  if (!req.file) {
    throw new ApiError(
      400,
      "Please select an image or video."
    );
  }

  const mediaPath =
    `/uploads/gallery/${req.file.filename}`;

  /*
  |--------------------------------------------------------------------------
  | Determine media type
  |--------------------------------------------------------------------------
  */

  let mediaType = "image";

  if (req.file.mimetype.startsWith("video/")) {
    mediaType = "video";
  }

  const item = await Gallery.create({
    title: title.trim(),

    caption: caption
      ? caption.trim()
      : "",

    media: mediaPath,

    mediaType,

    category: category
      ? category.trim()
      : "General",

    status: status || "published",
  });

  res.status(201).json({
    success: true,
    message: "Gallery item created successfully.",
    data: item,
  });
});

/*
|--------------------------------------------------------------------------
| Update Gallery Item
|--------------------------------------------------------------------------
*/

const updateGalleryItem = asyncHandler(async (req, res) => {
  const item = await Gallery.findById(
    req.params.id
  );

  if (!item) {
    throw new ApiError(
      404,
      "Gallery item not found."
    );
  }

  const {
    title,
    caption,
    category,
    status,
  } = req.body;

  if (title !== undefined) {
    if (!title.trim()) {
      throw new ApiError(
        400,
        "Gallery title is required."
      );
    }

    item.title = title.trim();
  }

  if (caption !== undefined) {
    item.caption = caption.trim();
  }

  if (category !== undefined) {
    item.category = category.trim();
  }

  if (status !== undefined) {
    item.status = status;
  }

  /*
  |--------------------------------------------------------------------------
  | Replace media only if a new file was selected
  |--------------------------------------------------------------------------
  */

  if (req.file) {
    item.media =
      `/uploads/gallery/${req.file.filename}`;

    item.mediaType =
      req.file.mimetype.startsWith("video/")
        ? "video"
        : "image";
  }

  await item.save();

  res.status(200).json({
    success: true,
    message: "Gallery item updated successfully.",
    data: item,
  });
});

/*
|--------------------------------------------------------------------------
| Delete Gallery Item
|--------------------------------------------------------------------------
*/

const deleteGalleryItem = asyncHandler(async (req, res) => {
  const item = await Gallery.findById(
    req.params.id
  );

  if (!item) {
    throw new ApiError(
      404,
      "Gallery item not found."
    );
  }

  await item.deleteOne();

  res.status(200).json({
    success: true,
    message: "Gallery item deleted successfully.",
  });
});

/*
|--------------------------------------------------------------------------
| Exports
|--------------------------------------------------------------------------
*/

export {
  getGallery,
  getAdminGallery,
  getGalleryItem,
  createGalleryItem,
  updateGalleryItem,
  deleteGalleryItem,
};