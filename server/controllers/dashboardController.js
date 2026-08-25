import Student from "../models/Student.js";
import Teacher from "../models/Teacher.js";
import Class from "../models/Class.js";
import Admission from "../models/Admission.js";
import Announcement from "../models/Announcement.js";
import Attendance from "../models/Attendance.js";

const getDashboardStats = async (req, res) => {
  const now = new Date();

  const dateKey = now.toISOString().slice(0, 10);

  const today = new Date(`${dateKey}T00:00:00.000Z`);

  const tomorrow = new Date(`${dateKey}T00:00:00.000Z`);
  tomorrow.setUTCDate(tomorrow.getUTCDate() + 1);

  const [
    totalStudents,
    totalTeachers,
    totalClasses,
    pendingAdmissions,
    totalAnnouncements,
    attendanceRecords,
  ] = await Promise.all([
    Student.countDocuments(),

    Teacher.countDocuments(),

    Class.countDocuments(),

    Admission.countDocuments({
      status: "pending",
    }),

    Announcement.countDocuments({
      status: "published",
    }),

    Attendance.find({
      date: {
        $gte: today,
        $lt: tomorrow,
      },
    }).select("status"),
  ]);

  const present = attendanceRecords.filter(
    (record) => record.status === "present"
  ).length;

  const absent = attendanceRecords.filter(
    (record) => record.status === "absent"
  ).length;

  const late = attendanceRecords.filter(
    (record) => record.status === "late"
  ).length;

  const totalAttendance =
    present + absent + late;

  const attendancePercentage =
    totalAttendance > 0
      ? Math.round(
          ((present + late) / totalAttendance) * 100
        )
      : 0;

  res.status(200).json({
    success: true,

    data: {
      totalStudents,
      totalTeachers,
      totalClasses,
      pendingAdmissions,
      totalAnnouncements,

      attendance: {
        present,
        absent,
        late,
        percentage: attendancePercentage,
      },
    },
  });
};

export default getDashboardStats;