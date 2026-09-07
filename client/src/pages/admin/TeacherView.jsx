import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import { useAuth } from "../../context/AuthContext";
import teacherService from "../../services/teacherService";
import API_SERVER_URL from "../../config/apiServer";

function TeacherView() {
  const { token } = useAuth();
  const { id } = useParams();

  const [teacher, setTeacher] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadTeacher = async () => {
      try {
        const response =
          await teacherService.getTeacher(token, id);

        setTeacher(response.data);
      } catch (error) {
        setError(
          error.response?.data?.message ||
            "Unable to load teacher."
        );
      } finally {
        setLoading(false);
      }
    };

    if (token && id) {
      loadTeacher();
    }
  }, [token, id]);

  if (loading) {
    return (
      <div className="p-6 text-sm text-slate-500">
        Loading teacher...
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="rounded-xl bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      </div>
    );
  }

  if (!teacher) {
    return (
      <div className="p-6 text-slate-500">
        Teacher not found.
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-blue-700">
            Teacher Management
          </p>

          <h1 className="mt-1 text-2xl font-bold text-slate-900">
            Teacher Profile
          </h1>
        </div>

        <Link
          to={`/admin/teachers/${teacher._id}/edit`}
          className="rounded-xl bg-blue-700 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-800"
        >
          Edit Teacher
        </Link>
      </div>

      <div className="mt-6 max-w-4xl rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-6 sm:flex-row">
          {teacher.photo ? (
          <img
            src={
              teacher.photo.startsWith("http")
                ? teacher.photo
                : `${API_SERVER_URL}${teacher.photo}`
            }
            alt={teacher.name}
            className="h-32 w-32 rounded-2xl object-cover"
          />
        ) : (
          <div className="flex h-32 w-32 items-center justify-center rounded-2xl bg-blue-100 text-4xl font-bold text-blue-700">
            {teacher.name?.charAt(0).toUpperCase()}
          </div>
        )}

          <div>
            <h2 className="text-2xl font-bold text-slate-900">
              {teacher.name}
            </h2>

            <p className="mt-1 text-slate-500">
              {teacher.subject || "Subject not provided"}
            </p>

            <span
              className={`mt-3 inline-block rounded-full px-3 py-1 text-xs font-semibold ${
                teacher.status === "active"
                  ? "bg-green-50 text-green-700"
                  : "bg-slate-100 text-slate-600"
              }`}
            >
              {teacher.status}
            </span>
          </div>
        </div>

        <div className="mt-8 grid gap-5 border-t border-slate-200 pt-6 sm:grid-cols-2">
          <Info label="Email" value={teacher.email} />
          <Info label="Phone" value={teacher.phone} />
          <Info
            label="Qualification"
            value={teacher.qualification}
          />
          <Info
            label="Experience"
            value={teacher.experience}
          />
          <Info
            label="Joining Date"
            value={
              teacher.joiningDate
                ? new Date(
                    teacher.joiningDate
                  ).toLocaleDateString()
                : "—"
            }
          />

          <div>
            <p className="text-xs font-semibold uppercase text-slate-400">
              Assigned Classes
            </p>

            <div className="mt-2 flex flex-wrap gap-2">
              {teacher.assignedClasses?.length ? (
                teacher.assignedClasses.map(
                  (classItem) => (
                    <span
                      key={classItem._id}
                      className="rounded-lg bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700"
                    >
                      {classItem.name}
                    </span>
                  )
                )
              ) : (
                <span className="text-sm text-slate-500">
                  No classes assigned
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="mt-8">
          <Link
            to="/admin/teachers"
            className="text-sm font-semibold text-blue-700 hover:underline"
          >
            ← Back to Teachers
          </Link>
        </div>
      </div>
    </div>
  );
}

function Info({ label, value }) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase text-slate-400">
        {label}
      </p>

      <p className="mt-1 text-sm font-medium text-slate-800">
        {value || "—"}
      </p>
    </div>
  );
}

export default TeacherView;