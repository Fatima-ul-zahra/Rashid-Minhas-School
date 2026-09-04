import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

import studentService from "../../services/studentService";
import feeService from "../../services/feeService";
import feeStructureService from "../../services/feeStructureService";

function Fees() {
  const navigate = useNavigate();
  const { token } = useAuth();

  const [students, setStudents] = useState([]);
  const [feeStructures, setFeeStructures] = useState([]);
  const [fees, setFees] = useState([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [editingId, setEditingId] = useState(null);

  const [form, setForm] = useState({
    student: "",
    month: "",
    totalAmount: "",
    paidAmount: "",
    dueDate: "",
    paymentDate: "",
    paymentMethod: "cash",
    receiptNumber: "",
    notes: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const selectedStudent = useMemo(() => {
    return students.find(
      (student) => student._id === form.student
    );
  }, [students, form.student]);

  const remainingAmount = Math.max(
    Number(form.totalAmount || 0) -
      Number(form.paidAmount || 0),
    0
  );

  const calculatedStatus = (() => {
    const total = Number(form.totalAmount || 0);
    const paid = Number(form.paidAmount || 0);

    if (total <= 0) return "unpaid";
    if (paid >= total) return "paid";
    if (paid > 0) return "partial";
    return "unpaid";
  })();

  useEffect(() => {
    if (token) {
      loadData();
    }
  }, [token]);

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");

      const [
        studentsResponse,
        structuresResponse,
        feesResponse,
      ] = await Promise.all([
        studentService.getStudents(token),
        feeStructureService.getFeeStructures(
          token,
          "active"
        ),
        feeService.getFees(token),
      ]);

      setStudents(
        studentsResponse?.data ||
          studentsResponse?.students ||
          []
      );

      setFeeStructures(
        structuresResponse?.data ||
          structuresResponse?.feeStructures ||
          []
      );

      setFees(
        feesResponse?.data ||
          feesResponse?.fees ||
          []
      );
    } catch (err) {
      console.error(err);

      setError(
        err?.response?.data?.message ||
          "Failed to load fee data."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));

    if (name === "student" && !editingId) {
      const student = students.find(
        (item) => item._id === value
      );

      if (student) {
        const structure = feeStructures.find(
          (item) =>
            item.class?.toLowerCase() ===
            student.class?.toLowerCase()
        );

        setForm((previous) => ({
          ...previous,
          student: value,
          totalAmount:
            structure?.monthlyFee !== undefined
              ? String(structure.monthlyFee)
              : "",
        }));
      }
    }
  };

  const handleStudentChange = (event) => {
    const studentId = event.target.value;

    const student = students.find(
      (item) => item._id === studentId
    );

    const structure = feeStructures.find(
      (item) =>
        item.class?.toLowerCase() ===
        student?.class?.toLowerCase()
    );

    setForm((previous) => ({
      ...previous,
      student: studentId,
      totalAmount:
        structure?.monthlyFee !== undefined
          ? String(structure.monthlyFee)
          : "",
    }));
  };

  const resetForm = () => {
    setForm({
      student: "",
      month: "",
      totalAmount: "",
      paidAmount: "",
      dueDate: "",
      paymentDate: "",
      paymentMethod: "cash",
      receiptNumber: "",
      notes: "",
    });

    setEditingId(null);
    setError("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    if (!form.student) {
      setError("Please select a student.");
      return;
    }

    if (!form.month) {
      setError("Please select a month.");
      return;
    }

    if (
      form.totalAmount === "" ||
      Number(form.totalAmount) <= 0
    ) {
      setError("Please enter a valid total fee amount.");
      return;
    }

    if (
      form.paidAmount === "" ||
      Number(form.paidAmount) < 0
    ) {
      setError("Please enter a valid paid amount.");
      return;
    }

    if (
      Number(form.paidAmount) >
      Number(form.totalAmount)
    ) {
      setError(
        "Paid amount cannot be greater than total fee."
      );
      return;
    }

    const payload = {
      student: form.student,
      month: form.month,
      totalAmount: Number(form.totalAmount),
      paidAmount: Number(form.paidAmount),
      dueDate: form.dueDate || null,
      paymentDate: form.paymentDate || null,
      paymentMethod: form.paymentMethod,
      receiptNumber: form.receiptNumber.trim(),
      notes: form.notes.trim(),
    };

    try {
      setSaving(true);

      if (editingId) {
        await feeService.updateFee(
          token,
          editingId,
          payload
        );

        setSuccess(
          "Fee record updated successfully."
        );
      } else {
        await feeService.createFee(
          token,
          payload
        );

        setSuccess(
          "Fee record created successfully."
        );
      }

      resetForm();
      await loadData();
    } catch (err) {
      console.error(err);

      setError(
        err?.response?.data?.message ||
          "Failed to save fee record."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (fee) => {
    setEditingId(fee._id);

    const studentId =
      fee.student?._id || fee.student || "";

    setForm({
      student: studentId,
      month: fee.month || "",
      totalAmount:
        fee.totalAmount !== undefined
          ? String(fee.totalAmount)
          : "",
      paidAmount:
        fee.paidAmount !== undefined
          ? String(fee.paidAmount)
          : "",
      dueDate: fee.dueDate
        ? new Date(fee.dueDate)
            .toISOString()
            .split("T")[0]
        : "",
      paymentDate: fee.paymentDate
        ? new Date(fee.paymentDate)
            .toISOString()
            .split("T")[0]
        : "",
      paymentMethod:
        fee.paymentMethod || "cash",
      receiptNumber:
        fee.receiptNumber || "",
      notes: fee.notes || "",
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleDelete = async (id) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this fee record?"
      )
    ) {
      return;
    }

    try {
      setError("");
      setSuccess("");

      await feeService.deleteFee(token, id);

      setSuccess(
        "Fee record deleted successfully."
      );

      await loadData();
    } catch (err) {
      console.error(err);

      setError(
        err?.response?.data?.message ||
          "Failed to delete fee record."
      );
    }
  };

  const formatCurrency = (amount) =>
    `Rs. ${Number(amount || 0).toLocaleString()}`;

  const formatDate = (date) => {
    if (!date) return "—";

    return new Date(date).toLocaleDateString(
      "en-PK",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };

  const statusClasses = {
    paid: "bg-green-100 text-green-700",
    partial: "bg-yellow-100 text-yellow-700",
    unpaid: "bg-red-100 text-red-700",
    overdue: "bg-red-100 text-red-700",
  };

  if (!token) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <button
          onClick={() => navigate("/login")}
          className="rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white"
        >
          Please Login
        </button>
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
              Student Fees
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Collect and manage student monthly fees.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={() =>
                navigate("/admin/fee-history")
              }
              className="rounded-lg bg-purple-600 px-4 py-2.5 font-semibold text-white hover:bg-purple-700"
            >
              Fee History
            </button>

            <button
              onClick={() =>
                navigate("/admin/fee-reports")
              }
              className="rounded-lg bg-indigo-600 px-4 py-2.5 font-semibold text-white hover:bg-indigo-700"
            >
              Fee Reports
            </button>

            <button
              onClick={() =>
                navigate("/admin/fee-structures")
              }
              className="rounded-lg bg-slate-700 px-4 py-2.5 font-semibold text-white hover:bg-slate-800"
            >
              Fee Structures
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 font-medium text-red-700">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-5 rounded-lg border border-green-200 bg-green-50 px-4 py-3 font-medium text-green-700">
            {success}
          </div>
        )}

        {/* Collection Form */}
        <div className="mb-8 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200 md:p-6">
          <h2 className="mb-5 text-xl font-bold text-slate-800">
            {editingId
              ? "Edit Fee Record"
              : "Collect Student Fee"}
          </h2>

          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 gap-5 md:grid-cols-2"
          >
            {/* Student */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Student
              </label>

              <select
                name="student"
                value={form.student}
                onChange={handleStudentChange}
                disabled={Boolean(editingId)}
                className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100 disabled:bg-slate-100"
              >
                <option value="">
                  Select Student
                </option>

                {students.map((student) => (
                  <option
                    key={student._id}
                    value={student._id}
                  >
                    {student.name} — Roll{" "}
                    {student.rollNumber || "N/A"} —{" "}
                    {student.class}
                  </option>
                ))}
              </select>
            </div>

            {/* Class */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Class
              </label>

              <input
                value={selectedStudent?.class || ""}
                readOnly
                placeholder="Student class"
                className="w-full rounded-lg border border-slate-300 bg-slate-100 px-4 py-3 text-slate-700"
              />
            </div>

            {/* Month */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Fee Month
              </label>

              <input
                type="month"
                name="month"
                value={form.month}
                onChange={handleChange}
                className="w-full rounded-lg border border-slate-300 px-4 py-3 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
              />
            </div>

            {/* Total */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Total Fee
              </label>

              <input
                type="number"
                name="totalAmount"
                min="0"
                value={form.totalAmount}
                onChange={handleChange}
                className="w-full rounded-lg border border-slate-300 px-4 py-3 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
              />

              {selectedStudent && (
                <p className="mt-1 text-xs text-slate-500">
                  Based on the active fee structure for{" "}
                  {selectedStudent.class}.
                </p>
              )}
            </div>

            {/* Paid */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Paid Amount
              </label>

              <input
                type="number"
                name="paidAmount"
                min="0"
                value={form.paidAmount}
                onChange={handleChange}
                placeholder="0"
                className="w-full rounded-lg border border-slate-300 px-4 py-3 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
              />
            </div>

            {/* Remaining */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Remaining Amount
              </label>

              <input
                value={remainingAmount}
                readOnly
                className="w-full rounded-lg border border-slate-300 bg-slate-100 px-4 py-3 font-bold text-red-600"
              />
            </div>

            {/* Status */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Status
              </label>

              <div className="flex h-[50px] items-center">
                <span
                  className={`rounded-full px-4 py-2 text-sm font-bold ${
                    statusClasses[calculatedStatus]
                  }`}
                >
                  {calculatedStatus.toUpperCase()}
                </span>
              </div>
            </div>

            {/* Due Date */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Due Date
              </label>

              <input
                type="date"
                name="dueDate"
                value={form.dueDate}
                onChange={handleChange}
                className="w-full rounded-lg border border-slate-300 px-4 py-3 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
              />
            </div>

            {/* Payment Date */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Payment Date
              </label>

              <input
                type="date"
                name="paymentDate"
                value={form.paymentDate}
                onChange={handleChange}
                className="w-full rounded-lg border border-slate-300 px-4 py-3 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
              />
            </div>

            {/* Payment Method */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Payment Method
              </label>

              <select
                name="paymentMethod"
                value={form.paymentMethod}
                onChange={handleChange}
                className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
              >
                <option value="cash">
                  Cash
                </option>

                <option value="bank">
                  Bank
                </option>

                <option value="online">
                  Online
                </option>

                <option value="other">
                  Other
                </option>
              </select>
            </div>

            {/* Receipt */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Receipt Number
              </label>

              <input
                name="receiptNumber"
                value={form.receiptNumber}
                onChange={handleChange}
                placeholder="e.g. RM-0001"
                className="w-full rounded-lg border border-slate-300 px-4 py-3 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
              />
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
                placeholder="Optional notes..."
                className="w-full resize-none rounded-lg border border-slate-300 px-4 py-3 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
              />
            </div>

            {/* Buttons */}
            <div className="flex flex-wrap gap-3 md:col-span-2">
              <button
                type="submit"
                disabled={saving}
                className="rounded-lg bg-green-600 px-7 py-3 font-bold text-white hover:bg-green-700 disabled:opacity-60"
              >
                {saving
                  ? "Saving..."
                  : editingId
                  ? "Update Fee"
                  : "Save Fee Payment"}
              </button>

              {editingId && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="rounded-lg bg-slate-200 px-7 py-3 font-semibold text-slate-700 hover:bg-slate-300"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Recent Fees */}
        <div className="rounded-2xl bg-white shadow-sm ring-1 ring-slate-200">
          <div className="border-b border-slate-200 p-5">
            <h2 className="text-xl font-bold text-slate-800">
              Recent Fee Records
            </h2>
          </div>

          {loading ? (
            <div className="p-8 text-center text-slate-500">
              Loading...
            </div>
          ) : fees.length === 0 ? (
            <div className="p-10 text-center text-slate-500">
              No fee records found.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-4 py-4 text-left text-xs font-bold uppercase text-slate-500">
                      Student
                    </th>

                    <th className="px-4 py-4 text-left text-xs font-bold uppercase text-slate-500">
                      Month
                    </th>

                    <th className="px-4 py-4 text-left text-xs font-bold uppercase text-slate-500">
                      Total
                    </th>

                    <th className="px-4 py-4 text-left text-xs font-bold uppercase text-slate-500">
                      Paid
                    </th>

                    <th className="px-4 py-4 text-left text-xs font-bold uppercase text-slate-500">
                      Remaining
                    </th>

                    <th className="px-4 py-4 text-left text-xs font-bold uppercase text-slate-500">
                      Status
                    </th>

                    <th className="px-4 py-4 text-right text-xs font-bold uppercase text-slate-500">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-200">
                  {fees.slice(0, 20).map((fee) => (
                    <tr
                      key={fee._id}
                      className="hover:bg-slate-50"
                    >
                      <td className="px-4 py-4">
                        <div className="font-semibold text-slate-800">
                          {fee.student?.name ||
                            "Unknown Student"}
                        </div>

                        <div className="text-xs text-slate-500">
                          {fee.class || ""}
                        </div>
                      </td>

                      <td className="px-4 py-4 text-slate-600">
                        {fee.month}
                      </td>

                      <td className="px-4 py-4 font-semibold">
                        {formatCurrency(
                          fee.totalAmount
                        )}
                      </td>

                      <td className="px-4 py-4 font-semibold text-green-600">
                        {formatCurrency(
                          fee.paidAmount
                        )}
                      </td>

                      <td className="px-4 py-4 font-semibold text-red-600">
                        {formatCurrency(
                          fee.remainingAmount
                        )}
                      </td>

                      <td className="px-4 py-4">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-bold ${
                            statusClasses[
                              fee.status
                            ] ||
                            "bg-slate-100 text-slate-600"
                          }`}
                        >
                          {fee.status}
                        </span>
                      </td>

                      <td className="px-4 py-4">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() =>
                              handleEdit(fee)
                            }
                            className="rounded-lg bg-blue-50 px-3 py-2 text-sm font-semibold text-blue-700 hover:bg-blue-100"
                          >
                            Edit
                          </button>

                          <button
                            onClick={() =>
                              handleDelete(
                                fee._id
                              )
                            }
                            className="rounded-lg bg-red-50 px-3 py-2 text-sm font-semibold text-red-700 hover:bg-red-100"
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

export default Fees;