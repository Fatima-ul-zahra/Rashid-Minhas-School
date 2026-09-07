import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import { useAuth } from "../../context/AuthContext";
import galleryService from "../../services/galleryService";
import API_SERVER_URL from "../../config/apiServer";

const initialForm = {
  title: "",
  caption: "",
  media: "",
  mediaType: "image",
  category: "General",
  status: "published",
};

function GalleryForm() {
  const { token } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams();

  const isEdit = Boolean(id);

  const [form, setForm] = useState(initialForm);

  const [mediaFile, setMediaFile] = useState(null);
  const [mediaPreview, setMediaPreview] = useState("");

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
          media: item.media || "",
          mediaType: item.mediaType || "image",
          category: item.category || "General",
          status: item.status || "published",
        });

        if (item.media) {
          const mediaUrl =
            item.media.startsWith("http")
              ? item.media
              : `${API_SERVER_URL}${item.media}`;

          setMediaPreview(mediaUrl);
        }
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

  const handleMediaChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
      "video/mp4",
      "video/webm",
      "video/quicktime",
    ];

    if (!allowedTypes.includes(file.type)) {
      setError(
        "Only JPG, PNG, WEBP, MP4, WEBM and MOV files are allowed."
      );

      event.target.value = "";
      return;
    }

    if (file.size > 100 * 1024 * 1024) {
      setError(
        "Image or video must be smaller than 100MB."
      );

      event.target.value = "";
      return;
    }

    setError("");

    setMediaFile(file);

    const previewUrl = URL.createObjectURL(file);

    setMediaPreview(previewUrl);

    const mediaType = file.type.startsWith("video/")
      ? "video"
      : "image";

    setForm((current) => ({
      ...current,
      mediaType,
    }));
  };

  const removeMedia = () => {
    setMediaFile(null);
    setMediaPreview("");

    setForm((current) => ({
      ...current,
      media: "",
      mediaType: "image",
    }));

    const fileInput =
      document.getElementById("gallery-media");

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

    /*
     * A new file is required when creating.
     * During editing, the existing media can remain.
     */
    if (!isEdit && !mediaFile) {
      setError(
        "Please select an image or video."
      );
      return;
    }

    try {
      setSaving(true);
      setError("");

      const formData = new FormData();

      formData.append(
        "title",
        form.title
      );

      formData.append(
        "caption",
        form.caption
      );

      formData.append(
        "category",
        form.category
      );

      formData.append(
        "status",
        form.status
      );

      if (mediaFile) {
        formData.append(
          "media",
          mediaFile
        );
      }

      if (isEdit) {
        await galleryService.updateGalleryItem(
          token,
          id,
          formData
        );
      } else {
        await galleryService.createGalleryItem(
          token,
          formData
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
          ? "Edit Gallery Media"
          : "Add Gallery Media"}
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

          {/* Title */}
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

          {/* Media Upload */}
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Image / Video *
            </label>

            <input
              id="gallery-media"
              type="file"
              accept="
                image/jpeg,
                image/png,
                image/webp,
                video/mp4,
                video/webm,
                video/quicktime
              "
              onChange={handleMediaChange}
              className="block w-full rounded-xl border border-slate-300 p-3 text-sm"
            />

            <p className="mt-2 text-xs text-slate-500">
              Images: JPG, PNG, WEBP
              <br />
              Videos: MP4, WEBM, MOV
              <br />
              Maximum file size: 100MB
            </p>
          </div>

          {/* Preview */}
          {mediaPreview && (
            <div>
              <p className="mb-2 text-sm font-semibold text-slate-700">
                Preview
              </p>

              {form.mediaType === "video" ? (
                <video
                  src={mediaPreview}
                  controls
                  className="h-64 w-full rounded-xl bg-black object-contain"
                />
              ) : (
                <img
                  src={mediaPreview}
                  alt="Gallery preview"
                  className="h-64 w-full rounded-xl object-cover"
                />
              )}

              <button
                type="button"
                onClick={removeMedia}
                className="mt-3 rounded-lg border border-red-200 px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-50"
              >
                Remove Media
              </button>
            </div>
          )}

          {/* Caption */}
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Caption
            </label>

            <textarea
              name="caption"
              value={form.caption}
              onChange={handleChange}
              rows="4"
              placeholder="Short description of the photograph or video..."
              className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-600"
            />
          </div>

          {/* Category + Status */}
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

        {/* Buttons */}
        <div className="mt-8 flex justify-end gap-3">

          <Link
            to="/admin/gallery"
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
              ? "Update Media"
              : "Add Media"}
          </button>

        </div>
      </form>
    </div>
  );
}

export default GalleryForm;