import { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import announcementService from "../services/announcementService";
import useAnnouncementNotifications from "../hooks/useAnnouncementNotifications";

const navigation = [
  { name: "Home", path: "/" },
  { name: "About", path: "/about" },
  { name: "Classes", path: "/classes" },
  { name: "Admissions", path: "/admissions" },
  { name: "Announcements", path: "/announcements" },
  { name: "Activities", path: "/student-activities" },
  { name: "Gallery", path: "/gallery" },
  { name: "Contact", path: "/contact" },
];

function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [announcements, setAnnouncements] = useState([]);

  const {
    unreadAnnouncements,
    unreadCount,
    markAsSeen,
    markAllAsSeen,
  } = useAnnouncementNotifications(announcements);

  useEffect(() => {
    const loadAnnouncements = async () => {
      try {
        const response =
          await announcementService.getPublicAnnouncements();

        setAnnouncements(response.data || []);
      } catch (error) {
        console.error(
          "Unable to load notifications:",
          error
        );
      }
    };

    loadAnnouncements();
  }, []);

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  const handleNotificationClick = (id) => {
    markAsSeen(id);
    setNotificationOpen(false);
  };

  const handleMarkAllAsSeen = () => {
    markAllAsSeen();
  };

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 shadow-sm backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">

        {/* Logo */}
       <Link
          to="/"
          onClick={closeMobileMenu}
          className="flex items-center gap-3"
        >
          <img
            src="/school-logo.png"
            alt="Rashid Minhas Secondary School Logo"
            className="h-14 w-14 object-contain"
          />

          <div>
            <h1 className="text-sm font-bold leading-tight text-slate-900 sm:text-base">
              Rashid Minhas
            </h1>

            <p className="text-xs font-medium text-blue-700 sm:text-sm">
              Secondary School, Ali Pur
            </p>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-2 lg:flex">

          <nav className="flex items-center gap-1">
            {navigation.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `rounded-lg px-3 py-2 text-sm font-medium transition ${
                    isActive
                      ? "bg-blue-50 text-blue-800"
                      : "text-slate-600 hover:bg-slate-50 hover:text-blue-800"
                  }`
                }
              >
                {item.name}
              </NavLink>
            ))}
          </nav>

          {/* Notification */}
          <div className="relative ml-2">

            <button
              type="button"
              onClick={() =>
                setNotificationOpen(
                  (current) => !current
                )
              }
              className="relative flex h-10 w-10 items-center justify-center rounded-full text-slate-600 transition hover:bg-blue-50 hover:text-blue-700"
              aria-label="Notifications"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                />
              </svg>

              {unreadCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-600 px-1 text-[10px] font-bold text-white">
                  {unreadCount > 9
                    ? "9+"
                    : unreadCount}
                </span>
              )}
            </button>

            {/* Notification Dropdown */}
            {notificationOpen && (
              <div className="absolute right-0 mt-3 w-80 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl">

                <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
                  <div>
                    <h3 className="font-bold text-slate-900">
                      Notifications
                    </h3>

                    <p className="text-xs text-slate-500">
                      {unreadCount} unread
                    </p>
                  </div>

                  {unreadCount > 0 && (
                    <button
                      type="button"
                      onClick={handleMarkAllAsSeen}
                      className="text-xs font-semibold text-blue-700 hover:text-blue-800"
                    >
                      Mark all read
                    </button>
                  )}
                </div>

                <div className="max-h-96 overflow-y-auto">

                  {unreadAnnouncements.length === 0 ? (
                    <div className="px-5 py-8 text-center">
                      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-500">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-6 w-6"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 12c0 5.591 3.824 10.29 9 11.622C17.176 22.29 21 17.591 21 12c0-1.41-.242-2.763-.684-4.016z"
                          />
                        </svg>
                      </div>

                      <p className="mt-3 text-sm font-semibold text-slate-700">
                        You're all caught up
                      </p>

                      <p className="mt-1 text-xs text-slate-500">
                        No new announcements.
                      </p>
                    </div>
                  ) : (
                    unreadAnnouncements.map(
                      (announcement) => (
                        <Link
                          key={announcement._id}
                          to="/announcements"
                          onClick={() =>
                            handleNotificationClick(
                              announcement._id
                            )
                          }
                          className="block border-b border-slate-100 px-4 py-4 transition hover:bg-blue-50"
                        >
                          <div className="flex gap-3">

                            <div className="mt-1 h-2.5 w-2.5 flex-shrink-0 rounded-full bg-blue-700" />

                            <div>
                              <p className="text-sm font-bold text-slate-900">
                                {announcement.title}
                              </p>

                              <p className="mt-1 line-clamp-2 text-xs leading-5 text-slate-500">
                                {announcement.description}
                              </p>

                              <p className="mt-2 text-[10px] font-semibold uppercase text-blue-700">
                                {new Date(
                                  announcement.date
                                ).toLocaleDateString()}
                              </p>
                            </div>

                          </div>
                        </Link>
                      )
                    )
                  )}

                </div>

                <div className="border-t border-slate-100 p-2">
                  <Link
                    to="/announcements"
                    onClick={() =>
                      setNotificationOpen(false)
                    }
                    className="block rounded-xl px-3 py-2 text-center text-sm font-semibold text-blue-700 hover:bg-blue-50"
                  >
                    View all announcements
                  </Link>
                </div>

              </div>
            )}
          </div>
        </div>

        {/* Mobile Button */}
        <button
          type="button"
          onClick={() =>
            setMobileMenuOpen(
              (current) => !current
            )
          }
          className="rounded-lg p-2 text-slate-700 hover:bg-slate-100 lg:hidden"
          aria-label="Toggle navigation menu"
          aria-expanded={mobileMenuOpen}
        >
          {mobileMenuOpen ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="border-t border-slate-200 bg-white lg:hidden">
          <nav className="mx-auto max-w-7xl px-4 py-3 sm:px-6">

            <div className="flex flex-col gap-1">
              {navigation.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={closeMobileMenu}
                  className={({ isActive }) =>
                    `rounded-lg px-4 py-3 text-sm font-medium transition ${
                      isActive
                        ? "bg-blue-50 text-blue-800"
                        : "text-slate-700 hover:bg-slate-50 hover:text-blue-800"
                    }`
                  }
                >
                  {item.name}
                </NavLink>
              ))}

              <Link
                to="/announcements"
                onClick={closeMobileMenu}
                className="flex items-center justify-between rounded-lg px-4 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                <span>Notifications</span>

                {unreadCount > 0 && (
                  <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-red-600 px-1 text-[10px] font-bold text-white">
                    {unreadCount > 9
                      ? "9+"
                      : unreadCount}
                  </span>
                )}
              </Link>
            </div>

          </nav>
        </div>
      )}
    </header>
  );
}

export default Navbar;