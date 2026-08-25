import { useEffect, useState } from "react";

import classService from "../services/classService";
import admissionService from "../services/admissionService";

const initialForm = {
  studentName: "",
  fatherName: "",
  dateOfBirth: "",
  gender: "male",
  previousSchool: "",
  desiredClass: "",
  phone: "",
  email: "",
  address: "",
};

function Admissions() {
  const [classes, setClasses] = useState([]);
  const [form, setForm] = useState(initialForm);

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const loadClasses = async () => {
      try {
        const response =
          await classService.getClasses(
            undefined
          );

        setClasses(response.data);
      } catch (error) {
        setError(
          "Unable to load available classes."
        );
      } finally {
        setLoading(false);
      }
    };

    loadClasses();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setSubmitting(true);
      setError("");
      setSuccess("");

      await admissionService.createAdmission(form);

      setSuccess(
        "Your admission application has been submitted successfully."
      );

      setForm(initialForm);
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Unable to submit application."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      {/* Hero */}
      <section className="bg-slate-950">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <span className="text-sm font-semibold uppercase tracking-wider text-blue-400">
            Admissions
          </span>

          <h1 className="mt-4 text-4xl font-extrabold text-white sm:text-5xl">
            Apply for Admission
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
            Submit an admission application to Rashid Minhas
            Secondary School, Ali Pur.
          </p>
        </div>
      </section>

      {/* Form */}
      <section className="bg-slate-50 py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          {success && (
            <div className="mb-6 rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-700">
              {success}
            </div>
          )}

          {error && (
            <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              {error}
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-10"
          >
            <div className="grid gap-5 md:grid-cols-2">
              <Field
                label="Student Name"
                name="studentName"
                value={form.studentName}
                onChange={handleChange}
                required
              />

              <Field
                label="Father's Name"
                name="fatherName"
                value={form.fatherName}
                onChange={handleChange}
                required
              />

              <Field
                label="Date of Birth"
                name="dateOfBirth"
                type="date"
                value={form.dateOfBirth}
                onChange={handleChange}
              />

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Gender
                </label>

                <select
                  name="gender"
                  value={form.gender}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-600"
                >
                  <option value="male">
                    Male
                  </option>

                  <option value="female">
                    Female
                  </option>

                  <option value="other">
                    Other
                  </option>
                </select>
              </div>

              <Field
                label="Previous School"
                name="previousSchool"
                value={form.previousSchool}
                onChange={handleChange}
              />

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Desired Class
                </label>

                <select
                  name="desiredClass"
                  value={form.desiredClass}
                  onChange={handleChange}
                  required
                  disabled={loading}
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-600 disabled:bg-slate-100"
                >
                  <option value="">
                    {loading
                      ? "Loading classes..."
                      : "Select class"}
                  </option>

                  {classes.map((classItem) => (
                    <option
                      key={classItem._id}
                      value={classItem._id}
                    >
                      {classItem.name}
                    </option>
                  ))}
                </select>
              </div>

              <Field
                label="Phone"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                required
              />

              <Field
                label="Email"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
              />

              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Address
                </label>

                <textarea
                  name="address"
                  value={form.address}
                  onChange={handleChange}
                  rows="4"
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-600"
                />
              </div>
            </div>

            <div className="mt-8">
              <button
                type="submit"
                disabled={submitting || loading}
                className="w-full rounded-xl bg-blue-700 px-6 py-3.5 text-sm font-semibold text-white hover:bg-blue-800 disabled:opacity-60"
              >
                {submitting
                  ? "Submitting..."
                  : "Submit Admission Application"}
              </button>
            </div>
          </form>
        </div>
      </section>
    </div>
  );
}

function Field({
  label,
  name,
  type = "text",
  value,
  onChange,
  required = false,
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-semibold text-slate-700">
        {label}
        {required && (
          <span className="text-red-500"> *</span>
        )}
      </label>

      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
      />
    </div>
  );
}

export default Admissions;