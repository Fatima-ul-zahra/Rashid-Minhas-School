import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

import { useAuth } from "../../context/AuthContext";
import teacherService from "../../services/teacherService";
import API_SERVER_URL from "../../config/apiServer";

function Teachers() {
  const { token } = useAuth();

  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");

  const loadTeachers = async () => {
    try {
      setLoading(true);
      setError("");

      const response =
        await teacherService.getTeachers(token);

      setTeachers(response.data);
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Unable to load teachers."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      loadTeachers();
    }
  }, [token]);

  const filteredTeachers = useMemo(() => {
    const value = search.toLowerCase().trim();

    return teachers.filter((teacher) => {
      const matchesSearch =
        !value ||
        teacher.name
          ?.toLowerCase()
          .includes(value) ||
        teacher.subject
          ?.toLowerCase()
          .includes(value) ||
        teacher.qualification
          ?.toLowerCase()
          .includes(value);

      const matchesStatus =
        !status || teacher.status === status;

      return matchesSearch && matchesStatus;
    });
  }, [teachers, search, status]);

  const handleDelete = async (teacher) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete ${teacher.name}?`
    );

    if (!confirmed) return;

    try {
      await teacherService.deleteTeacher(
        token,
        teacher._id
      );

      setTeachers((current) =>
        current.filter(
          (item) => item._id !== teacher._id
        )
      );
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Unable to delete teacher."
      );
    }
  };

  return (
    <div className="p-4 sm:p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-blue-700">
            Academic Management
          </p>

          <h1 className="mt-1 text-2xl font-bold text-slate-900">
            Teachers
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Manage school teachers and assignments.
          </p>
        </div>

        <Link
          to="/admin/teachers/new"
          className="inline-flex items-center justify-center rounded-xl bg-blue-700 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-800"
        >
          + Add Teacher
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
            placeholder="Search by name, subject..."
            className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
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
            className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
          >
            <option value="">All Statuses</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>

      {/* Teacher table */}
      <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-[950px] w-full text-left">
            <thead className="border-b border-slate-200 bg-slate-50">
              <tr>
                <th className="px-5 py-4 text-xs font-semibold uppercase text-slate-500">
                  Teacher
                </th>

                <th className="px-5 py-4 text-xs font-semibold uppercase text-slate-500">
                  Subject
                </th>

                <th className="px-5 py-4 text-xs font-semibold uppercase text-slate-500">
                  Qualification
                </th>

                <th className="px-5 py-4 text-xs font-semibold uppercase text-slate-500">
                  Classes
                </th>

                <th className="px-5 py-4 text-xs font-semibold uppercase text-slate-500">
                  Status
                </th>

                <th className="px-5 py-4 text-xs font-semibold uppercase text-slate-500">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td
                    colSpan="6"
                    className="px-5 py-12 text-center text-sm text-slate-500"
                  >
                    Loading teachers...
                  </td>
                </tr>
              ) : filteredTeachers.length === 0 ? (
                <tr>
                  <td
                    colSpan="6"
                    className="px-5 py-12 text-center"
                  >
                    <p className="font-semibold text-slate-700">
                      No teachers found
                    </p>

                    <p className="mt-1 text-sm text-slate-500">
                      Add a teacher or change your filters.
                    </p>
                  </td>
                </tr>
              ) : (
                filteredTeachers.map((teacher) => (
                  <tr
                    key={teacher._id}
                    className="hover:bg-slate-50"
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                    {teacher.photo ? (
                      <img
                        src={
                          teacher.photo.startsWith("http")
                            ? teacher.photo
                            : `${API_SERVER_URL}${teacher.photo}`
                        }
                        alt={teacher.name}
                        className="h-11 w-11 rounded-full object-cover"
                      />
                    ) : (
                      <div className="flex h-11 w-11 items-center justify-center rounded-full bg-blue-100 font-bold text-blue-700">
                        {teacher.name?.charAt(0).toUpperCase()}
                      </div>
                    )}


                        <div>
                          <p className="font-semibold text-slate-900">
                            {teacher.name}
                          </p>

                          <p className="text-xs text-slate-500">
                            {teacher.email || "No email"}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-5 py-4 text-sm text-slate-600">
                      {teacher.subject || "—"}
                    </td>

                    <td className="px-5 py-4 text-sm text-slate-600">
                      {teacher.qualification || "—"}
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex flex-wrap gap-1">
                        {teacher.assignedClasses?.length ? (
                          teacher.assignedClasses.map(
                            (classItem) => (
                              <span
                                key={classItem._id}
                                className="rounded-lg bg-blue-50 px-2 py-1 text-xs font-semibold text-blue-700"
                              >
                                {classItem.name}
                              </span>
                            )
                          )
                        ) : (
                          <span className="text-sm text-slate-400">
                            None
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="px-5 py-4">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${
                          teacher.status === "active"
                            ? "bg-green-50 text-green-700"
                            : "bg-slate-100 text-slate-600"
                        }`}
                      >
                        {teacher.status}
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex gap-2">
                          <Link
                            to={`/admin/teachers/${teacher._id}`}
                            className="rounded-lg bg-slate-100 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-200"
                          >
                            View
                          </Link>

                          <Link
                            to={`/admin/teachers/${teacher._id}/edit`}
                            className="rounded-lg bg-blue-50 px-3 py-2 text-xs font-semibold text-blue-700 hover:bg-blue-100"
                          >
                            Edit
                          </Link>

                          <button
                            type="button"
                            onClick={() => handleDelete(teacher)}
                            className="rounded-lg bg-red-50 px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-100"
                          >
                            Delete
                          </button>
                        </div>
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

export default Teachers;