import React from "react";
import Navbar from "../components/Navbar";
import { FiFileText, FiDownload, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import Footer from "../components/Footer";
import sample-report-page1.png from './public/sample-report-page1.png';

const SampleReportPage = () => {
  const [currentPage, setCurrentPage] = React.useState(0);
  const pages = [
    "medical-ai-frontend/public/sample-report-page1.png",
    "medical-ai-frontend/public/sample-report-page2.png"
  ];

  const nextPage = () => {
    setCurrentPage((prev) => (prev + 1) % pages.length);
  };

  const prevPage = () => {
    setCurrentPage((prev) => (prev - 1 + pages.length) % pages.length);
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-cyan-50 to-slate-50 pt-28 pb-16">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    {/* Header */}
    <div className="text-center mb-12">
      <h1 className="text-4xl font-bold text-slate-900 mb-3">
        <span className="text-cyan-600">Sample</span> Medical Report
      </h1>
      <p className="text-xl text-slate-600 max-w-3xl mx-auto">
        Explore an example of our AI-generated diagnostic reports
      </p>
    </div>

    {/* Report Viewer */}
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
      <div className="p-6">
        {/* Viewer Controls */}
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center space-x-2">
            <FiFileText className="text-cyan-500" />
            <span className="font-medium text-slate-700">
              Sample Report {currentPage + 1}/{pages.length}
            </span>
          </div>
        </div>

        {/* Report Content */}
        <div className="relative">
          <img
            src={pages[currentPage]}
            alt={`Sample Report Page ${currentPage + 1}`}
            className="w-full h-auto border border-slate-200 rounded-lg shadow-sm"
          />

          {/* Navigation Arrows */}
          <button
            onClick={prevPage}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white p-3 rounded-full shadow-md hover:bg-slate-50 transition-colors"
          >
            <FiChevronLeft className="h-6 w-6 text-slate-700" />
          </button>
          <button
            onClick={nextPage}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white p-3 rounded-full shadow-md hover:bg-slate-50 transition-colors"
          >
            <FiChevronRight className="h-6 w-6 text-slate-700" />
          </button>
        </div>

        {/* Page Indicators */}
        <div className="flex justify-center mt-4 space-x-2">
          {pages.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentPage(index)}
              className={`h-2 w-2 rounded-full ${
                currentPage === index ? "bg-cyan-600" : "bg-slate-300"
              }`}
              aria-label={`Go to page ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>

{/* Features Section */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-xl shadow-md">
              <div className="bg-blue-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <svg className="h-6 w-6 text-cyan-800" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">AI-Powered Insights</h3>
              <p className="text-gray-600">Detailed findings and interpretations of medical imaging data</p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-md">
              <div className="bg-blue-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <svg className="h-6 w-6 text-cyan-800" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">AI Virtual Consultant</h3>
              <p className="text-gray-600">Provide accurate diagnostic suggestions with chatbot support for Q/A</p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-md">
              <div className="bg-blue-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <svg className="h-6 w-6 text-cyan-800" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Timely Results</h3>
              <p className="text-gray-600">Fast turnaround without compromising accuracy</p>
            </div>
          </div>

  </div>
</div>
<Footer />

    </>
  );
};

export default SampleReportPage;
