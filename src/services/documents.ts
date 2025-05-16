import api from "./api";

export const uploadDocument = async (file: File) => {
  const formData = new FormData();
  formData.append("file", file);
  const res = await api.post("/upload", formData);
  if(res.status >= 400){
    console.log(res.status)
    throw new Error('Error uploading file.')
  }
  return res.data;
};

export const listDocuments = async () => {
  const res = await api.get("/documents");
  return res.data;
};

export const deleteDocument = async (id: string) => {
  const res = await api.delete(`/documents/${id}`);
  return res.data;
};

export const askDocument = async (file_id: string, question: string) => {
  const res = await api.post("/ask", { file_id, question });
  return res.data;
};
