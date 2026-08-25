import { Link } from "react-router-dom";

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-950 text-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-2 lg:grid-cols-4 lg:px-8">
        {/* School */}
        <div>
          <Link to="/" className="mb-4 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-blue-700 font-bold">
              RM
            </div>

            <div>
              <h2 className="font-bold">Rashid Minhas</h2>

              <p className="text-sm text-slate-400">
                Secondary School, Ali Pur
              </p>
            </div>
          </Link>

          <p className="max-w-sm text-sm leading-6 text-slate-400">
            A professional school website and digital platform dedicated to
            supporting students, parents, teachers, and the wider school
            community.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider">
            Quick Links
          </h3>

          <ul className="space-y-3 text-sm text-slate-400">
            <li>
              <Link
                to="/"
                className="transition hover:text-white"
              >
                Home
              </Link>
            </li>

            <li>
              <Link
                to="/about"
                className="transition hover:text-white"
              >
                About School
              </Link>
            </li>

            <li>
              <Link
                to="/classes"
                className="transition hover:text-white"
              >
                Classes
              </Link>
            </li>

            <li>
              <Link
                to="/teachers"
                className="transition hover:text-white"
              >
               
              </Link>
            </li>
          </ul>
        </div>

        {/* Admissions */}
        <div>
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider">
            Admissions
          </h3>

          <ul className="space-y-3 text-sm text-slate-400">
            <li>
              <Link
                to="/admissions"
                className="transition hover:text-white"
              >
                Admission Information
              </Link>
            </li>

            <li>
              <Link
                to="/admissions"
                className="transition hover:text-white"
              >
                Admission Procedure
              </Link>
            </li>

            <li>
              <Link
                to="/admissions"
                className="transition hover:text-white"
              >
                Required Documents
              </Link>
            </li>

            <li>
              <Link
                to="/contact"
                className="transition hover:text-white"
              >
                Contact School
              </Link>
            </li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider">
            Contact
          </h3>

          <div className="space-y-3 text-sm text-slate-400">
            <p>
              <span className="font-medium text-slate-300">
                Address:
              </span>{" "}
              <span className="text-amber-300">
                School address to be provided
              </span>
            </p>

            <p>
              <span className="font-medium text-slate-300">
                Phone:
              </span>{" "}
              <span className="text-amber-300">
                Phone number to be provided
              </span>
            </p>

            <p>
              <span className="font-medium text-slate-300">
                Email:
              </span>{" "}
              <span className="text-amber-300">
                Email address to be provided
              </span>
            </p>
          </div>
        </div>
      </div>

      <div className="border-t border-slate-800">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-5 text-sm text-slate-500 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
          <p>
            © {currentYear} Rashid Minhas Secondary School, Ali Pur.
            All rights reserved.
          </p>

          <p>School Management System</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;