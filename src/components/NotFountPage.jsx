import { Link } from "react-router-dom";

export default function NotFoundPage() {
    return (
        <div className="container vh-100 d-flex justify-content-center align-items-center">
            <div className="text-center">
                <h1 className="display-1 fw-bold text-primary">404</h1>

                <h3 className="mb-3">Không tìm thấy trang</h3>

                <p className="text-muted mb-4">
                    Đường dẫn bạn truy cập không tồn tại hoặc đã được di chuyển.
                </p>

                <Link to="/" className="btn btn-primary">
                    Quay về trang chủ
                </Link>
            </div>
        </div>
    );
}