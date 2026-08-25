import SchoolSettings from "../models/SchoolSettings.js";
import ApiError from "../utils/ApiError.js";

const getSchoolSettings = async (req, res) => {
  const settings = await SchoolSettings.findOne({
    isActive: true,
  }).lean();

  if (!settings) {
    throw new ApiError(
      404,
      "School settings have not been configured yet."
    );
  }

  res.status(200).json({
    success: true,
    data: settings,
  });
};

const createSchoolSettings = async (req, res) => {
  const existingSettings = await SchoolSettings.findOne();

  if (existingSettings) {
    throw new ApiError(
      409,
      "School settings already exist. Use update instead."
    );
  }

  const settings = await SchoolSettings.create(req.body);

  res.status(201).json({
    success: true,
    message: "School settings created successfully.",
    data: settings,
  });
};

const updateSchoolSettings = async (req, res) => {
  const settings = await SchoolSettings.findOne();

  if (!settings) {
    throw new ApiError(
      404,
      "School settings have not been configured yet."
    );
  }

  const updatedSettings = await SchoolSettings.findByIdAndUpdate(
    settings._id,
    req.body,
    {
      new: true,
      runValidators: true,
    }
  );

  res.status(200).json({
    success: true,
    message: "School settings updated successfully.",
    data: updatedSettings,
  });
};

export {
  getSchoolSettings,
  createSchoolSettings,
  updateSchoolSettings,
};