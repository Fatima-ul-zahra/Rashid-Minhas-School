import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

import classService from "../../services/classService";
import feeStructureService from "../../services/feeStructureService";

function FeeStructures() {
  const navigate = useNavigate();

  const { token } = useAuth();

  const [classes, setClasses] = useState([]);
  const [feeStructures, setFeeStructures] = useState([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [editingId, setEditingId] = useState(null);

  const [form, setForm] = useState({
    class: "",
    monthlyFee: "",
    dueDay: "10",
    status: "active",
    notes: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (token) {
      loadData();
    }
  }, [token]);

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");

      const [classesResponse, feeResponse] =
        await Promise.all([
          classService.getClasses(token),
          feeStructureService.getFeeStructures(token),
        ]);

      setClasses(
        classesResponse?.data ||
          classesResponse?.classes ||
          []
      );

      setFeeStructures(
        feeResponse?.data ||
          feeResponse?.feeStructures ||
          []
      );
    } catch (err) {
      console.error(err);

      setError(
        err?.response?.data?.message ||
          "Failed to load fee structures."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const resetForm = () => {
    setForm({
      class: "",
      monthlyFee: "",
      dueDay: "10",
      status: "active",
      notes: "",
    });

    setEditingId(null);
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (!form.class) {
      setError("Please select a class.");
      return;
    }

    if (
      form.monthlyFee === "" ||
      Number(form.monthlyFee) < 0
    ) {
      setError("Please enter a valid monthly fee.");
      return;
    }

    if (
      Number(form.dueDay) < 1 ||
      Number(form.dueDay) > 31
    ) {
      setError("Due day must be between 1 and 31.");
      return;
    }

    const payload = {
      class: form.class,
      monthlyFee: Number(form.monthlyFee),
      dueDay: Number(form.dueDay),
      status: form.status,
      notes: form.notes.trim(),
    };

    try {
      setSaving(true);

      if (editingId) {
        await feeStructureService.updateFeeStructure(
          token,
          editingId,
          payload
        );

        setSuccess(
          "Fee structure updated successfully."
        );
      } else {
        await feeStructureService.createFeeStructure(
          token,
          payload
        );

        setSuccess(
          "Fee structure created successfully."
        );
      }

      resetForm();
      await loadData();
    } catch (err) {
      console.error(err);

      setError(
        err?.response?.data?.message ||
          "Failed to save fee structure."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (feeStructure) => {
    setEditingId(feeStructure._id);

    setForm({
      class: feeStructure.class || "",
      monthlyFee:
        feeStructure.monthlyFee !== undefined
          ? String(feeStructure.monthlyFee)
          : "",
      dueDay:
        feeStructure.dueDay !== undefined
          ? String(feeStructure.dueDay)
          : "10",
      status: feeStructure.status || "active",
      notes: feeStructure.notes || "",
    });

    setError("");
    setSuccess("");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this fee structure?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setError("");
      setSuccess("");

      await feeStructureService.deleteFeeStructure(
        token,
        id
      );

      setSuccess(
        "Fee structure deleted successfully."
      );

      if (editingId === id) {
        resetForm();
      }

      await loadData();
    } catch (err) {
      console.error(err);

      setError(
        err?.response?.data?.message ||
          "Failed to delete fee structure."
      );
    }
  };

  const formatCurrency = (amount) => {
    return `Rs. ${Number(amount || 0).toLocaleString()}`;
  };

  if (!token) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 p-6">
        <div className="rounded-2xl bg-white p-8 text-center shadow-sm ring-1 ring-slate-200">
          <h2 className="text-xl font-bold text-slate-800">
            Authentication Required
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            Please log in to manage fee structures.
          </p>

          <button
            type="button"
            onClick={() => navigate("/login")}
            className="mt-5 rounded-lg bg-blue-600 px-5 py-2.5 font-semibold text-white hover:bg-blue-700"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-6">
      <div className="mx-auto max-w-7xl">

        {/* Header */}
        <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-800">
              Fee Structures
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Manage monthly fees for each class.
            </p>
          </div>

          <button
            type="button"
            onClick={() => navigate("/admin")}
            className="rounded-lg bg-slate-700 px-5 py-2.5 font-medium text-white transition hover:bg-slate-800"
          >
            Back to Dashboard
          </button>
        </div>

        {/* Messages */}
        {error && (
          <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-5 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm font-medium text-green-700">
            {success}
          </div>
        )}

        {/* Form */}
        <div className="mb-8 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200 md:p-6">
          <div className="mb-5">
            <h2 className="text-xl font-bold text-slate-800">
              {editingId
                ? "Edit Fee Structure"
                : "Add Fee Structure"}
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Define the monthly fee and payment due day
              for a class.
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 gap-5 md:grid-cols-2"
          >
            {/* Class */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Class
              </label>

              <select
                name="class"
                value={form.class}
                onChange={handleChange}
                disabled={Boolean(editingId)}
                className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-slate-100"
              >
                <option value="">
                  Select Class
                </option>

                {classes.map((item) => (
                  <option
                    key={item._id}
                    value={item.name}
                  >
                    {item.name}
                  </option>
                ))}
              </select>

              {editingId && (
                <p className="mt-1 text-xs text-slate-500">
                  Class cannot be changed while editing.
                </p>
              )}
            </div>

            {/* Monthly Fee */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Monthly Fee
              </label>

              <input
                type="number"
                name="monthlyFee"
                min="0"
                step="1"
                value={form.monthlyFee}
                onChange={handleChange}
                placeholder="e.g. 2500"
                className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            {/* Due Day */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Fee Due Day
              </label>

              <input
                type="number"
                name="dueDay"
                min="1"
                max="31"
                value={form.dueDay}
                onChange={handleChange}
                className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />

              <p className="mt-1 text-xs text-slate-500">
                Example: 10 means the fee is due on the
                10th of each month.
              </p>
            </div>

            {/* Status */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Status
              </label>

              <select
                name="status"
                value={form.status}
                onChange={handleChange}
                className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              >
                <option value="active">
                  Active
                </option>

                <option value="inactive">
                  Inactive
                </option>
              </select>
            </div>

            {/* Notes */}
            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Notes
              </label>

              <textarea
                name="notes"
                value={form.notes}
                onChange={handleChange}
                rows="3"
                maxLength="500"
                placeholder="Optional notes..."
                className="w-full resize-none rounded-lg border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            {/* Buttons */}
            <div className="flex flex-wrap gap-3 md:col-span-2">
              <button
                type="submit"
                disabled={saving}
                className="rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {saving
                  ? "Saving..."
                  : editingId
                  ? "Update Fee Structure"
                  : "Add Fee Structure"}
              </button>

              {editingId && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="rounded-lg bg-slate-200 px-6 py-3 font-semibold text-slate-700 transition hover:bg-slate-300"
                >
                  Cancel Edit
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Fee Structures List */}
        <div className="rounded-2xl bg-white shadow-sm ring-1 ring-slate-200">
          <div className="border-b border-slate-200 px-5 py-5 md:px-6">
            <h2 className="text-xl font-bold text-slate-800">
              Existing Fee Structures
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              {feeStructures.length} fee structure
              {feeStructures.length === 1 ? "" : "s"} configured.
            </p>
          </div>

          {loading ? (
            <div className="p-8 text-center text-slate-500">
              Loading fee structures...
            </div>
          ) : feeStructures.length === 0 ? (
            <div className="p-10 text-center">
              <div className="mb-3 text-4xl">
                💰
              </div>

              <h3 className="text-lg font-semibold text-slate-700">
                No Fee Structures Yet
              </h3>

              <p className="mt-1 text-sm text-slate-500">
                Add your first class fee structure above.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wide text-slate-500">
                      Class
                    </th>

                    <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wide text-slate-500">
                      Monthly Fee
                    </th>

                    <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wide text-slate-500">
                      Due Day
                    </th>

                    <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wide text-slate-500">
                      Status
                    </th>

                    <th className="px-5 py-4 text-right text-xs font-bold uppercase tracking-wide text-slate-500">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-200">
                  {feeStructures.map((item) => (
                    <tr
                      key={item._id}
                      className="transition hover:bg-slate-50"
                    >
                      <td className="px-5 py-4 font-semibold text-slate-800">
                        {item.class}
                      </td>

                      <td className="px-5 py-4 font-semibold text-slate-700">
                        {formatCurrency(
                          item.monthlyFee
                        )}
                      </td>

                      <td className="px-5 py-4 text-slate-600">
                        {item.dueDay}
                      </td>

                      <td className="px-5 py-4">
                        <span
                          className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ${
                            item.status === "active"
                              ? "bg-green-100 text-green-700"
                              : "bg-slate-100 text-slate-600"
                          }`}
                        >
                          {item.status === "active"
                            ? "Active"
                            : "Inactive"}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex justify-end gap-2">
                          <button
                            type="button"
                            onClick={() =>
                              handleEdit(item)
                            }
                            className="rounded-lg bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700 transition hover:bg-blue-100"
                          >
                            Edit
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              handleDelete(item._id)
                            }
                            className="rounded-lg bg-red-50 px-4 py-2 text-sm font-semibold text-red-700 transition hover:bg-red-100"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

export default FeeStructures;