import { useState } from "react"
import { LogOut } from 'lucide-react';
import { Info } from 'lucide-react';
import { Link, useNavigate } from "react-router-dom";
import { LogOut as LogOutAction } from "../../services/authService";
import { useAuthContext } from "../../context/AuthContext";

export default function UserMenu({ user }) {
    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate();
    const { removeUser } = useAuthContext();
    const menuItem = [
        { name: 'Thông tin cá nhân', link: '#', icon: <Info />, class: 'btn btn-info text-decoration-none text-light w-100' },
    ]
    return (
        <div className="position-relative">
            <button type='button' className='btn p-0 border-0 bg-transparent' onClick={() => { setIsOpen(!isOpen) }}>
                {user?.image ? (
                    <img
                        src={user.image}
                        alt={user.name}
                        className="rounded-circle object-fit-cover"
                        style={{
                            width: "42px",
                            height: "42px"
                        }}
                    />
                ) : (
                    <div
                        className="rounded-circle bg-light text-primary fw-bold d-flex align-items-center justify-content-center"
                        style={{
                            width: "42px",
                            height: "42px",
                            fontSize: "18px"
                        }}
                    >
                        {user?.name?.[0]?.toUpperCase()}
                    </div>
                )}
            </button>

            {/* Dropdown Menu */}
            {isOpen && (
                <div className="position-absolute end-0 mt-2 bg-black rounded-4 shadow border p-3"
                    style={{
                        width: "260px",
                        zIndex: 9999
                    }}
                >
                    <div className="d-flex flex-column align-items-center justify-content-center gap-3 mb-3">
                        {user?.image ? (
                            <img
                                src={user.image}
                                alt={user.name}
                                className="rounded-circle object-fit-cover"
                                style={{
                                    width: "92px",
                                    height: "92px"
                                }}
                            />
                        ) : (
                            <div
                                className="rounded-circle bg-light text-primary fw-bold d-flex align-items-center justify-content-center"
                                style={{
                                    width: "92px",
                                    height: "92px",
                                    fontSize: "50px"
                                }}
                            >
                                {user?.name?.[0]?.toUpperCase()}
                            </div>
                        )}
                        <div>
                            <h4 className="text-light">{user.name}</h4>
                        </div>
                        <ul className="list-unstyled d-flex flex-column align-items-center justify-content-center p-0 m-0 gap-3">
                            {menuItem.map(item => <li className='w-100'>
                                <Link to={item.link} className={item.class}>{item.icon} {item.name}</Link>
                            </li>)}
                            <li className="w-100">
                                <button className="btn btn-outline-light text-decoration-none w-100" onClick={() => LogOutAction(navigate, removeUser)}><LogOut /> Đăng xuất</button>
                            </li>
                        </ul>
                    </div>
                </div>
            )}
        </div>
    )
}