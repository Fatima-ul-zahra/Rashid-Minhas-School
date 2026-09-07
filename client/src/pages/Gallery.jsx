import { useEffect, useMemo, useState } from "react";

import galleryService from "../services/galleryService";
import API_SERVER_URL from "../config/apiServer";

function Gallery() {
  const [items, setItems] = useState([]);
  const [category, setCategory] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadGallery = async () => {
      try {
        const response =
          await galleryService.getPublicGallery();

        setItems(response.data);
      } catch (error) {
        setError(
          "Unable to load the school gallery."
        );
      } finally {
        setLoading(false);
      }
    };

    loadGallery();
  }, []);

  const categories = useMemo(() => {
    return [
      "All",
      ...new Set(
        items
          .map((item) => item.category)
          .filter(Boolean)
      ),
    ];
  }, [items]);

  const filteredItems = useMemo(() => {
    if (category === "All") {
      return items;
    }

    return items.filter(
      (item) => item.category === category
    );
  }, [items, category]);

  return (
    <div>
      {/* Hero */}
      <section className="bg-slate-950">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <span className="text-sm font-semibold uppercase tracking-wider text-blue-400">
            School Life
          </span>

          <h1 className="mt-4 text-4xl font-extrabold text-white sm:text-5xl">
            School Gallery
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
            Explore moments, activities, events, and
            memories from Rashid Minhas Secondary
            School, Ali Pur.
          </p>
        </div>
      </section>

      {/* Gallery */}
      <section className="bg-slate-50 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

          {/* Categories */}
          {!loading &&
            categories.length > 1 && (
              <div className="mb-10 flex flex-wrap justify-center gap-3">
                {categories.map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() =>
                      setCategory(item)
                    }
                    className={`rounded-full px-5 py-2.5 text-sm font-semibold transition ${
                      category === item
                        ? "bg-blue-700 text-white"
                        : "bg-white text-slate-700 border border-slate-200 hover:border-blue-300 hover:text-blue-700"
                    }`}
                  >
                    {item}
                  </button>
                ))}
              </div>
            )}

          {error && (
            <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-center text-sm text-red-700">
              {error}
            </div>
          )}

          {loading ? (
            <div className="py-16 text-center text-slate-500">
              Loading gallery...
            </div>
          ) : filteredItems.length === 0 ? (
            <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center">
              <h2 className="font-bold text-slate-900">
                No gallery images available
              </h2>

              <p className="mt-2 text-sm text-slate-500">
                School photographs will appear here
                when published.
              </p>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredItems.map((item) => (
                <article
                  key={item._id}
                  className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl"
                >
                  <div className="relative overflow-hidden">
                   {item.mediaType === "video" ? (
                    <video
                      src={
                        item.media?.startsWith("http")
                          ? item.media
                          : `${API_SERVER_URL}${item.media}`
                      }
                      controls
                      preload="metadata"
                      className="h-64 w-full object-cover bg-black transition duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <img
                      src={
                        item.media?.startsWith("http")
                          ? item.media
                          : `${API_SERVER_URL}${item.media}`
                      }
                      alt={item.title}
                      loading="lazy"
                      className="h-64 w-full object-cover transition duration-500 group-hover:scale-105"
                    />
                  )}

                    <span className="absolute left-4 top-4 rounded-full bg-white/95 px-3 py-1.5 text-xs font-semibold text-blue-700 shadow-sm">
                      {item.category}
                    </span>
                  </div>

                  <div className="p-5">
                    <h2 className="text-lg font-bold text-slate-900">
                      {item.title}
                    </h2>

                    {item.caption && (
                      <p className="mt-2 text-sm leading-6 text-slate-600">
                        {item.caption}
                      </p>
                    )}
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

export default Gallery;