import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

function AdminHeader() {
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  const initial =
    user?.name?.charAt(0)?.toUpperCase() || "A";

  return (
    <header className="sticky top-0 z-20 border-b border-slate-200 bg-white">
      <div className="flex min-h-20 items-center justify-between px-4 sm:px-6">

        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-blue-700">
            School Administration
          </p>

          <h1 className="mt-1 text-lg font-bold text-slate-900 sm:text-xl">
            Admin Dashboard
          </h1>
        </div>

        <div className="flex items-center gap-3">
          {/* Public Website Button */}
          <Link
            to="/"
            className="hidden rounded-xl border border-blue-200 bg-blue-50 px-4 py-2.5 text-sm font-semibold text-blue-700 transition hover:bg-blue-100 sm:inline-flex"
          >
            Visit Website
          </Link>

          <div className="relative">
            <button
              type="button"
              onClick={() =>
                setMenuOpen((value) => !value)
              }
              className="flex items-center gap-3 rounded-xl px-2 py-2 transition hover:bg-slate-100"
            >
              <div className="hidden text-right sm:block">
                <p className="text-sm font-semibold text-slate-900">
                  {user?.name || "Administrator"}
                </p>

                <p className="text-xs capitalize text-slate-500">
                  {user?.role || "admin"}
                </p>
              </div>

              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-700 font-bold text-white">
                {initial}
              </div>
            </button>

            {menuOpen && (
              <div className="absolute right-0 mt-2 w-56 rounded-2xl border border-slate-200 bg-white p-2 shadow-xl">
                <div className="border-b border-slate-100 px-3 py-3">
                  <p className="font-semibold text-slate-900">
                    {user?.name}
                  </p>

                  <p className="mt-1 text-xs text-slate-500">
                    {user?.email}
                  </p>
                </div>

                {/* Mobile Website Button */}
                <Link
                  to="/"
                  onClick={() => setMenuOpen(false)}
                  className="mt-2 block rounded-xl px-3 py-2.5 text-sm font-semibold text-blue-700 hover:bg-blue-50 sm:hidden"
                >
                  Visit Website
                </Link>

                <button
                  type="button"
                  onClick={logout}
                  className="mt-2 w-full rounded-xl px-3 py-2.5 text-left text-sm font-semibold text-red-600 hover:bg-red-50"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

export default AdminHeader;