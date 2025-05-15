import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, Upload, MessageCircle, LogOut } from "lucide-react";

const Sidebar = ({ close }: { close?: () => void }) => {
  const location = useLocation();

  const linkClass = (path: string) =>
    `flex items-center gap-3 px-4 py-2 rounded-lg transition-all ${
      location.pathname === path
        ? "bg-gray-800 text-white"
        : "text-gray-300 hover:bg-gray-800 hover:text-white"
    }`;

  return (
    <div className="w-64 h-full bg-gray-900 text-white flex flex-col p-6">
      <h1 className="text-2xl font-bold mb-10 tracking-wide">IA Document</h1>

      <nav className="flex flex-col gap-3 flex-1">
        <Link to="/dashboard" className={linkClass("/dashboard")} onClick={close}>
          <LayoutDashboard size={20} />
          Dashboard
        </Link>
        <Link to="/upload" className={linkClass("/upload")} onClick={close}>
          <Upload size={20} />
          Subir documento
        </Link>
        <Link to="/ask" className={linkClass("/ask")} onClick={close}>
          <MessageCircle size={20} />
          Preguntar
        </Link>
      </nav>

      <button
        onClick={() => {
          close?.();
          // lógica de logout si aplica
        }}
        className="mt-auto text-gray-400 hover:text-red-400 flex items-center gap-2"
      >
        <LogOut size={18} />
        Cerrar sesión
      </button>
    </div>
  );
};

export default Sidebar;
