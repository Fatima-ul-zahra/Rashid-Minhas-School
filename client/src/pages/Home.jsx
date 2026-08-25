import { Link } from "react-router-dom";

const classes = [
  {
    name: "Class 1",
    description: "Building strong foundations for young learners.",
  },
  {
    name: "Class 2",
    description: "Encouraging curiosity and confident learning.",
  },
  {
    name: "Class 3",
    description: "Developing knowledge through engaging education.",
  },
  {
    name: "Class 4",
    description: "Strengthening academic and creative abilities.",
  },
  {
    name: "Class 5",
    description: "Preparing students for the next stage of learning.",
  },
  {
    name: "Class 6",
    description: "Developing independent learning skills.",
  },
];

const teachers = [
  {
    name: "Teacher Profile",
    subject: "Subject to be provided",
    qualification: "Qualification to be provided",
  },
  {
    name: "Teacher Profile",
    subject: "Subject to be provided",
    qualification: "Qualification to be provided",
  },
  {
    name: "Teacher Profile",
    subject: "Subject to be provided",
    qualification: "Qualification to be provided",
  },
];

const announcements = [
  {
    title: "Welcome to the School Website",
    date: "Information to be updated",
    description:
      "Important school announcements will be published here for students and parents.",
  },
  {
    title: "Admissions Information",
    date: "Information to be updated",
    description:
      "Admission updates and important information will appear in this section.",
  },
  {
    title: "School Activities",
    date: "Information to be updated",
    description:
      "Updates about educational activities and school events will be shared here.",
  },
];

const events = [
  {
    title: "School Event",
    date: "Date to be announced",
    location: "Location to be announced",
  },
  {
    title: "Educational Activity",
    date: "Date to be announced",
    location: "School Campus",
  },
  {
    title: "Student Activity",
    date: "Date to be announced",
    location: "School Campus",
  },
];

