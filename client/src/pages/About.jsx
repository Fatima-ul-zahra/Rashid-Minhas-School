import { Link } from "react-router-dom";

const values = [
  {
    title: "Excellence",
    description:
      "Encouraging students to pursue high standards in learning and personal development.",
  },
  {
    title: "Integrity",
    description:
      "Promoting honesty, responsibility, respect, and positive character.",
  },
  {
    title: "Respect",
    description:
      "Creating an environment where students, teachers, and families are valued.",
  },
  {
    title: "Curiosity",
    description:
      "Encouraging students to ask questions, explore ideas, and continue learning.",
  },
];

const facilities = [
  "Classrooms",
  "Learning Resources",
  "Student Activities",
  "Teacher Support",
  "School Administration",
  "Additional Facilities — To Be Confirmed",
];

function About() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-slate-950">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <span className="text-sm font-semibold uppercase tracking-wider text-blue-400">
              About Our School
            </span>

            <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
              Rashid Minhas Secondary School, Ali Pur
            </h1>

            <p className="mt-6 text-lg leading-8 text-slate-300">
              Discover our educational environment, values, goals, and
              commitment to supporting students throughout their learning
              journey.
            </p>
          </div>
        </div>
      </section>

      {/* Introduction */}
      <section className="bg-white py-20">
        <div className="mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:items-center lg:px-8">
          <div>
            <span className="text-sm font-semibold uppercase tracking-wider text-blue-700">
              Who We Are
            </span>

            <h2 className="mt-3 text-3xl font-bold text-slate-900 sm:text-4xl">
              Education With Purpose
            </h2>

            <p className="mt-6 leading-8 text-slate-600">
              Rashid Minhas Secondary School, Ali Pur aims to provide students
              with a supportive environment in which they can develop
              academic knowledge, confidence, discipline, creativity, and
              positive social values.
            </p>

            <p className="mt-4 leading-8 text-slate-600">
              The school website is designed to make important information
              accessible to students, parents, teachers, and visitors while
              providing a foundation for future digital school services.
            </p>

            <div className="mt-7 rounded-2xl border border-amber-200 bg-amber-50 p-5">
              <p className="text-sm leading-6 text-amber-800">
                <strong>Client information:</strong> Official school history,
                establishment details, achievements, and other institutional
                information will be added after verification by the school
                administration.
              </p>
            </div>
          </div>

          <div className="rounded-3xl bg-slate-100 p-8 sm:p-10">
            <div className="flex aspect-video items-center justify-center rounded-2xl bg-gradient-to-br from-blue-900 to-slate-900">
              <div className="text-center">
                <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-white/10 text-3xl font-bold text-white">
                  RM
                </div>

                <h3 className="mt-5 text-xl font-bold text-white">
                  Rashid Minhas
                </h3>

                <p className="mt-1 text-sm text-blue-200">
                  Secondary School, Ali Pur
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="bg-slate-50 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="rounded-3xl bg-blue-700 p-8 text-white shadow-lg sm:p-10">
              <span className="text-sm font-semibold uppercase tracking-wider text-blue-200">
                Our Mission
              </span>

              <h2 className="mt-4 text-3xl font-bold">
                Empowering Students Through Education
              </h2>

              <p className="mt-5 leading-8 text-blue-100">
                To provide a supportive learning environment that encourages
                academic development, responsible citizenship, creativity,
                confidence, and lifelong learning.
              </p>

              <p className="mt-5 text-sm text-blue-200">
                * Mission statement to be confirmed by the school.
              </p>
            </div>

            <div className="rounded-3xl bg-slate-900 p-8 text-white shadow-lg sm:p-10">
              <span className="text-sm font-semibold uppercase tracking-wider text-blue-400">
                Our Vision
              </span>

              <h2 className="mt-4 text-3xl font-bold">
                Preparing Learners for the Future
              </h2>

              <p className="mt-5 leading-8 text-slate-300">
                To create an educational community where students are
                prepared to learn, adapt, contribute, and succeed in an
                evolving world.
              </p>

              <p className="mt-5 text-sm text-slate-500">
                * Vision statement to be confirmed by the school.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <span className="text-sm font-semibold uppercase tracking-wider text-blue-700">
              Our Values
            </span>

            <h2 className="mt-3 text-3xl font-bold text-slate-900 sm:text-4xl">
              Principles That Guide Us
            </h2>

            <p className="mt-5 leading-7 text-slate-600">
              These values provide a general framework for the school's
              educational environment and will be finalized with the client.
            </p>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((value, index) => (
              <div
                key={value.title}
                className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 font-bold text-blue-700">
                  0{index + 1}
                </div>

                <h3 className="mt-6 text-xl font-bold text-slate-900">
                  {value.title}
                </h3>

                <p className="mt-3 text-sm leading-7 text-slate-600">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Educational Goals */}
      <section className="bg-slate-50 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2">
            <div>
              <span className="text-sm font-semibold uppercase tracking-wider text-blue-700">
                Educational Goals
              </span>

              <h2 className="mt-3 text-3xl font-bold text-slate-900 sm:text-4xl">
                Helping Students Become Confident Learners
              </h2>

              <p className="mt-5 leading-8 text-slate-600">
                Our educational approach aims to support students academically
                while helping them develop the skills and attitudes needed for
                personal and future growth.
              </p>
            </div>

            <div className="space-y-4">
              {[
                "Develop strong academic foundations.",
                "Encourage independent thinking and problem solving.",
                "Promote confidence and communication.",
                "Develop responsible and respectful behavior.",
                "Encourage creativity and curiosity.",
                "Support positive relationships between school and families.",
              ].map((goal, index) => (
                <div
                  key={goal}
                  className="flex gap-4 rounded-xl border border-slate-200 bg-white p-5"
                >
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-700 text-sm font-bold text-white">
                    {index + 1}
                  </div>

                  <p className="text-sm leading-6 text-slate-700">
                    {goal}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Principal Message */}
      <section className="bg-white py-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl bg-slate-950 p-8 text-white sm:p-12">
            <div className="grid gap-10 md:grid-cols-[180px_1fr] md:items-center">
              <div className="text-center">
                <div className="mx-auto flex h-32 w-32 items-center justify-center rounded-full border border-white/10 bg-blue-700 text-3xl font-bold">
                  PM
                </div>

                <p className="mt-4 text-sm text-blue-300">
                  Principal
                </p>

                <p className="mt-1 text-xs text-slate-500">
                  Abdul Ghafoor Malik
                </p>
              </div>

              <div>
                <span className="text-sm font-semibold uppercase tracking-wider text-blue-400">
                  Principal's Message
                </span>

                <blockquote className="mt-4 text-xl font-medium leading-9 text-slate-200 sm:text-2xl">
                  “Education is a journey of discovery, growth, and
                  opportunity. Our aim is to support every student in
                  developing the knowledge, confidence, and character needed
                  to move forward.”
                </blockquote>

                <p className="mt-6 text-sm leading-6 text-slate-400">
                  This is a placeholder message. The official Principal's
                  Message will be added after receiving the approved content
                  from the school administration.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Facilities */}
      <section className="bg-slate-50 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <span className="text-sm font-semibold uppercase tracking-wider text-blue-700">
              School Facilities
            </span>

            <h2 className="mt-3 text-3xl font-bold text-slate-900 sm:text-4xl">
              Supporting the Learning Environment
            </h2>

            <p className="mx-auto mt-5 max-w-2xl leading-7 text-slate-600">
              Facility details will be updated after verification and
              confirmation from the school.
            </p>
          </div>

          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {facilities.map((facility, index) => (
              <div
                key={facility}
                className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 font-bold text-blue-700">
                  {String(index + 1).padStart(2, "0")}
                </div>

                <h3 className="mt-5 font-bold text-slate-900">
                  {facility}
                </h3>

                <p className="mt-2 text-sm text-slate-500">
                  Details to be confirmed.
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-blue-700 py-16">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white sm:text-4xl">
            Learn More About Our School
          </h2>

          <p className="mt-4 text-blue-100">
            Explore our classes, teachers, admissions information, and school
            updates.
          </p>

          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              to="/classes"
              className="rounded-xl bg-white px-7 py-3 font-semibold text-blue-700 transition hover:bg-blue-50"
            >
              Explore Classes
            </Link>

            <Link
              to="/contact"
              className="rounded-xl border border-white/40 px-7 py-3 font-semibold text-white transition hover:bg-white/10"
            >
              Contact School
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

export default About;