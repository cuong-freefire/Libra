import { ArrowLeft, SquareUserRound, BookHeart, ShelvingUnit, Telescope } from 'lucide-react';
import useAdminBookDetail from "./useAdminBookDetail";
import '../../pages/user-pages/books/book.css'; // Dùng lại CSS cũ
import { useNavigate } from "react-router-dom";

export default function AdminBookDetail() {
    const { isLoading, book } = useAdminBookDetail();
    const navigate = useNavigate();

    return (
        <div>
            <div className="mb-4">
                <button className="btn btn-outline-dark pe-4 d-inline-flex align-items-center gap-2" 
                    onClick={() => navigate(-1)}>
                    <ArrowLeft size={18} /> Quay lại
                </button>
            </div>

            <div>
                {!book && !isLoading ? (
                    <h2 className="text-muted">Không tìm thấy thông tin cuốn sách này.</h2>
                ) : isLoading ? (
                    <h2>Đang tải dữ liệu...</h2>
                ) : (
                    <div className="rounded-4 border border-dark row g-0 shadow-sm bg-white overflow-hidden">
                        <div className="col-12 col-md-4 p-4 d-flex justify-content-center bg-light border-end border-dark">
                            <img
                                src={book.coverImage}
                                alt={book.title}
                                className="img-fluid rounded border border-secondary shadow-sm"
                                style={{ maxHeight: '400px', objectFit: 'cover' }}
                            />
                        </div>
                        <div className="col-12 col-md-8 p-4 d-flex flex-column">
                            <div className="d-flex justify-content-between align-items-start mb-3">
                                <h3 className="fs-2 fw-bold text-dark mb-0">{book.title}</h3>
                                <span className={`badge ${book.is_active ? 'bg-success' : 'bg-danger'} px-3 py-2 fs-6 rounded-pill`}>
                                    {book.is_active ? 'Đang phục vụ' : 'Đã ẩn'}
                                </span>
                            </div>
                            
                            <div className="d-flex flex-column gap-3 mb-4 mt-2">
                                <div className="d-flex align-items-center gap-2 fs-5">
                                    <SquareUserRound className="text-secondary" /> <strong>Tác giả:</strong> {book.author}
                                </div>
                                <div className="d-flex align-items-center gap-2 fs-5">
                                    <BookHeart className="text-secondary" /> <strong>Thể loại:</strong> {book.category?.name || 'N/A'}
                                </div>
                                <div className="d-flex align-items-center gap-2 fs-5">
                                    <ShelvingUnit className="text-secondary" /> <strong>Kệ:</strong> {book.shelf?.name || 'N/A'}
                                </div>
                                <div className="d-flex align-items-center gap-2 fs-5">
                                    <Telescope className="text-secondary" /> <strong>Vị trí:</strong> {book.shelf?.location || 'N/A'}
                                </div>
                                <div className="d-flex align-items-center gap-2 fs-5">
                                    <span className="fw-bold">Số lượng trong kho:</span> <span className="text-primary fw-bold fs-4">{book.quantity || 0}</span>
                                </div>
                            </div>
                            <hr />
                            <h4 className="mt-2 fw-bold">Mô tả: </h4>
                            <div className="overflow border border-secondary rounded bg-light p-3 flex-grow-1" style={{ maxHeight: '200px' }}>
                                <p className="card-text text-justify" style={{ lineHeight: '1.8' }}>{book.description}</p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}