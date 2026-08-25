import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

import { useAuth } from "../../context/AuthContext";
import admissionService from "../../services/admissionService";

function Admissions() {
  const { token } = useAuth();

  const [admissions, setAdmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");

  const loadAdmissions = async () => {
    try {
      setLoading(true);
      setError("");

      const response =
        await admissionService.getAdmissions(token);

      setAdmissions(response.data);
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Unable to load admissions."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      loadAdmissions();
    }
  }, [token]);

  const filteredAdmissions = useMemo(() => {
    const value = search.toLowerCase().trim();

    return admissions.filter((admission) => {
      const matchesSearch =
        !value ||
        admission.studentName
          ?.toLowerCase()
          .includes(value) ||
        admission.fatherName
          ?.toLowerCase()
          .includes(value) ||
        admission.phone
          ?.toLowerCase()
          .includes(value);

      const matchesStatus =
        !status || admission.status === status;

      return matchesSearch && matchesStatus;
    });
  }, [admissions, search, status]);

  return (
    <div className="p-4 sm:p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-blue-700">
            Admissions
          </p>

          <h1 className="mt-1 text-2xl font-bold text-slate-900">
            Admission Applications
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Review and manage admission applications.
          </p>
        </div>

        <Link
          to="/admissions"
          className="rounded-xl bg-blue-700 px-5 py-3 text-center text-sm font-semibold text-white hover:bg-blue-800"
        >
          Public Admission Form
        </Link>
      </div>

      {error && (
        <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Filters */}
      <div className="mt-6 grid gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-700">
            Search
          </label>

          <input
            type="text"
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
            placeholder="Student, father name or phone"
            className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-blue-600"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-700">
            Status
          </label>

          <select
            value={status}
            onChange={(event) =>
              setStatus(event.target.value)
            }
            className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-blue-600"
          >
            <option value="">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-[950px] w-full text-left">
            <thead className="border-b border-slate-200 bg-slate-50">
              <tr>
                <th className="px-5 py-4 text-xs font-semibold uppercase text-slate-500">
                  Applicant
                </th>

                <th className="px-5 py-4 text-xs font-semibold uppercase text-slate-500">
                  Father
                </th>

                <th className="px-5 py-4 text-xs font-semibold uppercase text-slate-500">
                  Desired Class
                </th>

                <th className="px-5 py-4 text-xs font-semibold uppercase text-slate-500">
                  Phone
                </th>

                <th className="px-5 py-4 text-xs font-semibold uppercase text-slate-500">
                  Status
                </th>

                <th className="px-5 py-4 text-xs font-semibold uppercase text-slate-500">
                  Date
                </th>

                <th className="px-5 py-4 text-xs font-semibold uppercase text-slate-500">
                  Action
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td
                    colSpan="7"
                    className="px-5 py-12 text-center text-sm text-slate-500"
                  >
                    Loading applications...
                  </td>
                </tr>
              ) : filteredAdmissions.length === 0 ? (
                <tr>
                  <td
                    colSpan="7"
                    className="px-5 py-12 text-center"
                  >
                    <p className="font-semibold text-slate-700">
                      No applications found
                    </p>

                    <p className="mt-1 text-sm text-slate-500">
                      Try changing your search or filter.
                    </p>
                  </td>
                </tr>
              ) : (
                filteredAdmissions.map((admission) => (
                  <tr
                    key={admission._id}
                    className="hover:bg-slate-50"
                  >
                    <td className="px-5 py-4">
                      <p className="font-semibold text-slate-900">
                        {admission.studentName}
                      </p>

                      <p className="text-xs text-slate-500">
                        {admission.email || "No email"}
                      </p>
                    </td>

                    <td className="px-5 py-4 text-sm text-slate-600">
                      {admission.fatherName}
                    </td>

                    <td className="px-5 py-4 text-sm font-semibold text-slate-700">
                      {admission.desiredClass?.name ||
                        "—"}
                    </td>

                    <td className="px-5 py-4 text-sm text-slate-600">
                      {admission.phone}
                    </td>

                    <td className="px-5 py-4">
                      <StatusBadge
                        status={admission.status}
                      />
                    </td>

                    <td className="px-5 py-4 text-sm text-slate-500">
                      {new Date(
                        admission.createdAt
                      ).toLocaleDateString()}
                    </td>

                    <td className="px-5 py-4">
                      <Link
                        to={`/admin/admissions/${admission._id}`}
                        className="rounded-lg bg-blue-50 px-3 py-2 text-xs font-semibold text-blue-700 hover:bg-blue-100"
                      >
                        View
                      </Link>
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

function StatusBadge({ status }) {
  const styles = {
    pending: "bg-yellow-50 text-yellow-700",
    approved: "bg-green-50 text-green-700",
    rejected: "bg-red-50 text-red-700",
  };

  return (
    <span
      className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${
        styles[status] ||
        "bg-slate-100 text-slate-600"
      }`}
    >
      {status}
    </span>
  );
}

export default Admissions;