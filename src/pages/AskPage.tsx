import React, { useEffect, useState } from "react";

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
    fetch("http://localhost:8000/documents")
      .then((res) => res.json())
      .then((data) => setDocuments(data))
      .catch((err) => console.error("Error al cargar documentos:", err));
  }, []);

  const handleSend = async () => {
    if (!question.trim() || !selectedFileId) return;

    const userMsg: Message = { type: "user", text: question };
    setChat((prev) => [...prev, userMsg]);
    setQuestion("");
    setLoading(true);

    try {
      const res = await fetch("http://localhost:8000/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          file_id: selectedFileId,
          question: userMsg.text,
          model: "gpt-4", // opcional
          temperature: 0.7,
          max_tokens: 500,
        }),
      });

      const data = await res.json();
      setChat((prev) => [...prev, { type: "bot", text: data.response }]);
    } catch (err) {
      console.error("Error al preguntar:", err);
      setChat((prev) => [
        ...prev,
        { type: "bot", text: "❌ Error al obtener respuesta." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 px-4 pb-12">
      <h2 className="text-2xl font-semibold">💬 Asistente de documentos</h2>

      {/* Selector de documento */}
      <div className="bg-white p-4 rounded-lg shadow-md">
        <label className="block text-sm font-medium mb-2">Selecciona un documento:</label>
        <select
          className="w-full border px-4 py-2 rounded-lg"
          value={selectedFileId}
          onChange={(e) => setSelectedFileId(e.target.value)}
        >
          <option value="">-- Selecciona un archivo --</option>
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
            El asistente está escribiendo...
          </div>
        )}
      </div>

      {/* Input de pregunta */}
      <div className="flex gap-4">
        <input
          type="text"
          placeholder="Escribe tu pregunta..."
          className="flex-1 border px-4 py-2 rounded-lg"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          disabled={!selectedFileId}
        />
        <button
          onClick={handleSend}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
          disabled={!question || !selectedFileId}
        >
          Enviar
        </button>
      </div>
    </div>
  );
};

export default AskPage;
