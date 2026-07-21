import {
    BookOpen,
    House,
    LayoutDashboard,
    ShelvingUnit,
    Users,
    Tag,
    BookMarked,
    FileText,
    ZodiacLibra
} from "lucide-react";

import { Link, useLocation } from "react-router-dom";
import "./navbar.css";
import { useAuthContext } from "../../context/AuthContext";
import UserMenu from "../user-menu/UserMenu";

export default function Navbar() {
    const { user, isAuthenticated } = useAuthContext();
    const location = useLocation();
    const pathname = location.pathname;

    const authItem = [
        {
            name: "Đăng nhập",
            link: "/login"
        },
        {
            name: "Đăng ký",
            link: "/register"
        }
    ];

    const userItem = [
        {
            name: "Trang chủ",
            link: "/",
            icon: <House />,
            isSelect: pathname === "/"
        },
        {
            name: "Tổng quan",
            link: "/dashboard",
            icon: <LayoutDashboard />,
            isSelect: pathname === "/dashboard"
        },
        {
            name: "Sách của tôi",
            link: "/books",
            icon: <BookMarked />,
            isSelect: pathname.startsWith("/books")
        },
        {
            name: "Đơn mượn",
            link: "/my-borrowings",
            icon: <FileText />,
            isSelect: pathname.startsWith("/my-borrowings")
        }
    ];

    const adminItem = [
        {
            name: "Sách",
            link: "/admin/book-views",
            icon: <BookOpen size={20} />,
            isSelect: pathname === "/admin/book-views"
        },
        {
            name: "Thể loại",
            link: "/admin/categories",
            icon: <Tag size={20} />,
            isSelect: pathname === "/admin/categories"
        },
        {
            name: "Tổng quan",
            link: "/admin/dashboard",
            icon: <LayoutDashboard size={20} />,
            isSelect: pathname === "/admin/dashboard"
        },
        {
            name: "Phiếu mượn",
            link: "/admin/borrowing",
            icon: <FileText size={20} />,
            isSelect: pathname === "/admin/borrowing"
        },
        {
            name: "Quản lý sách",
            link: "/admin/books",
            icon: <BookMarked size={20} />,
            isSelect: pathname === "/admin/books"
        },
        {
            name: "Kệ sách",
            link: "/admin/shelves",
            icon: <ShelvingUnit size={20} />,
            isSelect: pathname === "/admin/shelves"
        },
        {
            name: "Quản lý Reader",
            link: "/admin/readers",
            icon: <Users size={20} />,
            isSelect: pathname === "/admin/readers"
        }
    ];

    const showUserMenu =
        (user && user.role === "reader") || !user;

    return (
        <div className="container-fluid bg-dark d-flex align-items-center py-3 m-0 fixed-top row">
            <div className="col-3 d-flex align-items-center gap-2">
                <span className="bg-success px-2 py-2 rounded-2 rainbow">
                    <ZodiacLibra />
                </span>

                <span className="text-light">
                    <h1>Libra</h1>
                </span>
            </div>

            <ul className="d-flex justify-content-evenly align-items-center m-0 p-0 col-6 list-unstyled">
                {showUserMenu
                    ? userItem.map(item => (
                        <li
                            key={item.name}
                            className={
                                `navItem py-3 px-3 ${
                                    item.isSelect
                                        ? "border border-white rounded"
                                        : ""
                                }`
                            }
                        >
                            <Link
                                to={item.link}
                                className="text-decoration-none text-light"
                            >
                                <span className="me-2">
                                    {item.icon}
                                </span>

                                <span>{item.name}</span>
                            </Link>
                        </li>
                    ))
                    : adminItem.map(item => (
                        <li
                            key={item.name}
                            className={
                                `navItem py-3 px-3 ${
                                    item.isSelect
                                        ? "border border-white rounded"
                                        : ""
                                }`
                            }
                        >
                            <Link
                                to={item.link}
                                className="text-decoration-none text-light"
                            >
                                <span className="me-2">
                                    {item.icon}
                                </span>

                                <span>{item.name}</span>
                            </Link>
                        </li>
                    ))
                }
            </ul>

            <div className="col-3 d-flex justify-content-end">
                {isAuthenticated && user ? (
                    <UserMenu user={user} />
                ) : (
                    <ul className="d-flex justify-content-evenly align-items-center m-0 p-0 col-6 list-unstyled">
                        {authItem.map(item => (
                            <li
                                key={item.name}
                                className="navItem py-2 px-2"
                            >
                                <Link
                                    to={item.link}
                                    className="text-decoration-none text-light"
                                >
                                    <span>{item.name}</span>
                                </Link>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
}