import Attendance from "../models/Attendance.js";
import Student from "../models/Student.js";
import ApiError from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";

const getAttendanceReport = asyncHandler(
  async (req, res) => {
    const {
      student,
      classId,
      startDate,
      endDate,
    } = req.query;

    const filter = {};

    if (student) {
      filter.student = student;
    }

    if (classId) {
      filter.class = classId;
    }

    if (startDate || endDate) {
      filter.date = {};

      if (startDate) {
        filter.date.$gte = new Date(
          `${startDate}T00:00:00.000Z`
        );
      }

      if (endDate) {
        filter.date.$lte = new Date(
          `${endDate}T23:59:59.999Z`
        );
      }
    }

    const records = await Attendance.find(filter)
      .populate(
        "student",
        "name admissionNumber rollNumber"
      )
      .populate("class", "name")
      .sort({ date: -1 });

    const summary = {
      total: records.length,
      present: 0,
      absent: 0,
      late: 0,
      percentage: 0,
    };

    records.forEach((record) => {
      if (record.status === "present") {
        summary.present++;
      }

      if (record.status === "absent") {
        summary.absent++;
      }

      if (record.status === "late") {
        summary.late++;
      }
    });

    if (summary.total > 0) {
      summary.percentage = Number(
        (
          ((summary.present + summary.late) /
            summary.total) *
          100
        ).toFixed(2)
      );
    }

    res.status(200).json({
      success: true,
      data: {
        records,
        summary,
      },
    });
  }
);

const getStudentAttendanceReport =
  asyncHandler(async (req, res) => {
    const { studentId } = req.params;

    const studentRecord =
      await Student.findById(studentId).select(
        "name admissionNumber rollNumber"
      );

    if (!studentRecord) {
      throw new ApiError(
        404,
        "Student not found."
      );
    }

    const records = await Attendance.find({
      student: studentId,
    }).sort({ date: -1 });

    const total = records.length;

    const present = records.filter(
      (item) => item.status === "present"
    ).length;

    const absent = records.filter(
      (item) => item.status === "absent"
    ).length;

    const late = records.filter(
      (item) => item.status === "late"
    ).length;

    const percentage =
      total > 0
        ? Number(
            (
              ((present + late) / total) *
              100
            ).toFixed(2)
          )
        : 0;

    res.status(200).json({
      success: true,
      data: {
        student: studentRecord,
        records,
        summary: {
          total,
          present,
          absent,
          late,
          percentage,
        },
      },
    });
  });

export {
  getAttendanceReport,
  getStudentAttendanceReport,
};