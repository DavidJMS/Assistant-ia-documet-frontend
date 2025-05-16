import React, { useState } from "react";
import background from "@/assets/background.svg";
import { useNavigate } from "react-router-dom";
import { login } from "@/services/auth";


const LoginPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setError(null);

  try {
    const data = await login(email, password);
    localStorage.setItem("token", data.access_token);
    navigate("/ask");
  } catch (err: any) {
    setError(err?.response?.data?.detail || "Error login.");
  }
};

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 bg-cover bg-center relative"
      style={{ backgroundImage: `url(${background})` }}
    >
      <div className="bg-white shadow-xl rounded-2xl p-6 sm:p-8 w-full max-w-sm z-10">
        <h2 className="text-2xl font-semibold text-center mb-6 text-gray-800">Login</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              className="mt-1 w-full px-4 py-2 border rounded-lg"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              className="mt-1 w-full px-4 py-2 border rounded-lg"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {error && <p className="text-red-600 text-sm">{error}</p>}

          <button
            type="submit"
            className="w-full bg-gray-900 text-white py-2 rounded-lg hover:bg-gray-950 cursor-pointer"
          >
            Submit
          </button>
        </form>
      </div>
      <div className="absolute inset-0 bg-black opacity-30 z-0"></div>
    </div>
  );
};

export default LoginPage;
