import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import {
  BookOpen,
  LayoutDashboard,
  FileText,
  BookMarked,
  Users,
  ZodiacLibra,
} from "lucide-react";

import { useAuthContext } from "../context/AuthContext";
import { LogOut as LogOutAction } from "../services/authService";

export default function AdminLayout() {
  const { user, removeUser } = useAuthContext();
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { name: "Sách", link: "/admin/book-views", icon: <BookOpen size={20} /> },
    {
      name: "Tổng quan",
      link: "/admin/dashboard",
      icon: <LayoutDashboard size={20} />,
    },
    {
      name: "Phiếu mượn",
      link: "/admin/borrowing",
      icon: <FileText size={20} />,
    },
    {
      name: "Quản lý sách",
      link: "/admin/books",
      icon: <BookMarked size={20} />,
    },
    {
      name: "Quản lý Reader",
      link: "/admin/readers",
      icon: <Users size={20} />,
    },
  ];

  return (
    <div className="vh-100 bg-light overflow-hidden">
      {/* Navbar ngang */}
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark shadow px-4">
        {/* Logo */}
        <Link
          to="/admin/dashboard"
          className="navbar-brand d-flex align-items-center gap-2"
        >
          <span className="bg-success p-2 rounded-2 text-dark rainbow">
            <ZodiacLibra size={24} />
          </span>

          <h3 className="m-0 fw-bold">Libra</h3>
        </Link>

        {/* Menu */}
        <div className="collapse navbar-collapse">
          <ul className="navbar-nav mx-auto gap-2">
            {navItems.map((item) => {
              const isActive = location.pathname.includes(item.link);

              return (
                <li className="nav-item" key={item.name}>
                  <Link
                    to={item.link}
                    className={`nav-link d-flex align-items-center gap-2 px-3 py-2rounded
                                ${isActive ? "bg-secondary text-white": "text-white"}
                            `}>
                    {item.icon}
                    <span className="fw-medium">{item.name}</span>
                  </Link>
                </li>
              );
            })}
          </ul>

          {/* User + Logout */}
          <div className="d-flex align-items-center gap-3">
            <Link
              to="/admin/profile"
              className="text-decoration-none d-flex align-items-center"
            >
              {user?.image ? (
                <img
                  src={user.image}
                  alt="Admin"
                  className="rounded-circle object-fit-cover"
                  style={{
                    width: "42px",
                    height: "42px",
                  }}
                />
              ) : (
                <div
                  className="
                                            rounded-circle 
                                            bg-secondary 
                                            text-white 
                                            fw-bold 
                                            d-flex 
                                            align-items-center 
                                            justify-content-center
                                        "
                  style={{
                    width: "42px",
                    height: "42px",
                  }}
                >
                  {user?.name?.[0]?.toUpperCase()}
                </div>
              )}

              <span className="ms-2 text-white fw-semibold">{user?.name}</span>
            </Link>

            <button
              className="btn btn-outline-light btn-sm"
              onClick={() => LogOutAction(removeUser, navigate)}
            >
              Đăng xuất
            </button>
          </div>
        </div>
      </nav>

      {/* Nội dung */}
      <main
        className="overflow-auto p-5"
        style={{
          height: "calc(100vh - 76px)",
        }}
      >
        <Outlet />
      </main>
    </div>
  );
}
