import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import { useAuth } from "../../context/AuthContext";
import galleryService from "../../services/galleryService";

const initialForm = {
  title: "",
  caption: "",
  image: "",
  category: "General",
  status: "published",
};

function GalleryForm() {
  const { token } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams();

  const isEdit = Boolean(id);

  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadItem = async () => {
      try {
        const response =
          await galleryService.getGalleryItem(
            token,
            id
          );

        const item = response.data;

        setForm({
          title: item.title || "",
          caption: item.caption || "",
          image: item.image || "",
          category: item.category || "General",
          status: item.status || "published",
        });
      } catch (error) {
        setError(
          error.response?.data?.message ||
            "Unable to load gallery item."
        );
      } finally {
        setLoading(false);
      }
    };

    if (token && isEdit) {
      loadItem();
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

    if (!form.image.trim()) {
      setError("Image URL is required.");
      return;
    }

    try {
      setSaving(true);
      setError("");

      if (isEdit) {
        await galleryService.updateGalleryItem(
          token,
          id,
          form
        );
      } else {
        await galleryService.createGalleryItem(
          token,
          form
        );
      }

      navigate("/admin/gallery");
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Unable to save gallery item."
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6 text-sm text-slate-500">
        Loading gallery item...
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6">
      <p className="text-sm font-semibold text-blue-700">
        Content Management
      </p>

      <h1 className="mt-1 text-2xl font-bold text-slate-900">
        {isEdit
          ? "Edit Gallery Image"
          : "Add Gallery Image"}
      </h1>

      {error && (
        <div className="mt-6 max-w-3xl rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="mt-6 max-w-3xl rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
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
              placeholder="School Annual Function"
              required
              className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-600"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Image URL *
            </label>

            <input
              name="image"
              value={form.image}
              onChange={handleChange}
              placeholder="https://example.com/image.jpg"
              required
              className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-600"
            />
          </div>

          {form.image && (
            <div>
              <p className="mb-2 text-sm font-semibold text-slate-700">
                Preview
              </p>

              <img
                src={form.image}
                alt="Preview"
                className="h-56 w-full rounded-xl object-cover"
                onError={(event) => {
                  event.currentTarget.style.display =
                    "none";
                }}
              />
            </div>
          )}

          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Caption
            </label>

            <textarea
              name="caption"
              value={form.caption}
              onChange={handleChange}
              rows="4"
              placeholder="Short description of the photograph..."
              className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-600"
            />
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Category
              </label>

              <input
                name="category"
                value={form.category}
                onChange={handleChange}
                placeholder="Events"
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
                <option value="published">
                  Published
                </option>

                <option value="unpublished">
                  Unpublished
                </option>
              </select>
            </div>
          </div>
        </div>

        <div className="mt-8 flex justify-end gap-3">
          <Link
            to="/admin/gallery"
            className="rounded-xl border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700"
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
              ? "Update Image"
              : "Add Image"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default GalleryForm;