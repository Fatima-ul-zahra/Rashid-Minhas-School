import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import { useAuth } from "../../context/AuthContext";
import studentService from "../../services/studentService";
import StudentDailyActivity from "../../components/admin/StudentDailyActivity";
import API_SERVER_URL from "../../config/apiServer";

function StudentView() {
  const { token } = useAuth();
  const { id } = useParams();

  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadStudent = async () => {
      try {
        setLoading(true);
        setError("");

        const response =
          await studentService.getStudentById(
            token,
            id
          );

        setStudent(response.data);
      } catch (error) {
        setError(
          error.response?.data?.message ||
            "Unable to load student."
        );
      } finally {
        setLoading(false);
      }
    };

    if (token && id) {
      loadStudent();
    }
  }, [token, id]);

  if (loading) {
    return (
      <div className="p-6 text-center text-slate-500">
        Loading student...
      </div>
    );
  }

  if (error || !student) {
    return (
      <div className="p-6">
        <div className="rounded-xl bg-red-50 p-5 text-red-700">
          {error || "Student not found."}
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-blue-700">
            Student Management
          </p>

          <h1 className="mt-1 text-2xl font-bold text-slate-900">
            Student Profile
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            View student information and daily progress.
          </p>
        </div>

        <Link
          to={`/admin/students/${student._id}/edit`}
          className="rounded-xl bg-blue-700 px-5 py-3 text-center text-sm font-semibold text-white hover:bg-blue-800"
        >
          Edit Student
        </Link>
      </div>

      {/* Student Information */}
      <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
          {student.photo ? (
          <img
            src={
              student.photo.startsWith("http")
                ? student.photo
                : `${API_SERVER_URL}${student.photo}`
            }
            alt={student.name}
            className="h-28 w-28 rounded-2xl object-cover"
          />
        ) : (
          <div className="flex h-28 w-28 items-center justify-center rounded-2xl bg-blue-100 text-3xl font-bold text-blue-700">
            {student.name.charAt(0)}
          </div>
        )}

          <div>
            <h2 className="text-2xl font-bold text-slate-900">
              {student.name}
            </h2>

            <p className="mt-1 text-slate-500">
              Father: {student.fatherName}
            </p>

            <span className="mt-3 inline-block rounded-full bg-green-50 px-3 py-1 text-xs font-semibold capitalize text-green-700">
              {student.status}
            </span>
          </div>
        </div>

        <div className="mt-8 grid gap-5 border-t border-slate-100 pt-6 sm:grid-cols-2 lg:grid-cols-3">
          <Info
            label="Admission Number"
            value={student.admissionNumber}
          />

          <Info
            label="Roll Number"
            value={student.rollNumber || "—"}
          />

          <Info
            label="Class"
            value={student.class}
          />

          <Info
            label="Gender"
            value={student.gender}
          />

          <Info
            label="Phone"
            value={student.phone || "—"}
          />

          <Info
            label="Date of Birth"
            value={
              student.dateOfBirth
                ? new Date(
                    student.dateOfBirth
                  ).toLocaleDateString()
                : "—"
            }
          />

          <Info
            label="Admission Date"
            value={
              student.admissionDate
                ? new Date(
                    student.admissionDate
                  ).toLocaleDateString()
                : "—"
            }
          />

          <div className="sm:col-span-2">
            <Info
              label="Address"
              value={student.address || "—"}
            />
          </div>
        </div>
      </div>

      {/* Daily Activity */}
      <StudentDailyActivity
        studentId={student._id}
      />
    </div>
  );
}

function Info({ label, value }) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
        {label}
      </p>

      <p className="mt-1 text-sm font-semibold capitalize text-slate-800">
        {value}
      </p>
    </div>
  );
}

export default StudentView;