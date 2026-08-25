import mongoose from "mongoose";

const studentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },

    fatherName: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },

    admissionNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      uppercase: true,
      index: true,
    },

    rollNumber: {
      type: String,
      trim: true,
      default: "",
    },

    class: {
      type: String,
      required: true,
      trim: true,
    },

    dateOfBirth: {
      type: Date,
      default: null,
    },

    gender: {
      type: String,
      enum: ["male", "female", "other"],
      default: "other",
    },

    phone: {
      type: String,
      trim: true,
      default: "",
    },

    address: {
      type: String,
      trim: true,
      default: "",
    },

    admissionDate: {
      type: Date,
      default: Date.now,
    },

    photo: {
      type: String,
      default: "",
    },

    status: {
      type: String,
      enum: ["active", "inactive", "graduated"],
      default: "active",
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

const Student = mongoose.model("Student", studentSchema);

export default Student;