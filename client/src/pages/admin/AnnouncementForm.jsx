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

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");

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
          description: announcement.description || "",
          date: announcement.date
            ? announcement.date.slice(0, 10)
            : "",
          image: announcement.image || "",
          status: announcement.status || "unpublished",
        });

        if (announcement.image) {
          setImagePreview(
            announcement.image.startsWith("http")
              ? announcement.image
              : `http://localhost:5000${announcement.image}`
          );
        }
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

  const handleImageChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
    ];

    if (!allowedTypes.includes(file.type)) {
      setError(
        "Only JPG, PNG and WEBP images are allowed."
      );
      event.target.value = "";
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setError("Image must be smaller than 10MB.");
      event.target.value = "";
      return;
    }

    setError("");
    setImageFile(file);

    const previewUrl = URL.createObjectURL(file);
    setImagePreview(previewUrl);
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview("");

    setForm((current) => ({
      ...current,
      image: "",
    }));

    const fileInput =
      document.getElementById("announcement-image");

    if (fileInput) {
      fileInput.value = "";
    }
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

      const formData = new FormData();

      formData.append("title", form.title);
      formData.append("description", form.description);
      formData.append("date", form.date);
      formData.append("status", form.status);

      if (imageFile) {
        formData.append("image", imageFile);
      }

      if (isEdit) {
        await announcementService.updateAnnouncement(
          token,
          id,
          formData
        );
      } else {
        await announcementService.createAnnouncement(
          token,
          formData
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
          {/* Title */}
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

          {/* Description */}
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

          {/* Date + Status */}
          <div className="grid gap-5 md:grid-cols-2">
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

          {/* Announcement Image */}
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Announcement Image
            </label>

            <input
              id="announcement-image"
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={handleImageChange}
              className="block w-full rounded-xl border border-slate-300 p-3 text-sm"
            />

            <p className="mt-2 text-xs text-slate-500">
              JPG, PNG or WEBP only. Maximum file size: 10MB.
            </p>

            {imagePreview && (
              <div className="mt-5">
                <div className="relative max-w-xl overflow-hidden rounded-2xl border border-slate-200 bg-slate-50">
                  <img
                    src={imagePreview}
                    alt="Announcement preview"
                    className="h-64 w-full object-cover"
                  />
                </div>

                <button
                  type="button"
                  onClick={removeImage}
                  className="mt-3 rounded-lg border border-red-200 px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-50"
                >
                  Remove Image
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Buttons */}
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