import Class from "../models/Class.js";
import ApiError from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";

const getClasses = asyncHandler(async (req, res) => {
  const classes = await Class.find().sort({
    name: 1,
  });

  res.status(200).json({
    success: true,
    data: classes,
  });
});

const getClassById = asyncHandler(async (req, res) => {
  const classItem = await Class.findById(req.params.id);

  if (!classItem) {
    throw new ApiError(404, "Class not found.");
  }

  res.status(200).json({
    success: true,
    data: classItem,
  });
});

const createClass = asyncHandler(async (req, res) => {
  const { name, description, status } = req.body;

  if (!name) {
    throw new ApiError(
      400,
      "Class name is required."
    );
  }

  const existingClass = await Class.findOne({
    name: name.trim(),
  });

  if (existingClass) {
    throw new ApiError(
      409,
      "This class already exists."
    );
  }

  const classItem = await Class.create({
    name: name.trim(),
    description,
    status,
  });

  res.status(201).json({
    success: true,
    message: "Class created successfully.",
    data: classItem,
  });
});

const updateClass = asyncHandler(async (req, res) => {
  const classItem = await Class.findById(req.params.id);

  if (!classItem) {
    throw new ApiError(404, "Class not found.");
  }

  if (req.body.name) {
    const duplicate = await Class.findOne({
      name: req.body.name.trim(),
      _id: {
        $ne: classItem._id,
      },
    });

    if (duplicate) {
      throw new ApiError(
        409,
        "This class already exists."
      );
    }
  }

  Object.assign(classItem, req.body);

  await classItem.save();

  res.status(200).json({
    success: true,
    message: "Class updated successfully.",
    data: classItem,
  });
});

const deleteClass = asyncHandler(async (req, res) => {
  const classItem = await Class.findById(req.params.id);

  if (!classItem) {
    throw new ApiError(404, "Class not found.");
  }

  await classItem.deleteOne();

  res.status(200).json({
    success: true,
    message: "Class deleted successfully.",
  });
});

export {
  getClasses,
  getClassById,
  createClass,
  updateClass,
  deleteClass,
};