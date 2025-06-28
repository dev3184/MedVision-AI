import React, { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const AskAIPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [report, setReport] = useState(null);
  const [question, setQuestion] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef();

  useEffect(() => {
    inputRef.current?.focus();
    const fetchReport = async () => {
      try {
        const res = await axios.get(`https://medvision-ai.onrender.com/api/report/${id}`);
        setReport(res.data);
      } catch (err) {
        setError("Could not fetch report. Please check the ID and try again.");
      }
    };
    fetchReport();
  }, [id]);

  const handleChat = async () => {
    if (!question.trim()) return;
    setLoading(true);
    setResponse("");
    try {
      const res = await axios.post(
        `https://medvision-ai.onrender.com/api/report/${id}/chat`,
        { question }
      );
      setResponse(res.data.answer || "No response from AI.");
    } catch (err) {
      setResponse("AI service error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleChat();
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 pt-28 pb-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h1 className="text-4xl font-extrabold text-gray-900 mb-3">
              <span className="text-cyan-700">MedVision AI</span> Consultant
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Ask questions about your report and get instant AI-powered insights.
            </p>
          </div>

          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-8 rounded-r">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            </div>
          )}

          {report && (
            <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
              <div className="p-6">
                <div className="flex items-center mb-4">
                  <div className="flex-shrink-0 bg-cyan-700 rounded-md p-2">
                    <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                  </div>
                  <h3 className="ml-3 text-lg font-medium text-gray-900">Report Summary</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <p className="text-sm font-medium text-cyan-800">Modality</p>
                    <p className="mt-1 text-gray-700">{report.imageType || "Not specified"}</p>
                  </div>
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <p className="text-sm font-medium text-cyan-800">Region</p>
                    <p className="mt-1 text-gray-700">{report.region || "Not specified"}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
            <div className="p-6">
              <label htmlFor="question" className="block text-sm font-medium text-cyan-800 mb-2">
                Your Question
              </label>
              <div className="relative">
                <textarea
                  ref={inputRef}
                  id="question"
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask any question about the report (e.g., 'What does this finding mean?', 'Is this result serious?')..."
                  rows={4}
                  className="block w-full px-4 py-3 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-cyan-600 focus:border-cyan-600 resize-none"
                />
                <div className="absolute right-2 bottom-2">
                  <button
                    onClick={handleChat}
                    disabled={loading || !question.trim()}
                    className={`inline-flex items-center px-4 py-2 rounded-lg text-white ${loading || !question.trim() ? 'bg-cyan-600 cursor-not-allowed' : 'bg-cyan-800 hover:bg-cyan-900'} transition-colors`}
                  >
                    {loading ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Processing...
                      </>
                    ) : (
                      <>
                        <svg className="-ml-1 mr-2 h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 1.414L10.586 9H7a1 1 0 100 2h3.586l-1.293 1.293a1 1 0 101.414 1.414l3-3a1 1 0 000-1.414z" clipRule="evenodd" />
                        </svg>
                        Ask Consultant
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {response && (
            <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
              <div className="p-6">
                <div className="flex items-center mb-4">
                  <div className="flex-shrink-0 bg-cyan-800 rounded-md p-2">
                    <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <h3 className="ml-3 text-lg font-medium text-cyan-800">Consultancy Summary</h3>
                </div>
                <div className="prose prose-blue max-w-none">
                  <p className="whitespace-pre-wrap text-cyan-700">{response}</p>
                </div>
              </div>
            </div>
          )}

          <div className="text-center">
            <button
              onClick={() => navigate("/report", { state: { report } })}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-cyan-700 bg-cyan-100 hover:bg-cyan-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 transition-colors"
            >
              <svg className="-ml-1 mr-2 h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              Back to Report
            </button>
          </div>
        </div>
      </div>
      <Footer />

    </>
  );
};

export default AskAIPage;
