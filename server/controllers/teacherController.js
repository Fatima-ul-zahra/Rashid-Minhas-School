import Teacher from "../models/Teacher.js";
import Class from "../models/Class.js";
import ApiError from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";

const getTeachers = asyncHandler(async (req, res) => {
  const teachers = await Teacher.find()
    .populate("assignedClasses", "name")
    .sort({ name: 1 });

  res.status(200).json({
    success: true,
    data: teachers,
  });
});

const getTeacherById = asyncHandler(async (req, res) => {
  const teacher = await Teacher.findById(req.params.id)
    .populate("assignedClasses", "name");

  if (!teacher) {
    throw new ApiError(404, "Teacher not found.");
  }

  res.status(200).json({
    success: true,
    data: teacher,
  });
});

const createTeacher = asyncHandler(async (req, res) => {
  const {
    name,
    photo,
    email,
    phone,
    qualification,
    subject,
    experience,
    joiningDate,
    assignedClasses,
    status,
  } = req.body;

  if (!name) {
    throw new ApiError(
      400,
      "Teacher name is required."
    );
  }

  if (assignedClasses?.length) {
    const validClasses = await Class.countDocuments({
      _id: { $in: assignedClasses },
    });

    if (validClasses !== assignedClasses.length) {
      throw new ApiError(
        400,
        "One or more assigned classes are invalid."
      );
    }
  }

  const teacher = await Teacher.create({
    name: name.trim(),
    photo,
    email,
    phone,
    qualification,
    subject,
    experience,
    joiningDate,
    assignedClasses,
    status,
  });

  const populatedTeacher =
    await Teacher.findById(teacher._id).populate(
      "assignedClasses",
      "name"
    );

  res.status(201).json({
    success: true,
    message: "Teacher created successfully.",
    data: populatedTeacher,
  });
});

const updateTeacher = asyncHandler(async (req, res) => {
  const teacher = await Teacher.findById(
    req.params.id
  );

  if (!teacher) {
    throw new ApiError(404, "Teacher not found.");
  }

  if (req.body.assignedClasses?.length) {
    const validClasses = await Class.countDocuments({
      _id: { $in: req.body.assignedClasses },
    });

    if (
      validClasses !== req.body.assignedClasses.length
    ) {
      throw new ApiError(
        400,
        "One or more assigned classes are invalid."
      );
    }
  }

  Object.assign(teacher, req.body);

  await teacher.save();

  const populatedTeacher =
    await Teacher.findById(teacher._id).populate(
      "assignedClasses",
      "name"
    );

  res.status(200).json({
    success: true,
    message: "Teacher updated successfully.",
    data: populatedTeacher,
  });
});

const deleteTeacher = asyncHandler(async (req, res) => {
  const teacher = await Teacher.findById(
    req.params.id
  );

  if (!teacher) {
    throw new ApiError(404, "Teacher not found.");
  }

  await teacher.deleteOne();

  res.status(200).json({
    success: true,
    message: "Teacher deleted successfully.",
  });
});

export {
  getTeachers,
  getTeacherById,
  createTeacher,
  updateTeacher,
  deleteTeacher,
};