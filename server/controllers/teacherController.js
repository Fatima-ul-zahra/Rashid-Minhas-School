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
    email,
    phone,
    qualification,
    subject,
    experience,
    joiningDate,
    status,
  } = req.body;

  let assignedClasses = req.body.assignedClasses || [];

  // Multipart form data can send a single class as a string.
  if (!Array.isArray(assignedClasses)) {
    assignedClasses = [assignedClasses];
  }

  // Remove empty values
  assignedClasses = assignedClasses.filter(Boolean);

  if (!name) {
    throw new ApiError(
      400,
      "Teacher name is required."
    );
  }

  if (assignedClasses.length) {
    const validClasses =
      await Class.countDocuments({
        _id: {
          $in: assignedClasses,
        },
      });

    if (validClasses !== assignedClasses.length) {
      throw new ApiError(
        400,
        "One or more assigned classes are invalid."
      );
    }
  }

  let photo = "";

  // Save uploaded photo path
  if (req.file) {
    photo = `/uploads/teachers/${req.file.filename}`;
  }

  const teacher = await Teacher.create({
    name: name.trim(),
    photo,
    email,
    phone,
    qualification,
    subject,
    experience,
    joiningDate: joiningDate || null,
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

  let assignedClasses =
    req.body.assignedClasses;

  if (assignedClasses !== undefined) {
    if (!Array.isArray(assignedClasses)) {
      assignedClasses = [assignedClasses];
    }

    assignedClasses =
      assignedClasses.filter(Boolean);

    if (assignedClasses.length) {
      const validClasses =
        await Class.countDocuments({
          _id: {
            $in: assignedClasses,
          },
        });

      if (
        validClasses !==
        assignedClasses.length
      ) {
        throw new ApiError(
          400,
          "One or more assigned classes are invalid."
        );
      }
    }

    teacher.assignedClasses = assignedClasses;
  }

  if (req.body.name !== undefined) {
    if (!req.body.name.trim()) {
      throw new ApiError(
        400,
        "Teacher name is required."
      );
    }

    teacher.name = req.body.name.trim();
  }

  if (req.body.email !== undefined) {
    teacher.email = req.body.email;
  }

  if (req.body.phone !== undefined) {
    teacher.phone = req.body.phone;
  }

  if (req.body.qualification !== undefined) {
    teacher.qualification =
      req.body.qualification;
  }

  if (req.body.subject !== undefined) {
    teacher.subject = req.body.subject;
  }

  if (req.body.experience !== undefined) {
    teacher.experience = req.body.experience;
  }

  if (req.body.joiningDate !== undefined) {
    teacher.joiningDate =
      req.body.joiningDate || null;
  }

  if (req.body.status !== undefined) {
    teacher.status = req.body.status;
  }

  // Replace photo only when a new photo is uploaded
  if (req.file) {
    teacher.photo =
      `/uploads/teachers/${req.file.filename}`;
  }

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