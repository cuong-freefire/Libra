import { BookOpen, House, LayoutDashboard, Users, Tag } from 'lucide-react';
import { BookMarked } from 'lucide-react';
import { FileText } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import './navbar.css';
import { ZodiacLibra } from 'lucide-react';
import { useAuthContext } from '../../context/AuthContext';
import UserMenu from '../user-menu/UserMenu';

export default function Navbar() {
    const { user, isAuthenticated } = useAuthContext();
    const pathName = useLocation();
    const authItem = [
        { name: "Đăng nhập", link: "/login" },
        { name: "Đăng ký", link: "/register" }
    ]
    const userItem = [
        { name: "Trang chủ", link: "/", icon: <House />, isSelect: pathName.pathname === '/' ? true : false },
        
        { name: "Sách của tôi", link: "/books", icon: <BookMarked />, isSelect: pathName.pathname.split('/')[1] === 'books' ? true : false },
        { name: "Đơn mượn", link: "/my-borrowings", icon: <FileText />, isSelect: pathName.pathname.split('/')[1] === 'my-borrowings' ? true : false }
    ]
    
    const adminItem = [
        { name: "Sách", link: "/admin/book-views", icon: <BookOpen size={20} />, isSelect: pathName.pathname === '/admin/book-views' ? true : false },
        { name: "Thể Loại", link: "/admin/categories", icon: <Tag size={20} />, isSelect: pathName.pathname === '/admin/categories' ? true : false },
        { name: "Tổng quan", link: "/admin/dashboard", icon: <LayoutDashboard size={20} />, isSelect: pathName.pathname === '/admin/dashboard' ? true : false },
        { name: "Phiếu mượn", link: "/admin/borrowing", icon: <FileText size={20} />, isSelect: pathName.pathname === '/admin/borrowing' ? true : false },
        { name: "Quản lý sách", link: "/admin/books", icon: <BookMarked size={20} />, isSelect: pathName.pathname === '/admin/books' ? true : false },
        { name: "Quản lý Reader", link: "/admin/readers", icon: <Users size={20} />, isSelect: pathName.pathname === '/admin/readers' ? true : false }
    ]
    return (
        <div className="app-navbar container-fluid bg-dark d-flex align-items-center py-2 m-0 fixed-top row">
            <div className='col-2 d-flex align-items-center gap-2'>
                <span className='bg-success px-2 py-1 rounded-2 rainbow'>
                    <ZodiacLibra size={22} />
                </span>
                <span className='text-light'><h1 className="m-0 fs-2">Libra</h1></span>
            </div>
            <ul className='d-flex justify-content-evenly align-items-center m-0 p-0 col-8 list-unstyled'>
                {(user && user.role === 'reader') || !user ?
                    userItem.map(item =>
                        <li key={item.name} className={`navItem py-2 px-2 ${item.isSelect ? 'border border-white rounded' : ''}`}>
                            <Link to={item.link} className='text-decoration-none text-light'>
                                <span className='me-2'>{item.icon}</span>
                                <span>{item.name}</span>
                            </Link>
                        </li>
                    ) :
                    adminItem.map(item =>
                        <li key={item.name} className={`navItem py-2 px-2 ${item.isSelect ? 'border border-white rounded' : ''}`}>
                            <Link to={item.link} className='text-decoration-none text-light'>
                                <span className='me-2'>{item.icon}</span>
                                <span>{item.name}</span>
                            </Link>
                        </li>
                    )
                }
            </ul >
            <div className='col-2 d-flex justify-content-end'>
                {isAuthenticated && user ?
                    <UserMenu user={user} />
                    :
                    <ul className='d-flex align-items-center gap-3 m-0 p-0 w-auto list-unstyled'>
                        {authItem.map(item =>
                            <li key={item.name} className='navItem py-2 px-1'>
                                <Link to={item.link} className='text-decoration-none text-light'>
                                    <span>{item.name}</span>
                                </Link>
                            </li>
                        )
                        }
                    </ul>
                }
            </div>
        </div >
    )
}
