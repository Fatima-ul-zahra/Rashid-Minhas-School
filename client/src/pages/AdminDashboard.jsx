import { useEffect, useState } from "react";

import { useAuth } from "../context/AuthContext";
import dashboardService from "../services/dashboardService";

function AdminDashboard() {
  const { user, token } = useAuth();

  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        setLoading(true);
        setError("");

        const response =
          await dashboardService.getStats(token);

        setStats(response.data);
      } catch (error) {
        console.error(error);

        setError(
          error.response?.data?.message ||
            "Unable to load dashboard statistics."
        );
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      loadDashboard();
    }
  }, [token]);

  const statistics = [
    {
      title: "Total Students",
      value: stats?.totalStudents ?? "—",
      description: "Registered students",
    },
    {
      title: "Total Teachers",
      value: stats?.totalTeachers ?? "—",
      description: "Teaching staff",
    },
    {
      title: "Total Classes",
      value: stats?.totalClasses ?? "—",
      description: "Available classes",
    },
    {
      title: "Today's Attendance",
      value:
        stats?.attendance?.percentage != null
          ? `${stats.attendance.percentage}%`
          : "—",
      description: "Present + late",
    },
    {
      title: "Pending Admissions",
      value: stats?.pendingAdmissions ?? "—",
      description: "Applications awaiting review",
    },
    {
      title: "Announcements",
      value: stats?.totalAnnouncements ?? "—",
      description: "Published announcements",
    },
  ];

  return (
    <div>
      <main className="px-6 py-8">
        {/* Welcome */}
        <section className="rounded-2xl bg-slate-950 p-7 text-white shadow-sm">
          <p className="text-sm font-semibold text-blue-400">
            Welcome back
          </p>

          <h2 className="mt-2 text-2xl font-bold">
            {user?.name || "Administrator"}
          </h2>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300">
            Manage students, teachers, attendance, admissions,
            announcements, and school operations from one
            central dashboard.
          </p>
        </section>

        {/* Error */}
        {error && (
          <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* Statistics */}
        <section className="mt-8">
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {statistics.map((stat) => (
              <div
                key={stat.title}
                className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
              >
                <p className="text-sm font-medium text-slate-500">
                  {stat.title}
                </p>

                {loading ? (
                  <div className="mt-4 h-9 w-20 animate-pulse rounded-lg bg-slate-200" />
                ) : (
                  <p className="mt-3 text-3xl font-bold text-slate-900">
                    {stat.value}
                  </p>
                )}

                <p className="mt-2 text-xs text-slate-500">
                  {stat.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Attendance Summary */}
        <section className="mt-8">
          <h2 className="text-xl font-bold text-slate-900">
            Today's Attendance
          </h2>

          <div className="mt-4 grid gap-4 sm:grid-cols-3">
            <div className="rounded-2xl bg-white p-5 shadow-sm">
              <p className="text-sm text-slate-500">
                Present
              </p>

              <p className="mt-2 text-2xl font-bold text-slate-900">
                {loading
                  ? "—"
                  : stats?.attendance?.present ?? 0}
              </p>
            </div>

            <div className="rounded-2xl bg-white p-5 shadow-sm">
              <p className="text-sm text-slate-500">
                Absent
              </p>

              <p className="mt-2 text-2xl font-bold text-slate-900">
                {loading
                  ? "—"
                  : stats?.attendance?.absent ?? 0}
              </p>
            </div>

            <div className="rounded-2xl bg-white p-5 shadow-sm">
              <p className="text-sm text-slate-500">
                Late
              </p>

              <p className="mt-2 text-2xl font-bold text-slate-900">
                {loading
                  ? "—"
                  : stats?.attendance?.late ?? 0}
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default AdminDashboard;