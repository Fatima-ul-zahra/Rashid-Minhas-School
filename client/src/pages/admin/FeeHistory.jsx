import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

import studentService from "../../services/studentService";
import feeService from "../../services/feeService";

function FeeHistory() {
  const navigate = useNavigate();
  const { token } = useAuth();

  const [students, setStudents] = useState([]);
  const [fees, setFees] = useState([]);

  const [studentFilter, setStudentFilter] =
    useState("");
  const [statusFilter, setStatusFilter] =
    useState("");
  const [monthFilter, setMonthFilter] =
    useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (token) {
      loadData();
    }
  }, [token]);

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");

      const [
        studentsResponse,
        feesResponse,
      ] = await Promise.all([
        studentService.getStudents(token),
        feeService.getFees(token),
      ]);

      setStudents(
        studentsResponse?.data ||
          studentsResponse?.students ||
          []
      );

      setFees(
        feesResponse?.data ||
          feesResponse?.fees ||
          []
      );
    } catch (err) {
      console.error(err);

      setError(
        err?.response?.data?.message ||
          "Failed to load fee history."
      );
    } finally {
      setLoading(false);
    }
  };

  const filteredFees = useMemo(() => {
    return fees.filter((fee) => {
      const feeStudentId =
        fee.student?._id || fee.student;

      if (
        studentFilter &&
        feeStudentId !== studentFilter
      ) {
        return false;
      }

      if (
        statusFilter &&
        fee.status !== statusFilter
      ) {
        return false;
      }

      if (
        monthFilter &&
        fee.month !== monthFilter
      ) {
        return false;
      }

      return true;
    });
  }, [
    fees,
    studentFilter,
    statusFilter,
    monthFilter,
  ]);

  const totals = useMemo(() => {
    return filteredFees.reduce(
      (result, fee) => {
        result.total += Number(
          fee.totalAmount || 0
        );

        result.paid += Number(
          fee.paidAmount || 0
        );

        result.remaining += Number(
          fee.remainingAmount || 0
        );

        return result;
      },
      {
        total: 0,
        paid: 0,
        remaining: 0,
      }
    );
  }, [filteredFees]);

  const formatCurrency = (amount) =>
    `Rs. ${Number(amount || 0).toLocaleString()}`;

  const formatDate = (date) => {
    if (!date) return "—";

    return new Date(date).toLocaleDateString(
      "en-PK",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };

  const statusClasses = {
    paid: "bg-green-100 text-green-700",
    partial: "bg-yellow-100 text-yellow-700",
    unpaid: "bg-red-100 text-red-700",
    overdue: "bg-red-100 text-red-700",
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-6">
      <div className="mx-auto max-w-7xl">

        <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-800">
              Fee History
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Complete student fee payment history.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={() =>
                navigate("/admin/fees")
              }
              className="rounded-lg bg-green-600 px-4 py-2.5 font-semibold text-white hover:bg-green-700"
            >
              Collect Fee
            </button>

            <button
              onClick={() =>
                navigate("/admin/fee-reports")
              }
              className="rounded-lg bg-indigo-600 px-4 py-2.5 font-semibold text-white hover:bg-indigo-700"
            >
              Reports
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-5 rounded-lg bg-red-50 p-4 text-red-700">
            {error}
          </div>
        )}

        {/* Filters */}
        <div className="mb-6 grid grid-cols-1 gap-4 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200 md:grid-cols-3">
          <div>
            <label className="mb-2 block text-sm font-semibold">
              Student
            </label>

            <select
              value={studentFilter}
              onChange={(e) =>
                setStudentFilter(e.target.value)
              }
              className="w-full rounded-lg border border-slate-300 px-4 py-3"
            >
              <option value="">
                All Students
              </option>

              {students.map((student) => (
                <option
                  key={student._id}
                  value={student._id}
                >
                  {student.name} — {student.class}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold">
              Month
            </label>

            <input
              type="month"
              value={monthFilter}
              onChange={(e) =>
                setMonthFilter(e.target.value)
              }
              className="w-full rounded-lg border border-slate-300 px-4 py-3"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold">
              Status
            </label>

            <select
              value={statusFilter}
              onChange={(e) =>
                setStatusFilter(e.target.value)
              }
              className="w-full rounded-lg border border-slate-300 px-4 py-3"
            >
              <option value="">
                All Statuses
              </option>

              <option value="paid">
                Paid
              </option>

              <option value="partial">
                Partial
              </option>

              <option value="unpaid">
                Unpaid
              </option>

              <option value="overdue">
                Overdue
              </option>
            </select>
          </div>
        </div>

        {/* Summary */}
        <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
            <p className="text-sm text-slate-500">
              Total Fees
            </p>

            <p className="mt-2 text-2xl font-bold text-slate-800">
              {formatCurrency(totals.total)}
            </p>
          </div>

          <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
            <p className="text-sm text-slate-500">
              Total Collected
            </p>

            <p className="mt-2 text-2xl font-bold text-green-600">
              {formatCurrency(totals.paid)}
            </p>
          </div>

          <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
            <p className="text-sm text-slate-500">
              Total Outstanding
            </p>

            <p className="mt-2 text-2xl font-bold text-red-600">
              {formatCurrency(
                totals.remaining
              )}
            </p>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200">
          <div className="border-b border-slate-200 p-5">
            <h2 className="text-xl font-bold text-slate-800">
              Payment Records
            </h2>

            <p className="text-sm text-slate-500">
              {filteredFees.length} record
              {filteredFees.length === 1
                ? ""
                : "s"}
            </p>
          </div>

          {loading ? (
            <div className="p-10 text-center text-slate-500">
              Loading fee history...
            </div>
          ) : filteredFees.length === 0 ? (
            <div className="p-10 text-center text-slate-500">
              No fee records match the selected filters.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-4 py-4 text-left text-xs font-bold uppercase text-slate-500">
                      Student
                    </th>

                    <th className="px-4 py-4 text-left text-xs font-bold uppercase text-slate-500">
                      Class
                    </th>

                    <th className="px-4 py-4 text-left text-xs font-bold uppercase text-slate-500">
                      Month
                    </th>

                    <th className="px-4 py-4 text-left text-xs font-bold uppercase text-slate-500">
                      Total
                    </th>

                    <th className="px-4 py-4 text-left text-xs font-bold uppercase text-slate-500">
                      Paid
                    </th>

                    <th className="px-4 py-4 text-left text-xs font-bold uppercase text-slate-500">
                      Remaining
                    </th>

                    <th className="px-4 py-4 text-left text-xs font-bold uppercase text-slate-500">
                      Status
                    </th>

                    <th className="px-4 py-4 text-left text-xs font-bold uppercase text-slate-500">
                      Payment Date
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-200">
                  {filteredFees.map((fee) => (
                    <tr
                      key={fee._id}
                      className="hover:bg-slate-50"
                    >
                      <td className="px-4 py-4 font-semibold text-slate-800">
                        {fee.student?.name ||
                          "Unknown"}
                      </td>

                      <td className="px-4 py-4 text-slate-600">
                        {fee.class || "—"}
                      </td>

                      <td className="px-4 py-4 text-slate-600">
                        {fee.month}
                      </td>

                      <td className="px-4 py-4 font-semibold">
                        {formatCurrency(
                          fee.totalAmount
                        )}
                      </td>

                      <td className="px-4 py-4 font-semibold text-green-600">
                        {formatCurrency(
                          fee.paidAmount
                        )}
                      </td>

                      <td className="px-4 py-4 font-semibold text-red-600">
                        {formatCurrency(
                          fee.remainingAmount
                        )}
                      </td>

                      <td className="px-4 py-4">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-bold ${
                            statusClasses[
                              fee.status
                            ] ||
                            "bg-slate-100 text-slate-600"
                          }`}
                        >
                          {fee.status}
                        </span>
                      </td>

                      <td className="px-4 py-4 text-slate-600">
                        {formatDate(
                          fee.paymentDate
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

export default FeeHistory;