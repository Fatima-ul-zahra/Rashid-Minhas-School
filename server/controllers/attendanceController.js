import Attendance from "../models/Attendance.js";
import Student from "../models/Student.js";
import Class from "../models/Class.js";
import ApiError from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";

const getAttendance = asyncHandler(async (req, res) => {
  const { classId, date } = req.query;

  const filter = {};

  if (date) {
    const startDate = new Date(`${date}T00:00:00.000Z`);
    const endDate = new Date(`${date}T00:00:00.000Z`);

    endDate.setUTCDate(endDate.getUTCDate() + 1);

    filter.date = {
      $gte: startDate,
      $lt: endDate,
    };
  }

  const records = await Attendance.find(filter)
    .populate("student", "name admissionNumber rollNumber")
    .populate("class", "name")
    .sort({ date: -1 });

  res.status(200).json({
    success: true,
    data: records,
  });
});

const getStudentsForAttendance = asyncHandler(
  async (req, res) => {
    const { classId } = req.query;

    if (!classId) {
      throw new ApiError(
        400,
        "Class is required."
      );
    }

    const classItem = await Class.findById(classId);

    if (!classItem) {
      throw new ApiError(
        404,
        "Class not found."
      );
    }

    const students = await Student.find({
      class: classItem.name,
      status: "active",
    }).sort({
      rollNumber: 1,
      name: 1,
    });

    res.status(200).json({
      success: true,
      data: students,
    });
  }
);

const saveAttendance = asyncHandler(
  async (req, res) => {
    const { classId, date, records } = req.body;

    if (!classId || !date || !records) {
      throw new ApiError(
        400,
        "Class, date and attendance records are required."
      );
    }

    if (!Array.isArray(records) || records.length === 0) {
      throw new ApiError(
        400,
        "Attendance records cannot be empty."
      );
    }

    const classItem = await Class.findById(classId);

    if (!classItem) {
      throw new ApiError(
        404,
        "Class not found."
      );
    }

    const attendanceDate = new Date(`${date}T00:00:00.000Z`);

    const operations = records.map((record) => ({
      updateOne: {
        filter: {
          student: record.student,
          class: classId,
          date: attendanceDate,
        },
        update: {
          $set: {
            status: record.status,
          },
        },
        upsert: true,
      },
    }));

    await Attendance.bulkWrite(operations);

    res.status(200).json({
      success: true,
      message: "Attendance saved successfully.",
    });
  }
);

export {
  getAttendance,
  getStudentsForAttendance,
  saveAttendance,
};