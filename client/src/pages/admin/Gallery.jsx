import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

import { useAuth } from "../../context/AuthContext";
import galleryService from "../../services/galleryService";
import API_SERVER_URL from "../../config/apiServer";

function Gallery() {
  const { token } = useAuth();

  const [items, setItems] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [status, setStatus] = useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // =========================
  // Load Gallery
  // =========================
  const loadGallery = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await galleryService.getAdminGallery(token);

      setItems(response.data);
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Unable to load gallery."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      loadGallery();
    }
  }, [token]);

  // =========================
  // Categories
  // =========================
  const categories = useMemo(() => {
    return [
      ...new Set(
        items
          .map((item) => item.category)
          .filter(Boolean)
      ),
    ];
  }, [items]);

  // =========================
  // Filter Gallery
  // =========================
  const filteredItems = useMemo(() => {
    const value = search.toLowerCase().trim();

    return items.filter((item) => {
      const matchesSearch =
        !value ||
        item.title?.toLowerCase().includes(value) ||
        item.caption?.toLowerCase().includes(value);

      const matchesCategory =
        !category || item.category === category;

      const matchesStatus =
        !status || item.status === status;

      return (
        matchesSearch &&
        matchesCategory &&
        matchesStatus
      );
    });
  }, [items, search, category, status]);

  // =========================
  // Toggle Publish Status
  // =========================
  const handleToggleStatus = async (item) => {
    try {
      setError("");

      const newStatus =
        item.status === "published"
          ? "unpublished"
          : "published";

      const response =
        await galleryService.updateGalleryItem(
          token,
          item._id,
          {
            status: newStatus,
          }
        );

      setItems((current) =>
        current.map((galleryItem) =>
          galleryItem._id === item._id
            ? response.data
            : galleryItem
        )
      );
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Unable to change gallery status."
      );
    }
  };

  // =========================
  // Delete Gallery Item
  // =========================
  const handleDelete = async (item) => {
    const confirmed = window.confirm(
      `Delete "${item.title}"?`
    );

    if (!confirmed) return;

    try {
      setError("");

      await galleryService.deleteGalleryItem(
        token,
        item._id
      );

      setItems((current) =>
        current.filter(
          (galleryItem) =>
            galleryItem._id !== item._id
        )
      );
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Unable to delete gallery item."
      );
    }
  };

  // =========================
  // Media URL
  // =========================
  const getMediaUrl = (media) => {
    if (!media) return "";

    return media.startsWith("http")
      ? media
      : `${API_SERVER_URL}${media}`;
  };

  return (
    <div className="p-4 sm:p-6">

      {/* =================================
          PAGE HEADER
      ================================= */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-blue-700">
            Content Management
          </p>

          <h1 className="mt-1 text-2xl font-bold text-slate-900">
            Gallery
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Manage school photographs and gallery content.
          </p>
        </div>

        <Link
          to="/admin/gallery/new"
          className="inline-flex h-11 items-center justify-center rounded-xl bg-blue-700 px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          + Add Image
        </Link>
      </div>

      {/* =================================
          ERROR MESSAGE
      ================================= */}
      {error && (
        <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-700">
          {error}
        </div>
      )}

      {/* =================================
          FILTERS
      ================================= */}
      <div className="mt-6 grid gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:grid-cols-3">

        {/* Search */}
        <div>
          <label className="mb-2 block text-xs font-semibold text-slate-500">
            Search
          </label>

          <input
            type="text"
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
            placeholder="Search gallery..."
            className="h-12 w-full rounded-xl border border-slate-300 bg-white px-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
          />
        </div>

        {/* Category */}
        <div>
          <label className="mb-2 block text-xs font-semibold text-slate-500">
            Category
          </label>

          <select
            value={category}
            onChange={(event) =>
              setCategory(event.target.value)
            }
            className="h-12 w-full rounded-xl border border-slate-300 bg-white px-4 text-sm text-slate-900 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
          >
            <option value="">All Categories</option>

            {categories.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>

        {/* Status */}
        <div>
          <label className="mb-2 block text-xs font-semibold text-slate-500">
            Status
          </label>

          <select
            value={status}
            onChange={(event) =>
              setStatus(event.target.value)
            }
            className="h-12 w-full rounded-xl border border-slate-300 bg-white px-4 text-sm text-slate-900 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
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

      {/* =================================
          LOADING
      ================================= */}
      {loading ? (
        <div className="py-16 text-center">
          <p className="text-sm text-slate-500">
            Loading gallery...
          </p>
        </div>
      ) : filteredItems.length === 0 ? (

        /* =================================
           EMPTY STATE
        ================================= */
        <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-12 text-center shadow-sm">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-2xl">
            🖼️
          </div>

          <h2 className="mt-4 font-bold text-slate-900">
            No gallery images found
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            Try changing your filters or add your first
            school image.
          </p>

          <Link
            to="/admin/gallery/new"
            className="mt-5 inline-flex h-10 items-center justify-center rounded-lg bg-blue-700 px-4 text-sm font-semibold text-white transition hover:bg-blue-800"
          >
            + Add Image
          </Link>
        </div>

      ) : (

        /* =================================
           GALLERY GRID
        ================================= */
        <div className="mt-6 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">

          {filteredItems.map((item) => (

            <div
              key={item._id}
              className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-md"
            >

              {/* =================================
                  MEDIA
              ================================= */}
              <div className="relative overflow-hidden bg-slate-100">

                {item.mediaType === "video" ? (
                  <video
                    src={getMediaUrl(item.media)}
                    controls
                    className="h-52 w-full bg-black object-cover"
                  />
                ) : (
                  <img
                    src={getMediaUrl(item.media)}
                    alt={item.title || "Gallery image"}
                    className="h-52 w-full object-cover"
                  />
                )}

              </div>

              {/* =================================
                  CARD CONTENT
              ================================= */}
              <div className="p-5">

                {/* Title + Category */}
                <div className="flex items-start justify-between gap-3">

                  <h2 className="min-w-0 truncate font-bold text-slate-900">
                    {item.title}
                  </h2>

                  <span className="shrink-0 rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                    {item.category || "General"}
                  </span>

                </div>

                {/* Caption */}
                <p className="mt-2 line-clamp-2 min-h-[40px] text-sm leading-5 text-slate-500">
                  {item.caption || "No caption"}
                </p>

                {/* =================================
                    STATUS + ACTIONS
                ================================= */}
                <div className="mt-5 border-t border-slate-100 pt-4">

                  {/* Status Row */}
                  <div className="mb-3 flex items-center justify-between">

                    <span className="text-xs font-medium text-slate-400">
                      Status
                    </span>

                    <span
                      className={`rounded-full border px-3 py-1 text-xs font-semibold capitalize ${
                        item.status === "published"
                          ? "border-emerald-100 bg-emerald-50 text-emerald-700"
                          : "border-slate-200 bg-slate-100 text-slate-600"
                      }`}
                    >
                      {item.status}
                    </span>

                  </div>

                  {/* Action Buttons */}
                  <div className="grid grid-cols-3 gap-2">

                    {/* Edit */}
                    <Link
                      to={`/admin/gallery/${item._id}/edit`}
                      className="flex h-10 items-center justify-center rounded-lg border border-blue-200 bg-blue-50 px-2 text-xs font-semibold text-blue-700 transition hover:border-blue-300 hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-200"
                    >
                      Edit
                    </Link>

                    {/* Publish / Unpublish */}
                    <button
                      type="button"
                      onClick={() =>
                        handleToggleStatus(item)
                      }
                      className={`flex h-10 items-center justify-center rounded-lg border px-2 text-xs font-semibold transition focus:outline-none focus:ring-2 ${
                        item.status === "published"
                          ? "border-amber-200 bg-amber-50 text-amber-700 hover:border-amber-300 hover:bg-amber-100 focus:ring-amber-200"
                          : "border-emerald-200 bg-emerald-50 text-emerald-700 hover:border-emerald-300 hover:bg-emerald-100 focus:ring-emerald-200"
                      }`}
                    >
                      {item.status === "published"
                        ? "Unpublish"
                        : "Publish"}
                    </button>

                    {/* Delete */}
                    <button
                      type="button"
                      onClick={() =>
                        handleDelete(item)
                      }
                      className="flex h-10 items-center justify-center rounded-lg border border-red-200 bg-red-50 px-2 text-xs font-semibold text-red-600 transition hover:border-red-300 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-red-200"
                    >
                      Delete
                    </button>

                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Gallery;