import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import LandingPage from "./pages/LandingPage";
import UploadPage from "./pages/UploadPage";
import ReportPage from "./pages/ReportPage";
import SampleReportPage from "./pages/SampleReportPage";
import ContactPage from "./pages/ContactPage";
import ChatWithReport from "./components/ChatWithReport";
import AskAIPage from "./pages/AskAIPage";

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/upload" element={<UploadPage />} />
        <Route path="/report" element={<ReportPage />} />
        <Route path="/sample" element={<SampleReportPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/ask-ai/:id" element={<AskAIPage />} />
      </Routes>
    </Router>
  );
}

export default App;