function Home() {
  return (
    <div>
      {/* ================= HERO ================= */}
      <section className="relative overflow-hidden bg-slate-950">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-950 via-slate-950 to-slate-900" />

        <div className="relative mx-auto grid min-h-[620px] max-w-7xl items-center gap-12 px-4 py-20 sm:px-6 lg:grid-cols-2 lg:px-8">
          <div className="max-w-2xl">
            <span className="inline-flex rounded-full border border-blue-400/30 bg-blue-400/10 px-4 py-2 text-sm font-medium text-blue-200">
              Welcome to Our School
            </span>

            <h1 className="mt-6 text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
              Building Knowledge.
              <span className="block text-blue-400">
                Shaping Futures.
              </span>
            </h1>

            <p className="mt-6 max-w-xl text-lg leading-8 text-slate-300">
              Welcome to Rashid Minhas Secondary School, Ali Pur — a place
              where learning, character, creativity, and future-ready skills
              come together.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                to="/admissions"
                className="rounded-xl bg-blue-600 px-6 py-3 text-center text-sm font-semibold text-white shadow-lg transition hover:bg-blue-500"
              >
                Explore Admissions
              </Link>

              <Link
                to="/about"
                className="rounded-xl border border-slate-600 px-6 py-3 text-center text-sm font-semibold text-white transition hover:bg-white/10"
              >
                Discover Our School
              </Link>
            </div>
          </div>

          {/* Hero Visual */}
          <div className="hidden lg:block">
            <div className="relative mx-auto max-w-lg">
              <div className="absolute -inset-6 rounded-[2rem] bg-blue-500/10 blur-3xl" />

              <div className="relative rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur">
                <div className="rounded-2xl border border-white/10 bg-slate-900/80 p-8">
                  <div className="mb-8 flex items-center gap-4">
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-600 text-xl font-bold text-white">
                      RM
                    </div>

                    <div>
                      <p className="text-sm text-slate-400">School</p>

                      <h2 className="font-bold text-white">
                        Rashid Minhas
                      </h2>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="rounded-xl bg-white/5 p-5">
                      <p className="text-2xl font-bold text-white">10</p>

                      <p className="mt-1 text-sm text-slate-400">
                        Classes
                      </p>
                    </div>

                    <div className="rounded-xl bg-white/5 p-5">
                      <p className="text-2xl font-bold text-white">A-C</p>

                      <p className="mt-1 text-sm text-slate-400">
                        Sections
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 rounded-xl bg-blue-600/10 p-5">
                    <p className="text-sm leading-6 text-blue-200">
                      Creating an engaging and supportive environment for
                      students to learn, grow, and succeed.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= ABOUT PREVIEW ================= */}
      <section className="bg-white py-20">
        <div className="mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:items-center lg:px-8">
          <div>
            <span className="text-sm font-semibold uppercase tracking-wider text-blue-700">
              About Our School
            </span>

            <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              A Place Where Students Learn, Grow and Thrive
            </h2>

            <p className="mt-6 leading-8 text-slate-600">
              Rashid Minhas Secondary School, Ali Pur is committed to
              providing students with a supportive educational environment.
              The school website will provide parents and students with
              access to important information, activities, announcements,
              and school services.
            </p>

            <p className="mt-4 leading-8 text-slate-600">
              Official school history, mission, vision, achievements, and
              facilities information will be added after receiving verified
              information from the school administration.
            </p>

            <Link
              to="/about"
              className="mt-7 inline-flex rounded-xl bg-blue-700 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-800"
            >
              Learn More About Us
            </Link>
          </div>

          <div className="rounded-3xl bg-slate-100 p-8 sm:p-10">
            <div className="grid gap-5 sm:grid-cols-2">
              {[
                {
                  title: "Learning",
                  text: "Supporting meaningful educational experiences.",
                },
                {
                  title: "Character",
                  text: "Encouraging responsibility and positive values.",
                },
                {
                  title: "Creativity",
                  text: "Helping students explore ideas and possibilities.",
                },
                {
                  title: "Community",
                  text: "Building strong relationships with families.",
                },
              ].map((item) => (
                <div
                  key={item.title}
                  className="rounded-2xl bg-white p-6 shadow-sm"
                >
                  <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 font-bold text-blue-700">
                    ✓
                  </div>

                  <h3 className="font-bold text-slate-900">
                    {item.title}
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    {item.text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ================= PRINCIPAL MESSAGE ================= */}
      <section className="bg-slate-50 py-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-slate-200">
            <div className="grid md:grid-cols-[280px_1fr]">
              <div className="flex min-h-[280px] items-center justify-center bg-gradient-to-br from-blue-800 to-blue-950 p-8">
                <div className="text-center">
                  <div className="mx-auto flex h-28 w-28 items-center justify-center rounded-full border-4 border-white/20 bg-white/10 text-3xl font-bold text-white">
                    PM
                  </div>

                  <p className="mt-5 text-sm font-medium text-blue-200">
                    Principal
                  </p>

                  <p className="mt-1 text-xs text-blue-300">
                    Name to be provided
                  </p>
                </div>
              </div>

              <div className="p-8 sm:p-10">
                <span className="text-sm font-semibold uppercase tracking-wider text-blue-700">
                  Principal's Message
                </span>

                <h2 className="mt-3 text-3xl font-bold text-slate-900">
                  Inspiring Every Student to Reach Their Potential
                </h2>

                <p className="mt-5 leading-8 text-slate-600">
                  “Our goal is to create an environment where every student
                  feels supported, valued, and motivated to learn. We believe
                  that education is not only about academic achievement but
                  also about developing confidence, responsibility, and a
                  lifelong love of learning.”
                </p>

                <p className="mt-5 text-sm font-semibold text-slate-900">
                  Principal
                </p>

                <p className="text-sm text-slate-500">
                  Official message and name to be provided by the school.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= WHY CHOOSE US ================= */}
      <section className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <span className="text-sm font-semibold uppercase tracking-wider text-blue-700">
              Why Choose Us
            </span>

            <h2 className="mt-3 text-3xl font-bold text-slate-900 sm:text-4xl">
              Supporting Students Beyond the Classroom
            </h2>

            <p className="mt-5 leading-7 text-slate-600">
              Our approach focuses on academic learning while also supporting
              personal development and positive student experiences.
            </p>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {[
              {
                number: "01",
                title: "Student Focus",
                text: "Keeping student learning and development at the center.",
              },
              {
                number: "02",
                title: "Dedicated Teaching",
                text: "Supporting teachers in delivering effective education.",
              },
              {
                number: "03",
                title: "Safe Environment",
                text: "Promoting a respectful and supportive school culture.",
              },
              {
                number: "04",
                title: "Future Skills",
                text: "Encouraging curiosity, creativity, and modern learning.",
              },
            ].map((item) => (
              <div
                key={item.number}
                className="rounded-2xl border border-slate-200 p-7 transition hover:-translate-y-1 hover:border-blue-200 hover:shadow-lg"
              >
                <span className="text-sm font-bold text-blue-600">
                  {item.number}
                </span>

                <h3 className="mt-4 text-xl font-bold text-slate-900">
                  {item.title}
                </h3>

                <p className="mt-3 text-sm leading-7 text-slate-600">
                  {item.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= CLASSES ================= */}
      <section className="bg-slate-50 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <span className="text-sm font-semibold uppercase tracking-wider text-blue-700">
                Academic Classes
              </span>

              <h2 className="mt-3 text-3xl font-bold text-slate-900 sm:text-4xl">
                Explore Our Classes
              </h2>
            </div>

            <Link
              to="/classes"
              className="text-sm font-semibold text-blue-700 hover:text-blue-900"
            >
              View All Classes →
            </Link>
          </div>

          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {classes.map((item) => (
              <div
                key={item.name}
                className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="flex items-center justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-700 font-bold text-white">
                    {item.name.replace("Class ", "")}
                  </div>

                  <span className="text-sm text-slate-400">
                    Class
                  </span>
                </div>

                <h3 className="mt-6 text-xl font-bold text-slate-900">
                  {item.name}
                </h3>

                <p className="mt-2 text-sm leading-6 text-slate-600">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= TEACHERS ================= */}
     

      {/* ================= ANNOUNCEMENTS ================= */}
      <section className="bg-slate-50 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <span className="text-sm font-semibold uppercase tracking-wider text-blue-700">
                Latest Updates
              </span>

              <h2 className="mt-3 text-3xl font-bold text-slate-900 sm:text-4xl">
                School Announcements
              </h2>
            </div>

            <Link
              to="/announcements"
              className="text-sm font-semibold text-blue-700 hover:text-blue-900"
            >
              View All Announcements →
            </Link>
          </div>

          <div className="mt-10 grid gap-6 lg:grid-cols-3">
            {announcements.map((item) => (
              <article
                key={item.title}
                className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm"
              >
                <span className="text-xs font-semibold uppercase tracking-wider text-blue-600">
                  {item.date}
                </span>

                <h3 className="mt-4 text-xl font-bold text-slate-900">
                  {item.title}
                </h3>

                <p className="mt-3 text-sm leading-7 text-slate-600">
                  {item.description}
                </p>

                <Link
                  to="/announcements"
                  className="mt-5 inline-block text-sm font-semibold text-blue-700"
                >
                  Read More →
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ================= EVENTS ================= */}
      <section className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <span className="text-sm font-semibold uppercase tracking-wider text-blue-700">
              School Calendar
            </span>

            <h2 className="mt-3 text-3xl font-bold text-slate-900 sm:text-4xl">
              Upcoming Events
            </h2>
          </div>

          <div className="mx-auto mt-12 max-w-4xl space-y-4">
            {events.map((event, index) => (
              <div
                key={index}
                className="flex flex-col gap-5 rounded-2xl border border-slate-200 p-6 transition hover:shadow-md sm:flex-row sm:items-center"
              >
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-center text-sm font-bold text-blue-700">
                  {String(index + 1).padStart(2, "0")}
                </div>

                <div className="flex-1">
                  <h3 className="text-lg font-bold text-slate-900">
                    {event.title}
                  </h3>

                  <p className="mt-1 text-sm text-slate-500">
                    {event.location}
                  </p>
                </div>

                <div className="text-sm font-medium text-slate-600">
                  {event.date}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= GALLERY PREVIEW ================= */}
      <section className="bg-slate-950 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <span className="text-sm font-semibold uppercase tracking-wider text-blue-400">
                School Life
              </span>

              <h2 className="mt-3 text-3xl font-bold text-white sm:text-4xl">
                School Gallery
              </h2>
            </div>

            <Link
              to="/gallery"
              className="text-sm font-semibold text-blue-400 hover:text-blue-300"
            >
              Explore Gallery →
            </Link>
          </div>

          <div className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-4">
            {[
              "Campus",
              "Learning",
              "Activities",
              "Students",
            ].map((item, index) => (
              <div
                key={item}
                className={`flex aspect-square items-end rounded-2xl border border-white/10 bg-gradient-to-br ${
                  index % 2 === 0
                    ? "from-blue-900 to-slate-800"
                    : "from-slate-800 to-blue-950"
                } p-5`}
              >
                <div>
                  <p className="text-xs uppercase tracking-wider text-blue-300">
                    Gallery
                  </p>

                  <h3 className="mt-1 font-bold text-white">
                    {item}
                  </h3>

                  <p className="mt-1 text-xs text-slate-400">
                    Photo to be provided
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= FINAL CTA ================= */}
      <section className="bg-blue-700 py-20">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white sm:text-4xl">
            Give Your Child a Strong Foundation
          </h2>

          <p className="mx-auto mt-5 max-w-2xl leading-7 text-blue-100">
            Learn more about Rashid Minhas Secondary School, Ali Pur and
            explore the opportunities available for students.
          </p>

          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Link
            to="/admissions"
            className="rounded-xl bg-white px-7 py-3 font-semibold text-blue-700 transition hover:bg-blue-50"
          >
            Explore Admissions
          </Link>

          <Link
            to="/contact"
            className="rounded-xl border border-white/40 px-7 py-3 font-semibold text-white transition hover:bg-white/10"
          >
            Contact School
          </Link>

          <Link
            to="/admin"
            className="rounded-xl border border-white/40 px-7 py-3 font-semibold text-white transition hover:bg-white/10"
          >
            Admin Login
          </Link>
        </div>
        </div>
      </section>
    </div>
  );
}

export default Home;