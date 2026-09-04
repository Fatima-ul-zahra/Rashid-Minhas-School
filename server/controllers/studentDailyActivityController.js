import StudentDailyActivity from "../models/StudentDailyActivity.js";
import Student from "../models/Student.js";
import ApiError from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";
import fs from "fs";
import path from "path";

/*
|--------------------------------------------------------------------------
| Get Public Student Daily Activities
|--------------------------------------------------------------------------
*/

const getPublicStudentActivities = asyncHandler(
  async (req, res) => {
    const activities =
      await StudentDailyActivity.find({})
        .populate(
          "student",
          "name rollNumber class photo"
        )
        .sort({
          date: -1,
          createdAt: -1,
        });

    res.status(200).json({
      success: true,
      data: activities,
    });
  }
);

/*
|--------------------------------------------------------------------------
| Get Student Daily Activities
|--------------------------------------------------------------------------
*/

const getStudentActivities = asyncHandler(
  async (req, res) => {
    const student = await Student.findById(
      req.params.studentId
    );

    if (!student) {
      throw new ApiError(
        404,
        "Student not found."
      );
    }

    const activities =
      await StudentDailyActivity.find({
        student: student._id,
      })
        .populate(
          "student",
          "name fatherName admissionNumber rollNumber class photo"
        )
        .sort({
          date: -1,
          createdAt: -1,
        });

    res.status(200).json({
      success: true,
      data: activities,
    });
  }
);

/*
|--------------------------------------------------------------------------
| Create Student Daily Activity
|--------------------------------------------------------------------------
*/

const createStudentActivity = asyncHandler(
  async (req, res) => {
    const {
      date,
      studied,
      dailyActivity,
      participation,
      progress,
      notes,
    } = req.body;

    const student = await Student.findById(
      req.params.studentId
    );

    if (!student) {
      throw new ApiError(
        404,
        "Student not found."
      );
    }

    if (!date) {
      throw new ApiError(
        400,
        "Activity date is required."
      );
    }

    if (
      !studied &&
      !dailyActivity &&
      !participation &&
      !progress &&
      !notes &&
      !req.file
    ) {
      throw new ApiError(
        400,
        "Please provide activity information or media."
      );
    }

    /*
    |--------------------------------------------------------------------------
    | Media
    |--------------------------------------------------------------------------
    */

    let media = [];

    if (req.file) {
      const mediaType =
        req.file.mimetype.startsWith("video/")
          ? "video"
          : "image";

      media.push({
        url: `/uploads/student-activities/${req.file.filename}`,
        type: mediaType,
        name: req.file.originalname,
      });
    }

    /*
    |--------------------------------------------------------------------------
    | Create Activity
    |--------------------------------------------------------------------------
    */

    const activity =
      await StudentDailyActivity.create({
        student: student._id,

        date,

        studied,

        dailyActivity,

        participation,

        progress,

        notes,

        media,

        createdBy:
          req.user?._id || null,
      });

    /*
    |--------------------------------------------------------------------------
    | Populate Student
    |--------------------------------------------------------------------------
    */

    const populatedActivity =
      await StudentDailyActivity.findById(
        activity._id
      ).populate(
        "student",
        "name fatherName admissionNumber rollNumber class photo"
      );

    res.status(201).json({
      success: true,
      message:
        "Daily activity added successfully.",
      data: populatedActivity,
    });
  }
);

/*
|--------------------------------------------------------------------------
| Delete Student Daily Activity
|--------------------------------------------------------------------------
*/

const deleteStudentActivity = asyncHandler(
  async (req, res) => {
    const activity =
      await StudentDailyActivity.findById(
        req.params.id
      );

    if (!activity) {
      throw new ApiError(
        404,
        "Daily activity not found."
      );
    }

    /*
    |--------------------------------------------------------------------------
    | Delete uploaded local media
    |--------------------------------------------------------------------------
    */

    if (
      Array.isArray(activity.media)
    ) {
      for (const media of activity.media) {
        if (!media.url) {
          continue;
        }

        try {
          const relativePath =
            media.url.startsWith("/")
              ? media.url.substring(1)
              : media.url;

          const filePath = path.join(
            process.cwd(),
            relativePath
          );

          if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
          }
        } catch (error) {
          console.error(
            "Media deletion failed:",
            error.message
          );
        }
      }
    }

    await activity.deleteOne();

    res.status(200).json({
      success: true,
      message:
        "Daily activity deleted successfully.",
    });
  }
);

/*
|--------------------------------------------------------------------------
| Exports
|--------------------------------------------------------------------------
*/

export {
  getPublicStudentActivities,
  getStudentActivities,
  createStudentActivity,
  deleteStudentActivity,
};