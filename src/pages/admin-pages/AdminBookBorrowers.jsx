import { useNavigate } from "react-router-dom";
import { ArrowLeft, UserSearch } from 'lucide-react';
import useAdminBookBorrowers from "./useAdminBookBorrowers";

export default function AdminBookBorrowers() {
    const { borrowers, book, isLoading } = useAdminBookBorrowers();
    const navigate = useNavigate();
    return (
        <div>
            <div className="mb-4">
                <button 
                    className="btn btn-outline-dark pe-4 d-inline-flex align-items-center gap-2" 
                    onClick={() => navigate(-1)}
                >
                    <ArrowLeft size={18} /> Quay lại
                </button>
            </div>

            <div className="mb-4">
                <h2 className="fw-bold text-uppercase text-secondary fs-6 mb-1">Admin</h2>
                <h1 className="fw-bold fs-2 mb-2">Chi tiết người mượn</h1>
                {book && <p className="text-muted fs-5">Sách: <strong className="text-dark">{book.title}</strong></p>}
            </div>

            {isLoading ? (
                <h3>Đang tải dữ liệu...</h3>
            ) : (
                <div className="table-responsive rounded-4 shadow border border-dark bg-white">
                    <table className="table table-hover align-middle mb-0">
                        <thead className="table-dark">
                            <tr>
                                <th className="py-3 px-4">Họ và tên</th>
                                <th className="py-3">Username</th>
                                <th className="py-3">Ngày mượn</th>
                                <th className="py-3">Hạn trả</th>
                                <th className="py-3 text-center">Trạng thái phiếu</th>
                                <th className="py-3 text-end px-4">Thông tin</th>
                            </tr>
                        </thead>
                        <tbody>
                            {borrowers.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="text-center py-5 text-muted">
                                        <UserSearch size={40} className="mb-3 text-secondary" /><br />
                                        Hiện tại chưa có độc giả nào mượn cuốn sách này.
                                    </td>
                                </tr>
                            ) : (
                                borrowers.map((record) => (
                                    <tr key={record.id}>
                                        <td className="px-4 fw-bold">{record.user?.name || 'Không xác định'}</td>
                                        <td>{record.user?.username || 'N/A'}</td>
                                        <td>{record.borrowDate || 'Chưa cập nhật'}</td>
                                        <td>{record.dueDate || 'Chưa cập nhật'}</td>
                                        <td className="text-center">
                                            <span className={`badge ${record.status === 'returned' ? 'bg-secondary' : 'bg-warning text-dark'} px-3 py-2 rounded-pill`}>
                                                {record.status === 'returned' ? 'Đã trả' : 'Đang mượn'}
                                            </span>
                                        </td>
                                        <td className="text-end px-4">
                                            {/* Link này có thể trỏ về trang chi tiết user hoặc lịch sử user */}
                                            <button className="btn btn-sm btn-outline-dark px-3 shadow-sm">Xem độc giả</button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    )
}