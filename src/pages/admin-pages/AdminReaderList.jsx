import { Search } from "lucide-react";
import Pagination from "../../components/pagination/Pagination"; // Đảm bảo đúng đường dẫn
import useAdminReaderList from "./useAdminReaderList";
import { useSearchParams } from "react-router-dom";
import { useDebouncedCallback } from "use-debounce";

export default function AdminReaderList() {
    const { readers, isLoading, totalPage, toggleLockStatus } = useAdminReaderList();
    const [searchParams, setSearchParams] = useSearchParams();

    // Lấy giá trị mặc định từ URL để đồng bộ với UI
    const defaultQuery = searchParams.get('query') || '';
    const defaultStatus = searchParams.get('status') || '';

    // Dùng Debounce để người dùng gõ xong mới set URL
    const handleSearch = useDebouncedCallback((value) => {
        const params = new URLSearchParams(searchParams);
        if (value) params.set('query', value);
        else params.delete('query');
        params.set('page', '1'); // Đổi filter thì quay về trang 1
        setSearchParams(params);
    }, 300);

    const handleFilterStatus = (e) => {
        const params = new URLSearchParams(searchParams);
        if (e.target.value) params.set('status', e.target.value);
        else params.delete('status');
        params.set('page', '1');
        setSearchParams(params);
    };

    return (
        <div>
            <div className="mb-4">
                <h2 className="fw-bold text-uppercase text-secondary fs-6 mb-1">Admin</h2>
                <h1 className="fw-bold fs-2 mb-2">Quản lý Reader</h1>
                <p className="text-muted">Tìm theo name/username, lọc active/locked và khóa/mở tài khoản Reader.</p>
            </div>

            {/* Filter Bar */}
            <div className="card border-dark shadow mb-4 rounded-4">
                <div className="card-body row g-3 p-4">
                    <div className="col-12 col-md-8 position-relative">
                        <Search className="position-absolute top-50 translate-middle-y ms-3 text-secondary" size={20} style={{ zIndex: 10 }} />
                        <input
                            type="text"
                            className="form-control border-dark ps-5 py-2"
                            placeholder="Tìm theo tên hoặc username"
                            defaultValue={defaultQuery}
                            onChange={(e) => handleSearch(e.target.value)}
                        />
                    </div>
                    <div className="col-12 col-md-4">
                        <select 
                            className="form-select border-dark py-2" 
                            defaultValue={defaultStatus} 
                            onChange={handleFilterStatus}
                        >
                            <option value="">Tất cả trạng thái</option>
                            <option value="active">Đang hoạt động</option>
                            <option value="locked">Đã khóa</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Data Table */}
            <div className="table-responsive rounded-4 shadow border border-dark mb-4 bg-white">
                <table className="table table-hover align-middle mb-0">
                    <thead className="table-dark">
                        <tr>
                            <th className="py-3 px-4">Họ tên</th>
                            <th className="py-3">Username</th>
                            <th className="py-3 text-center">Hỏng</th>
                            <th className="py-3 text-center">Mất</th>
                            <th className="py-3 text-center">Trạng thái</th>
                            <th className="py-3 text-end px-4">Thao tác</th>
                        </tr>
                    </thead>
                    <tbody>
                        {isLoading ? (
                            <tr>
                                <td colSpan="6" className="text-center py-4 fw-bold">Đang tải dữ liệu...</td>
                            </tr>
                        ) : readers.length === 0 ? (
                            <tr>
                                <td colSpan="6" className="text-center py-4 text-muted">Không tìm thấy Reader nào.</td>
                            </tr>
                        ) : (
                            readers.map((reader) => (
                                <tr key={reader.id}>
                                    <td className="px-4 fw-bold">{reader.name}</td>
                                    <td>{reader.username}</td>
                                    <td className="text-center">{reader.damaged || 0}</td>
                                    <td className="text-center">{reader.lost || 0}</td>
                                    <td className="text-center">
                                        {reader.is_active ? (
                                            <span className="badge bg-success px-3 py-2 rounded-pill">Đang hoạt động</span>
                                        ) : (
                                            <span className="badge bg-danger px-3 py-2 rounded-pill">Đã khóa</span>
                                        )}
                                    </td>
                                    <td className="text-end px-4">
                                        {reader.is_active ? (
                                            <button 
                                                onClick={() => toggleLockStatus(reader.id, reader.is_active)}
                                                className="btn btn-sm btn-outline-dark px-3 py-1 fw-medium shadow-sm"
                                            >
                                                Khóa
                                            </button>
                                        ) : (
                                            <button 
                                                onClick={() => toggleLockStatus(reader.id, reader.is_active)}
                                                className="btn btn-sm btn-outline-secondary px-3 py-1 fw-medium shadow-sm"
                                            >
                                                Mở khóa
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {totalPage > 0 && <Pagination totalPage={totalPage} />}
        </div>
    )
}