import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

import { useAuth } from "../../context/AuthContext";
import studentService from "../../services/studentService";

function Students() {
  const { token } = useAuth();

  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [classFilter, setClassFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const loadStudents = async () => {
    try {
      setLoading(true);
      setError("");

      const response =
        await studentService.getStudents(token);

      setStudents(response.data);
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Unable to load students."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      loadStudents();
    }
  }, [token]);

  const filteredStudents = useMemo(() => {
    const searchValue = search.toLowerCase().trim();

    return students.filter((student) => {
      const matchesSearch =
        !searchValue ||
        student.name.toLowerCase().includes(searchValue) ||
        student.fatherName.toLowerCase().includes(searchValue) ||
        student.admissionNumber
          .toLowerCase()
          .includes(searchValue);

      const matchesClass =
        !classFilter ||
        student.class === classFilter;

      const matchesStatus =
        !statusFilter ||
        student.status === statusFilter;

      return (
        matchesSearch &&
        matchesClass &&
        matchesStatus
      );
    });
  }, [students, search, classFilter, statusFilter]);

  const handleDelete = async (student) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete ${student.name}?`
    );

    if (!confirmed) return;

    try {
      await studentService.deleteStudent(
        token,
        student._id
      );

      setStudents((current) =>
        current.filter(
          (item) => item._id !== student._id
        )
      );
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Unable to delete student."
      );
    }
  };

  return (
    <div className="p-4 sm:p-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-blue-700">
            Student Management
          </p>

          <h1 className="mt-1 text-2xl font-bold text-slate-900">
            Students
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            {students.length} total student
            {students.length !== 1 ? "s" : ""}
          </p>
        </div>

        <Link
          to="/admin/students/new"
          className="inline-flex items-center justify-center rounded-xl bg-blue-700 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-800"
        >
          + Add Student
        </Link>
      </div>

      {/* Error */}
      {error && (
        <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Filters */}
      <div className="mt-6 grid gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:grid-cols-3">
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
            placeholder="Name, father name, admission no."
            className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-blue-600"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-700">
            Class
          </label>

          <select
            value={classFilter}
            onChange={(event) =>
              setClassFilter(event.target.value)
            }
            className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-blue-600"
          >
            <option value="">All Classes</option>

            {Array.from(
              { length: 10 },
              (_, index) => (
                <option
                  key={index + 1}
                  value={`Class ${index + 1}`}
                >
                  Class {index + 1}
                </option>
              )
            )}
          </select>
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-700">
            Status
          </label>

          <select
            value={statusFilter}
            onChange={(event) =>
              setStatusFilter(event.target.value)
            }
            className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-blue-600"
          >
            <option value="">All Statuses</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="graduated">Graduated</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-[900px] w-full text-left">
            <thead className="border-b border-slate-200 bg-slate-50">
              <tr>
                <th className="px-5 py-4 text-xs font-semibold uppercase text-slate-500">
                  Student
                </th>

                <th className="px-5 py-4 text-xs font-semibold uppercase text-slate-500">
                  Admission No.
                </th>

                <th className="px-5 py-4 text-xs font-semibold uppercase text-slate-500">
                  Roll No.
                </th>

                <th className="px-5 py-4 text-xs font-semibold uppercase text-slate-500">
                  Class
                </th>

                <th className="px-5 py-4 text-xs font-semibold uppercase text-slate-500">
                  Gender
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
                    colSpan="7"
                    className="px-5 py-12 text-center text-sm text-slate-500"
                  >
                    Loading students...
                  </td>
                </tr>
              ) : filteredStudents.length === 0 ? (
                <tr>
                  <td
                    colSpan="7"
                    className="px-5 py-12 text-center"
                  >
                    <p className="font-semibold text-slate-700">
                      No students found
                    </p>

                    <p className="mt-1 text-sm text-slate-500">
                      Try changing your search or filters.
                    </p>
                  </td>
                </tr>
              ) : (
                filteredStudents.map((student) => (
                  <tr
                    key={student._id}
                    className="hover:bg-slate-50"
                  >
                    <td className="px-5 py-4">
                      <p className="font-semibold text-slate-900">
                        {student.name}
                      </p>

                      <p className="text-xs text-slate-500">
                        {student.fatherName}
                      </p>
                    </td>

                    <td className="px-5 py-4 text-sm text-slate-600">
                      {student.admissionNumber}
                    </td>

                    <td className="px-5 py-4 text-sm text-slate-600">
                      {student.rollNumber || "—"}
                    </td>

                    <td className="px-5 py-4 text-sm text-slate-600">
                      {student.class}
                    </td>

                    <td className="px-5 py-4 text-sm capitalize text-slate-600">
                      {student.gender}
                    </td>

                    <td className="px-5 py-4">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${
                          student.status === "active"
                            ? "bg-green-50 text-green-700"
                            : student.status === "graduated"
                            ? "bg-blue-50 text-blue-700"
                            : "bg-slate-100 text-slate-600"
                        }`}
                      >
                        {student.status}
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <Link
                          to={`/admin/students/${student._id}`}
                          className="rounded-lg bg-slate-100 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-200"
                        >
                          View
                        </Link>

                        <Link
                          to={`/admin/students/${student._id}/edit`}
                          className="rounded-lg bg-blue-50 px-3 py-2 text-xs font-semibold text-blue-700 hover:bg-blue-100"
                        >
                          Edit
                        </Link>

                        <button
                          type="button"
                          onClick={() =>
                            handleDelete(student)
                          }
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

export default Students;