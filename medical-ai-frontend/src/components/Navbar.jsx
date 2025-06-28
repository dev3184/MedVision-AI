import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const navLinks = [
  { name: "Home", path: "/" },
  { name: "Upload", path: "/upload" },
  { name: "Sample", path: "/sample" },
  { name: "Contact Us", path: "/contact" },
];

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-cyan-50 shadow-sm px-4 sm:px-6 py-3">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        {/* Logo */}
        <div
          className="flex items-center gap-3 cursor-pointer"
          onClick={() => {
            navigate("/");
            setMobileMenuOpen(false);
          }}
        >
          <img src="/logo.png" alt="MedVision Logo" className="h-10 sm:h-12" />
          <span className="text-sm font-bold text-cyan-800 hidden sm:inline">
            MedVision AI
          </span>
        </div>

        {/* Desktop Nav */}
        <ul className="hidden md:flex gap-6 text-slate-800 font-medium">
          {navLinks.map((link) => (
            <li key={link.name}>
              <button
                onClick={() => navigate(link.path)}
                className={`px-3 py-2 rounded-md transition-colors ${
                  isActive(link.path)
                    ? "text-white bg-cyan-700 shadow-md"
                    : "hover:bg-sky-100 hover:text-cyan-700"
                }`}
              >
                {link.name}
              </button>
            </li>
          ))}
        </ul>

        {/* Mobile Menu Toggle */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 text-slate-700 rounded-lg hover:bg-sky-100 focus:outline-none focus:ring-2 focus:ring-cyan-300"
          aria-label="Toggle Mobile Menu"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            {mobileMenuOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Nav */}
      {mobileMenuOpen && (
        <div className="md:hidden animate-slideDown origin-top bg-white shadow-lg rounded-b-lg mt-2 px-4">
          <ul className="flex flex-col divide-y divide-gray-200">
            {navLinks.map((link) => (
              <li key={link.name}>
                <button
                  onClick={() => {
                    navigate(link.path);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full text-left py-3 px-2 rounded-md transition-colors ${
                    isActive(link.path)
                      ? "bg-cyan-50 text-cyan-800 font-semibold"
                      : "hover:bg-sky-50 text-slate-700"
                  }`}
                >
                  {link.name}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
