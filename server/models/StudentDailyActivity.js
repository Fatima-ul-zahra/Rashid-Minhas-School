import mongoose from "mongoose";

const mediaSchema = new mongoose.Schema(
  {
    url: {
      type: String,
      required: true,
    },

    publicId: {
      type: String,
      default: "",
    },

    type: {
      type: String,
      enum: ["image", "video", "document"],
      required: true,
    },

    name: {
      type: String,
      default: "",
    },
  },
  {
    _id: false,
  }
);

const studentDailyActivitySchema =
  new mongoose.Schema(
    {
      student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Student",
        required: true,
        index: true,
      },

      date: {
        type: Date,
        required: true,
        index: true,
      },

      studied: {
        type: String,
        trim: true,
        maxlength: 1000,
        default: "",
      },

      dailyActivity: {
        type: String,
        trim: true,
        maxlength: 1500,
        default: "",
      },

      participation: {
        type: String,
        trim: true,
        maxlength: 1000,
        default: "",
      },

      progress: {
        type: String,
        trim: true,
        maxlength: 1500,
        default: "",
      },

      notes: {
        type: String,
        trim: true,
        maxlength: 1500,
        default: "",
      },

      media: {
        type: [mediaSchema],
        default: [],
      },

      createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: null,
      },
    },
    {
      timestamps: true,
    }
  );

studentDailyActivitySchema.index({
  student: 1,
  date: -1,
});

const StudentDailyActivity =
  mongoose.model(
    "StudentDailyActivity",
    studentDailyActivitySchema
  );

export default StudentDailyActivity;