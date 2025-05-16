import React, { useEffect, useState } from "react";
import { listDocuments, askDocument } from "@/services/documents";

interface Message {
  type: "user" | "bot";
  text: string;
}

interface Document {
  id: string;
  filename: string;
  file_id: string;
}

const AskPage: React.FC = () => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [selectedFileId, setSelectedFileId] = useState<string>("");
  const [question, setQuestion] = useState("");
  const [chat, setChat] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadDocuments = async () => {
      try {
        const data = await listDocuments();
        setDocuments(data);
      } catch (err) {
        console.error("Error getting documents:", err);
      }
    };

    loadDocuments();
  }, []);

  const handleSend = async () => {
    if (!question.trim() || !selectedFileId) return;

    const userMsg: Message = { type: "user", text: question };
    setChat((prev) => [...prev, userMsg]);
    setQuestion("");
    setLoading(true);

    try {
      const data = await askDocument(selectedFileId, userMsg.text);
      setChat((prev) => [...prev, { type: "bot", text: data.answer || data.response }]);
    } catch (err) {
      console.error("Error when asking:", err);
      setChat((prev) => [
        ...prev,
        { type: "bot", text: "❌ Error getting response." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 px-4 pb-12">
      <h2 className="text-2xl font-semibold">💬 Document Assistant</h2>

      {/* Selector de documento */}
      <div className="bg-white p-4 rounded-lg shadow-md">
        <label className="block text-sm font-medium mb-2">Select a document:</label>
        <select
          className="w-full border px-4 py-2 rounded-lg"
          value={selectedFileId}
          onChange={(e) => setSelectedFileId(e.target.value)}
        >
          <option value="">-- Select a file --</option>
          {documents.map((doc) => (
            <option key={doc.id} value={doc.file_id}>
              {doc.filename}
            </option>
          ))}
        </select>
      </div>

      {/* Chat */}
      <div className="bg-white rounded-lg shadow-md p-4 h-[400px] overflow-y-auto space-y-4 flex flex-col">
        {chat.map((msg, idx) => (
          <div
            key={idx}
            className={`p-3 rounded-lg max-w-[80%] text-sm ${
              msg.type === "user"
                ? "bg-blue-100 self-end ml-auto"
                : "bg-gray-100 self-start mr-auto"
            }`}
          >
            {msg.text}
          </div>
        ))}
        {loading && (
          <div className="animate-pulse text-gray-500 italic">
            The assistant is typing...
          </div>
        )}
      </div>

      {/* Input de pregunta */}
      <div className="flex gap-4">
        <input
          type="text"
          placeholder="Write your question..."
          className="flex-1 border px-4 py-2 rounded-lg"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          disabled={!selectedFileId}
        />
        <button
          onClick={handleSend}
          className="bg-gray-900 text-white px-6 py-2 rounded-lg hover:bg-gray-950 disabled:bg-gray-400"
          disabled={!question || !selectedFileId}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default AskPage;
