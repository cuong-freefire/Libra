import React, { useState } from "react";
import { useAuthContext } from "../../../context/AuthContext";
import { axiosApi } from "../../../api/axios";
import { toast } from "react-toastify";
import { Lock, Loader, ShieldCheck } from "lucide-react";

export default function ChangePassword() {
    const { user } = useAuthContext();
    const [isLoading, setIsLoading] = useState(false);

    const [passwordData, setPasswordData] = useState({
        oldPassword: "",
        newPassword: "",
        confirmPassword: ""
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setPasswordData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
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
            const userCheck = await axiosApi.get(`users/${user.id}`);

            if (userCheck.data.password !== oldPassword) {
                toast.error("Mật khẩu cũ không chính xác!");
                setIsLoading(false);
                return;
            }

            await axiosApi.patch(`users/${user.id}`, {
                password: newPassword
            });

            toast.success("Đổi mật khẩu thành công!");
            setPasswordData({ oldPassword: "", newPassword: "", confirmPassword: "" });
        } catch (error) {
            console.error("Change password error:", error);
            toast.error("Đã xảy ra lỗi khi đổi mật khẩu!");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div
            className="container-fluid d-flex align-items-center justify-content-center min-vh-100"
            style={{ backgroundColor: "#f3f4f6" }}
        >
            <div
                className="row w-100 shadow-sm"
                style={{ maxWidth: "900px", borderRadius: "12px", overflow: "hidden" }}
            >
                {/* Cột trái: Icon + Thông tin bảo mật */}
                <div
                    className="col-md-5 d-flex flex-column justify-content-center align-items-center p-5"
                    style={{ backgroundColor: "#e5e7eb", color: "#111827" }}
                >
                    <div
                        className="rounded-circle bg-dark d-flex align-items-center justify-content-center mb-4 text-white"
                        style={{ width: "100px", height: "100px" }}
                    >
                        <Lock size={40} />
                    </div>
                    <h3 className="fw-bold text-center mb-3" style={{ fontWeight: "700" }}>
                        Bảo mật tài khoản
                    </h3>
                    <p className="text-muted small text-center mb-0" style={{ lineHeight: "1.6" }}>
                        Sử dụng mật khẩu mạnh để bảo vệ tài khoản.<br />
                        Mật khẩu nên có ít nhất 6 ký tự.
                    </p>
                </div>

                {/* Cột phải: Form đổi mật khẩu */}
                <div
                    className="col-md-7 p-5 bg-white d-flex flex-column justify-content-center"
                    style={{ borderLeft: "1px solid #e5e7eb" }}
                >
                    <h2 className="fw-bold mb-4 fs-3" style={{ color: "#111827" }}>
                        Đổi mật khẩu
                    </h2>

                    <form onSubmit={handleSubmit}>
                        {/* Mật khẩu cũ */}
                        <div className="mb-3">
                            <label
                                htmlFor="oldPassword"
                                className="form-label small fw-semibold text-muted mb-2"
                            >
                                Mật khẩu hiện tại
                            </label>
                            <input
                                type="password"
                                className="form-control rounded-2 py-2 px-3"
                                id="oldPassword"
                                name="oldPassword"
                                value={passwordData.oldPassword}
                                onChange={handleChange}
                                placeholder="••••••••"
                                style={{ borderColor: "#d1d5db", backgroundColor: "#f9fafb" }}
                            />
                        </div>

                        <hr className="my-3" style={{ borderColor: "#e5e7eb" }} />

                        {/* Mật khẩu mới */}
                        <div className="mb-3">
                            <label
                                htmlFor="newPassword"
                                className="form-label small fw-semibold text-muted mb-2"
                            >
                                Mật khẩu mới
                            </label>
                            <input
                                type="password"
                                className="form-control rounded-2 py-2 px-3"
                                id="newPassword"
                                name="newPassword"
                                value={passwordData.newPassword}
                                onChange={handleChange}
                                placeholder="Tối thiểu 6 ký tự"
                                style={{ borderColor: "#d1d5db", backgroundColor: "#f9fafb" }}
                            />
                        </div>

                        {/* Xác nhận mật khẩu mới */}
                        <div className="mb-4">
                            <label
                                htmlFor="confirmPassword"
                                className="form-label small fw-semibold text-muted mb-2"
                            >
                                Xác nhận mật khẩu mới
                            </label>
                            <input
                                type="password"
                                className="form-control rounded-2 py-2 px-3"
                                id="confirmPassword"
                                name="confirmPassword"
                                value={passwordData.confirmPassword}
                                onChange={handleChange}
                                placeholder="Nhập lại mật khẩu mới"
                                style={{ borderColor: "#d1d5db", backgroundColor: "#f9fafb" }}
                            />
                        </div>

                        {/* Nút xác nhận */}
                        <button
                            type="submit"
                            className="btn w-100 py-2 fw-semibold border-0 rounded-2 d-flex align-items-center justify-content-center gap-2"
                            style={{
                                backgroundColor: isLoading ? "#9ca3af" : "#111827",
                                color: "#ffffff",
                                fontSize: "0.95rem",
                            }}
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <>
                                    <Loader size={18} className="animate-spin" /> Đang cập nhật...
                                </>
                            ) : (
                                <>
                                    <ShieldCheck size={18} /> Xác nhận đổi mật khẩu
                                </>
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}