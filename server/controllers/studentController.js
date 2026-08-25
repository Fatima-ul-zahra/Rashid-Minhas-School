import Student from "../models/Student.js";
import ApiError from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";

const getStudents = asyncHandler(async (req, res) => {
  const students = await Student.find()
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    data: students,
  });
});

const getStudentById = asyncHandler(async (req, res) => {
  const student = await Student.findById(req.params.id);

  if (!student) {
    throw new ApiError(404, "Student not found.");
  }

  res.status(200).json({
    success: true,
    data: student,
  });
});

const createStudent = asyncHandler(async (req, res) => {
  const {
    name,
    fatherName,
    admissionNumber,
    rollNumber,
    class: studentClass,
    dateOfBirth,
    gender,
    phone,
    address,
    admissionDate,
    photo,
    status,
  } = req.body;

  if (!name || !fatherName || !admissionNumber || !studentClass) {
    throw new ApiError(
      400,
      "Name, father name, admission number and class are required."
    );
  }

  const existingStudent = await Student.findOne({
    admissionNumber: admissionNumber.toUpperCase(),
  });

  if (existingStudent) {
    throw new ApiError(
      409,
      "A student with this admission number already exists."
    );
  }

  const student = await Student.create({
    name,
    fatherName,
    admissionNumber,
    rollNumber,
    class: studentClass,
    dateOfBirth,
    gender,
    phone,
    address,
    admissionDate,
    photo,
    status,
  });

  res.status(201).json({
    success: true,
    message: "Student created successfully.",
    data: student,
  });
});

const updateStudent = asyncHandler(async (req, res) => {
  const student = await Student.findById(req.params.id);

  if (!student) {
    throw new ApiError(404, "Student not found.");
  }

  if (
    req.body.admissionNumber &&
    req.body.admissionNumber.toUpperCase() !==
      student.admissionNumber
  ) {
    const duplicate = await Student.findOne({
      admissionNumber:
        req.body.admissionNumber.toUpperCase(),
      _id: {
        $ne: student._id,
      },
    });

    if (duplicate) {
      throw new ApiError(
        409,
        "A student with this admission number already exists."
      );
    }
  }

  Object.assign(student, req.body);

  await student.save();

  res.status(200).json({
    success: true,
    message: "Student updated successfully.",
    data: student,
  });
});

const deleteStudent = asyncHandler(async (req, res) => {
  const student = await Student.findById(req.params.id);

  if (!student) {
    throw new ApiError(404, "Student not found.");
  }

  await student.deleteOne();

  res.status(200).json({
    success: true,
    message: "Student deleted successfully.",
  });
});

export {
  getStudents,
  getStudentById,
  createStudent,
  updateStudent,
  deleteStudent,
};