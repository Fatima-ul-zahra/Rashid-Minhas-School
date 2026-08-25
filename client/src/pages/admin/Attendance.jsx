import { useEffect, useState } from "react";

import { useAuth } from "../../context/AuthContext";
import classService from "../../services/classService";
import attendanceService from "../../services/attendanceService";

function Attendance() {
  const { token } = useAuth();

  const [classes, setClasses] = useState([]);
  const [students, setStudents] = useState([]);
  const [attendance, setAttendance] = useState({});

  const [classId, setClassId] = useState("");
  const [date, setDate] = useState(
    new Date().toISOString().slice(0, 10)
  );

  const [loading, setLoading] = useState(false);
  const [loadingStudents, setLoadingStudents] =
    useState(false);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const loadClasses = async () => {
      try {
        const response =
          await classService.getClasses(token);

        setClasses(response.data);
      } catch (error) {
        setError(
          error.response?.data?.message ||
            "Unable to load classes."
        );
      }
    };

    if (token) {
      loadClasses();
    }
  }, [token]);

  const loadStudents = async (selectedClass) => {
    if (!selectedClass) {
      setStudents([]);
      setAttendance({});
      return;
    }

    try {
      setLoadingStudents(true);
      setError("");
      setSuccess("");

      const response =
        await attendanceService.getStudents(
          token,
          selectedClass
        );

      const studentList = response.data;

      setStudents(studentList);

      const initialAttendance = {};

      studentList.forEach((student) => {
        initialAttendance[student._id] = "present";
      });

      setAttendance(initialAttendance);
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Unable to load students."
      );
      setStudents([]);
    } finally {
      setLoadingStudents(false);
    }
  };

  const handleClassChange = (event) => {
    const selectedClass = event.target.value;

    setClassId(selectedClass);
    loadStudents(selectedClass);
  };

  const handleStatusChange = (studentId, status) => {
    setAttendance((current) => ({
      ...current,
      [studentId]: status,
    }));
  };

  const markAll = (status) => {
    const updated = {};

    students.forEach((student) => {
      updated[student._id] = status;
    });

    setAttendance(updated);
  };

  const handleSave = async () => {
    if (!classId) {
      setError("Please select a class.");
      return;
    }

    if (!date) {
      setError("Please select a date.");
      return;
    }

    if (students.length === 0) {
      setError("No students available.");
      return;
    }

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      const records = students.map((student) => ({
        student: student._id,
        status: attendance[student._id] || "present",
      }));

      await attendanceService.saveAttendance(
        token,
        {
          classId,
          date,
          records,
        }
      );

      setSuccess(
        "Attendance saved successfully."
      );
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Unable to save attendance."
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-4 sm:p-6">
      {/* Header */}
      <div>
        <p className="text-sm font-semibold text-blue-700">
          Academic Management
        </p>

        <h1 className="mt-1 text-2xl font-bold text-slate-900">
          Attendance
        </h1>

        <p className="mt-1 text-sm text-slate-500">
          Mark daily student attendance.
        </p>
      </div>

      {/* Messages */}
      {error && (
        <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      {success && (
        <div className="mt-6 rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-700">
          {success}
        </div>
      )}

      {/* Selection */}
      <div className="mt-6 grid gap-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-700">
            Select Class
          </label>

          <select
            value={classId}
            onChange={handleClassChange}
            className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
          >
            <option value="">
              Select class
            </option>

            {classes.map((classItem) => (
              <option
                key={classItem._id}
                value={classItem._id}
              >
                {classItem.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-700">
            Attendance Date
          </label>

          <input
            type="date"
            value={date}
            onChange={(event) =>
              setDate(event.target.value)
            }
            className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
          />
        </div>
      </div>

      {/* Attendance */}
      {classId && (
        <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          {/* Toolbar */}
          <div className="flex flex-col gap-4 border-b border-slate-200 p-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="font-bold text-slate-900">
                Student Attendance
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                {students.length} student
                {students.length !== 1 ? "s" : ""}
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => markAll("present")}
                className="rounded-lg bg-green-50 px-3 py-2 text-xs font-semibold text-green-700 hover:bg-green-100"
              >
                Mark All Present
              </button>

              <button
                type="button"
                onClick={() => markAll("absent")}
                className="rounded-lg bg-red-50 px-3 py-2 text-xs font-semibold text-red-700 hover:bg-red-100"
              >
                Mark All Absent
              </button>

              <button
                type="button"
                onClick={() => markAll("late")}
                className="rounded-lg bg-yellow-50 px-3 py-2 text-xs font-semibold text-yellow-700 hover:bg-yellow-100"
              >
                Mark All Late
              </button>
            </div>
          </div>

          {loadingStudents ? (
            <div className="p-12 text-center text-sm text-slate-500">
              Loading students...
            </div>
          ) : students.length === 0 ? (
            <div className="p-12 text-center">
              <p className="font-semibold text-slate-700">
                No students found
              </p>

              <p className="mt-1 text-sm text-slate-500">
                Add students to this class first.
              </p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="min-w-[800px] w-full text-left">
                  <thead className="border-b border-slate-200 bg-slate-50">
                    <tr>
                      <th className="px-5 py-4 text-xs font-semibold uppercase text-slate-500">
                        Roll No.
                      </th>

                      <th className="px-5 py-4 text-xs font-semibold uppercase text-slate-500">
                        Student
                      </th>

                      <th className="px-5 py-4 text-xs font-semibold uppercase text-slate-500">
                        Present
                      </th>

                      <th className="px-5 py-4 text-xs font-semibold uppercase text-slate-500">
                        Absent
                      </th>

                      <th className="px-5 py-4 text-xs font-semibold uppercase text-slate-500">
                        Late
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-100">
                    {students.map((student) => (
                      <tr
                        key={student._id}
                        className="hover:bg-slate-50"
                      >
                        <td className="px-5 py-4 text-sm text-slate-600">
                          {student.rollNumber || "—"}
                        </td>

                        <td className="px-5 py-4">
                          <p className="font-semibold text-slate-900">
                            {student.name}
                          </p>

                          <p className="text-xs text-slate-500">
                            {student.admissionNumber}
                          </p>
                        </td>

                        <StatusButton
                          active={
                            attendance[
                              student._id
                            ] === "present"
                          }
                          status="present"
                          onClick={() =>
                            handleStatusChange(
                              student._id,
                              "present"
                            )
                          }
                        />

                        <StatusButton
                          active={
                            attendance[
                              student._id
                            ] === "absent"
                          }
                          status="absent"
                          onClick={() =>
                            handleStatusChange(
                              student._id,
                              "absent"
                            )
                          }
                        />

                        <StatusButton
                          active={
                            attendance[
                              student._id
                            ] === "late"
                          }
                          status="late"
                          onClick={() =>
                            handleStatusChange(
                              student._id,
                              "late"
                            )
                          }
                        />
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Save */}
              <div className="flex justify-end border-t border-slate-200 p-5">
                <button
                  type="button"
                  onClick={handleSave}
                  disabled={saving}
                  className="rounded-xl bg-blue-700 px-7 py-3 text-sm font-semibold text-white hover:bg-blue-800 disabled:opacity-60"
                >
                  {saving
                    ? "Saving..."
                    : "Save Attendance"}
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}

function StatusButton({
  active,
  status,
  onClick,
}) {
  const labels = {
    present: "Present",
    absent: "Absent",
    late: "Late",
  };

  return (
    <td className="px-5 py-4">
      <button
        type="button"
        onClick={onClick}
        className={`rounded-lg px-4 py-2 text-xs font-semibold transition ${
          active
            ? status === "present"
              ? "bg-green-600 text-white"
              : status === "absent"
              ? "bg-red-600 text-white"
              : "bg-yellow-500 text-white"
            : "bg-slate-100 text-slate-500 hover:bg-slate-200"
        }`}
      >
        {labels[status]}
      </button>
    </td>
  );
}

export default Attendance;