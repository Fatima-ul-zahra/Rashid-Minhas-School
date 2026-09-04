import mongoose from "mongoose";
import dotenv from "dotenv";

import Student from "./models/Student.js";
import Attendance from "./models/Attendance.js";
import StudentDailyActivity from "./models/StudentDailyActivity.js";
import Fee from "./models/Fee.js";

dotenv.config();

const mongoUri = process.env.MONGO_URI;

if (!mongoUri) {
  console.error(
    "MONGO_URI is missing from .env"
  );

  process.exit(1);
}

const cleanup = async () => {
  try {
    await mongoose.connect(mongoUri);

    console.log(
      "Connected to MongoDB."
    );

    const students =
      await Student.find()
        .select("_id")
        .lean();

    const studentIds =
      students.map(
        (student) => student._id
      );

    const attendanceResult =
      await Attendance.deleteMany({
        student: {
          $nin: studentIds,
        },
      });

    const activityResult =
      await StudentDailyActivity.deleteMany({
        student: {
          $nin: studentIds,
        },
      });

    const feeResult =
      await Fee.deleteMany({
        student: {
          $nin: studentIds,
        },
      });

    console.log(
      `Orphan attendance records removed: ${attendanceResult.deletedCount}`
    );

    console.log(
      `Orphan daily activity records removed: ${activityResult.deletedCount}`
    );

    console.log(
      `Orphan fee records removed: ${feeResult.deletedCount}`
    );

    console.log(
      "Orphan student records cleanup completed."
    );
  } catch (error) {
    console.error(
      "Cleanup failed:",
      error.message
    );

    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
};

cleanup();