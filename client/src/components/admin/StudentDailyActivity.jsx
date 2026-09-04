import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import studentDailyActivityService from "../../services/studentDailyActivityService";

const API_SERVER = "http://localhost:5000";

function getMediaUrl(url) {
  if (!url) return "";

  if (
    url.startsWith("http://") ||
    url.startsWith("https://")
  ) {
    return url;
  }

  return `${API_SERVER}${url}`;
}

function StudentDailyActivity({ studentId }) {
  const { token } = useAuth();

  const [activities, setActivities] = useState([]);

  const [form, setForm] = useState({
    date: new Date().toISOString().split("T")[0],
    studied: "",
    progress: "",
  });

  const [media, setMedia] = useState(null);
  const [mediaPreview, setMediaPreview] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  /*
  |--------------------------------------------------------------------------
  | Load Activity History
  |--------------------------------------------------------------------------
  */

  const loadActivities = async () => {
    try {
      setLoading(true);
      setError("");

      const response =
        await studentDailyActivityService.getActivities(
          token,
          studentId
        );

      setActivities(response.data || []);
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Unable to load daily activities."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token && studentId) {
      loadActivities();
    }
  }, [token, studentId]);

  /*
  |--------------------------------------------------------------------------
  | Text Field Changes
  |--------------------------------------------------------------------------
  */

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  };

  /*
  |--------------------------------------------------------------------------
  | Choose Photo / Video
  |--------------------------------------------------------------------------
  */

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) {
      setMedia(null);
      setMediaPreview("");
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
      setMedia(null);
      setMediaPreview("");
      return;
    }

    if (file.size > 100 * 1024 * 1024) {
      setError(
        "Photo or video must be smaller than 100MB."
      );

      event.target.value = "";
      setMedia(null);
      setMediaPreview("");
      return;
    }

    setError("");
    setMedia(file);

    const previewUrl = URL.createObjectURL(file);
    setMediaPreview(previewUrl);
  };

  /*
  |--------------------------------------------------------------------------
  | Remove Selected Media
  |--------------------------------------------------------------------------
  */

  const removeMedia = () => {
    setMedia(null);
    setMediaPreview("");

    const fileInput = document.getElementById(
      "student-activity-media"
    );

    if (fileInput) {
      fileInput.value = "";
    }
  };

  /*
  |--------------------------------------------------------------------------
  | Save Activity
  |--------------------------------------------------------------------------
  */

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!form.date) {
      setError("Activity date is required.");
      return;
    }

    if (!form.studied.trim()) {
      setError("Please enter what the student studied.");
      return;
    }

    if (!form.progress.trim()) {
      setError("Please enter the student's daily progress.");
      return;
    }

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      const formData = new FormData();

      formData.append("date", form.date);
      formData.append("studied", form.studied);
      formData.append("progress", form.progress);

      if (media) {
        formData.append("media", media);
      }

      await studentDailyActivityService.createActivity(
        token,
        studentId,
        formData
      );

      setSuccess(
        "Daily activity added successfully."
      );

      setForm({
        date: new Date()
          .toISOString()
          .split("T")[0],
        studied: "",
        progress: "",
      });

      removeMedia();

      await loadActivities();
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Unable to save daily activity."
      );
    } finally {
      setSaving(false);
    }
  };

  /*
  |--------------------------------------------------------------------------
  | Delete Activity
  |--------------------------------------------------------------------------
  */

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this daily activity?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setError("");
      setSuccess("");

      await studentDailyActivityService.deleteActivity(
        token,
        id
      );

      setSuccess(
        "Daily activity deleted successfully."
      );

      await loadActivities();
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Unable to delete activity."
      );
    }
  };

  /*
  |--------------------------------------------------------------------------
  | Render
  |--------------------------------------------------------------------------
  */

  return (
    <section className="mt-8">

      {/* Heading */}
      <div className="mb-5">
        <p className="text-sm font-semibold text-blue-700">
          Student Progress
        </p>

        <h2 className="mt-1 text-2xl font-bold text-slate-900">
          Daily Activity Log
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Record what this student studied and their
          daily progress.
        </p>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Success */}
      {success && (
        <div className="mb-5 rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-700">
          {success}
        </div>
      )}

      {/* Add Activity */}
      <form
        onSubmit={handleSubmit}
        className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
      >
        <h3 className="text-lg font-bold text-slate-900">
          Add Daily Activity
        </h3>

        <div className="mt-6 grid gap-5 md:grid-cols-2">

          {/* Date */}
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Activity Date
            </label>

            <input
              type="date"
              name="date"
              value={form.date}
              onChange={handleChange}
              required
              className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          {/* Studied */}
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              What did the student study?
            </label>

            <input
              type="text"
              name="studied"
              value={form.studied}
              onChange={handleChange}
              placeholder="e.g. Mathematics - Fractions"
              required
              className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          {/* Progress */}
          <div className="md:col-span-2">
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Daily Progress
            </label>

            <textarea
              name="progress"
              value={form.progress}
              onChange={handleChange}
              rows="5"
              placeholder="How did the student perform today?"
              required
              className="w-full resize-y rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
            />
          </div>
        </div>

        {/* Media */}
        <div className="mt-6">
          <label className="mb-2 block text-sm font-semibold text-slate-700">
            Photo / Video
          </label>

          <div className="rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 p-5">

            <input
              id="student-activity-media"
              type="file"
              accept=".jpg,.jpeg,.png,.webp,.mp4,.webm,.mov,image/jpeg,image/png,image/webp,video/mp4,video/webm,video/quicktime"
              onChange={handleFileChange}
              className="block w-full cursor-pointer text-sm text-slate-600 file:mr-4 file:cursor-pointer file:rounded-lg file:border-0 file:bg-blue-700 file:px-4 file:py-2.5 file:font-semibold file:text-white hover:file:bg-blue-800"
            />

            <p className="mt-3 text-xs text-slate-500">
              Supported: JPG, PNG, WEBP, MP4, WEBM, MOV
              — Maximum 100 MB.
            </p>

            {/* Selected File */}
            {media && (
              <div className="mt-4 rounded-xl border border-blue-200 bg-blue-50 p-4">

                <div className="flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-xs font-semibold uppercase tracking-wide text-blue-600">
                      Selected File
                    </p>

                    <p className="mt-1 truncate text-sm font-semibold text-slate-800">
                      {media.name}
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                      {(media.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={removeMedia}
                    className="rounded-lg bg-white px-3 py-2 text-xs font-semibold text-red-600 shadow-sm hover:bg-red-50"
                  >
                    Remove
                  </button>
                </div>

                {/* Preview */}
                {mediaPreview && (
                  <div className="mt-4 overflow-hidden rounded-xl border border-slate-200 bg-black">

                    {media.type.startsWith("video/") ? (
                      <video
                        src={mediaPreview}
                        controls
                        className="max-h-96 w-full"
                      />
                    ) : (
                      <img
                        src={mediaPreview}
                        alt="Activity preview"
                        className="max-h-96 w-full object-contain"
                      />
                    )}

                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Save */}
        <div className="mt-6 flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="rounded-xl bg-blue-700 px-7 py-3 text-sm font-semibold text-white transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving
              ? "Saving..."
              : "Save Daily Activity"}
          </button>
        </div>
      </form>

      {/* Activity History */}
      <div className="mt-8">

        <div>
          <h3 className="text-xl font-bold text-slate-900">
            Activity History
          </h3>

          <p className="mt-1 text-sm text-slate-500">
            Previous daily learning and progress records.
          </p>
        </div>

        {loading ? (
          <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-10 text-center text-sm text-slate-500">
            Loading activity history...
          </div>
        ) : activities.length === 0 ? (
          <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-10 text-center text-sm text-slate-500">
            No daily activities have been recorded yet.
          </div>
        ) : (
          <div className="mt-5 space-y-5">

            {activities.map((activity) => (
              <article
                key={activity._id}
                className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
              >

                {/* Date + Delete */}
                <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">

                  <div>
                    <p className="text-sm font-semibold text-blue-700">
                      {new Date(
                        activity.date
                      ).toLocaleDateString()}
                    </p>

                    {activity.studied && (
                      <h4 className="mt-2 text-lg font-bold text-slate-900">
                        {activity.studied}
                      </h4>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      handleDelete(activity._id)
                    }
                    className="self-start rounded-lg bg-red-50 px-3 py-2 text-xs font-semibold text-red-600 transition hover:bg-red-100"
                  >
                    Delete
                  </button>

                </div>

                {/* Progress */}
                {activity.progress && (
                  <div className="mt-5">

                    <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                      Daily Progress
                    </p>

                    <p className="mt-2 whitespace-pre-line text-sm leading-7 text-slate-600">
                      {activity.progress}
                    </p>

                  </div>
                )}

                {/* Media */}
                {activity.media?.length > 0 && (
                  <div className="mt-6">

                    <p className="mb-3 text-xs font-bold uppercase tracking-wide text-slate-400">
                      Activity Media
                    </p>

                    <div className="grid gap-4 sm:grid-cols-2">

                      {activity.media.map(
                        (item, index) => {

                          const mediaUrl =
                            getMediaUrl(item.url);

                          return (
                            <div
                              key={`${item.url}-${index}`}
                              className="overflow-hidden rounded-xl border border-slate-200 bg-slate-50"
                            >

                              {item.type === "video" ? (
                                <video
                                  src={mediaUrl}
                                  controls
                                  preload="metadata"
                                  className="max-h-96 w-full bg-slate-950"
                                />
                              ) : (
                                <img
                                  src={mediaUrl}
                                  alt={
                                    item.name ||
                                    "Student activity"
                                  }
                                  className="max-h-96 w-full object-cover"
                                />
                              )}

                            </div>
                          );
                        }
                      )}

                    </div>
                  </div>
                )}

              </article>
            ))}

          </div>
        )}
      </div>
    </section>
  );
}

export default StudentDailyActivity;