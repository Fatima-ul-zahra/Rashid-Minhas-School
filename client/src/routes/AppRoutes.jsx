import { Routes, Route } from "react-router-dom";

import PublicLayout from "../layouts/PublicLayout";

// Public pages
import Home from "../pages/Home";
import About from "../pages/About";
import Classes from "../pages/Classes";
import Teachers from "../pages/Teachers";
import Admissions from "../pages/Admissions";
import Announcements from "../pages/Announcements";
import Gallery from "../pages/Gallery";
import Contact from "../pages/Contact";
import NotFound from "../pages/NotFound";
import ApiTest from "../pages/ApiTest";

// Authentication
import Login from "../pages/Login";

// Admin
import AdminDashboard from "../pages/AdminDashboard";
import ProtectedRoute from "./ProtectedRoute";
import AdminLayout from "../layouts/AdminLayout";

import StudentView from "../pages/admin/StudentView";
import Students from "../pages/admin/Students";
import StudentForm from "../pages/admin/StudentForm";

import AdminClasses from "../pages/admin/Classes";
import ClassForm from "../pages/admin/ClassForm";

import Attendance from "../pages/admin/Attendance";
import AttendanceRecords from "../pages/admin/AttendanceRecords";

import AdminTeachers from "../pages/admin/Teachers";
import TeacherForm from "../pages/admin/TeacherForm";
import TeacherView from "../pages/admin/TeacherView";

import AdminAdmissions from "../pages/admin/Admissions";
import AdmissionView from "../pages/admin/AdmissionView";

import AdminAnnouncements from "../pages/admin/Announcements";
import AnnouncementForm from "../pages/admin/AnnouncementForm";

import GalleryAdmin from "../pages/admin/Gallery";
import GalleryForm from "../pages/admin/GalleryForm";

import Reports from "../pages/admin/Reports";

function AppRoutes() {
  return (
    <Routes>
      {/* ================= PUBLIC WEBSITE ================= */}

      <Route element={<PublicLayout />}>
        <Route path="/" element={<Home />} />

        <Route path="/about" element={<About />} />

        <Route path="/classes" element={<Classes />} />

        <Route path="/teachers" element={<Teachers />} />

        <Route path="/admissions" element={<Admissions />} />

        <Route
          path="/announcements"
          element={<Announcements />}
        />

        <Route path="/gallery" element={<Gallery />} />

        <Route path="/contact" element={<Contact />} />

        <Route path="/api-test" element={<ApiTest />} />
      </Route>

      {/* ================= AUTHENTICATION ================= */}

      <Route path="/login" element={<Login />} />

      {/* ================= ADMIN ================= */}

      <Route element={<ProtectedRoute />}>
        <Route element={<AdminLayout />}>

          <Route
            path="/admin"
            element={<AdminDashboard />}
          />

          {/* Students */}

          <Route
            path="/admin/students"
            element={<Students />}
          />

          <Route
            path="/admin/students/new"
            element={<StudentForm />}
          />

          <Route
            path="/admin/students/:id"
            element={<StudentView />}
          />

          <Route
            path="/admin/students/:id/edit"
            element={<StudentForm />}
          />

          {/* Classes */}

          <Route
            path="/admin/classes"
            element={<AdminClasses />}
          />

          <Route
            path="/admin/classes/new"
            element={<ClassForm />}
          />

          <Route
            path="/admin/classes/:id/edit"
            element={<ClassForm />}
          />

          {/*Attendance*/}
          <Route
            path="/admin/attendance"
            element={<Attendance />}
          />
          <Route
            path="/admin/attendance/records"
            element={<AttendanceRecords />}
          />

          {/*Teachers*/}
          <Route
            path="/admin/teachers"
            element={<AdminTeachers />}
          />

          <Route
            path="/admin/teachers/new"
            element={<TeacherForm />}
          />

          <Route
            path="/admin/teachers/:id/edit"
            element={<TeacherForm />}
          />

          <Route
            path="/admin/teachers/:id"
            element={<TeacherView />}
          />

          {/*Admissions*/}
          <Route
            path="/admin/admissions"
            element={<AdminAdmissions />}
          />

          <Route
            path="/admin/admissions/:id"
            element={<AdmissionView />}
          />

          {/*Announcements*/}
          <Route
            path="/admin/announcements"
            element={<AdminAnnouncements />}
          />

          <Route
            path="/admin/announcements/new"
            element={<AnnouncementForm />}
          />

          <Route
            path="/admin/announcements/:id/edit"
            element={<AnnouncementForm />}
          />

          {/*Gallery*/}
          <Route
            path="/admin/gallery"
            element={<GalleryAdmin />}
          />

          <Route
            path="/admin/gallery/new"
            element={<GalleryForm />}
          />

          <Route
            path="/admin/gallery/:id/edit"
            element={<GalleryForm />}
          />

          {/*Reports*/}
          <Route
            path="/admin/reports"
            element={<Reports />}
          />

        </Route>
      </Route>

      {/* ================= 404 ================= */}

      <Route
        path="*"
        element={<NotFound />}
      />
    </Routes>
  );
}

export default AppRoutes;