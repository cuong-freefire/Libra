import { Link, useSearchParams } from "react-router-dom";
import { Search as SearchIcon, Eye, Users, BookHeart, ShelvingUnit, Info } from "lucide-react";
import { useDebouncedCallback } from "use-debounce";
import Pagination from "../../components/pagination/Pagination"; // Chỉnh lại đường dẫn
import useAdminBooksView from "./useAdminBooksView";
import '../../pages/user-pages/books/book.css';

export default function AdminBooksView() {
    const { books, categories, isLoading, totalPage } = useAdminBooksView();
    const [searchParams, setSearchParams] = useSearchParams();

    // Lấy giá trị mặc định từ URL
    const defaultQuery = searchParams.get('query') || '';
    const defaultCategory = searchParams.get('category') || '';
    const defaultStatus = searchParams.get('status') || '';

    // Xử lý Input Tìm kiếm
    const handleSearch = useDebouncedCallback((value) => {
        const params = new URLSearchParams(searchParams);
        if (value) params.set('query', value);
        else params.delete('query');
        params.set('page', '1');
        setSearchParams(params);
    }, 300);

    // Xử lý Select Thể loại & Trạng thái
    const handleFilterChange = (key, value) => {
        const params = new URLSearchParams(searchParams);
        if (value) params.set(key, value);
        else params.delete(key);
        params.set('page', '1');
        setSearchParams(params);
    };

    return (
        <div>
            <div className="mb-4">
                <h2 className="fw-bold text-uppercase text-secondary fs-6 mb-1">Admin</h2>
                <h1 className="fw-bold fs-2 mb-2">Khám phá Sách</h1>
                <p className="text-muted">Giao diện quản trị danh mục sách. Lọc, xem chi tiết và theo dõi người mượn.</p>
            </div>

            {/* Thanh Tìm kiếm & Lọc (Tất cả trên 1 dòng) */}
            <div className="card border-dark shadow-sm mb-4 rounded-4">
                <div className="card-body row g-3 p-3">
                    {/* Ô Tìm kiếm */}
                    <div className="col-12 col-md-5 position-relative">
                        <SearchIcon className="position-absolute top-50 translate-middle-y ms-3 text-secondary" size={20} style={{ zIndex: 10 }} />
                        <input
                            type="text"
                            className="form-control border-dark ps-5"
                            placeholder="Tìm kiếm sách, tác giả..."
                            defaultValue={defaultQuery}
                            onChange={(e) => handleSearch(e.target.value)}
                        />
                    </div>
                    {/* Ô Lọc Thể loại */}
                    <div className="col-12 col-md-4">
                        <select 
                            className="form-select border-dark" 
                            defaultValue={defaultCategory}
                            onChange={(e) => handleFilterChange('category', e.target.value)}
                        >
                            <option value="">Tất cả thể loại</option>
                            {categories.map(cat => (
                                <option key={cat.id} value={cat.id}>{cat.name}</option>
                            ))}
                        </select>
                    </div>
                    {/* Ô Lọc Trạng thái */}
                    <div className="col-12 col-md-3">
                        <select 
                            className="form-select border-dark" 
                            defaultValue={defaultStatus}
                            onChange={(e) => handleFilterChange('status', e.target.value)}
                        >
                            <option value="">Tất cả trạng thái</option>
                            <option value="active">Đang phục vụ</option>
                            <option value="inactive">Ngưng phục vụ</option>
                        </select>
                    </div>
                </div>
            </div>
            
            {
                isLoading ?
                    <h3 className="mt-4 text-center">Đang tải dữ liệu...</h3> :
                    totalPage === 0 ?
                        <div className="mt-4 text-center text-muted">
                            <h3>Không tìm thấy cuốn sách nào phù hợp.</h3>
                        </div> :
                        <div className="row mt-4">
                            {books.map(book => (
                                <div key={book.id} className="mb-4 col-12 col-md-6 col-lg-4 col-xl-3">
                                    {/* Bỏ class height cứng để card tự co giãn theo nội dung */}
                                    <div className="card border border-dark shadow-sm h-100">
                                        <img
                                            className="card-img-top object-fit-cover p-2 rounded-4"
                                            src={book.coverImage}
                                            alt={book.title}
                                            style={{ height: '220px' }}
                                        />
                                        <div className="card-body d-flex flex-column p-3">
                                            <h5 className="card-title text-one-line fw-bold mb-1" title={book.title}>
                                                {book.title}
                                            </h5>
                                            <p className="card-text text-one-line text-muted small fw-medium mb-3">
                                                Tác giả: {book.author}
                                            </p>
                                            
                                            {/* Phần thông tin metadata giống ảnh bạn yêu cầu */}
                                            <div className="mb-3 small bg-light p-2 rounded border">
                                                <div className="d-flex align-items-center gap-2 mb-2">
                                                    <BookHeart size={16} className="text-secondary" />
                                                    <span className="text-one-line"><strong>Thể loại:</strong> {book.category?.name || 'Chưa cập nhật'}</span>
                                                </div>
                                                <div className="d-flex align-items-center gap-2 mb-2">
                                                    <ShelvingUnit size={16} className="text-secondary" />
                                                    <span className="text-one-line"><strong>Kệ:</strong> {book.shelf?.name || 'Chưa cập nhật'}</span>
                                                </div>
                                                <div className="d-flex align-items-center gap-2">
                                                    <Info size={16} className={book.is_active ? "text-success" : "text-danger"} />
                                                    <span><strong>Trạng thái:</strong> {book.is_active ? 'Đang phục vụ' : 'Đã ẩn'}</span>
                                                </div>
                                            </div>
                                            
                                            {/* Khu vực nút bấm được đẩy xuống đáy card */}
                                            <div className="mt-auto d-flex flex-column gap-2">
                                                {/* ĐIỀU HƯỚNG MỚI DÀNH RIÊNG CHO ADMIN */}
                                                <Link 
                                                    className="btn btn-outline-dark btn-sm w-100 d-flex justify-content-center align-items-center gap-2" 
                                                    to={`/admin/books/detail?id=${book.id}`}
                                                >
                                                    <Eye size={16} /> Xem chi tiết sách
                                                </Link>
                                                <Link 
                                                    className="btn btn-dark btn-sm w-100 d-flex justify-content-center align-items-center gap-2" 
                                                    to={`/admin/books/borrowers?id=${book.id}`}
                                                >
                                                    <Users size={16} /> Chi tiết người mượn
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
            }
            
            {totalPage > 0 && <Pagination totalPage={totalPage} />}
        </div>
    )
}