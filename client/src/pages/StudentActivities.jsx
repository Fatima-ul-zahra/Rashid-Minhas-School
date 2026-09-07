import { useEffect, useState } from "react";
import studentActivityService from "../services/studentActivityService";

import API_URL from "../config/apiServer";

/*
|--------------------------------------------------------------------------
| Media URL
|--------------------------------------------------------------------------
*/

function getMediaUrl(url) {
  if (!url) {
    return "";
  }

  if (
    url.startsWith("http://") ||
    url.startsWith("https://")
  ) {
    return url;
  }

  return `${API_URL}${url}`;
}

/*
|--------------------------------------------------------------------------
| Student Photo URL
|--------------------------------------------------------------------------
*/

function getStudentPhoto(photo) {
  if (!photo) {
    return "";
  }

  if (
    photo.startsWith("http://") ||
    photo.startsWith("https://")
  ) {
    return photo;
  }

  return `${API_URL}${photo}`;
}

/*
|--------------------------------------------------------------------------
| Format Date
|--------------------------------------------------------------------------
*/

function formatDate(date) {
  if (!date) {
    return "Date not available";
  }

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "Date not available";
  }

  return parsedDate.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

/*
|--------------------------------------------------------------------------
| Progress Color
|--------------------------------------------------------------------------
*/

function getProgressStyle(progress) {
  const value = String(progress || "").toLowerCase();

  /*
  |--------------------------------------------------------------------------
  | Bad / Poor / Weak
  |--------------------------------------------------------------------------
  */

  if (
    value.includes("bad") ||
    value.includes("poor") ||
    value.includes("weak") ||
    value.includes("unsatisfactory") ||
    value.includes("needs improvement")
  ) {
    return {
      container:
        "border border-red-200 bg-red-50",
      icon:
        "bg-red-100 text-red-700",
      label:
        "text-red-700",
      text:
        "text-red-900",
    };
  }

  /*
  |--------------------------------------------------------------------------
  | Average / Fair
  |--------------------------------------------------------------------------
  */

  if (
    value.includes("average") ||
    value.includes("fair") ||
    value.includes("satisfactory")
  ) {
    return {
      container:
        "border border-yellow-200 bg-yellow-50",
      icon:
        "bg-yellow-100 text-yellow-700",
      label:
        "text-yellow-700",
      text:
        "text-yellow-900",
    };
  }

  /*
  |--------------------------------------------------------------------------
  | Good / Excellent / Default
  |--------------------------------------------------------------------------
  */

  return {
    container:
      "border border-green-100 bg-green-50",
    icon:
      "bg-green-100 text-green-700",
    label:
      "text-green-700",
    text:
      "text-green-900",
  };
}

/*
|--------------------------------------------------------------------------
| Student Activities Page
|--------------------------------------------------------------------------
*/

