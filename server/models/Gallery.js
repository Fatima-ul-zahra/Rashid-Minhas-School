import mongoose from "mongoose";

const gallerySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },

    caption: {
      type: String,
      trim: true,
      default: "",
    },

    media: {
      type: String,
      required: true,
      trim: true,
    },

    mediaType: {
      type: String,
      enum: ["image", "video"],
      required: true,
      default: "image",
    },

    category: {
      type: String,
      trim: true,
      default: "General",
      index: true,
    },

    status: {
      type: String,
      enum: ["published", "unpublished"],
      default: "published",
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

const Gallery = mongoose.model(
  "Gallery",
  gallerySchema
);

export default Gallery;