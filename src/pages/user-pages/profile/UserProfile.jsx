import React, { useState, useEffect } from "react";
import { useAuthContext } from "../../../context/AuthContext";
import { axiosApi } from "../../../api/axios";
import { toast } from "react-toastify";
import { User, Image, Save, Loader } from "lucide-react";

export default function UserProfile() {
    const { user, saveUser } = useAuthContext();
    const [isLoading, setIsLoading] = useState(false);

    const [formData, setFormData] = useState({
        name: "",
        image: ""
    });

    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name || "",
                image: user.image || ""
            });
        }
    }, [user]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleUpdateProfile = async (e) => {
        e.preventDefault();

        if (!formData.name.trim()) {
            toast.error("Tên hiển thị không được để trống!");
            return;
        }

        setIsLoading(true);
        try {
            const response = await axiosApi.patch(`users/${user.id}`, {
                name: formData.name,
                image: formData.image
            });

            if (response.data) {
                const updatedUser = {
                    ...user,
                    name: response.data.name,
                    image: response.data.image
                };
                saveUser(updatedUser);
                toast.success("Cập nhật thông tin cá nhân thành công!");
            }
        } catch (error) {
            console.error("Update profile error:", error);
            toast.error("Cập nhật thất bại. Vui lòng thử lại!");
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
                {/* Cột trái: Avatar + Thông tin */}
                <div
                    className="col-md-5 d-flex flex-column justify-content-center align-items-center p-5"
                    style={{ backgroundColor: "#e5e7eb", color: "#111827" }}
                >
                    {formData.image ? (
                        <img
                            src={formData.image}
                            alt="Avatar"
                            className="rounded-circle border border-secondary shadow mb-4 object-fit-cover"
                            style={{ width: "140px", height: "140px" }}
                        />
                    ) : (
                        <div
                            className="rounded-circle bg-dark d-flex align-items-center justify-content-center mb-4 text-white fw-bold"
                            style={{ width: "140px", height: "140px", fontSize: "3.5rem" }}
                        >
                            {formData.name?.[0]?.toUpperCase() || "U"}
                        </div>
                    )}
                    <h3 className="fw-bold text-center mb-1" style={{ fontWeight: "700" }}>
                        {formData.name || "Tên hiển thị"}
                    </h3>
                    <p className="text-muted small text-center mb-0" style={{ lineHeight: "1.6" }}>
                        Cập nhật ảnh đại diện và tên hiển thị.<br />
                        Thay đổi sẽ hiển thị ngay trên thanh menu.
                    </p>
                </div>

                {/* Cột phải: Form cập nhật */}
                <div
                    className="col-md-7 p-5 bg-white d-flex flex-column justify-content-center"
                    style={{ borderLeft: "1px solid #e5e7eb" }}
                >
                    <h2 className="fw-bold mb-4 fs-3" style={{ color: "#111827" }}>
                        Thông tin cá nhân
                    </h2>

                    <form onSubmit={handleUpdateProfile}>
                        {/* Avatar URL */}
                        <div className="mb-4">
                            <label
                                htmlFor="image"
                                className="form-label small fw-semibold text-muted mb-2"
                            >
                                Đường dẫn ảnh đại diện (Avatar URL)
                            </label>
                            <div className="input-group">
                                <span
                                    className="input-group-text"
                                    style={{ borderColor: "#d1d5db", backgroundColor: "#f9fafb" }}
                                >
                                    <Image size={18} />
                                </span>
                                <input
                                    type="text"
                                    className="form-control rounded-2 py-2 px-3"
                                    id="image"
                                    name="image"
                                    value={formData.image}
                                    onChange={handleInputChange}
                                    placeholder="Dán link ảnh online vào đây..."
                                    style={{ borderColor: "#d1d5db", backgroundColor: "#f9fafb" }}
                                />
                            </div>
                        </div>

                        {/* Tên hiển thị */}
                        <div className="mb-4">
                            <label
                                htmlFor="name"
                                className="form-label small fw-semibold text-muted mb-2"
                            >
                                Tên hiển thị
                            </label>
                            <input
                                type="text"
                                className="form-control rounded-2 py-2 px-3"
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                style={{ borderColor: "#d1d5db", backgroundColor: "#f9fafb" }}
                            />
                        </div>

                        {/* Nút Lưu */}
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
                                    <Loader size={18} className="animate-spin" /> Đang xử lý...
                                </>
                            ) : (
                                <>
                                    <Save size={18} /> Lưu thay đổi
                                </>
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}