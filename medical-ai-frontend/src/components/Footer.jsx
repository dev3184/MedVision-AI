import React from "react";
import { FaEnvelope, FaLinkedin, FaGithub } from "react-icons/fa";
import logo from "/logo.png"; // adjust path as needed

const Footer = () => {
  return (
    <footer className="bg-cyan-50 text-gray-700 py-5 border-t border-cyan-200">
      <div className="max-w-5xl mx-auto px-4 text-center space-y-4">
        {/* Logo */}
        <div className="flex justify-center">
          <img
            src={logo}
            alt="MedVisionAI Logo"
            className="h-12 w-12 "
          />
        </div>

        <h3 className="text-2xl font-bold text-cyan-800">MedVisionAI</h3>

        <p className="text-md max-w-xl mx-auto">
          Empowering healthcare with AI-driven insights. Contact us for partnerships, support, or collaboration.
        </p>

        <div className="flex justify-center space-x-6 mt-4">
          <a
            href="mailto:workwithdev31@gmail.com"
            className="text-cyan-700 hover:text-cyan-900"
          >
            <FaEnvelope className="w-5 h-5" />
          </a>
          <a
            href="https://www.linkedin.com/in/dev-bhalani-6b266a26b/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-cyan-700 hover:text-cyan-900"
          >
            <FaLinkedin className="w-5 h-5" />
          </a>
          <a
            href="https://github.com/dev3184"
            target="_blank"
            rel="noopener noreferrer"
            className="text-cyan-700 hover:text-cyan-900"
          >
            <FaGithub className="w-5 h-5" />
          </a>
        </div>

        <p className="text-sm text-gray-500 pt-4">
          © {new Date().getFullYear()} MedVisionAI. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
