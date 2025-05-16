import React, { useState, useEffect } from "react";
import {
  listDocuments,
  uploadDocument,
  deleteDocument,
} from "@/services/documents";

interface Document {
  id: string;
  file_id: string;
  filename: string;
  user_id: string;
  created_at: string;
}

const UploadPage: React.FC = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [currentPage, setCurrentPage] = useState(1);

  const pageSize = 25;
  const totalPages = Math.ceil(documents.length / pageSize);
  const paginatedDocs = documents.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      const data = await listDocuments();
      setDocuments(data);
    } catch (err) {
      console.error("Error getting documents:", err);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files));
      setMessage(null);
    }
  };

  const handleUpload = async () => {
    if (files.length === 0) return;
    setLoading(true);
    setMessage(null);

    const successful: string[] = [];

    for (const file of files) {
      try {
        await uploadDocument(file);
        successful.push(`${file.name} ✅`);
      } catch (err: any) {
        console.error("Error uploading file:", err);
        // successful.push(`${file.name} ❌ (${err?.response?.data?.detail || "error"})`);
        successful.push(`${file.name} ❌`);
        setLoading(false);
        setMessage(`Error uploading :\n${successful.join("\n")}`);
        return null
      }
    }

    setFiles([]);
    setMessage(`Process completed:\n${successful.join("\n")}`);
    setLoading(false);
    fetchDocuments();
  };

  const handleDelete = async (id: string) => {
    const confirmed = window.confirm("¿Estás seguro de eliminar este documento?");
    if (!confirmed) return;

    try {
      await deleteDocument(id);
      setDocuments((prev) => prev.filter((doc) => doc.id !== id));
    } catch (err: any) {
      console.error("Error al eliminar documento:", err);
      alert("Error al eliminar: " + (err?.response?.data?.detail || "error"));
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 px-4">
      <h2 className="text-2xl font-semibold mb-4">📤 Upload documents</h2>

      {/* Formulario */}
      <div className="bg-white p-6 rounded-lg shadow-md space-y-4">
        <input
          type="file"
          onChange={handleFileChange}
          accept=".pdf,.docx"
          multiple
          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4
            file:rounded-full file:border-0
            file:text-sm file:font-semibold
            file:bg-blue-50 file:text-blue-700
            hover:file:bg-blue-100"
        />

        <button
          onClick={handleUpload}
          disabled={files.length === 0 || loading}
          className="bg-gray-900 text-white px-6 py-2 rounded-md hover:bg-gray-950 disabled:bg-gray-400"
        >
          {loading ? "Uploading..." : "Upload"}
        </button>

        {message && (
          <div className="bg-gray-100 p-4 rounded text-sm whitespace-pre-wrap text-gray-700 border border-gray-300">
            {message}
          </div>
        )}
      </div>

      {/* Lista de archivos subidos */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-medium mb-2">📚 My documents</h3>

        {documents.length === 0 ? (
          <p className="text-gray-500">There are no documents yet.</p>
        ) : (
          <>
            <ul className="divide-y text-sm text-gray-700">
              {paginatedDocs.map((doc) => (
                <li key={doc.id} className="py-2 flex justify-between items-center">
                  <div>
                    <strong>{doc.filename}</strong> <br />
                    <span className="text-xs text-gray-500">{doc.created_at}</span>
                  </div>
                  <button
                    onClick={() => handleDelete(doc.id)}
                    className="text-red-500 hover:text-red-700 text-xs border px-2 py-1 rounded"
                  >
                    Delete
                  </button>
                </li>
              ))}
            </ul>

            {/* Paginación */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-4 mt-4">
                <button
                  onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="text-sm px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
                >
                  ← Previous
                </button>
                <span className="text-sm">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                  className="text-sm px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
                >
                  Next →
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default UploadPage;
