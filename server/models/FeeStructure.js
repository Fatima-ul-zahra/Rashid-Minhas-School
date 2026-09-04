import mongoose from "mongoose";

const feeStructureSchema = new mongoose.Schema(
  {
    class: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true,
    },

    monthlyFee: {
      type: Number,
      required: true,
      min: 0,
    },

    dueDay: {
      type: Number,
      default: 10,
      min: 1,
      max: 31,
    },

    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
      index: true,
    },

    notes: {
      type: String,
      trim: true,
      default: "",
      maxlength: 500,
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

const FeeStructure = mongoose.model(
  "FeeStructure",
  feeStructureSchema
);

export default FeeStructure;