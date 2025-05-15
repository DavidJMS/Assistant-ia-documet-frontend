import Sidebar from "@/components/Sidebar";
import { Outlet } from "react-router-dom";
import { Menu } from "lucide-react";
import { useState } from "react";

const DashboardLayout = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="flex min-h-screen relative">
      {/* Sidebar (desktop) */}
      <div className="hidden md:flex">
        <Sidebar />
      </div>

      {/* Sidebar (mobile) */}
      {menuOpen && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 md:hidden" onClick={() => setMenuOpen(false)}>
          <div className="w-64 bg-gray-900 h-full shadow-lg" onClick={(e) => e.stopPropagation()}>
            <Sidebar close={() => setMenuOpen(false)} />
          </div>
        </div>
      )}

      {/* Contenido principal */}
      <main className="flex-1 p-4 sm:p-6 bg-gray-100 w-full">
        {/* Botón hamburguesa solo en móvil */}
        <div className="md:hidden mb-4">
          <button
            onClick={() => setMenuOpen(true)}
            className="text-gray-700 hover:text-gray-900 focus:outline-none"
          >
            <Menu size={28} />
          </button>
        </div>

        <Outlet />
      </main>
    </div>
  );
};

export default DashboardLayout;
