import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import { useAuth } from "../../context/AuthContext";
import classService from "../../services/classService";
import teacherService from "../../services/teacherService";
import API_SERVER_URL from "../../config/apiServer";

const initialForm = {
  name: "",
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

  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState("");

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
            email: teacher.email || "",
            phone: teacher.phone || "",
            qualification:
              teacher.qualification || "",
            subject: teacher.subject || "",
            experience:
              teacher.experience || "",
            joiningDate: teacher.joiningDate
              ? teacher.joiningDate.slice(0, 10)
              : "",
            assignedClasses:
              teacher.assignedClasses?.map(
                (item) => item._id
              ) || [],
            status:
              teacher.status || "active",
          });

          if (teacher.photo) {
            const photoUrl =
              teacher.photo.startsWith("http")
                ? teacher.photo
                : `${API_SERVER_URL}${teacher.photo}`;

            setPhotoPreview(photoUrl);
          }
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

  const handlePhotoChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
    ];

    if (!allowedTypes.includes(file.type)) {
      setError(
        "Only JPG, PNG and WEBP images are allowed."
      );

      event.target.value = "";
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setError(
        "Teacher photo must be smaller than 10 MB."
      );

      event.target.value = "";
      return;
    }

    setError("");
    setPhotoFile(file);

    const previewUrl = URL.createObjectURL(file);

    setPhotoPreview(previewUrl);
  };

  const removePhoto = () => {
    setPhotoFile(null);
    setPhotoPreview("");

    const fileInput =
      document.getElementById(
        "teacher-photo"
      );

    if (fileInput) {
      fileInput.value = "";
    }
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

      const formData = new FormData();

      formData.append("name", form.name);
      formData.append("email", form.email);
      formData.append("phone", form.phone);
      formData.append(
        "qualification",
        form.qualification
      );
      formData.append(
        "subject",
        form.subject
      );
      formData.append(
        "experience",
        form.experience
      );
      formData.append(
        "joiningDate",
        form.joiningDate
      );
      formData.append(
        "status",
        form.status
      );

      form.assignedClasses.forEach(
        (classId) => {
          formData.append(
            "assignedClasses",
            classId
          );
        }
      );

      if (photoFile) {
        formData.append(
          "photo",
          photoFile
        );
      }

      if (isEdit) {
        await teacherService.updateTeacher(
          token,
          id,
          formData
        );
      } else {
        await teacherService.createTeacher(
          token,
          formData
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
          {isEdit
            ? "Edit Teacher"
            : "Add Teacher"}
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

          {/* Teacher Photo */}
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Teacher Photo
            </label>

            <input
              id="teacher-photo"
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={handlePhotoChange}
              className="w-full cursor-pointer rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-700 file:mr-4 file:rounded-lg file:border-0 file:bg-blue-50 file:px-4 file:py-2 file:font-semibold file:text-blue-700 hover:file:bg-blue-100"
            />

            <p className="mt-2 text-xs text-slate-500">
              JPG, PNG or WEBP. Maximum size: 10 MB.
            </p>

            {photoFile && (
              <p className="mt-2 text-xs font-medium text-blue-700">
                Selected: {photoFile.name}
              </p>
            )}

            {photoPreview && (
              <div className="mt-4">
                <div className="relative inline-block">
                  <img
                    src={photoPreview}
                    alt="Teacher preview"
                    className="h-32 w-32 rounded-2xl border border-slate-200 object-cover shadow-sm"
                  />

                  <button
                    type="button"
                    onClick={removePhoto}
                    className="absolute -right-2 -top-2 flex h-7 w-7 items-center justify-center rounded-full bg-red-600 font-bold text-white shadow-md hover:bg-red-700"
                  >
                    ×
                  </button>
                </div>
              </div>
            )}
          </div>

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

          {/* Status */}
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

          {/* Classes */}
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
              Hold Ctrl while selecting multiple
              classes.
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
          <span className="text-red-500">
            {" "}*
          </span>
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