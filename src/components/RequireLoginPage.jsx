import { Link } from "react-router-dom";

export default function RequireLoginPage() {
    return (
        <div className="container vh-100 d-flex justify-content-center align-items-center">
            <div
                className="card shadow-lg border-0 text-center p-4"
                style={{ maxWidth: "450px", width: "100%" }}
            >
                <div className="card-body">
                    <div className="display-2 mb-3">🔒</div>

                    <h2 className="fw-bold mb-3">Bạn chưa đăng nhập</h2>

                    <p className="text-muted mb-4">
                        Bạn cần đăng nhập để truy cập và xem nội dung của trang này.
                    </p>

                    <Link to="/login" className="btn btn-primary btn-lg px-4">
                        Đăng nhập
                    </Link>
                </div>
            </div>
        </div>
    );
}