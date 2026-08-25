import { useEffect, useState } from "react";

import announcementService from "../services/announcementService";

function Announcements() {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadAnnouncements = async () => {
      try {
        const response =
          await announcementService.getPublicAnnouncements();

        setAnnouncements(response.data);
      } catch (error) {
        setError(
          "Unable to load announcements."
        );
      } finally {
        setLoading(false);
      }
    };

    loadAnnouncements();
  }, []);

  return (
    <div>
      <section className="bg-slate-950">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <span className="text-sm font-semibold uppercase tracking-wider text-blue-400">
            School Updates
          </span>

          <h1 className="mt-4 text-4xl font-extrabold text-white sm:text-5xl">
            Announcements
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
            Stay informed about the latest school notices
            and important updates.
          </p>
        </div>
      </section>

      <section className="bg-slate-50 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {error && (
            <div className="rounded-xl bg-red-50 p-4 text-sm text-red-700">
              {error}
            </div>
          )}

          {loading ? (
            <div className="py-16 text-center text-slate-500">
              Loading announcements...
            </div>
          ) : announcements.length === 0 ? (
            <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center">
              <h2 className="font-bold text-slate-900">
                No announcements available
              </h2>

              <p className="mt-2 text-sm text-slate-500">
                Please check back later for school updates.
              </p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {announcements.map(
                (announcement) => (
                  <article
                    key={announcement._id}
                    className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
                  >
                    {announcement.image && (
                      <img
                        src={announcement.image}
                        alt={announcement.title}
                        className="h-48 w-full object-cover"
                      />
                    )}

                    <div className="p-6">
                      <p className="text-xs font-semibold uppercase tracking-wide text-blue-700">
                        {new Date(
                          announcement.date
                        ).toLocaleDateString()}
                      </p>

                      <h2 className="mt-3 text-xl font-bold text-slate-900">
                        {announcement.title}
                      </h2>

                      <p className="mt-3 text-sm leading-7 text-slate-600">
                        {announcement.description}
                      </p>
                    </div>
                  </article>
                )
              )}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

export default Announcements;