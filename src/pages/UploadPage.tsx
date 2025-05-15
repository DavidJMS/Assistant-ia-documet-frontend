import React, { useState } from "react";

const UploadPage: React.FC = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [uploaded, setUploaded] = useState<string[]>([]); // lista de nombres o file_ids

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files));
    }
  };

  const handleUpload = async () => {
    for (const file of files) {
      const formData = new FormData();
      formData.append("file", file);

      try {
        const res = await fetch("http://localhost:8000/upload", {
          method: "POST",
          body: formData,
        });
        const data = await res.json();
        setUploaded((prev) => [...prev, data.file_id || file.name]);
      } catch (err) {
        console.error("Error al subir:", err);
      }
    }

    setFiles([]);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 px-4">
      <h2 className="text-2xl font-semibold mb-4">📤 Subir documentos</h2>

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
          disabled={files.length === 0}
          className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 disabled:bg-gray-400"
        >
          Subir archivos
        </button>
      </div>

      {/* Lista de archivos subidos */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-medium mb-2">📚 Documentos subidos</h3>
        {uploaded.length === 0 ? (
          <p className="text-gray-500">Aún no has subido ningún archivo.</p>
        ) : (
          <ul className="list-disc pl-6 text-gray-700 space-y-1">
            {uploaded.map((file, idx) => (
              <li key={idx}>{file}</li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default UploadPage;
