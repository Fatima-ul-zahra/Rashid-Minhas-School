import { useState } from "react";

const contactInformation = [
  {
    title: "Address",
    value: "Official school address to be provided",
  },
  {
    title: "Phone",
    value: "Official school phone number to be provided",
  },
  {
    title: "Email",
    value: "Official school email to be provided",
  },
];

function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const [submitted, setSubmitted] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    setSubmitted(true);

    setFormData({
      name: "",
      email: "",
      phone: "",
      subject: "",
      message: "",
    });

    setTimeout(() => {
      setSubmitted(false);
    }, 5000);
  };

  return (
    <div>
      {/* Hero */}
      <section className="bg-slate-950">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <span className="text-sm font-semibold uppercase tracking-wider text-blue-400">
            Contact Us
          </span>

          <h1 className="mt-4 text-4xl font-extrabold text-white sm:text-5xl">
            Get in Touch With Our School
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
            Have a question about admissions, classes, school activities, or
            general information? Contact the school using the information
            below.
          </p>
        </div>
      </section>

      {/* Contact Information */}
      <section className="bg-white py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-5 md:grid-cols-3">
            {contactInformation.map((item, index) => (
              <div
                key={item.title}
                className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 font-bold text-blue-700">
                  {index === 0 ? "A" : index === 1 ? "P" : "E"}
                </div>

                <h2 className="mt-5 font-bold text-slate-900">
                  {item.title}
                </h2>

                <p className="mt-2 text-sm leading-6 text-slate-500">
                  {item.value}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form + Map */}
      <section className="bg-slate-50 py-20">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
          {/* Form */}
          <div>
            <span className="text-sm font-semibold uppercase tracking-wider text-blue-700">
              Send a Message
            </span>

            <h2 className="mt-3 text-3xl font-bold text-slate-900">
              Contact the School
            </h2>

            <p className="mt-4 leading-7 text-slate-600">
              Complete the form below to send an inquiry. This frontend form
              will be connected to the backend later.
            </p>

            {submitted && (
              <div
                className="mt-6 rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-800"
                role="alert"
              >
                Your message has been submitted successfully for
                demonstration purposes.
              </div>
            )}

            <form
              onSubmit={handleSubmit}
              className="mt-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8"
            >
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="name"
                    className="mb-2 block text-sm font-semibold text-slate-700"
                  >
                    Name *
                  </label>

                  <input
                    id="name"
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder="Your name"
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                  />
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="mb-2 block text-sm font-semibold text-slate-700"
                  >
                    Email *
                  </label>

                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="Your email"
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                  />
                </div>

                <div>
                  <label
                    htmlFor="phone"
                    className="mb-2 block text-sm font-semibold text-slate-700"
                  >
                    Phone
                  </label>

                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Your phone number"
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                  />
                </div>

                <div>
                  <label
                    htmlFor="subject"
                    className="mb-2 block text-sm font-semibold text-slate-700"
                  >
                    Subject *
                  </label>

                  <input
                    id="subject"
                    name="subject"
                    type="text"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    placeholder="Message subject"
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label
                    htmlFor="message"
                    className="mb-2 block text-sm font-semibold text-slate-700"
                  >
                    Message *
                  </label>

                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows="6"
                    placeholder="Write your message..."
                    className="w-full resize-none rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="mt-6 w-full rounded-xl bg-blue-700 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-800"
              >
                Send Message
              </button>
            </form>
          </div>

          {/* Map Placeholder */}
          <div>
            <span className="text-sm font-semibold uppercase tracking-wider text-blue-700">
              Location
            </span>

            <h2 className="mt-3 text-3xl font-bold text-slate-900">
              Find Our School
            </h2>

            <p className="mt-4 leading-7 text-slate-600">
              An official map location will be embedded once the verified
              school address is provided.
            </p>

            <div className="mt-8 flex min-h-[500px] items-center justify-center rounded-3xl bg-slate-900 p-8 text-center shadow-lg">
              <div>
                <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-blue-700 text-2xl font-bold text-white">
                  📍
                </div>

                <h3 className="mt-6 text-xl font-bold text-white">
                  School Location
                </h3>

                <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-slate-400">
                  Google Maps or another map service can be embedded here
                  after the official school address and coordinates are
                  confirmed.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Social Media */}
      <section className="bg-white py-16">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <span className="text-sm font-semibold uppercase tracking-wider text-blue-700">
            Social Media
          </span>

          <h2 className="mt-3 text-3xl font-bold text-slate-900">
            Stay Connected
          </h2>

          <p className="mt-4 text-slate-600">
            Official social media links will be added once provided by the
            school administration.
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-3">
            {["Facebook", "Instagram", "YouTube"].map((platform) => (
              <span
                key={platform}
                className="rounded-xl border border-slate-200 bg-slate-50 px-5 py-3 text-sm font-semibold text-slate-400"
              >
                {platform}
              </span>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

export default Contact;