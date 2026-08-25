import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

import { useAuth } from "../../context/AuthContext";
import announcementService from "../../services/announcementService";

function Announcements() {
  const { token } = useAuth();

  const [announcements, setAnnouncements] = useState([]);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadAnnouncements = async () => {
    try {
      setLoading(true);
      setError("");

      const response =
        await announcementService.getAdminAnnouncements(
          token
        );

      setAnnouncements(response.data);
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Unable to load announcements."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      loadAnnouncements();
    }
  }, [token]);

  const filteredAnnouncements = useMemo(() => {
    const value = search.toLowerCase().trim();

    return announcements.filter((announcement) => {
      const matchesSearch =
        !value ||
        announcement.title
          ?.toLowerCase()
          .includes(value) ||
        announcement.description
          ?.toLowerCase()
          .includes(value);

      const matchesStatus =
        !status ||
        announcement.status === status;

      return matchesSearch && matchesStatus;
    });
  }, [announcements, search, status]);

  const handleDelete = async (announcement) => {
    const confirmed = window.confirm(
      `Delete "${announcement.title}"?`
    );

    if (!confirmed) return;

    try {
      await announcementService.deleteAnnouncement(
        token,
        announcement._id
      );

      setAnnouncements((current) =>
        current.filter(
          (item) =>
            item._id !== announcement._id
        )
      );
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Unable to delete announcement."
      );
    }
  };

  return (
    <div className="p-4 sm:p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-blue-700">
            Content Management
          </p>

          <h1 className="mt-1 text-2xl font-bold text-slate-900">
            Announcements
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Manage school announcements.
          </p>
        </div>

        <Link
          to="/admin/announcements/new"
          className="rounded-xl bg-blue-700 px-5 py-3 text-center text-sm font-semibold text-white hover:bg-blue-800"
        >
          + New Announcement
        </Link>
      </div>

      {error && (
        <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

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
            placeholder="Search announcements..."
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
            <option value="published">
              Published
            </option>
            <option value="unpublished">
              Unpublished
            </option>
          </select>
        </div>
      </div>

      <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-[900px] w-full text-left">
            <thead className="border-b border-slate-200 bg-slate-50">
              <tr>
                <th className="px-5 py-4 text-xs font-semibold uppercase text-slate-500">
                  Announcement
                </th>

                <th className="px-5 py-4 text-xs font-semibold uppercase text-slate-500">
                  Date
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
                    colSpan="4"
                    className="px-5 py-12 text-center text-sm text-slate-500"
                  >
                    Loading announcements...
                  </td>
                </tr>
              ) : filteredAnnouncements.length ===
                0 ? (
                <tr>
                  <td
                    colSpan="4"
                    className="px-5 py-12 text-center"
                  >
                    <p className="font-semibold text-slate-700">
                      No announcements found
                    </p>

                    <p className="mt-1 text-sm text-slate-500">
                      Create your first announcement.
                    </p>
                  </td>
                </tr>
              ) : (
                filteredAnnouncements.map(
                  (announcement) => (
                    <tr
                      key={announcement._id}
                      className="hover:bg-slate-50"
                    >
                      <td className="px-5 py-4">
                        <p className="font-semibold text-slate-900">
                          {announcement.title}
                        </p>

                        <p className="mt-1 max-w-md truncate text-sm text-slate-500">
                          {announcement.description}
                        </p>
                      </td>

                      <td className="px-5 py-4 text-sm text-slate-600">
                        {new Date(
                          announcement.date
                        ).toLocaleDateString()}
                      </td>

                      <td className="px-5 py-4">
                        <StatusBadge
                          status={announcement.status}
                        />
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex gap-2">
                          <Link
                            to={`/admin/announcements/${announcement._id}/edit`}
                            className="rounded-lg bg-blue-50 px-3 py-2 text-xs font-semibold text-blue-700 hover:bg-blue-100"
                          >
                            Edit
                          </Link>

                          <button
                            type="button"
                            onClick={() =>
                              handleDelete(
                                announcement
                              )
                            }
                            className="rounded-lg bg-red-50 px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-100"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                )
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function StatusBadge({ status }) {
  return (
    <span
      className={`rounded-full px-3 py-1 text-xs font-semibold ${
        status === "published"
          ? "bg-green-50 text-green-700"
          : "bg-slate-100 text-slate-600"
      }`}
    >
      {status}
    </span>
  );
}

export default Announcements;