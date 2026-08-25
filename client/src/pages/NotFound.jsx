import { Link } from "react-router-dom";

function NotFound() {
  return (
    <section className="flex min-h-[70vh] items-center justify-center bg-slate-50 px-4 py-20">
      <div className="text-center">
        <p className="text-7xl font-extrabold text-blue-700">
          404
        </p>

        <h1 className="mt-5 text-3xl font-bold text-slate-900">
          Page Not Found
        </h1>

        <p className="mx-auto mt-4 max-w-md text-slate-600">
          The page you're looking for doesn't exist or may have been moved.
        </p>

        <Link
          to="/"
          className="mt-8 inline-flex rounded-xl bg-blue-700 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-800"
        >
          Return Home
        </Link>
      </div>
    </section>
  );
}

export default NotFound;