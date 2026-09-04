import StudentActivity from "../models/StudentActivity.js";
import Student from "../models/Student.js";
import ApiError from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";

const getPublicActivities = asyncHandler(
  async (req, res) => {
    const activities = await StudentActivity.find({
      status: "published",
    })
      .populate("student", "name rollNumber class")
      .sort({ activityDate: -1, createdAt: -1 });

    res.status(200).json({
      success: true,
      data: activities,
    });
  }
);

const getAdminActivities = asyncHandler(
  async (req, res) => {
    const activities = await StudentActivity.find()
      .populate("student", "name rollNumber class")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: activities,
    });
  }
);

const getActivityById = asyncHandler(
  async (req, res) => {
    const activity =
      await StudentActivity.findById(req.params.id)
        .populate(
          "student",
          "name rollNumber class admissionNumber"
        );

    if (!activity) {
      throw new ApiError(
        404,
        "Student activity not found."
      );
    }

    res.status(200).json({
      success: true,
      data: activity,
    });
  }
);

const createActivity = asyncHandler(
  async (req, res) => {
    const {
      title,
      description,
      student,
      class: studentClass,
      videoUrl,
      thumbnail,
      activityDate,
      status,
    } = req.body;

    if (!title || !videoUrl) {
      throw new ApiError(
        400,
        "Title and video URL are required."
      );
    }

    let studentName = "";

    if (student) {
      const studentRecord =
        await Student.findById(student);

      if (!studentRecord) {
        throw new ApiError(
          404,
          "Student not found."
        );
      }

      studentName = studentRecord.name;
    }

    const activity =
      await StudentActivity.create({
        title,
        description,
        student,
        studentName,
        class: studentClass,
        videoUrl,
        thumbnail,
        activityDate,
        status,
      });

    const populatedActivity =
      await StudentActivity.findById(activity._id)
        .populate("student", "name rollNumber class");

    res.status(201).json({
      success: true,
      message:
        "Student activity created successfully.",
      data: populatedActivity,
    });
  }
);

const updateActivity = asyncHandler(
  async (req, res) => {
    const activity =
      await StudentActivity.findById(req.params.id);

    if (!activity) {
      throw new ApiError(
        404,
        "Student activity not found."
      );
    }

    if (req.body.student) {
      const studentRecord =
        await Student.findById(req.body.student);

      if (!studentRecord) {
        throw new ApiError(
          404,
          "Student not found."
        );
      }

      activity.studentName = studentRecord.name;
    }

    Object.assign(activity, req.body);

    await activity.save();

    const updatedActivity =
      await StudentActivity.findById(activity._id)
        .populate("student", "name rollNumber class");

    res.status(200).json({
      success: true,
      message:
        "Student activity updated successfully.",
      data: updatedActivity,
    });
  }
);

const deleteActivity = asyncHandler(
  async (req, res) => {
    const activity =
      await StudentActivity.findById(req.params.id);

    if (!activity) {
      throw new ApiError(
        404,
        "Student activity not found."
      );
    }

    await activity.deleteOne();

    res.status(200).json({
      success: true,
      message:
        "Student activity deleted successfully.",
    });
  }
);

export {
  getPublicActivities,
  getAdminActivities,
  getActivityById,
  createActivity,
  updateActivity,
  deleteActivity,
};