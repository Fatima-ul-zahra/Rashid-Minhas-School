import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { useAuth } from "../../context/AuthContext";
import studentService from "../../services/studentService";

const initialForm = {
  name: "",
  fatherName: "",
  admissionNumber: "",
  rollNumber: "",
  class: "",
  dateOfBirth: "",
  gender: "male",
  phone: "",
  address: "",
  admissionDate: "",
  status: "active",
};

function StudentForm() {
  const { token } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams();

  const [form, setForm] = useState(initialForm);

  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState("");

  const [loading, setLoading] = useState(Boolean(id));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const isEditing = Boolean(id);

  useEffect(() => {
    if (!id || !token) return;

    const loadStudent = async () => {
      try {
        const response =
          await studentService.getStudentById(token, id);

        const student = response.data;

        setForm({
          name: student.name || "",
          fatherName: student.fatherName || "",
          admissionNumber: student.admissionNumber || "",
          rollNumber: student.rollNumber || "",
          class: student.class || "",
          dateOfBirth: student.dateOfBirth
            ? student.dateOfBirth.slice(0, 10)
            : "",
          gender: student.gender || "male",
          phone: student.phone || "",
          address: student.address || "",
          admissionDate: student.admissionDate
            ? student.admissionDate.slice(0, 10)
            : "",
          status: student.status || "active",
        });

        if (student.photo) {
          const photoUrl = student.photo.startsWith("http")
            ? student.photo
            : `http://localhost:5000${student.photo}`;

          setPhotoPreview(photoUrl);
        }
      } catch (error) {
        setError(
          error.response?.data?.message ||
            "Unable to load student."
        );
      } finally {
        setLoading(false);
      }
    };

    loadStudent();
  }, [id, token]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
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
        "Student photo must be smaller than 10 MB."
      );

      event.target.value = "";
      return;
    }

    setError("");

    setPhotoFile(file);

    const previewUrl = URL.createObjectURL(file);
    setPhotoPreview(previewUrl);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setSaving(true);
      setError("");

      const formData = new FormData();

      formData.append("name", form.name);
      formData.append("fatherName", form.fatherName);
      formData.append("admissionNumber", form.admissionNumber);
      formData.append("rollNumber", form.rollNumber);
      formData.append("class", form.class);
      formData.append("dateOfBirth", form.dateOfBirth);
      formData.append("gender", form.gender);
      formData.append("phone", form.phone);
      formData.append("address", form.address);
      formData.append("admissionDate", form.admissionDate);
      formData.append("status", form.status);

      if (photoFile) {
        formData.append("photo", photoFile);
}

      if (isEditing) {
        await studentService.updateStudent(
          token,
          id,
          formData
        );
      } else {
        await studentService.createStudent(
          token,
          formData
        );
      }

      navigate("/admin/students");
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Unable to save student."
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6 text-center text-slate-500">
        Loading student...
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6">
      <div>
        <p className="text-sm font-semibold text-blue-700">
          Student Management
        </p>

        <h1 className="mt-1 text-2xl font-bold text-slate-900">
          {isEditing ? "Edit Student" : "Add Student"}
        </h1>
      </div>

      {error && (
        <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
      >
        <div className="grid gap-5 md:grid-cols-2">

          <Input
            label="Student Name"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
          />

          <Input
            label="Father Name"
            name="fatherName"
            value={form.fatherName}
            onChange={handleChange}
            required
          />

          <Input
            label="Admission Number"
            name="admissionNumber"
            value={form.admissionNumber}
            onChange={handleChange}
            required
          />

          <Input
            label="Roll Number"
            name="rollNumber"
            value={form.rollNumber}
            onChange={handleChange}
          />

          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Class
            </label>

            <select
              name="class"
              value={form.class}
              onChange={handleChange}
              required
              className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-600"
            >
              <option value="">
                Select class
              </option>

              {Array.from(
                { length: 10 },
                (_, index) => (
                  <option
                    key={index + 1}
                    value={`Class ${index + 1}`}
                  >
                    Class {index + 1}
                  </option>
                )
              )}
            </select>
          </div>

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
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>

          <Input
            label="Date of Birth"
            name="dateOfBirth"
            type="date"
            value={form.dateOfBirth}
            onChange={handleChange}
          />

          <Input
            label="Admission Date"
            name="admissionDate"
            type="date"
            value={form.admissionDate}
            onChange={handleChange}
          />

          <Input
            label="Phone"
            name="phone"
            value={form.phone}
            onChange={handleChange}
          />

          {/* PHOTO UPLOAD */}
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Student Photo
            </label>

            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={handlePhotoChange}
              className="w-full cursor-pointer rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-700 file:mr-4 file:rounded-lg file:border-0 file:bg-blue-50 file:px-4 file:py-2 file:font-semibold file:text-blue-700 hover:file:bg-blue-100"
            />

            <p className="mt-2 text-xs text-slate-500">
              JPG, PNG or WEBP. Maximum size: 10 MB.
            </p>

            {photoPreview && (
              <div className="mt-4">
                <img
                  src={photoPreview}
                  alt="Student preview"
                  className="h-32 w-32 rounded-2xl object-cover border border-slate-200 shadow-sm"
                />
              </div>
            )}
          </div>

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

              <option value="graduated">
                Graduated
              </option>
            </select>
          </div>

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

        <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={() =>
              navigate("/admin/students")
            }
            className="rounded-xl border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={saving}
            className="rounded-xl bg-blue-700 px-6 py-3 text-sm font-semibold text-white hover:bg-blue-800 disabled:opacity-60"
          >
            {saving
              ? "Saving..."
              : isEditing
              ? "Update Student"
              : "Save Student"}
          </button>
        </div>
      </form>
    </div>
  );
}

function Input({
  label,
  name,
  value,
  onChange,
  type = "text",
  required = false,
  placeholder,
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-semibold text-slate-700">
        {label}
      </label>

      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        placeholder={placeholder}
        className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
      />
    </div>
  );
}

export default StudentForm;