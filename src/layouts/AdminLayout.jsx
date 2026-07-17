import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { BookOpen, LayoutDashboard, FileText, BookMarked, Users, ZodiacLibra } from 'lucide-react';
import { useAuthContext } from "../context/AuthContext";
import { LogOut as LogOutAction } from "../services/authService";


export default function AdminLayout() {
    const { user, removeUser } = useAuthContext();
    const navigate = useNavigate();
    const location = useLocation();

    const navItems = [
        { name: "Sách", link: "/admin/book-views", icon: <BookOpen size={20} /> },
        { name: "Tổng quan", link: "/admin/dashboard", icon: <LayoutDashboard size={20} /> },
        { name: "Phiếu mượn", link: "/admin/borrowing", icon: <FileText size={20} /> },
        { name: "Quản lý sách", link: "/admin/books", icon: <BookMarked size={20} /> },
        { name: "Quản lý Reader", link: "/admin/readers", icon: <Users size={20} /> }
    ];

    return (
        <div className="d-flex vh-100 bg-light overflow-hidden">
            {/* Sidebar */}
            <div className="bg-dark text-white p-3 d-flex flex-column shadow" style={{ width: '280px', flexShrink: 0 }}>
                <div className="d-flex align-items-center gap-2 mb-4 mt-2 px-2">
                    <span className="bg-success p-2 rounded-2 rainbow text-dark">
                        <ZodiacLibra size={24} />
                    </span>
                    <h3 className="m-0 fw-bold">Libra</h3>
                </div>                
                <hr className="text-secondary" />
                
                <ul className="nav nav-pills flex-column mb-auto gap-2">
                    {navItems.map(item => {
                        const isActive = location.pathname.includes(item.link);
                        return (
                            <li className="nav-item" key={item.name}>
                                <Link 
                                    to={item.link} 
                                    className={`nav-link d-flex align-items-center gap-3 py-3 px-3 text-white ${isActive ? 'border border-white rounded bg-secondary' : 'navItem'}`}
                                >
                                    {item.icon} 
                                    <span className="fw-medium">{item.name}</span>
                                </Link>
                            </li>
                        )
                    })}
                </ul>
                
                {/* <hr className="text-secondary" /> */}

                <div className="d-flex align-items-center justify-content-between mt-2">
                    
                </div>

                <div className="border-top pt-3 mt-auto d-flex align-items-center justify-content-between">
                    <div className="d-flex align-items-center">
                        <Link to="/admin/profile" className="text-decoration-none">
                            {user?.image ? (
                                <img src={user.image} alt="Admin" className="rounded-circle object-fit-cover" style={{ width: "42px", height: "42px" }} />
                            ) : (
                        <div className="rounded-circle bg-dark text-light fw-bold d-flex align-items-center justify-content-center" style={{ width: "42px", height: "42px" }}>
                             {user?.name?.[0]?.toUpperCase()}
                        </div>
                            )}
                        </Link>
                        <span className="ms-2 fw-semibold">{user?.name}</span>
                    </div>

                    <button className="btn btn-outline-light btn-sm" onClick={() => LogOutAction(removeUser,navigate)}>Đăng xuất</button>
                </div>
                
                

            </div>

            {/* Main Content */}
            <div className="flex-grow-1 overflow-auto p-5">
                <Outlet />
            </div>
        </div>
    )
}