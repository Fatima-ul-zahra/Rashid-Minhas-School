import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import { useAuth } from "../../context/AuthContext";
import classService from "../../services/classService";
import teacherService from "../../services/teacherService";

const initialForm = {
  name: "",
  photo: "",
  email: "",
  phone: "",
  qualification: "",
  subject: "",
  experience: "",
  joiningDate: "",
  assignedClasses: [],
  status: "active",
};

function TeacherForm() {
  const { token } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams();

  const isEdit = Boolean(id);

  const [form, setForm] = useState(initialForm);
  const [classes, setClasses] = useState([]);

  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadData = async () => {
      try {
        const classResponse =
          await classService.getClasses(token);

        setClasses(classResponse.data);

        if (isEdit) {
          const teacherResponse =
            await teacherService.getTeacher(
              token,
              id
            );

          const teacher = teacherResponse.data;

          setForm({
            name: teacher.name || "",
            photo: teacher.photo || "",
            email: teacher.email || "",
            phone: teacher.phone || "",
            qualification:
              teacher.qualification || "",
            subject: teacher.subject || "",
            experience: teacher.experience || "",
            joiningDate: teacher.joiningDate
              ? teacher.joiningDate.slice(0, 10)
              : "",
            assignedClasses:
              teacher.assignedClasses?.map(
                (item) => item._id
              ) || [],
            status: teacher.status || "active",
          });
        }
      } catch (error) {
        setError(
          error.response?.data?.message ||
            "Unable to load teacher information."
        );
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      loadData();
    }
  }, [token, id, isEdit]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleClasses = (event) => {
    const selected = Array.from(
      event.target.selectedOptions,
      (option) => option.value
    );

    setForm((current) => ({
      ...current,
      assignedClasses: selected,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!form.name.trim()) {
      setError("Teacher name is required.");
      return;
    }

    try {
      setSaving(true);
      setError("");

      if (isEdit) {
        await teacherService.updateTeacher(
          token,
          id,
          form
        );
      } else {
        await teacherService.createTeacher(
          token,
          form
        );
      }

      navigate("/admin/teachers");
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Unable to save teacher."
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6 text-sm text-slate-500">
        Loading teacher...
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6">
      <div>
        <p className="text-sm font-semibold text-blue-700">
          Academic Management
        </p>

        <h1 className="mt-1 text-2xl font-bold text-slate-900">
          {isEdit ? "Edit Teacher" : "Add Teacher"}
        </h1>
      </div>

      {error && (
        <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="mt-6 max-w-4xl rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
      >
        <div className="grid gap-5 md:grid-cols-2">
          <Field
            label="Teacher Name"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
          />

          <Field
            label="Photo URL"
            name="photo"
            value={form.photo}
            onChange={handleChange}
            placeholder="Optional"
          />

          <Field
            label="Email"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
          />

          <Field
            label="Phone"
            name="phone"
            value={form.phone}
            onChange={handleChange}
          />

          <Field
            label="Qualification"
            name="qualification"
            value={form.qualification}
            onChange={handleChange}
          />

          <Field
            label="Subject"
            name="subject"
            value={form.subject}
            onChange={handleChange}
          />

          <Field
            label="Experience"
            name="experience"
            value={form.experience}
            onChange={handleChange}
            placeholder="e.g. 5 years"
          />

          <Field
            label="Joining Date"
            name="joiningDate"
            type="date"
            value={form.joiningDate}
            onChange={handleChange}
          />

          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Status
            </label>

            <select
              name="status"
              value={form.status}
              onChange={handleChange}
              className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-600"
            >
              <option value="active">
                Active
              </option>

              <option value="inactive">
                Inactive
              </option>
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Assigned Classes
            </label>

            <select
              multiple
              value={form.assignedClasses}
              onChange={handleClasses}
              className="h-32 w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-600"
            >
              {classes.map((classItem) => (
                <option
                  key={classItem._id}
                  value={classItem._id}
                >
                  {classItem.name}
                </option>
              ))}
            </select>

            <p className="mt-2 text-xs text-slate-500">
              Hold Ctrl while selecting multiple classes.
            </p>
          </div>
        </div>

        <div className="mt-8 flex justify-end gap-3">
          <Link
            to="/admin/teachers"
            className="rounded-xl border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            Cancel
          </Link>

          <button
            type="submit"
            disabled={saving}
            className="rounded-xl bg-blue-700 px-6 py-3 text-sm font-semibold text-white hover:bg-blue-800 disabled:opacity-60"
          >
            {saving
              ? "Saving..."
              : isEdit
              ? "Update Teacher"
              : "Save Teacher"}
          </button>
        </div>
      </form>
    </div>
  );
}

function Field({
  label,
  name,
  type = "text",
  value,
  onChange,
  placeholder,
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
        placeholder={placeholder}
        required={required}
        className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
      />
    </div>
  );
}

export default TeacherForm;