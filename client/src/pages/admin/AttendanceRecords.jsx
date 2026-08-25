import { useEffect, useState } from "react";

import { useAuth } from "../../context/AuthContext";
import classService from "../../services/classService";
import attendanceService from "../../services/attendanceService";

function AttendanceRecords() {
  const { token } = useAuth();

  const [classes, setClasses] = useState([]);
  const [records, setRecords] = useState([]);

  const [classId, setClassId] = useState("");
  const [date, setDate] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadClasses = async () => {
      try {
        const response = await classService.getClasses(token);
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

  const loadRecords = async () => {
    try {
      setLoading(true);
      setError("");

      const params = {};

      if (classId) {
        params.classId = classId;
      }

      if (date) {
        params.date = date;
      }

      const response =
        await attendanceService.getAttendance(
          token,
          params
        );

      setRecords(response.data);
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Unable to load attendance records."
      );
    } finally {
      setLoading(false);
    }
  };

  const clearFilters = () => {
    setClassId("");
    setDate("");
    setRecords([]);
    setError("");
  };

  return (
    <div className="p-4 sm:p-6">
      <div>
        <p className="text-sm font-semibold text-blue-700">
          Academic Management
        </p>

        <h1 className="mt-1 text-2xl font-bold text-slate-900">
          Attendance Records
        </h1>

        <p className="mt-1 text-sm text-slate-500">
          View and filter saved attendance records.
        </p>
      </div>

      {error && (
        <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Filters */}
      <div className="mt-6 grid gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:grid-cols-3">
        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-700">
            Class
          </label>

          <select
            value={classId}
            onChange={(event) =>
              setClassId(event.target.value)
            }
            className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-600"
          >
            <option value="">All Classes</option>

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
            Date
          </label>

          <input
            type="date"
            value={date}
            onChange={(event) =>
              setDate(event.target.value)
            }
            className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-600"
          />
        </div>

        <div className="flex items-end gap-2">
          <button
            type="button"
            onClick={loadRecords}
            className="flex-1 rounded-xl bg-blue-700 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-800"
          >
            Search
          </button>

          <button
            type="button"
            onClick={clearFilters}
            className="rounded-xl border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            Clear
          </button>
        </div>
      </div>

      {/* Records */}
      <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        {loading ? (
          <div className="p-12 text-center text-sm text-slate-500">
            Loading attendance records...
          </div>
        ) : records.length === 0 ? (
          <div className="p-12 text-center">
            <p className="font-semibold text-slate-700">
              No attendance records
            </p>

            <p className="mt-1 text-sm text-slate-500">
              Select filters and click Search.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-[800px] w-full text-left">
              <thead className="border-b border-slate-200 bg-slate-50">
                <tr>
                  <th className="px-5 py-4 text-xs font-semibold uppercase text-slate-500">
                    Date
                  </th>

                  <th className="px-5 py-4 text-xs font-semibold uppercase text-slate-500">
                    Class
                  </th>

                  <th className="px-5 py-4 text-xs font-semibold uppercase text-slate-500">
                    Student
                  </th>

                  <th className="px-5 py-4 text-xs font-semibold uppercase text-slate-500">
                    Admission No.
                  </th>

                  <th className="px-5 py-4 text-xs font-semibold uppercase text-slate-500">
                    Status
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {records.map((record) => (
                  <tr
                    key={record._id}
                    className="hover:bg-slate-50"
                  >
                    <td className="px-5 py-4 text-sm text-slate-600">
                      {new Date(
                        record.date
                      ).toLocaleDateString()}
                    </td>

                    <td className="px-5 py-4 text-sm font-semibold text-slate-700">
                      {record.class?.name || "—"}
                    </td>

                    <td className="px-5 py-4">
                      <p className="font-semibold text-slate-900">
                        {record.student?.name || "—"}
                      </p>

                      <p className="text-xs text-slate-500">
                        Roll No:{" "}
                        {record.student?.rollNumber || "—"}
                      </p>
                    </td>

                    <td className="px-5 py-4 text-sm text-slate-600">
                      {record.student?.admissionNumber ||
                        "—"}
                    </td>

                    <td className="px-5 py-4">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${
                          record.status === "present"
                            ? "bg-green-50 text-green-700"
                            : record.status === "absent"
                            ? "bg-red-50 text-red-700"
                            : "bg-yellow-50 text-yellow-700"
                        }`}
                      >
                        {record.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default AttendanceRecords;