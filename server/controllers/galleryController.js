import Gallery from "../models/Gallery.js";
import ApiError from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";

const getGallery = asyncHandler(async (req, res) => {
  const filter = {};

  if (!req.user) {
    filter.status = "published";
  }

  const gallery = await Gallery.find(filter)
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    data: gallery,
  });
});

const getGalleryItem = asyncHandler(
  async (req, res) => {
    const item = await Gallery.findById(
      req.params.id
    );

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
  }
);

const createGalleryItem = asyncHandler(
  async (req, res) => {
    const {
      title,
      caption,
      image,
      category,
      status,
    } = req.body;

    if (!title || !image) {
      throw new ApiError(
        400,
        "Title and image are required."
      );
    }

    const item = await Gallery.create({
      title: title.trim(),
      caption: caption || "",
      image: image.trim(),
      category: category || "General",
      status: status || "published",
    });

    res.status(201).json({
      success: true,
      message: "Gallery item created successfully.",
      data: item,
    });
  }
);

const updateGalleryItem = asyncHandler(
  async (req, res) => {
    const item = await Gallery.findById(
      req.params.id
    );

    if (!item) {
      throw new ApiError(
        404,
        "Gallery item not found."
      );
    }

    Object.assign(item, req.body);

    await item.save();

    res.status(200).json({
      success: true,
      message: "Gallery item updated successfully.",
      data: item,
    });
  }
);

const deleteGalleryItem = asyncHandler(
  async (req, res) => {
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
  }
);

export {
  getGallery,
  getGalleryItem,
  createGalleryItem,
  updateGalleryItem,
  deleteGalleryItem,
};