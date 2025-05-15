import api from "./api";

export const login = async (email: string, password: string) => {
  const res = await api.post("/login", { email, password });
  return res.data;
};

export const register = async (email: string, password: string) => {
  const res = await api.post("/register", { email, password });
  return res.data;
};

export const logout = () => {
  localStorage.removeItem("token");
};
