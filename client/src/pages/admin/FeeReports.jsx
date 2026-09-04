import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

import feeService from "../../services/feeService";

function FeeReports() {
  const navigate = useNavigate();
  const { token } = useAuth();

  const [fees, setFees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [monthFilter, setMonthFilter] =
    useState("");

  const [classFilter, setClassFilter] =
    useState("");

  useEffect(() => {
    if (token) {
      loadFees();
    }
  }, [token]);

  const loadFees = async () => {
    try {
      setLoading(true);
      setError("");

      const response =
        await feeService.getFees(token);

      setFees(
        response?.data ||
          response?.fees ||
          []
      );
    } catch (err) {
      console.error(err);

      setError(
        err?.response?.data?.message ||
          "Failed to load fee reports."
      );
    } finally {
      setLoading(false);
    }
  };

  const classes = useMemo(() => {
    return [
      ...new Set(
        fees
          .map((fee) => fee.class)
          .filter(Boolean)
      ),
    ].sort();
  }, [fees]);

  const filteredFees = useMemo(() => {
    return fees.filter((fee) => {
      if (
        monthFilter &&
        fee.month !== monthFilter
      ) {
        return false;
      }

      if (
        classFilter &&
        fee.class !== classFilter
      ) {
        return false;
      }

      return true;
    });
  }, [fees, monthFilter, classFilter]);

  const summary = useMemo(() => {
    const result = {
      total: 0,
      collected: 0,
      outstanding: 0,
      paid: 0,
      partial: 0,
      unpaid: 0,
      overdue: 0,
    };

    filteredFees.forEach((fee) => {
      result.total += Number(
        fee.totalAmount || 0
      );

      result.collected += Number(
        fee.paidAmount || 0
      );

      result.outstanding += Number(
        fee.remainingAmount || 0
      );

      if (fee.status === "paid")
        result.paid += 1;

      if (fee.status === "partial")
        result.partial += 1;

      if (fee.status === "unpaid")
        result.unpaid += 1;

      if (fee.status === "overdue")
        result.overdue += 1;
    });

    return result;
  }, [filteredFees]);

  const classReport = useMemo(() => {
    const map = {};

    filteredFees.forEach((fee) => {
      const className =
        fee.class || "Unknown";

      if (!map[className]) {
        map[className] = {
          className,
          total: 0,
          collected: 0,
          outstanding: 0,
          students: 0,
        };
      }

      map[className].total += Number(
        fee.totalAmount || 0
      );

      map[className].collected += Number(
        fee.paidAmount || 0
      );

      map[className].outstanding += Number(
        fee.remainingAmount || 0
      );

      map[className].students += 1;
    });

    return Object.values(map).sort(
      (a, b) =>
        b.outstanding - a.outstanding
    );
  }, [filteredFees]);

  const studentReport = useMemo(() => {
    const map = {};

    filteredFees.forEach((fee) => {
      const studentId =
        fee.student?._id ||
        fee.student ||
        "unknown";

      const studentName =
        fee.student?.name ||
        "Unknown Student";

      if (!map[studentId]) {
        map[studentId] = {
          studentId,
          studentName,
          className:
            fee.class || "—",
          total: 0,
          collected: 0,
          outstanding: 0,
        };
      }

      map[studentId].total += Number(
        fee.totalAmount || 0
      );

      map[studentId].collected += Number(
        fee.paidAmount || 0
      );

      map[studentId].outstanding += Number(
        fee.remainingAmount || 0
      );
    });

    return Object.values(map).sort(
      (a, b) =>
        b.outstanding - a.outstanding
    );
  }, [filteredFees]);

  const formatCurrency = (amount) =>
    `Rs. ${Number(amount || 0).toLocaleString()}`;

  const collectionPercentage =
    summary.total > 0
      ? Math.round(
          (summary.collected /
            summary.total) *
            100
        )
      : 0;

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-6">
      <div className="mx-auto max-w-7xl">

        {/* Header */}
        <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-800">
              Fee Reports
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Financial overview of student fee collection.
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
                navigate("/admin/fee-history")
              }
              className="rounded-lg bg-purple-600 px-4 py-2.5 font-semibold text-white hover:bg-purple-700"
            >
              Fee History
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-5 rounded-lg bg-red-50 p-4 text-red-700">
            {error}
          </div>
        )}

        {/* Filters */}
        <div className="mb-6 grid grid-cols-1 gap-4 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200 md:grid-cols-2">
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
              Class
            </label>

            <select
              value={classFilter}
              onChange={(e) =>
                setClassFilter(e.target.value)
              }
              className="w-full rounded-lg border border-slate-300 px-4 py-3"
            >
              <option value="">
                All Classes
              </option>

              {classes.map((className) => (
                <option
                  key={className}
                  value={className}
                >
                  {className}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Main Summary */}
        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">

          <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
            <p className="text-sm text-slate-500">
              Total Fees
            </p>

            <p className="mt-2 text-2xl font-bold text-slate-800">
              {formatCurrency(
                summary.total
              )}
            </p>
          </div>

          <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
            <p className="text-sm text-slate-500">
              Total Collected
            </p>

            <p className="mt-2 text-2xl font-bold text-green-600">
              {formatCurrency(
                summary.collected
              )}
            </p>
          </div>

          <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
            <p className="text-sm text-slate-500">
              Outstanding
            </p>

            <p className="mt-2 text-2xl font-bold text-red-600">
              {formatCurrency(
                summary.outstanding
              )}
            </p>
          </div>

          <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
            <p className="text-sm text-slate-500">
              Collection Rate
            </p>

            <p className="mt-2 text-2xl font-bold text-indigo-600">
              {collectionPercentage}%
            </p>
          </div>
        </div>

        {/* Status Cards */}
        <div className="mb-8 grid grid-cols-2 gap-4 md:grid-cols-4">

          <div className="rounded-2xl bg-green-50 p-5 ring-1 ring-green-100">
            <p className="text-sm font-medium text-green-700">
              Paid
            </p>

            <p className="mt-2 text-3xl font-bold text-green-700">
              {summary.paid}
            </p>
          </div>

          <div className="rounded-2xl bg-yellow-50 p-5 ring-1 ring-yellow-100">
            <p className="text-sm font-medium text-yellow-700">
              Partial
            </p>

            <p className="mt-2 text-3xl font-bold text-yellow-700">
              {summary.partial}
            </p>
          </div>

          <div className="rounded-2xl bg-red-50 p-5 ring-1 ring-red-100">
            <p className="text-sm font-medium text-red-700">
              Unpaid
            </p>

            <p className="mt-2 text-3xl font-bold text-red-700">
              {summary.unpaid}
            </p>
          </div>

          <div className="rounded-2xl bg-orange-50 p-5 ring-1 ring-orange-100">
            <p className="text-sm font-medium text-orange-700">
              Overdue
            </p>

            <p className="mt-2 text-3xl font-bold text-orange-700">
              {summary.overdue}
            </p>
          </div>
        </div>

        {/* Class Report */}
        <div className="mb-8 overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200">
          <div className="border-b border-slate-200 p-5">
            <h2 className="text-xl font-bold text-slate-800">
              Class-wise Fee Report
            </h2>
          </div>

          {loading ? (
            <div className="p-8 text-center text-slate-500">
              Loading...
            </div>
          ) : classReport.length === 0 ? (
            <div className="p-8 text-center text-slate-500">
              No data available.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-5 py-4 text-left text-xs font-bold uppercase text-slate-500">
                      Class
                    </th>

                    <th className="px-5 py-4 text-left text-xs font-bold uppercase text-slate-500">
                      Records
                    </th>

                    <th className="px-5 py-4 text-left text-xs font-bold uppercase text-slate-500">
                      Total
                    </th>

                    <th className="px-5 py-4 text-left text-xs font-bold uppercase text-slate-500">
                      Collected
                    </th>

                    <th className="px-5 py-4 text-left text-xs font-bold uppercase text-slate-500">
                      Outstanding
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-200">
                  {classReport.map((item) => (
                    <tr
                      key={item.className}
                      className="hover:bg-slate-50"
                    >
                      <td className="px-5 py-4 font-bold text-slate-800">
                        {item.className}
                      </td>

                      <td className="px-5 py-4">
                        {item.students}
                      </td>

                      <td className="px-5 py-4 font-semibold">
                        {formatCurrency(
                          item.total
                        )}
                      </td>

                      <td className="px-5 py-4 font-semibold text-green-600">
                        {formatCurrency(
                          item.collected
                        )}
                      </td>

                      <td className="px-5 py-4 font-semibold text-red-600">
                        {formatCurrency(
                          item.outstanding
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Student Outstanding Report */}
        <div className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200">
          <div className="border-b border-slate-200 p-5">
            <h2 className="text-xl font-bold text-slate-800">
              Student-wise Fee Report
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Students with the highest outstanding balances appear first.
            </p>
          </div>

          {studentReport.length === 0 ? (
            <div className="p-8 text-center text-slate-500">
              No student fee data available.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-5 py-4 text-left text-xs font-bold uppercase text-slate-500">
                      Student
                    </th>

                    <th className="px-5 py-4 text-left text-xs font-bold uppercase text-slate-500">
                      Class
                    </th>

                    <th className="px-5 py-4 text-left text-xs font-bold uppercase text-slate-500">
                      Total
                    </th>

                    <th className="px-5 py-4 text-left text-xs font-bold uppercase text-slate-500">
                      Collected
                    </th>

                    <th className="px-5 py-4 text-left text-xs font-bold uppercase text-slate-500">
                      Outstanding
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-200">
                  {studentReport.map((item) => (
                    <tr
                      key={item.studentId}
                      className="hover:bg-slate-50"
                    >
                      <td className="px-5 py-4 font-semibold text-slate-800">
                        {item.studentName}
                      </td>

                      <td className="px-5 py-4 text-slate-600">
                        {item.className}
                      </td>

                      <td className="px-5 py-4 font-semibold">
                        {formatCurrency(
                          item.total
                        )}
                      </td>

                      <td className="px-5 py-4 font-semibold text-green-600">
                        {formatCurrency(
                          item.collected
                        )}
                      </td>

                      <td className="px-5 py-4 font-bold text-red-600">
                        {formatCurrency(
                          item.outstanding
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

export default FeeReports;