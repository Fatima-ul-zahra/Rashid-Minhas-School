import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import reportService from "../../services/reportService";

function Reports() {
  const { token } = useAuth();

  const [filters, setFilters] = useState({
    startDate: "",
    endDate: "",
  });

  const [report, setReport] = useState({
    records: [],
    summary: {
      total: 0,
      present: 0,
      absent: 0,
      late: 0,
      percentage: 0,
    },
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const loadReport = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await reportService.getAttendanceReport(
        token,
        filters
      );

      setReport(response.data);
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Unable to load attendance report."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      loadReport();
    }
  }, [token]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFilters((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    loadReport();
  };

  const clearFilters = () => {
    const emptyFilters = {
      startDate: "",
      endDate: "",
    };

    setFilters(emptyFilters);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="p-4 sm:p-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-blue-700">
            Reports
          </p>

          <h1 className="mt-1 text-2xl font-bold text-slate-900">
            Attendance Reports
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            View and analyze student attendance.
          </p>
        </div>

        <button
          type="button"
          onClick={handlePrint}
          className="rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-800 print:hidden"
        >
          Print Report
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Filters */}
      <form
        onSubmit={handleSubmit}
        className="mt-6 grid gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:grid-cols-3 print:hidden"
      >
        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-700">
            Start Date
          </label>

          <input
            type="date"
            name="startDate"
            value={filters.startDate}
            onChange={handleChange}
            className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-600"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-700">
            End Date
          </label>

          <input
            type="date"
            name="endDate"
            value={filters.endDate}
            onChange={handleChange}
            className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-600"
          />
        </div>

        <div className="flex items-end gap-2">
          <button
            type="submit"
            className="flex-1 rounded-xl bg-blue-700 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-800"
          >
            Apply
          </button>

          <button
            type="button"
            onClick={clearFilters}
            className="rounded-xl border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            Clear
          </button>
        </div>
      </form>

      {/* Statistics */}
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <StatCard
          title="Total"
          value={report.summary.total}
        />

        <StatCard
          title="Present"
          value={report.summary.present}
        />

        <StatCard
          title="Absent"
          value={report.summary.absent}
        />

        <StatCard
          title="Late"
          value={report.summary.late}
        />

        <StatCard
          title="Attendance"
          value={`${report.summary.percentage}%`}
        />
      </div>

      {/* Attendance Table */}
      <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 p-5">
          <h2 className="font-bold text-slate-900">
            Attendance Records
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-[800px] w-full text-left">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-5 py-4 text-xs font-semibold uppercase text-slate-500">
                  Student
                </th>

                <th className="px-5 py-4 text-xs font-semibold uppercase text-slate-500">
                  Roll No.
                </th>

                <th className="px-5 py-4 text-xs font-semibold uppercase text-slate-500">
                  Class
                </th>

                <th className="px-5 py-4 text-xs font-semibold uppercase text-slate-500">
                  Date
                </th>

                <th className="px-5 py-4 text-xs font-semibold uppercase text-slate-500">
                  Status
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td
                    colSpan="5"
                    className="px-5 py-12 text-center text-sm text-slate-500"
                  >
                    Loading report...
                  </td>
                </tr>
              ) : report.records.length === 0 ? (
                <tr>
                  <td
                    colSpan="5"
                    className="px-5 py-12 text-center text-sm text-slate-500"
                  >
                    No attendance records found.
                  </td>
                </tr>
              ) : (
                report.records.map((record) => (
                  <tr
                    key={record._id}
                    className="hover:bg-slate-50"
                  >
                    <td className="px-5 py-4 font-semibold text-slate-900">
                      {record.student?.name || "Unknown"}
                    </td>

                    <td className="px-5 py-4 text-sm text-slate-600">
                      {record.student?.rollNumber || "-"}
                    </td>

                    <td className="px-5 py-4 text-sm text-slate-600">
                      {record.class?.name || "-"}
                    </td>

                    <td className="px-5 py-4 text-sm text-slate-600">
                      {new Date(
                        record.date
                      ).toLocaleDateString()}
                    </td>

                    <td className="px-5 py-4">
                      <StatusBadge
                        status={record.status}
                      />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-sm text-slate-500">
        {title}
      </p>

      <p className="mt-2 text-2xl font-bold text-slate-900">
        {value}
      </p>
    </div>
  );
}

function StatusBadge({ status }) {
  const classes = {
    present: "bg-green-50 text-green-700",
    absent: "bg-red-50 text-red-700",
    late: "bg-amber-50 text-amber-700",
  };

  return (
    <span
      className={`rounded-full px-3 py-1 text-xs font-semibold ${
        classes[status] ||
        "bg-slate-100 text-slate-600"
      }`}
    >
      {status}
    </span>
  );
}

export default Reports;