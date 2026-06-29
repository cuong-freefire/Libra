import { ZodiacLibra } from "lucide-react";
import useOnlineStatus from "../../../hooks/useOnlineStatus"
import useLoginPage from "./useLoginPage"
import { Loader } from 'lucide-react';
import { Link } from "react-router-dom";
import { House } from 'lucide-react';

export default function LoginPage() {
    const { register, errors, submitHandler, isLoading } = useLoginPage();
    const isOnline = useOnlineStatus();

    return (
        <div className="container-fluid d-flex align-items-center justify-content-center min-vh-100" style={{ backgroundColor: "#f3f4f6" }}>
            <div className="row w-100 shadow-sm" style={{ maxWidth: "900px", borderRadius: "12px", overflow: "hidden" }}>

                {/* Cột trái: Giới thiệu hệ thống */}
                <div className="col-md-5 d-flex flex-column justify-content-between p-5" style={{ backgroundColor: "#e5e7eb", color: "#111827" }}>
                    <div>
                        <Link to={'/'} className="btn btn-dark mb-3"><House /> Home</Link>
                        <div className="d-flex align-items-center gap-2 mb-5">
                            <div className='col-3 d-flex align-items-center gap-2'>
                                <span className='bg-success px-2 py-2 rounded-2 rainbow'>
                                    <ZodiacLibra />
                                </span>
                                <span className='text-dark'><h1>Libra</h1></span>
                            </div>
                        </div>

                        <h1 className="fw-black display-6 mb-4" style={{ fontWeight: "800", letterSpacing: "-0.5px" }}>
                            Đăng nhập hệ thống
                        </h1>
                    </div>

                    <p className="text-secondary small mb-0" style={{ lineHeight: "1.6" }}>
                        Reader tra cứu và mượn sách.<br />
                        Admin quản lý sách, phiếu mượn và người đọc.
                    </p>
                </div>

                {/* Cột phải: Form Đăng nhập */}
                <div className="col-md-7 p-5 bg-white d-flex flex-column justify-content-center" style={{ borderLeft: "1px solid #e5e7eb" }}>
                    <h2 className="fw-bold mb-5 fs-3" style={{ color: "#111827" }}>Chào mừng trở lại</h2>

                    <form onSubmit={submitHandler}>
                        {/* Tài khoản / Email */}
                        <div className="mb-4">
                            <label htmlFor="username" className="form-label small fw-semibold text-muted mb-2">
                                Tài khoản
                            </label>
                            <input
                                type="text"
                                className={`form-control rounded-2 py-2 px-3 ${errors.username ? 'is-invalid' : ''}`}
                                id="username"
                                style={{ borderColor: "#d1d5db", backgroundColor: "#f9fafb" }}
                                {...register("username")}
                            />
                            {errors.username?.message && (
                                <div className="text-danger small mt-1">
                                    {errors.username?.message}
                                </div>
                            )}
                        </div>

                        {/* Mật khẩu */}
                        <div className="mb-4">
                            <label htmlFor="password" className="form-label small fw-semibold text-muted mb-2">
                                Mật khẩu
                            </label>
                            <input
                                type="password"
                                className={`form-control rounded-2 py-2 px-3 ${errors.password ? 'is-invalid' : ''}`}
                                id="password"
                                style={{ borderColor: "#d1d5db", backgroundColor: "#f9fafb" }}
                                {...register("password")}
                            />
                            {errors.password?.message && (
                                <div className="text-danger small mt-1">
                                    {errors.password?.message}
                                </div>
                            )}
                        </div>

                        {/* Nút hành động */}
                        <button
                            type="submit"
                            className="btn w-100 py-2.5 fw-semibold mb-3 border-0 rounded-2 transition-all"
                            style={{
                                backgroundColor: (!isOnline || isLoading) ? "#9ca3af" : "#111827",
                                color: "#ffffff",
                                fontSize: "0.95rem"
                            }}
                            disabled={!isOnline || isLoading}
                        >
                            {!isOnline ? <><Loader className="animate-spin" />  Mất kết nối</> : isLoading ? <><Loader className="animate-spin" />  Đang xử lý</> : 'Đăng nhập'}
                        </button>

                        {/* Điều hướng đăng ký */}
                        <div className="text-center mt-3">
                            <span className="text-muted small">Chưa có tài khoản? </span>
                            <a href="/register" className="text-dark small fw-bold text-decoration-underline ms-1">
                                Đăng ký
                            </a>
                        </div>
                    </form>
                </div>

            </div>
        </div>
    )
}