import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { FiUpload, FiImage, FiLoader } from "react-icons/fi";
import Footer from "../components/Footer";

const UploadPage = () => {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    
    if (selectedFile) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(selectedFile);
    } else {
      setPreview(null);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      alert("Please select a medical image to upload");
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await axios.post("https://medvision-ai.onrender.com/api/upload", formData);
      const report = res.data;
      navigate("/report", { state: { report } });
    } catch (err) {
      alert("Upload failed. Please try again with a valid medical image.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-cyan-50 to-slate-50 pt-28 pb-16 px-4 flex items-center justify-center">
  <div className="w-full max-w-lg">
    <div className="text-center mb-8">
      <h1 className="text-4xl font-bold text-slate-900 mb-3">
        Get Image <span className="text-cyan-600">Analysis</span>
      </h1>
      <p className="text-lg text-slate-600">
        Upload your medical scan for AI-powered diagnostic insights
      </p>
    </div>

    <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
      <div className="p-8">
        <div className="space-y-6">
          {/* Upload Area */}
          <div
            className={`border-2 border-dashed rounded-xl p-8 text-center transition-all ${
              preview
                ? "border-cyan-200 bg-cyan-50"
                : "border-slate-300 hover:border-cyan-400"
            }`}
          >
            {preview ? (
              <div className="mb-4">
                <img
                  src={preview}
                  alt="Preview"
                  className="mx-auto max-h-48 rounded-lg shadow-sm border border-slate-200"
                />
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center space-y-3">
                <FiImage className="h-12 w-12 text-cyan-400" />
                <p className="text-cyan-500">No image selected</p>
              </div>
            )}

            <label className="cursor-pointer">
              <div className="mt-4">
                <span
                  className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium ${
                    preview
                      ? "bg-cyan-100 text-cyan-700"
                      : "bg-cyan-600 text-white hover:bg-cyan-700"
                  } transition-colors`}
                >
                  <FiUpload className="mr-2" />
                  {preview ? "Change Image" : "Select Image"}
                </span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </div>
            </label>
          </div>

          {/* File Info */}
          {file && (
            <div className="bg-slate-50 p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 truncate">
                  <FiImage className="flex-shrink-0 h-5 w-5 text-cyan-500" />
                  <span className="text-sm font-medium text-slate-700 truncate">
                    {file.name}
                  </span>
                </div>
                <span className="text-xs text-slate-500">
                  {(file.size / 1024 / 1024).toFixed(2)} MB
                </span>
              </div>
            </div>
          )}

          {/* Analyze Button */}
          <button
            onClick={handleUpload}
            disabled={!file || loading}
            className={`w-full flex justify-center items-center px-6 py-3 rounded-lg text-white font-medium ${
              !file
                ? "bg-slate-300 cursor-not-allowed"
                : loading
                ? "bg-cyan-400"
                : "bg-cyan-600 hover:bg-cyan-700"
            } transition-colors`}
          >
            {loading ? (
              <>
                <FiLoader className="animate-spin mr-2" />
                Analyzing Image...
              </>
            ) : (
              "Analyze"
            )}
          </button>

          {/* Requirements */}
          <div className="text-center text-sm text-slate-500">
            <p>Supported Files: JPEG, PNG</p>
            <p>Max file size: 10MB</p>
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

export default UploadPage;
