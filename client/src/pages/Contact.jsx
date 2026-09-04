import { useState } from "react";

const contactInformation = [
  {
    title: "Address",
    value: "View School Location",
    href: "https://maps.app.goo.gl/phKEs9ZgTqRuTXxa6",
  },
  {
    title: "Phone",
    value: "0334 7675556",
    href: "tel:03347675556",
  },
  {
    title: "Email",
    value: "rmalipur@gmail.com",
    href: "mailto:rmalipur@gmail.com",
  },
];

const socialMedia = [
  {
    name: "Facebook",
    url: "https://www.facebook.com/rashidminhasschoolalipur/",
  },
  {
    name: "Instagram",
    url: "https://www.instagram.com/rashid_minhas_alipur/?hl=en",
  },
  {
    name: "YouTube",
    url: "https://www.youtube.com/@rashidminhasgroupofschools9156",
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

                <a
                  href={item.href}
                  target={item.title === "Address" ? "_blank" : undefined}
                  rel={
                    item.title === "Address"
                      ? "noopener noreferrer"
                      : undefined
                  }
                  className="mt-2 inline-block text-sm leading-6 text-blue-700 hover:underline"
                >
                  {item.value}
                </a>
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

          {/* School Location */}
          <div>
            <span className="text-sm font-semibold uppercase tracking-wider text-blue-700">
              Location
            </span>

            <h2 className="mt-3 text-3xl font-bold text-slate-900">
              Find Our School
            </h2>

            <p className="mt-4 leading-7 text-slate-600">
              Visit our school location using Google Maps.
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
                  Find Rashid Minhas Secondary School, Ali Pur on Google Maps.
                </p>

                <a
                  href="https://maps.app.goo.gl/phKEs9ZgTqRuTXxa6"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-6 inline-flex rounded-xl bg-blue-700 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-800"
                >
                  Open in Google Maps
                </a>
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
      Follow Rashid Minhas Secondary School, Ali Pur on our official
      social media platforms.
    </p>

    <div className="mt-8 flex flex-wrap justify-center gap-4">
      {/* Facebook */}
      <a
        href="https://www.facebook.com/rashidminhasschoolalipur/"
        target="_blank"
        rel="noopener noreferrer"
        className="rounded-xl bg-[#1877F2] px-6 py-3 text-sm font-semibold text-white shadow-md transition-all duration-200 hover:-translate-y-1 hover:bg-[#166FE5] hover:shadow-lg"
      >
        Facebook
      </a>

      {/* Instagram */}
      <a
        href="https://www.instagram.com/rashid_minhas_alipur/?hl=en"
        target="_blank"
        rel="noopener noreferrer"
        className="rounded-xl bg-gradient-to-r from-[#833AB4] via-[#E1306C] to-[#F77737] px-6 py-3 text-sm font-semibold text-white shadow-md transition-all duration-200 hover:-translate-y-1 hover:shadow-lg"
      >
        Instagram
      </a>

      {/* YouTube */}
      <a
        href="https://www.youtube.com/@rashidminhasgroupofschools9156"
        target="_blank"
        rel="noopener noreferrer"
        className="rounded-xl bg-[#FF0000] px-6 py-3 text-sm font-semibold text-white shadow-md transition-all duration-200 hover:-translate-y-1 hover:bg-[#CC0000] hover:shadow-lg"
      >
        YouTube
      </a>
    </div>
  </div>
</section>

    </div>
  );
}

export default Contact;