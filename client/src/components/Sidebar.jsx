import { NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";

export default function Sidebar() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const linkStyle = ({ isActive }) =>
    `px-4 py-2.5 rounded-xl transition text-sm font-medium ${
      isActive
        ? "bg-slate-900 text-white shadow"
        : "text-slate-600 hover:bg-slate-100"
    }`;

  return (
    <>
      {/* MOBILE MENU BUTTON */}
      <div className="md:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setOpen(true)}
          className="bg-white shadow-md p-2 rounded-lg"
        >
          ☰
        </button>
      </div>

      {/* OVERLAY */}
      {open && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* SIDEBAR */}
      <aside
        className={`fixed top-0 left-0 h-screen w-64 bg-white z-50
        shadow-lg transform transition-transform duration-300
        ${open ? "translate-x-0" : "-translate-x-full"}
        md:translate-x-0`}
      >
        {/* HEADER */}
        <div className="p-5 border-b flex justify-between items-center">
          <h2 className="text-xl font-semibold text-slate-900">
            Inventory
          </h2>

          <button
            onClick={() => setOpen(false)}
            className="md:hidden text-slate-500"
          >
            ✕
          </button>
        </div>

        {/* NAVIGATION */}
        <nav className="flex flex-col gap-2 p-4">
          <NavLink to="/" onClick={() => setOpen(false)} className={linkStyle}>
            Dashboard
          </NavLink>

          <NavLink
            to="/products"
            onClick={() => setOpen(false)}
            className={linkStyle}
          >
            Products
          </NavLink>

          <NavLink
            to="/profile"
            onClick={() => setOpen(false)}
            className={linkStyle}
          >
            Profile
          </NavLink>
        </nav>

        {/* LOGOUT */}
        <div className="absolute bottom-6 w-full px-4">
          <button
            onClick={logout}
            className="w-full py-2.5 rounded-xl bg-red-50 text-red-600
            hover:bg-red-100 transition font-medium"
          >
            Logout
          </button>
        </div>
      </aside>
    </>
  );
}
