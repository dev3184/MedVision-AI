import { Suspense, useState, useEffect, lazy } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { FiArrowRight, FiUpload } from "react-icons/fi";
import Footer from "../components/Footer";


const LazyDoctorScene = lazy(() => import("../components/DoctorScene"));

const LandingPage = () => {
  const navigate = useNavigate();
  const [show3D, setShow3D] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => setShow3D(true), 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-sky-100 pt-28 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row items-center justify-between">
          
          {/* Text Content */}
          <div className="lg:w-1/2 space-y-8 lg:pr-12 order-2 lg:order-1 mt-12 lg:mt-0">
            <div className="inline-block bg-cyan-100 text-cyan-800 px-4 py-2 rounded-full text-sm font-medium mb-4">
              AI-Powered Medical Imaging
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 leading-tight">
              Transforming <span className="text-cyan-700">Healthcare</span> with Intelligent Diagnostics
            </h1>

            <p className="text-xl text-slate-600">
              Get instant, accurate medical imaging reports with AI analysis and virtual consultation support.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mt-8">
              <button
                onClick={() => navigate("/upload")}
                className="flex items-center justify-center px-8 py-4 bg-cyan-700 hover:bg-cyan-800 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <FiUpload className="mr-3 h-5 w-5" />
                Upload Your Scan
                <FiArrowRight className="ml-3 h-5 w-5" />
              </button>

              <button
                onClick={() => navigate("/sample")}
                className="flex items-center justify-center px-8 py-4 bg-white border-2 border-cyan-700 text-cyan-700 hover:bg-cyan-50 rounded-xl shadow-md hover:shadow-lg transition-all duration-300"
              >
                View Sample Report
              </button>
            </div>

            {/* Features Grid */}
      <div className="grid grid-cols-2 gap-4 mt-8">
  {[
    { text: "AI Analysis", icon: "M5 13l4 4L19 7" },
    {
      text: "Instant Results",
      icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z",
    },
    {
      text: "Detailed Reports",
      icon:
        "M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10",
    },
    {
      text: "Virtual Consultation",
      icon:
        "M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z",
    },
  ].map((item, idx) => (
    <div className="flex items-center" key={idx}>
      <div className="bg-blue-100 p-2 rounded-lg mr-3">
        <svg
          className="h-5 w-5 text-cyan-800"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d={item.icon}
          />
        </svg>
      </div>
      <span className="text-gray-700">{item.text}</span>
    </div>
  ))}
</div>



          </div>

          {/* 3D Model Container */}
          <div className="w-full lg:w-1/2 h-[400px] sm:h-[500px] lg:h-[600px] order-1 lg:order-2 relative">
            <div className="absolute inset-0 bg-blue-60 rounded-xl flex items-center justify-center">
              {show3D ? (
                <Suspense fallback={
                  <div className="flex flex-col items-center">
                    <div className="w-16 h-16 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin mb-2"></div>
                    <p className="text-cyan-700 font-medium">Loading 3D Model...</p>
                  </div>
                }>
                  <LazyDoctorScene isMobile={isMobile} />
                </Suspense>
              ) : (
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 border-4 border-sky-200 border-t-transparent rounded-full animate-spin mb-2"></div>
                  <p className="text-sky-700 font-medium">Preparing 3D Viewer...</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />

    </>
  );
};

export default LandingPage;
