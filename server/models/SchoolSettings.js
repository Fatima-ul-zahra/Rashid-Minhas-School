import mongoose from "mongoose";

const schoolSettingsSchema = new mongoose.Schema(
  {
    schoolName: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },

    shortName: {
      type: String,
      trim: true,
      maxlength: 100,
    },

    location: {
      type: String,
      trim: true,
      maxlength: 200,
    },

    address: {
      type: String,
      trim: true,
      maxlength: 500,
    },

    phone: {
      type: String,
      trim: true,
    },

    email: {
      type: String,
      trim: true,
      lowercase: true,
    },

    logo: {
      type: String,
      default: "",
      trim: true,
    },

    principalName: {
      type: String,
      trim: true,
      maxlength: 100,
    },

    principalMessage: {
      type: String,
      trim: true,
      maxlength: 3000,
    },

    mission: {
      type: String,
      trim: true,
      maxlength: 2000,
    },

    vision: {
      type: String,
      trim: true,
      maxlength: 2000,
    },

    socialLinks: {
      facebook: {
        type: String,
        default: "",
        trim: true,
      },

      instagram: {
        type: String,
        default: "",
        trim: true,
      },

      youtube: {
        type: String,
        default: "",
        trim: true,
      },

      website: {
        type: String,
        default: "",
        trim: true,
      },
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const SchoolSettings = mongoose.model(
  "SchoolSettings",
  schoolSettingsSchema
);

export default SchoolSettings;