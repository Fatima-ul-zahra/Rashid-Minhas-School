import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import { useAuth } from "../../context/AuthContext";
import announcementService from "../../services/announcementService";

const initialForm = {
  title: "",
  description: "",
  date: new Date().toISOString().slice(0, 10),
  image: "",
  status: "unpublished",
};

function AnnouncementForm() {
  const { token } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams();

  const isEdit = Boolean(id);

  const [form, setForm] = useState(initialForm);

  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadAnnouncement = async () => {
      try {
        const response =
          await announcementService.getAnnouncement(
            token,
            id
          );

        const announcement = response.data;

        setForm({
          title: announcement.title || "",
          description:
            announcement.description || "",
          date: announcement.date
            ? announcement.date.slice(0, 10)
            : "",
          image: announcement.image || "",
          status:
            announcement.status || "unpublished",
        });
      } catch (error) {
        setError(
          error.response?.data?.message ||
            "Unable to load announcement."
        );
      } finally {
        setLoading(false);
      }
    };

    if (token && isEdit) {
      loadAnnouncement();
    } else {
      setLoading(false);
    }
  }, [token, id, isEdit]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!form.title.trim()) {
      setError("Title is required.");
      return;
    }

    if (!form.description.trim()) {
      setError("Description is required.");
      return;
    }

    try {
      setSaving(true);
      setError("");

      if (isEdit) {
        await announcementService.updateAnnouncement(
          token,
          id,
          form
        );
      } else {
        await announcementService.createAnnouncement(
          token,
          form
        );
      }

      navigate("/admin/announcements");
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Unable to save announcement."
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6 text-sm text-slate-500">
        Loading announcement...
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6">
      <div>
        <p className="text-sm font-semibold text-blue-700">
          Content Management
        </p>

        <h1 className="mt-1 text-2xl font-bold text-slate-900">
          {isEdit
            ? "Edit Announcement"
            : "New Announcement"}
        </h1>
      </div>

      {error && (
        <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="mt-6 max-w-4xl rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
      >
        <div className="space-y-5">
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Title *
            </label>

            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="Announcement title"
              required
              className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-600"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Description *
            </label>

            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows="7"
              placeholder="Write announcement details..."
              required
              className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-600"
            />
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Date
              </label>

              <input
                type="date"
                name="date"
                value={form.date}
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-600"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Image URL
              </label>

              <input
                name="image"
                value={form.image}
                onChange={handleChange}
                placeholder="Optional"
                className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-600"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Status
              </label>

              <select
                name="status"
                value={form.status}
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-600"
              >
                <option value="unpublished">
                  Unpublished
                </option>

                <option value="published">
                  Published
                </option>
              </select>
            </div>
          </div>
        </div>

        <div className="mt-8 flex justify-end gap-3">
          <Link
            to="/admin/announcements"
            className="rounded-xl border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            Cancel
          </Link>

          <button
            type="submit"
            disabled={saving}
            className="rounded-xl bg-blue-700 px-6 py-3 text-sm font-semibold text-white hover:bg-blue-800 disabled:opacity-60"
          >
            {saving
              ? "Saving..."
              : isEdit
              ? "Update Announcement"
              : "Create Announcement"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default AnnouncementForm;