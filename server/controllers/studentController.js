import mongoose from "mongoose";
import fs from "fs/promises";
import path from "path";

import Student from "../models/Student.js";
import Attendance from "../models/Attendance.js";
import StudentDailyActivity from "../models/StudentDailyActivity.js";
import Fee from "../models/Fee.js";

import ApiError from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";

const deleteLocalFile = async (fileUrl) => {
  if (!fileUrl || typeof fileUrl !== "string") {
    return;
  }

  if (!fileUrl.startsWith("/uploads/")) {
    return;
  }

  const relativePath = fileUrl.replace(/^\/uploads\//, "");

  const uploadsRoot = path.resolve(
    process.cwd(),
    "uploads"
  );

  const filePath = path.resolve(
    uploadsRoot,
    relativePath
  );

  // Prevent path traversal
  if (
    filePath !== uploadsRoot &&
    !filePath.startsWith(`${uploadsRoot}${path.sep}`)
  ) {
    return;
  }

  try {
    await fs.unlink(filePath);
  } catch (error) {
    if (error.code !== "ENOENT") {
      console.error(
        "Failed to delete uploaded file:",
        filePath,
        error.message
      );
    }
  }
};

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
    throw new ApiError(
      404,
      "Student not found."
    );
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
    status,
  } = req.body;

  if (
    !name ||
    !fatherName ||
    !admissionNumber ||
    !studentClass
  ) {
    throw new ApiError(
      400,
      "Name, father name, admission number and class are required."
    );
  }

  const existingStudent = await Student.findOne({
    admissionNumber:
      admissionNumber.toUpperCase(),
  });

  if (existingStudent) {
    throw new ApiError(
      409,
      "A student with this admission number already exists."
    );
  }

  let photo = "";

  if (req.file) {
    photo = `/uploads/students/${req.file.filename}`;
  }

  const student = await Student.create({
    name,
    fatherName,
    admissionNumber,
    rollNumber,
    class: studentClass,
    dateOfBirth: dateOfBirth || null,
    gender,
    phone,
    address,
    admissionDate: admissionDate || null,
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
  const student = await Student.findById(
    req.params.id
  );

  if (!student) {
    throw new ApiError(
      404,
      "Student not found."
    );
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
    status,
  } = req.body;

  student.name = name ?? student.name;

  student.fatherName =
    fatherName ?? student.fatherName;

  student.admissionNumber =
    admissionNumber
      ? admissionNumber.toUpperCase()
      : student.admissionNumber;

  student.rollNumber =
    rollNumber ?? student.rollNumber;

  student.class =
    studentClass ?? student.class;

  student.dateOfBirth =
    dateOfBirth || null;

  student.gender =
    gender ?? student.gender;

  student.phone =
    phone ?? student.phone;

  student.address =
    address ?? student.address;

  student.admissionDate =
    admissionDate || null;

  student.status =
    status ?? student.status;

  if (req.file) {
    const oldPhoto = student.photo;

    student.photo =
      `/uploads/students/${req.file.filename}`;

    await student.save();

    if (
      oldPhoto &&
      oldPhoto !== student.photo
    ) {
      await deleteLocalFile(oldPhoto);
    }

    res.status(200).json({
      success: true,
      message: "Student updated successfully.",
      data: student,
    });

    return;
  }

  await student.save();

  res.status(200).json({
    success: true,
    message: "Student updated successfully.",
    data: student,
  });
});

const deleteStudent = asyncHandler(async (req, res) => {
  const studentId = req.params.id;

  if (!mongoose.isValidObjectId(studentId)) {
    throw new ApiError(
      400,
      "Invalid student ID."
    );
  }

  const session =
    await mongoose.startSession();

  let student;
  let dailyActivities = [];

  try {
    await session.withTransaction(async () => {
      student = await Student.findById(
        studentId
      ).session(session);

      if (!student) {
        throw new ApiError(
          404,
          "Student not found."
        );
      }

      // Collect daily activities before deleting
      // them so their uploaded media can be removed.
      dailyActivities =
        await StudentDailyActivity.find({
          student: student._id,
        }).session(session);

      // Delete attendance records
      await Attendance.deleteMany(
        {
          student: student._id,
        },
        { session }
      );

      // Delete daily learning activities
      await StudentDailyActivity.deleteMany(
        {
          student: student._id,
        },
        { session }
      );

      // Delete fee records
      await Fee.deleteMany(
        {
          student: student._id,
        },
        { session }
      );

      // Finally delete the student
      await Student.deleteOne(
        {
          _id: student._id,
        },
        { session }
      );
    });
  } finally {
    await session.endSession();
  }

  // Delete student's uploaded photo
  await deleteLocalFile(student.photo);

  // Delete uploaded media attached to daily activities
  for (const activity of dailyActivities) {
    if (
      Array.isArray(activity.media)
    ) {
      for (const media of activity.media) {
        await deleteLocalFile(media.url);
      }
    }
  }

  res.status(200).json({
    success: true,
    message:
      "Student and all related records deleted successfully.",
  });
});

export {
  getStudents,
  getStudentById,
  createStudent,
  updateStudent,
  deleteStudent,
};