function StudentActivities() {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /*
  |--------------------------------------------------------------------------
  | Load Public Activities
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    const loadActivities = async () => {
      try {
        setLoading(true);
        setError("");

        const response =
          await studentActivityService.getPublicActivities();

        setActivities(response.data || []);
      } catch (error) {
        console.error(
          "Unable to load student activities:",
          error
        );

        setError(
          "Unable to load student activities."
        );
      } finally {
        setLoading(false);
      }
    };

    loadActivities();
  }, []);

  return (
    <div>

      {/* =====================================================
          HERO
      ====================================================== */}

      <section className="relative overflow-hidden bg-slate-950">

        <div className="absolute inset-0 bg-gradient-to-br from-blue-950 via-slate-950 to-slate-950" />

        <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">

          <span className="inline-flex rounded-full bg-blue-500/10 px-4 py-2 text-sm font-semibold uppercase tracking-wider text-blue-400 ring-1 ring-blue-500/20">
            School Life
          </span>

          <h1 className="mt-5 text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
            Student Activities
          </h1>

          <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-300">
            Discover how our students learn, grow,
            and make progress every day through
            meaningful classroom activities and
            learning experiences.
          </p>

        </div>
      </section>

      {/* =====================================================
          ACTIVITIES
      ====================================================== */}

      <section className="bg-slate-50 py-16">

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

          {/* =================================================
              ERROR
          ================================================== */}

          {error && (
            <div className="mb-8 rounded-2xl border border-red-200 bg-red-50 p-5 text-sm text-red-700">
              {error}
            </div>
          )}

          {/* =================================================
              LOADING
          ================================================== */}

          {loading ? (
            <div className="py-20 text-center">

              <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600" />

              <p className="mt-5 text-sm font-medium text-slate-500">
                Loading student activities...
              </p>

            </div>
          ) : activities.length === 0 ? (

            /* =================================================
               EMPTY STATE
            ================================================== */

            <div className="rounded-3xl border border-slate-200 bg-white px-6 py-16 text-center shadow-sm sm:px-12">

              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-blue-50 text-blue-600">

                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-10 w-10"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="1.8"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 6v12m6-6H6"
                  />
                </svg>

              </div>

              <h2 className="mt-6 text-2xl font-bold text-slate-900">
                No student activities yet
              </h2>

              <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-slate-500">
                Daily student learning activities,
                progress updates, photos, and videos
                will appear here when published by
                the school.
              </p>

            </div>

          ) : (

            /* =================================================
               ACTIVITY GRID
            ================================================== */

            <div className="grid gap-8 lg:grid-cols-2">

              {activities.map((activity) => {

                const student = activity.student;

                const firstMedia =
                  Array.isArray(activity.media) &&
                  activity.media.length > 0
                    ? activity.media[0]
                    : null;

                const progressStyle =
                  getProgressStyle(
                    activity.progress
                  );

                return (

                  <article
                    key={activity._id}
                    className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl"
                  >

                    {/* =========================================
                        MEDIA
                    ========================================== */}

                    {firstMedia ? (

                      <div className="relative bg-slate-950">

                        {firstMedia.type === "video" ? (

                          <video
                            src={getMediaUrl(
                              firstMedia.url
                            )}
                            controls
                            preload="metadata"
                            className="aspect-video w-full object-cover"
                          >
                            Your browser does not support
                            video playback.
                          </video>

                        ) : (

                          <img
                            src={getMediaUrl(
                              firstMedia.url
                            )}
                            alt={
                              student?.name
                                ? `${student.name} student activity`
                                : "Student activity"
                            }
                            className="aspect-video w-full object-cover"
                          />

                        )}

                      </div>

                    ) : (

                      <div className="flex aspect-video items-center justify-center bg-gradient-to-br from-blue-950 to-slate-950">

                        <div className="text-center">

                          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-white/10">

                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-8 w-8 text-blue-300"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              strokeWidth="1.8"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M12 6v12m6-6H6"
                              />
                            </svg>

                          </div>

                          <p className="mt-4 text-sm font-medium text-slate-400">
                            Learning Activity
                          </p>

                        </div>

                      </div>

                    )}

                    {/* =========================================
                        CONTENT
                    ========================================== */}

                    <div className="p-6 sm:p-7">

                      {/* =======================================
                          STUDENT HEADER
                      ======================================== */}

                      <div className="flex items-center gap-4">

                        {student?.photo ? (

                          <img
                            src={getStudentPhoto(
                              student.photo
                            )}
                            alt={student.name}
                            className="h-14 w-14 rounded-full border-2 border-white object-cover shadow-md"
                          />

                        ) : (

                          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-blue-100 text-lg font-bold text-blue-700">

                            {student?.name
                              ? student.name
                                  .charAt(0)
                                  .toUpperCase()
                              : "S"}

                          </div>

                        )}

                        <div className="min-w-0">

                          <h2 className="truncate text-lg font-bold text-slate-900">
                            {student?.name ||
                              "Student"}
                          </h2>

                          <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-slate-500">

                            {student?.rollNumber && (
                              <span>
                                Roll No:{" "}
                                <strong className="text-slate-700">
                                  {student.rollNumber}
                                </strong>
                              </span>
                            )}

                            {student?.class && (
                              <>
                                <span>
                                  •
                                </span>

                                <span>
                                  Class:{" "}
                                  <strong className="text-blue-700">
                                    {student.class}
                                  </strong>
                                </span>
                              </>
                            )}

                          </div>

                        </div>

                      </div>

                      {/* =======================================
                          DATE
                      ======================================== */}

                      <div className="mt-5 flex flex-wrap items-center gap-2">

                        <span className="rounded-full bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700">
                          Daily Learning Activity
                        </span>

                        <span className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-600">
                          {formatDate(activity.date)}
                        </span>

                      </div>

                      {/* =======================================
                          STUDIED
                      ======================================== */}

                      {activity.studied && (

                        <div className="mt-6 rounded-2xl bg-slate-50 p-5">

                          <div className="flex items-start gap-3">

                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-blue-700">

                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth="1.8"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5s3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18s-3.332.477-4.5 1.253"
                                />
                              </svg>

                            </div>

                            <div className="min-w-0">

                              <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
                                What Was Studied
                              </p>

                              <p className="mt-1 text-sm leading-6 text-slate-700">
                                {activity.studied}
                              </p>

                            </div>

                          </div>

                        </div>

                      )}

                      {/* =======================================
                          DAILY PROGRESS
                      ======================================== */}

                      {activity.progress && (

                        <div
                          className={`mt-4 rounded-2xl p-5 ${progressStyle.container}`}
                        >

                          <div className="flex items-start gap-3">

                            <div
                              className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${progressStyle.icon}`}
                            >

                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth="1.8"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M5 13l4 4L19 7"
                                />
                              </svg>

                            </div>

                            <div className="min-w-0">

                              <p
                                className={`text-xs font-bold uppercase tracking-wide ${progressStyle.label}`}
                              >
                                Daily Progress
                              </p>

                              <p
                                className={`mt-1 text-sm leading-6 ${progressStyle.text}`}
                              >
                                {activity.progress}
                              </p>

                            </div>

                          </div>

                        </div>

                      )}

                    </div>

                  </article>

                );
              })}

            </div>

          )}

        </div>

      </section>

    </div>
  );
}

export default StudentActivities;