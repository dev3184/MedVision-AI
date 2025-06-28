// src/components/ChatWithReport.jsx
import { useState } from "react";
import axios from "axios";

const ChatWithReport = ({ reportId }) => {
  const [question, setQuestion] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChat = async () => {
    if (!question.trim()) return;

    setLoading(true);
    try {
      const res = await axios.post(`http://localhost:8080/api/report/${reportId}/chat`, {
        question: question,
      });
      setResponse(res.data.answer);
    } catch (err) {
      setResponse("⚠️ Something went wrong while contacting the AI.");
    }
    setLoading(false);
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-md mt-8">
      <h2 className="text-xl font-semibold mb-2">💬 Ask AI About This Report</h2>
      <textarea
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        placeholder="Type your question here..."
        className="w-full p-3 border rounded-md mb-4"
        rows={3}
      />
      <button
        onClick={handleChat}
        disabled={loading}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        {loading ? "Asking..." : "Ask"}
      </button>

      {response && (
        <div className="mt-4 bg-gray-100 p-4 rounded-md border border-gray-300 whitespace-pre-line">
          <strong>🤖 AI Response:</strong>
          <p>{response}</p>
        </div>
      )}
    </div>
  );
};

export default ChatWithReport;
