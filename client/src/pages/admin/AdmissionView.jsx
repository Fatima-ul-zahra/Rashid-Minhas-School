import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import { useAuth } from "../../context/AuthContext";
import admissionService from "../../services/admissionService";

function AdmissionView() {
  const { token } = useAuth();
  const { id } = useParams();

  const [admission, setAdmission] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadAdmission = async () => {
      try {
        const response =
          await admissionService.getAdmission(token, id);

        setAdmission(response.data);
      } catch (error) {
        setError(
          error.response?.data?.message ||
            "Unable to load admission."
        );
      } finally {
        setLoading(false);
      }
    };

    if (token && id) {
      loadAdmission();
    }
  }, [token, id]);

  const updateStatus = async (status) => {
    try {
      setSaving(true);
      setError("");

      const response =
        await admissionService.updateAdmission(
          token,
          id,
          { status }
        );

      setAdmission(response.data);
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Unable to update admission."
      );
    } finally {
      setSaving(false);
    }
  };

  const deleteApplication = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this application?"
    );

    if (!confirmed) return;

    try {
      setSaving(true);

      await admissionService.deleteAdmission(
        token,
        id
      );

      window.location.href = "/admin/admissions";
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Unable to delete application."
      );
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6 text-sm text-slate-500">
        Loading application...
      </div>
    );
  }

  if (error && !admission) {
    return (
      <div className="p-6">
        <div className="rounded-xl bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      </div>
    );
  }

  if (!admission) return null;

  return (
    <div className="p-4 sm:p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-blue-700">
            Admissions
          </p>

          <h1 className="mt-1 text-2xl font-bold text-slate-900">
            Admission Application
          </h1>
        </div>

        <Link
          to="/admin/admissions"
          className="rounded-xl border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
        >
          ← Back
        </Link>
      </div>

      {error && (
        <div className="mt-6 rounded-xl bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="mt-6 max-w-4xl rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 border-b border-slate-200 pb-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">
              {admission.studentName}
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Application submitted{" "}
              {new Date(
                admission.createdAt
              ).toLocaleDateString()}
            </p>
          </div>

          <StatusBadge status={admission.status} />
        </div>

        <div className="mt-6 grid gap-5 sm:grid-cols-2">
          <Info
            label="Father's Name"
            value={admission.fatherName}
          />

          <Info
            label="Desired Class"
            value={admission.desiredClass?.name}
          />

          <Info
            label="Date of Birth"
            value={
              admission.dateOfBirth
                ? new Date(
                    admission.dateOfBirth
                  ).toLocaleDateString()
                : "—"
            }
          />

          <Info
            label="Gender"
            value={admission.gender}
          />

          <Info
            label="Previous School"
            value={admission.previousSchool}
          />

          <Info
            label="Phone"
            value={admission.phone}
          />

          <Info
            label="Email"
            value={admission.email}
          />

          <Info
            label="Address"
            value={admission.address}
          />
        </div>

        <div className="mt-8 border-t border-slate-200 pt-6">
          <p className="text-sm font-semibold text-slate-700">
            Application Status
          </p>

          <div className="mt-4 flex flex-wrap gap-3">
            <button
              type="button"
              disabled={saving}
              onClick={() =>
                updateStatus("pending")
              }
              className="rounded-xl bg-yellow-50 px-5 py-3 text-sm font-semibold text-yellow-700 hover:bg-yellow-100 disabled:opacity-50"
            >
              Mark Pending
            </button>

            <button
              type="button"
              disabled={saving}
              onClick={() =>
                updateStatus("approved")
              }
              className="rounded-xl bg-green-50 px-5 py-3 text-sm font-semibold text-green-700 hover:bg-green-100 disabled:opacity-50"
            >
              Approve
            </button>

            <button
              type="button"
              disabled={saving}
              onClick={() =>
                updateStatus("rejected")
              }
              className="rounded-xl bg-red-50 px-5 py-3 text-sm font-semibold text-red-700 hover:bg-red-100 disabled:opacity-50"
            >
              Reject
            </button>

            <button
              type="button"
              disabled={saving}
              onClick={deleteApplication}
              className="rounded-xl bg-slate-100 px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-200 disabled:opacity-50"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Info({ label, value }) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase text-slate-400">
        {label}
      </p>

      <p className="mt-1 text-sm font-medium capitalize text-slate-800">
        {value || "—"}
      </p>
    </div>
  );
}

function StatusBadge({ status }) {
  const styles = {
    pending: "bg-yellow-50 text-yellow-700",
    approved: "bg-green-50 text-green-700",
    rejected: "bg-red-50 text-red-700",
  };

  return (
    <span
      className={`rounded-full px-4 py-2 text-xs font-semibold capitalize ${
        styles[status] || "bg-slate-100 text-slate-600"
      }`}
    >
      {status}
    </span>
  );
}

export default AdmissionView;