import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

import { useAuth } from "../../context/AuthContext";
import galleryService from "../../services/galleryService";

function Gallery() {
  const { token } = useAuth();

  const [items, setItems] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [status, setStatus] = useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadGallery = async () => {
    try {
      setLoading(true);
      setError("");

      const response =
        await galleryService.getAdminGallery(token);

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

  const categories = useMemo(() => {
    return [
      ...new Set(
        items
          .map((item) => item.category)
          .filter(Boolean)
      ),
    ];
  }, [items]);

  const filteredItems = useMemo(() => {
    const value = search.toLowerCase().trim();

    return items.filter((item) => {
      const matchesSearch =
        !value ||
        item.title
          ?.toLowerCase()
          .includes(value) ||
        item.caption
          ?.toLowerCase()
          .includes(value);

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
  const handleDelete = async (item) => {
    const confirmed = window.confirm(
      `Delete "${item.title}"?`
    );

    if (!confirmed) return;

    try {
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

  return (
    <div className="p-4 sm:p-6">
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
          className="rounded-xl bg-blue-700 px-5 py-3 text-center text-sm font-semibold text-white hover:bg-blue-800"
        >
          + Add Image
        </Link>
      </div>

      {error && (
        <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="mt-6 grid gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:grid-cols-3">
        <input
          type="text"
          value={search}
          onChange={(event) =>
            setSearch(event.target.value)
          }
          placeholder="Search gallery..."
          className="rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-blue-600"
        />

        <select
          value={category}
          onChange={(event) =>
            setCategory(event.target.value)
          }
          className="rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-blue-600"
        >
          <option value="">All Categories</option>

          {categories.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>

        <select
          value={status}
          onChange={(event) =>
            setStatus(event.target.value)
          }
          className="rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-blue-600"
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

      {loading ? (
        <div className="py-16 text-center text-sm text-slate-500">
          Loading gallery...
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-12 text-center">
          <h2 className="font-bold text-slate-900">
            No gallery images found
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            Add your first school image.
          </p>
        </div>
      ) : (
        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredItems.map((item) => (
            <div
              key={item._id}
              className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
            >
              <img
                src={item.image}
                alt={item.title}
                className="h-52 w-full object-cover"
              />

              <div className="p-5">
                <div className="flex items-start justify-between gap-3">
                  <h2 className="font-bold text-slate-900">
                    {item.title}
                  </h2>

                  <span className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700">
                    {item.category}
                  </span>
                </div>

                <p className="mt-2 line-clamp-2 text-sm text-slate-500">
                  {item.caption || "No caption"}
                </p>

                <div className="mt-4 flex items-center justify-between">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
                      item.status === "published"
                        ? "bg-green-50 text-green-700"
                        : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    {item.status}
                  </span>

                  <div className="flex flex-wrap gap-2">
                        <Link
                            to={`/admin/gallery/${item._id}/edit`}
                            className="rounded-lg bg-blue-50 px-3 py-2 text-xs font-semibold text-blue-700"
                        >
                            Edit
                        </Link>

                        <button
                            type="button"
                            onClick={() =>
                            handleToggleStatus(item)
                            }
                            className="rounded-lg bg-amber-50 px-3 py-2 text-xs font-semibold text-amber-700"
                        >
                            {item.status === "published"
                            ? "Unpublish"
                            : "Publish"}
                        </button>

                        <button
                            type="button"
                            onClick={() =>
                            handleDelete(item)
                            }
                            className="rounded-lg bg-red-50 px-3 py-2 text-xs font-semibold text-red-600"
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