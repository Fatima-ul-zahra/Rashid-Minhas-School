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

    image: {
      type: String,
      required: true,
      trim: true,
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