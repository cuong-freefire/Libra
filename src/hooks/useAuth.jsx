import { useState } from "react";

export default function useAuth() {
    const [user, setUser] = useState(() => {
        const savedUser = localStorage.getItem('user');
        return savedUser ? JSON.parse(savedUser) : null
    });

    // Hàm cập nhật dữ liệu của user khi đăng ký or đăng nhập
    function saveUser(userData) {
        localStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);
    }

    function removeUser() {
        localStorage.removeItem('user');
        setUser(null);
    }

    return { user, saveUser, removeUser, isAuthenticated: !!user }
}
