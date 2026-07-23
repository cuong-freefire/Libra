import { useState } from "react"
import { LogOut, Info } from 'lucide-react';
import { Link, useNavigate } from "react-router-dom";
import { LogOut as LogOutAction } from "../../services/authService";
import { useAuthContext } from "../../context/AuthContext";
import './userMenu.css';

export default function UserMenu({ user }) {
    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate();
    const { removeUser } = useAuthContext();

    const menuItem = [
        { name: 'Thông tin cá nhân', link: '#', icon: <Info size={18} /> },
    ];

    return (
        <div className="position-relative">
            <button
                type="button"
                className="user-menu-btn"
                onClick={() => setIsOpen(!isOpen)}
                aria-label="User menu"
            >
                {user?.image ? (
                    <img
                        src={user.image}
                        alt={user.name}
                        className="user-menu-avatar"
                    />
                ) : (
                    <div className="user-menu-avatar-fallback">
                        {user?.name?.[0]?.toUpperCase()}
                    </div>
                )}
            </button>

            {isOpen && (
                <div className="user-dropdown position-absolute end-0 mt-2 p-3">
                    {/* Header: Avatar + Name */}
                    <div className="d-flex flex-column align-items-center gap-2 mb-3">
                        {user?.image ? (
                            <img
                                src={user.image}
                                alt={user.name}
                                className="user-dropdown-avatar"
                            />
                        ) : (
                            <div className="user-dropdown-avatar-fallback">
                                {user?.name?.[0]?.toUpperCase()}
                            </div>
                        )}
                        <h4 className="user-dropdown-name">{user.name}</h4>
                    </div>

                    <hr className="user-dropdown-divider mb-3" />

                    {/* Menu Items */}
                    <ul className="list-unstyled d-flex flex-column gap-2 p-0 m-0">
                        {menuItem.map(item => (
                            <li key={item.name}>
                                <Link
                                    to={item.link}
                                    className="user-dropdown-item user-dropdown-item-info"
                                >
                                    {item.icon}
                                    <span>{item.name}</span>
                                </Link>
                            </li>
                        ))}
                        <li>
                            <button
                                className="user-dropdown-item user-dropdown-item-logout"
                                onClick={() => LogOutAction(removeUser, navigate)}
                            >
                                <LogOut size={18} />
                                <span>Đăng xuất</span>
                            </button>
                        </li>
                    </ul>
                </div>
            )}
        </div>
    );
}