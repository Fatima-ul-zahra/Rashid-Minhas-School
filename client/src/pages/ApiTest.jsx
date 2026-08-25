import { useEffect, useState } from "react";

import healthService from "../services/healthService";
import schoolSettingsService from "../services/schoolSettingsService";

function ApiTest() {
  const [health, setHealth] = useState(null);
  const [settings, setSettings] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const testApi = async () => {
      try {
        setLoading(true);
        setError("");

        const healthResponse =
          await healthService.checkHealth();

        const settingsResponse =
          await schoolSettingsService.getSettings();

        setHealth(healthResponse);
        setSettings(settingsResponse);
      } catch (error) {
        console.error(error);

        setError(
          error.response?.data?.message ||
            "Unable to connect to the backend API."
        );
      } finally {
        setLoading(false);
      }
    };

    testApi();
  }, []);

  if (loading) {
    return (
      <section className="flex min-h-[70vh] items-center justify-center bg-slate-50 px-4">
        <div className="rounded-2xl bg-white p-8 text-center shadow-sm">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-blue-700" />

          <p className="mt-4 font-semibold text-slate-700">
            Testing backend connection...
          </p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="flex min-h-[70vh] items-center justify-center bg-slate-50 px-4">
        <div className="max-w-lg rounded-2xl border border-red-200 bg-red-50 p-8 text-center">
          <h1 className="text-2xl font-bold text-red-800">
            API Connection Failed
          </h1>

          <p className="mt-3 text-sm leading-6 text-red-700">
            {error}
          </p>

          <p className="mt-5 text-sm text-red-600">
            Make sure the Express backend and MongoDB are
            running.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-[70vh] bg-slate-50 py-16">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <span className="text-sm font-semibold uppercase tracking-wider text-green-600">
            Connection Successful
          </span>

          <h1 className="mt-3 text-3xl font-bold text-slate-900">
            Frontend ↔ Backend API
          </h1>

          <p className="mt-4 text-slate-600">
            React successfully communicated with the Express
            backend and MongoDB.
          </p>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {/* Health */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-bold text-slate-900">
              Backend Health
            </h2>

            <div className="mt-5 rounded-xl bg-green-50 p-4">
              <p className="text-sm font-semibold text-green-800">
                {health?.message}
              </p>

              <div className="mt-3 space-y-2 text-sm text-green-700">
                <p>
                  Environment:{" "}
                  <strong>
                    {health?.data?.environment}
                  </strong>
                </p>

                <p>
                  Database:{" "}
                  <strong>
                    {health?.data?.database}
                  </strong>
                </p>
              </div>
            </div>
          </div>

          {/* School Settings */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-bold text-slate-900">
              School Settings
            </h2>

            <div className="mt-5 rounded-xl bg-blue-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-blue-600">
                School Name
              </p>

              <p className="mt-2 text-xl font-bold text-blue-900">
                {settings?.data?.schoolName}
              </p>

              <p className="mt-2 text-sm text-blue-700">
                Location: {settings?.data?.location}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ApiTest;