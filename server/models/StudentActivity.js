import mongoose from "mongoose";

const studentActivitySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 150,
    },

    description: {
      type: String,
      trim: true,
      maxlength: 1000,
      default: "",
    },

    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      default: null,
    },

    studentName: {
      type: String,
      trim: true,
      default: "",
    },

    class: {
      type: String,
      trim: true,
      default: "",
    },

    videoUrl: {
      type: String,
      required: true,
      trim: true,
    },

    thumbnail: {
      type: String,
      trim: true,
      default: "",
    },

    activityDate: {
      type: Date,
      default: Date.now,
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

const StudentActivity = mongoose.model(
  "StudentActivity",
  studentActivitySchema
);

export default StudentActivity;