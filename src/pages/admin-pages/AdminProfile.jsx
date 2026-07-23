import React, { useState, useEffect } from "react";
import { useAuthContext } from "../../context/AuthContext";
import { axiosApi } from "../../api/axios";
import { toast } from "react-toastify";
import { User, Lock, Image, Save } from "lucide-react";

export default function AdminProfile() {
    const { user, saveUser } = useAuthContext();
    const [isLoading, setIsLoading] = useState(false);

    // State lưu thông tin cá nhân
    const [formData, setFormData] = useState({
        name: "",
        username: "",
        image: ""
    });

    // State lưu thông tin mật khẩu
    const [passwordData, setPasswordData] = useState({
        oldPassword: "",
        newPassword: "",
        confirmPassword: ""
    });

    // Đồng bộ dữ liệu từ Context vào Form khi trang được tải
    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name || "",
                username: user.username || "",
                image: user.image || ""
            });
        }
    }, [user]);

    // Xử lý thay đổi dữ liệu các ô nhập liệu
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handlePasswordChange = (e) => {
        const { name, value } = e.target;
        setPasswordData(prev => ({ ...prev, [name]: value }));
    };

    // Gửi yêu cầu cập nhật thông tin lên db.json
    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        
        // Trường hợp lỗi validation: Để trống trường bắt buộc
        if (!formData.name.trim() || !formData.username.trim()) {
            toast.error("Tên hiển thị và tên đăng nhập không được để trống!");
            return;
        }

        setIsLoading(true);
        try {
            // Lấy thông tin tài khoản hiện tại từ db để kiểm tra bảo mật (nếu cần) hoặc cập nhật trực tiếp
            const response = await axiosApi.patch(`users/${user.id}`, {
                name: formData.name,
                username: formData.username,
                image: formData.image
            });

            if (response.data) {
                // Trường hợp THÀNH CÔNG: Cập nhật lại AuthContext và LocalStorage để hiển thị Avatar/Tên mới trên thanh nav
                const updatedUser = {
                    ...user,
                    name: response.data.name,
                    username: response.data.username,
                    image: response.data.image
                };
                saveUser(updatedUser);
                toast.success("Cập nhật thông tin cá nhân thành công!");
            }
        } catch (error) {
            // Trường hợp THẤT BẠI (Lỗi kết nối, trùng username, trùng ID, server sập...)
            console.error("Update profile error:", error);
            toast.error(error.response?.data?.message || "Cập nhật thất bại. Vui lòng thử lại!");
        } finally {
            setIsLoading(false);
        }
    };

    // Gửi yêu cầu đổi mật khẩu
    const handleUpdatePassword = async (e) => {
        e.preventDefault();
        const { oldPassword, newPassword, confirmPassword } = passwordData;

        if (!oldPassword || !newPassword || !confirmPassword) {
            toast.error("Vui lòng điền đầy đủ các trường mật khẩu!");
            return;
        }

        if (newPassword !== confirmPassword) {
            toast.error("Mật khẩu mới và xác nhận mật khẩu không khớp!");
            return;
        }

        setIsLoading(true);
        try {
            // Kiểm tra mật khẩu cũ bằng cách fetch lại dữ liệu user từ db.json
            const userCheck = await axiosApi.get(`users/${user.id}`);
            
            if (userCheck.data.password !== oldPassword) {
                // Trường hợp THẤT BẠI: Sai mật khẩu cũ
                toast.error("Mật khẩu cũ không chính xác!");
                setIsLoading(false);
                return;
            }

            // Tiến hành cập nhật mật khẩu mới vào db.json
            await axiosApi.patch(`users/${user.id}`, {
                password: newPassword
            });

            toast.success("Đổi mật khẩu thành công!");
            setPasswordData({ oldPassword: "", newPassword: "", confirmPassword: "" }); // Xóa trắng form mật khẩu
        } catch (error) {
            console.error("Change password error:", error);
            toast.error("Đã xảy ra lỗi khi đổi mật khẩu!");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="container py-4">            
            {/* <div className="p-4"> */}
                <h2 className="fw-bold text-uppercase text-secondary fs-6 mb-1">Admin</h2>
                <h1 className="fw-bold fs-2 mb-2">Thông tin cá nhân</h1>
                <p className="text-muted">Quản lý tài khoản Admin của bạn.</p>
            {/* </div> */}
            <div className="row g-4">
                {/* CỘT BÊN TRÁI: ĐỔI THÔNG TIN VÀ AVATAR */}
                <div className="col-12 col-lg-7">
                    <div className="card border border-dark shadow-sm rounded-3">
                        <div className="card-header bg-dark text-light fw-bold py-3">
                            <User size={18} className="me-2" /> Thông tin cá nhân
                        </div>
                        <div className="card-body p-4">
                            <form onSubmit={handleUpdateProfile}>
                                <div className="text-center mb-4">
                                    {formData.image ? (
                                        <img 
                                            src={formData.image} 
                                            alt="Avatar Preview" 
                                            className="rounded-circle border border-secondary shadow-sm object-fit-cover mb-2"
                                            style={{ width: "120px", height: "120px" }}
                                        />
                                    ) : (
                                        <div className="rounded-circle bg-light border border-secondary d-inline-flex align-items-center justify-content-center mb-2 text-secondary fw-bold" style={{ width: "120px", height: "120px", fontSize: "3rem" }}>
                                            {formData.name?.[0]?.toUpperCase() || "A"}
                                        </div>
                                    )}
                                    {/* <p className="text-muted small mb-0">Ảnh xem trước hiển thị thời gian thực</p> */}
                                </div>

                                <div className="mb-3">
                                    <label className="form-label fw-bold">Đường dẫn ảnh đại diện (Avatar URL)</label>
                                    <div className="input-group">
                                        <span className="input-group-text border-dark bg-light"><Image size={18} /></span>
                                        <input 
                                            type="text" 
                                            className="form-control border-dark" 
                                            name="image"
                                            value={formData.image}
                                            onChange={handleInputChange}
                                            placeholder="Dán link ảnh online vào đây..."
                                        />
                                    </div>
                                </div>

                                <div className="mb-3">
                                    <label className="form-label fw-bold">Tên hiển thị</label>
                                    <input 
                                        type="text" 
                                        className="form-control border-dark" 
                                        name="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                    />
                                </div>

                                <div className="mb-4">
                                    <label className="form-label fw-bold">Tên đăng nhập (Username)</label>
                                    <input 
                                        type="text" 
                                        className="form-control border-dark" 
                                        name="username"
                                        value={formData.username}
                                        onChange={handleInputChange}
                                    />
                                </div>

                                <button 
                                    type="submit" 
                                    className="btn btn-dark w-100 d-flex align-items-center justify-content-center gap-2 py-2"
                                    disabled={isLoading}
                                >
                                    <Save size={18} /> {isLoading ? "Đang xử lý..." : "Lưu thay đổi"}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>

                {/* CỘT BÊN PHẢI: ĐỔI MẬT KHẨU */}
                <div className="col-12 col-lg-5">
                    <div className="card border border-dark shadow-sm rounded-3">
                        <div className="card-header bg-secondary text-light fw-bold py-3">
                            <Lock size={18} className="me-2" /> Đổi mật khẩu bảo mật
                        </div>
                        <div className="card-body p-4">
                            <form onSubmit={handleUpdatePassword}>
                                <div className="mb-3">
                                    <label className="form-label fw-bold">Mật khẩu hiện tại</label>
                                    <input 
                                        type="password" 
                                        className="form-control border-dark" 
                                        name="oldPassword"
                                        value={passwordData.oldPassword}
                                        onChange={handlePasswordChange}
                                        placeholder="••••••••"
                                    />
                                </div>

                                <hr className="my-3 text-secondary" />

                                <div className="mb-3">
                                    <label className="form-label fw-bold">Mật khẩu mới</label>
                                    <input 
                                        type="password" 
                                        className="form-control border-dark" 
                                        name="newPassword"
                                        value={passwordData.newPassword}
                                        onChange={handlePasswordChange}
                                        placeholder="Tối thiểu 6 ký tự"
                                    />
                                </div>

                                <div className="mb-4">
                                    <label className="form-label fw-bold">Xác nhận mật khẩu mới</label>
                                    <input 
                                        type="password" 
                                        className="form-control border-dark" 
                                        name="confirmPassword"
                                        value={passwordData.confirmPassword}
                                        onChange={handlePasswordChange}
                                        placeholder="Nhập lại mật khẩu mới"
                                    />
                                </div>

                                <button 
                                    type="submit" 
                                    className="btn btn-outline-dark w-100 py-2"
                                    disabled={isLoading}
                                >
                                    {isLoading ? "Đang cập nhật..." : "Xác nhận đổi mật khẩu"}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}