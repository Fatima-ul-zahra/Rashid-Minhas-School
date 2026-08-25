import { Link } from "react-router-dom";

const classes = [
  {
    number: 1,
    title: "Class 1",
    description:
      "Developing foundational literacy, numeracy, communication, and learning skills.",
  },
  {
    number: 2,
    title: "Class 2",
    description:
      "Strengthening core concepts through structured and engaging learning.",
  },
  {
    number: 3,
    title: "Class 3",
    description:
      "Building confidence and expanding students' academic understanding.",
  },
  {
    number: 4,
    title: "Class 4",
    description:
      "Encouraging deeper understanding, creativity, and independent thinking.",
  },
  {
    number: 5,
    title: "Class 5",
    description:
      "Preparing students for the transition toward secondary-level learning.",
  },
  {
    number: 6,
    title: "Class 6",
    description:
      "Developing stronger academic and problem-solving capabilities.",
  },
  {
    number: 7,
    title: "Class 7",
    description:
      "Supporting subject knowledge and independent learning habits.",
  },
  {
    number: 8,
    title: "Class 8",
    description:
      "Preparing students for more advanced academic challenges.",
  },
  {
    number: 9,
    title: "Class 9",
    description:
      "Supporting focused secondary education and examination preparation.",
  },
  {
    number: 10,
    title: "Class 10",
    description:
      "Preparing students for academic progression and future opportunities.",
  },
];

function Classes() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-slate-950">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <span className="text-sm font-semibold uppercase tracking-wider text-blue-400">
            Academic Programs
          </span>

          <h1 className="mt-4 text-4xl font-extrabold text-white sm:text-5xl">
            Classes
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
            Explore the classes offered at Rashid Minhas Secondary School,
            Ali Pur.
          </p>
        </div>
      </section>

      {/* Overview */}
      <section className="bg-white py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="rounded-2xl border border-slate-200 p-7">
              <p className="text-3xl font-bold text-blue-700">10</p>

              <p className="mt-2 font-semibold text-slate-900">
                Academic Classes
              </p>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                From Class 1 through Class 10.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 p-7">
              <p className="text-3xl font-bold text-blue-700">10</p>

              <p className="mt-2 font-semibold text-slate-900">
                Grade Levels
              </p>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                A structured progression from primary to secondary level.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Classes */}
      <section className="bg-slate-50 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <span className="text-sm font-semibold uppercase tracking-wider text-blue-700">
              Classes
            </span>

            <h2 className="mt-3 text-3xl font-bold text-slate-900 sm:text-4xl">
              Our Academic Levels
            </h2>

            <p className="mx-auto mt-5 max-w-2xl leading-7 text-slate-600">
              Explore the academic levels offered at Rashid Minhas Secondary
              School, Ali Pur.
            </p>
          </div>

          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {classes.map((item) => (
              <div
                key={item.number}
                className="group rounded-2xl border border-slate-200 bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:border-blue-200 hover:shadow-lg"
              >
                <div className="flex items-center justify-between">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-700 text-lg font-bold text-white">
                    {item.number}
                  </div>

                  <span className="text-sm font-medium text-slate-400">
                    Grade
                  </span>
                </div>

                <h3 className="mt-6 text-xl font-bold text-slate-900">
                  {item.title}
                </h3>

                <p className="mt-3 text-sm leading-7 text-slate-600">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Future Management System */}
      <section className="bg-white py-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl bg-slate-950 p-8 text-white sm:p-12">
            <span className="text-sm font-semibold uppercase tracking-wider text-blue-400">
              Future Management System
            </span>

            <h2 className="mt-4 text-3xl font-bold">
              Classes Will Be Managed From the Admin Dashboard
            </h2>

            <p className="mt-5 leading-8 text-slate-300">
              During the management-system development phase, authorized
              administrators will be able to create and manage classes,
              assign teachers, and view student counts.
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {[
                "Create and edit classes",
                "Assign class teachers",
                "View enrolled students",
                "Manage class information",
              ].map((item) => (
                <div
                  key={item}
                  className="rounded-xl border border-white/10 bg-white/5 p-4 text-sm text-slate-300"
                >
                  ✓ {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-blue-700 py-16">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white sm:text-4xl">
            Interested in Admission?
          </h2>

          <p className="mt-4 text-blue-100">
            Explore admission information and the application process.
          </p>

          <Link
            to="/admissions"
            className="mt-8 inline-flex rounded-xl bg-white px-7 py-3 font-semibold text-blue-700 transition hover:bg-blue-50"
          >
            View Admissions
          </Link>
        </div>
      </section>
    </div>
  );
}

export default Classes;