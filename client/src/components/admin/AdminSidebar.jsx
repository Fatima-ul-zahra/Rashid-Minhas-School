import { NavLink } from "react-router-dom";

const menuItems = [
  {
    name: "Dashboard",
    path: "/admin",
  },
  {
    name: "Students",
    path: "/admin/students",
  },
  {
    name: "Teachers",
    path: "/admin/teachers",
  },
  {
    name: "Classes",
    path: "/admin/classes",
  },
  {
    name: "Fees",
    path: "/admin/fees",
  },
  {
    name: "Attendance",
    path: "/admin/attendance",
  },
  {
    name: "Admissions",
    path: "/admin/admissions",
  },
  {
    name: "Announcements",
    path: "/admin/announcements",
  },
  {
    name: "Gallery",
    path: "/admin/gallery",
  },
  {
    name: "Reports",
    path: "/admin/reports",
  },
];

function AdminSidebar({ open, onClose }) {
  return (
    <aside
      className={`fixed inset-y-0 left-0 z-40 w-72 transform bg-slate-950 text-white transition-transform duration-300 lg:translate-x-0 ${
        open ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      <div className="flex h-full flex-col">
        {/* Logo */}
        <div className="border-b border-white/10 px-6 py-6">
          <div className="flex items-center gap-3">
            <img
              src="/school-logo.png"
              alt="Rashid Minhas School Logo"
              className="h-12 w-12 object-contain"
            />

            <div>
              <h1 className="font-bold">
                Rashid Minhas
              </h1>

              <p className="text-xs text-slate-400">
                School Management
              </p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-4 py-6">
          <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
            Main Menu
          </p>

          <div className="space-y-1">
            {menuItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === "/admin"}
                onClick={onClose}
                className={({ isActive }) =>
                  `block rounded-xl px-4 py-3 text-sm font-medium transition ${
                    isActive
                      ? "bg-blue-700 text-white"
                      : "text-slate-300 hover:bg-white/10 hover:text-white"
                  }`
                }
              >
                {item.name}
              </NavLink>
            ))}
          </div>
        </nav>

        {/* Bottom */}
        <div className="border-t border-white/10 p-4">
          <p className="px-3 text-xs text-slate-500">
            Admin Panel
          </p>

          <p className="mt-1 px-3 text-xs text-slate-400">
            Rashid Minhas Secondary School
          </p>
        </div>
      </div>
    </aside>
  );
}

export default AdminSidebar;