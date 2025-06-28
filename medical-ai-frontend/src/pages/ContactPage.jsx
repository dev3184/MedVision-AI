import React from "react";
import Navbar from "../components/Navbar";
import {
  FaEnvelope,
  FaLinkedin,
  FaGithub,
  FaClock,
  FaMapMarkerAlt,
} from "react-icons/fa";
import Footer from "../components/Footer";

const ContactPage = () => {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gradient-to-br from-cyan-50 to-slate-50 pt-28 pb-16 px-4">
        <div className="max-w-5xl mx-auto space-y-12">
          {/* Header */}
          <section className="text-center">
            <h1 className="text-4xl md:text-4xl font-bold text-gray-900">
              Contact <span className="text-cyan-700">MedVisionAI</span>
            </h1>
            <p className="mt-3 text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
              Reach out to us through any of these channels. We're happy to help!
            </p>
          </section>

          {/* Contact Cards */}
          <section className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Email */}
            <ContactCard
              icon={<FaEnvelope className="h-8 w-8 text-cyan-700" />}
              title="Email Us"
              subtitle="For general inquiries and support"
              link="mailto:workwithdev31@gmail.com"
              label="workwithdev31@gmail.com"
            />

            {/* LinkedIn */}
            <ContactCard
              icon={<FaLinkedin className="h-8 w-8 text-cyan-700" />}
              title="LinkedIn"
              subtitle="Connect with us professionally"
              link="https://www.linkedin.com/in/dev-bhalani-6b266a26b/"
              label="linkedin.com/in/dev-bhalani"
            />

            {/* GitHub */}
            <ContactCard
              icon={<FaGithub className="h-8 w-8 text-cyan-700" />}
              title="GitHub"
              subtitle="Explore our open-source projects"
              link="https://github.com/dev3184"
              label="github.com/dev3184"
            />

            {/* Response Time */}
            <ContactCard
              icon={<FaClock className="h-8 w-8 text-cyan-700" />}
              title="Response Time"
              subtitle="We typically respond within"
              label="24-48 hours"
            />
          </section>

          {/* Location Section */}
          <section className="bg-white p-8 rounded-2xl shadow-lg">
            <div className="flex flex-col md:flex-row items-center md:items-start">
              <div className="bg-cyan-100 p-4 rounded-full mb-4 md:mb-0 md:mr-6">
                <FaMapMarkerAlt className="h-8 w-8 text-cyan-700" />
              </div>
              <div className="text-center md:text-left">
                <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                  Our Location
                </h2>
                <address className="not-italic text-gray-700 text-lg leading-relaxed">
                  1208 Sardardham Boys Hostel<br />
                  Ahmedabad, 382421<br />
                  India
                </address>
              </div>
            </div>
          </section>
        </div>
      </main>
      <Footer />

    </>
  );
};

const ContactCard = ({ icon, title, subtitle, link, label }) => {
  return (
    <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow text-center">
      <div className="flex flex-col items-center">
        <div className="bg-cyan-100 p-4 rounded-full mb-4">{icon}</div>
        <h3 className="text-xl font-bold text-gray-900 mb-1">{title}</h3>
        <p className="text-gray-600 mb-3">{subtitle}</p>
        {link ? (
          <a
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            className="text-cyan-700 hover:text-cyan-900 font-medium text-lg transition-colors"
          >
            {label}
          </a>
        ) : (
          <p className="text-cyan-700 font-medium text-lg">{label}</p>
        )}
      </div>
    </div>
  );
};

export default ContactPage;
