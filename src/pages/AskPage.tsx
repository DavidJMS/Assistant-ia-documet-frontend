import React, { useState } from "react";

interface Message {
  type: "user" | "bot";
  text: string;
}

const AskPage: React.FC = () => {
  const [documentId, setDocumentId] = useState<string>("");
  const [question, setQuestion] = useState("");
  const [chat, setChat] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);

  // Simulación de documentos disponibles
  const availableDocuments = [
    { id: "doc-1", name: "Rutina de gimnasio.pdf" },
    { id: "doc-2", name: "Contrato de arrendamiento.docx" },
    { id: "doc-3", name: "Manual de IA.docx" },
  ];

  const handleSend = async () => {
    if (!question.trim() || !documentId) return;

    const userMsg: Message = { type: "user", text: question };
    setChat((prev) => [...prev, userMsg]);
    setQuestion("");
    setLoading(true);

    try {
      const res = await fetch("http://localhost:8000/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ file_id: documentId, question }),
      });

      const data = await res.json();
      setChat((prev) => [...prev, { type: "bot", text: data.response }]);
    } catch (err) {
      setChat((prev) => [...prev, { type: "bot", text: "❌ Error al obtener respuesta." }]);
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
          value={documentId}
          onChange={(e) => setDocumentId(e.target.value)}
        >
          <option value="">-- Selecciona un archivo --</option>
          {availableDocuments.map((doc) => (
            <option key={doc.id} value={doc.id}>
              {doc.name}
            </option>
          ))}
        </select>
      </div>

      {/* Chat de mensajes */}
      <div className="bg-white rounded-lg shadow-md p-4 h-[400px] overflow-y-auto space-y-4 flex flex-col">
        {chat.map((msg, idx) => (
          <div
            key={idx}
            className={`p-3 rounded-lg max-w-[80%] ${
              msg.type === "user"
                ? "bg-blue-100 self-end ml-auto"
                : "bg-gray-100 self-start mr-auto"
            }`}
          >
            {msg.text}
          </div>
        ))}

        {loading && (
          <div className="animate-pulse text-gray-500 italic">El asistente está escribiendo...</div>
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
          disabled={!documentId}
        />
        <button
          onClick={handleSend}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
          disabled={!question || !documentId}
        >
          Enviar
        </button>
      </div>
    </div>
  );
};

export default AskPage;
