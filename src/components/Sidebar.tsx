import { Link, useLocation } from "react-router-dom";
import { Upload, MessageCircle, LogOut } from "lucide-react";
import { logout } from "@/services/auth";
import { useNavigate } from "react-router-dom";

const Sidebar = ({ close }: { close?: () => void }) => {
  const location = useLocation();

  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const linkClass = (path: string) =>
    `flex items-center gap-3 px-4 py-2 rounded-lg transition-all ${
      location.pathname === path
        ? "bg-gray-800 text-white"
        : "text-gray-300 hover:bg-gray-800 hover:text-white"
    }`;

  return (
    <div className="w-64 h-full bg-gray-900 text-white flex flex-col p-6">
      <h1 className="text-xl font-bold mb-10 tracking-wide text-center">IA Assistant Document</h1>

      <nav className="flex flex-col gap-3 flex-1">
        {/* <Link to="/dashboard" className={linkClass("/dashboard")} onClick={close}>
          <LayoutDashboard size={20} />
          Dashboard
        </Link> */}
        <Link to="/upload" className={linkClass("/upload")} onClick={close}>
          <Upload size={20} />
          Upload document
        </Link>
        <Link to="/ask" className={linkClass("/ask")} onClick={close}>
          <MessageCircle size={20} />
          Ask
        </Link>
      </nav>

      <button
        onClick={handleLogout}
        className="mt-auto text-gray-400 hover:text-red-400 flex items-center gap-2"
      >
        <LogOut size={18} />
        Logout
      </button>
    </div>
  );
};

export default Sidebar;
