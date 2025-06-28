import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import Footer from "../components/Footer";

const ReportPage = () => {
  const { state } = useLocation();
  const [report, setReport] = useState(null);
  const [email, setEmail] = useState("");
  const [emailStatus, setEmailStatus] = useState("");
  const [emailLoading, setEmailLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (state?.report) {
      setReport(state.report);
      sessionStorage.setItem("reportData", JSON.stringify(state.report));
    } else {
      const saved = sessionStorage.getItem("reportData");
      if (saved) setReport(JSON.parse(saved));
    }
  }, [state]);

  const handlePDFDownload = () => {
    if (!report?.id) return;
    const pdfUrl = `http://localhost:8080/api/report/${report.id}/pdf`;
    window.open(pdfUrl, "_blank");
  };

  const handleSendEmail = async () => {
    if (!email || !report?.id) {
      setEmailStatus("Please enter a valid email address.");
      return;
    }

    setEmailLoading(true);
    setEmailStatus("");

    try {
      await axios.post(`http://localhost:8080/api/report/${report.id}/email`, { email });
      setEmailStatus("Email sent successfully!");
    } catch (err) {
      setEmailStatus("Failed to send email.");
    } finally {
      setEmailLoading(false);
    }
  };

  if (!report)
    return (
      <>
        <div className="min-h-screen bg-zinc-50 pt-28">
          <div className="max-w-4xl mx-auto p-6">
            <div className="bg-white rounded-xl shadow-md p-6 text-center">
              <div className="bg-rose-50 border-l-4 border-rose-500 p-4 rounded-r">
                <div className="flex items-center justify-center">
                  <svg className="h-5 w-5 text-rose-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  <p className="ml-3 text-sm text-rose-700">No report available.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </>
    );

  return (
    <>
      <div className="min-h-screen bg-gradient-to-b from-zinc-50 to-zinc-100 pt-28 pb-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="text-center">
            <h1 className="text-4xl font-extrabold text-slate-900 mb-2">Medical Analysis <span className="text-cyan-700">Report</span></h1>
            <p className="text-lg text-slate-600">Detailed analysis of your diagnostic imaging</p>
          </div>

          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="p-6">
              <div className="flex items-center mb-4">
                <div className="flex-shrink-0 bg-cyan-500 rounded-md p-2">
                  <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <h2 className="ml-3 text-xl font-semibold text-slate-900">{report.imageType}</h2>
              </div>
              <img
                src={report.imageName}
                alt="Medical scan"
                className="w-full rounded-lg shadow-sm border border-zinc-200"
              />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="bg-cyan-50 p-4 rounded-lg">
                  <p className="text-sm font-medium text-cyan-800">Modality</p>
                  <p className="mt-1 text-zinc-700">{report.imageType}</p>
                </div>
                <div className="bg-cyan-50 p-4 rounded-lg">
                  <p className="text-sm font-medium text-cyan-800">Region</p>
                  <p className="mt-1 text-zinc-700">{report.region}</p>
                </div>
              </div>

              <div className="space-y-6">
                <Section title="Key Findings" color="cyan" content={report.keyFindings} icon="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                <Section title="Diagnostic Assessment" color="emerald" content={report.diagnosticAssessment} icon="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                <Section title="Patient-Friendly Explanation" color="purple" content={report.patientExplanation} icon="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ActionCard
              color="cyan"
              title="Get Report Via Email"
              icon="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              input={{
                value: email,
                onChange: setEmail,
                loading: emailLoading,
                status: emailStatus,
                onClick: handleSendEmail,
              }}
            />

            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="p-6">
                <div className="flex items-center mb-4">
                  <div className="flex-shrink-0 bg-cyan-500 rounded-md p-2">
                    <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
                    </svg>
                  </div>
                  <h3 className="ml-3 text-lg font-medium text-slate-900">Download And Consult</h3>
                </div>
                <div className="space-y-4">
                  <button
                    onClick={handlePDFDownload}
                    className="w-full flex justify-center items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-white bg-cyan-700 hover:bg-cyan-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
                  >
                    <svg className="-ml-1 mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    Download Report
                  </button>
                  <button
                    onClick={() => navigate(`/ask-ai/${report.id}`)}
                    className="w-full flex justify-center items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-white bg-cyan-700 hover:bg-cyan-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                  >
                    <svg className="-ml-1 mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                    </svg>
                    Chat With Our Consultant
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

const Section = ({ title, content, icon, color }) => (
  <div>
    <h3 className={`text-lg font-medium text-slate-900 mb-3 flex items-center`}>
      <svg className={`h-5 w-5 text-${color}-500 mr-2`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={icon} />
      </svg>
      {title}
    </h3>
    <div className={`prose prose-${color} max-w-none bg-zinc-50 p-4 rounded-lg`}>
      <pre className="whitespace-pre-wrap font-sans">{content}</pre>
    </div>
  </div>
);

const ActionCard = ({ title, icon, color, input }) => (
  <div className="bg-white rounded-xl shadow-md overflow-hidden">
    <div className="p-6">
      <div className="flex items-center mb-4">
        <div className={`flex-shrink-0 bg-${color}-500 rounded-md p-2`}>
          <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={icon} />
          </svg>
        </div>
        <h3 className="ml-3 text-lg font-medium text-slate-900">{title}</h3>
      </div>
      <div className="space-y-4">
        <input
          type="email"
          value={input.value}
          onChange={(e) => input.onChange(e.target.value)}
          placeholder="abc@gmail.com"
          className="w-full px-4 py-2 border border-zinc-300 rounded-lg focus:ring-cyan-500 focus:border-cyan-500"
        />
        <button
          onClick={input.onClick}
          disabled={input.loading}
          className={`w-full flex justify-center items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-white ${input.loading ? 'bg-cyan-400' : 'bg-cyan-600 hover:bg-cyan-700'} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500`}
        >
          {input.loading ? "Sending..." : "Send Report"}
        </button>
        {input.status && (
          <p className={`text-sm text-center p-2 rounded ${input.status.includes('success') ? 'text-emerald-700 bg-emerald-50' : 'text-rose-700 bg-rose-50'}`}>
            {input.status}
          </p>
        )}
      </div>
    </div>
  </div>
);

export default ReportPage;
                                                                        