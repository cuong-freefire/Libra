import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { RefreshCw } from 'lucide-react';
import { axiosApi } from '../../api/axios';
import { toast } from 'react-toastify';

function asCollection(payload) {
    if (Array.isArray(payload)) return payload;
    if (Array.isArray(payload?.data)) return payload.data;
    return [];
}

function displayDate(value) {
    if (!value) return '-';
    const [year, month, day] = String(value).slice(0, 10).split('-');
    return year ? `${day}/${month}/${year}` : '-';
}

function isOverdue(item) {
    return item.status === 'borrowing' && item.dueDate && String(item.dueDate).slice(0, 10) < new Date().toISOString().slice(0, 10);
}

const statusLabels = {
    pending: 'Chờ duyệt',
    borrowing: 'Đang mượn',
    returned: 'Đã trả',
    rejected: 'Từ chối',
    cancelled: 'Đã huỷ',
};

function Icon({ name }) {
    switch (name) {
        case 'book':
            return <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3 6.5A2.5 2.5 0 015.5 4H19" stroke="#6b7280" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><path d="M3 19.5A2.5 2.5 0 015.5 17H19" stroke="#6b7280" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
        case 'users':
            return <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M17 21v-2a4 4 0 00-4-4H7a4 4 0 00-4 4v2" stroke="#6b7280" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><circle cx="9.5" cy="7" r="3" stroke="#6b7280" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><path d="M20 8v1" stroke="#6b7280" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
        case 'clipboard':
            return <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M9 2h6v2H9z" fill="#f3f4f6"/><rect x="7" y="4" width="10" height="16" rx="2" stroke="#6b7280" strokeWidth="1.5"/></svg>
        case 'shelves':
            return <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3 6h18" stroke="#6b7280" strokeWidth="1.5" strokeLinecap="round"/><path d="M3 12h18" stroke="#6b7280" strokeWidth="1.5" strokeLinecap="round"/><path d="M3 18h18" stroke="#6b7280" strokeWidth="1.5" strokeLinecap="round"/></svg>
        case 'check':
            return <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M20 6L9 17l-5-5" stroke="#6b7280" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
        case 'thumbsDown':
            return <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M10 14V5a1 1 0 011-1h3l3 7v6a2 2 0 01-2 2H12" stroke="#6b7280" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><path d="M3 10h4v10H3z" stroke="#6b7280" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
        case 'xCircle':
            return <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="9" stroke="#6b7280" strokeWidth="1.5"/><path d="M15 9l-6 6M9 9l6 6" stroke="#6b7280" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
        case 'clock':
            return <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="9" stroke="#6b7280" strokeWidth="1.5"/><path d="M12 7v6l4 2" stroke="#6b7280" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
        case 'alert':
            return <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" stroke="#6b7280" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/><path d="M12 9v4" stroke="#6b7280" strokeWidth="1.5" strokeLinecap="round"/><path d="M12 17h.01" stroke="#6b7280" strokeWidth="1.5" strokeLinecap="round"/></svg>
        default:
            return null
    }
}

export default function AdminDashboard() {
    const [data, setData] = useState({ books: [], users: [], borrowings: [] });
    const [loading, setLoading] = useState(true);

    const loadDashboard = async () => {
        try {
            setLoading(true);
            const [booksResponse, usersResponse, borrowingResponse] = await Promise.all([
                axiosApi.get('books'),
                axiosApi.get('users'),
                axiosApi.get('borrowings'),
            ]);
            setData({
                books: asCollection(booksResponse.data),
                users: asCollection(usersResponse.data),
                borrowings: asCollection(borrowingResponse.data),
            });
        } catch (error) {
            toast.error(error.message || 'Không thể tải dữ liệu tổng quan.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { loadDashboard(); }, []);

    const { statItems, recentRequests } = useMemo(() => {
        const activeBooks = data.books.filter((book) => book.is_active !== false).length;
        const activeReaders = data.users.filter((user) => user.role === 'reader' && user.is_active !== false).length;
        const usersById = new Map(data.users.map((user) => [String(user.id), user]));
        const booksById = new Map(data.books.map((book) => [String(book.id), book]));
        const countByStatus = (currentStatus) => data.borrowings.filter((item) => item.status === currentStatus).length;
        const damagedOrLost = data.borrowings.filter((item) => item.status === 'returned' && ['damaged', 'lost'].includes(item.returnCondition)).length;

        return {
            statItems: [
                { key: 'books', label: 'Sách đang hiển thị', value: activeBooks, icon: 'book' },
                { key: 'readers', label: 'Reader đang hoạt động', value: activeReaders, icon: 'users' },
                { key: 'pending', label: 'Đơn chờ duyệt', value: countByStatus('pending'), icon: 'clipboard' },
                { key: 'borrowing', label: 'Đang mượn', value: countByStatus('borrowing'), icon: 'shelves' },
                { key: 'returned', label: 'Đã trả', value: countByStatus('returned'), icon: 'check' },
                { key: 'rejected', label: 'Từ chối', value: countByStatus('rejected'), icon: 'thumbsDown' },
                { key: 'cancelled', label: 'Đã huỷ', value: countByStatus('cancelled'), icon: 'xCircle' },
                { key: 'overdue', label: 'Quá hạn', value: data.borrowings.filter(isOverdue).length, icon: 'clock' },
                { key: 'lost', label: 'Hỏng / mất', value: damagedOrLost, icon: 'alert' },
            ],
            recentRequests: [...data.borrowings]
                .sort((first, second) => String(second.requestDate || second.createdAt || second.borrowDate || '').localeCompare(String(first.requestDate || first.createdAt || first.borrowDate || '')))
                .slice(0, 5)
                .map((item) => ({
                    ...item,
                    reader: usersById.get(String(item.userId)),
                    book: booksById.get(String(item.bookId)),
                })),
        };
    }, [data]);

    return (
        <div className="p-4">
            <div className="d-flex justify-content-between align-items-start gap-3 mb-4">
                <div>
                    <h2 className="fw-bold text-uppercase text-secondary fs-6 mb-1">Admin</h2>
                    <h1 className="fw-bold fs-2 mb-2">Tổng quan thư viện</h1>
                    <p className="text-muted mb-0">Theo dõi đơn Reader gửi, duyệt mượn và tình trạng trả sách theo thời gian thực.</p>
                </div>
                <button className="btn btn-dark d-flex align-items-center gap-2" onClick={loadDashboard} disabled={loading}>
                    <RefreshCw size={16} className={loading ? 'is-spinning' : ''} /> Làm mới
                </button>
            </div>

            <div className="row g-3">
                {statItems.map((s) => (
                    <div key={s.key} className="col-12 col-sm-6 col-md-4 col-lg-3 col-xl-2">
                        <div className="bg-white rounded-3 border p-3 h-100" style={{ minHeight: 120 }}>
                            <div className="d-flex justify-content-between align-items-start mb-2">
                                <div className="text-muted" style={{ fontSize: 14 }}>{s.label}</div>
                                <div style={{ opacity: 0.9 }}><Icon name={s.icon} /></div>
                            </div>
                            <div className="d-flex align-items-center" style={{ height: '64px' }}>
                                <div className="fw-bold" style={{ fontSize: 48, lineHeight: 1 }}>{s.value}</div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="card border mt-4 shadow-sm">
                <div className="card-header bg-white d-flex justify-content-between align-items-center">
                    <div><h2 className="h5 fw-bold mb-1">Đơn mượn mới nhất</h2><p className="text-muted small mb-0">Các đơn này được Reader tạo từ mục “Đơn mượn”.</p></div>
                    <Link className="btn btn-outline-dark btn-sm" to="/admin/borrowing">Xem tất cả phiếu</Link>
                </div>
                <div className="table-responsive">
                    <table className="table table-hover align-middle mb-0">
                        <thead className="table-light"><tr><th className="ps-3">Mã đơn</th><th>Reader</th><th>Sách</th><th>Ngày gửi</th><th>Trạng thái</th></tr></thead>
                        <tbody>
                            {loading ? <tr><td className="text-center py-4" colSpan="5">Đang tải dữ liệu...</td></tr> : recentRequests.length === 0 ? <tr><td className="text-center py-4 text-muted" colSpan="5">Chưa có đơn mượn nào.</td></tr> : recentRequests.map((item) => <tr key={item.id}>
                                <td className="ps-3">#{item.id}</td><td>{item.reader?.name || 'Reader không tồn tại'}</td><td>{item.book?.title || 'Sách không tồn tại'}</td><td>{displayDate(item.requestDate || item.createdAt || item.borrowDate)}</td><td><span className={`badge ${item.status === 'pending' ? 'text-bg-info' : item.status === 'borrowing' ? 'text-bg-primary' : item.status === 'returned' ? 'text-bg-success' : item.status === 'rejected' ? 'text-bg-danger' : 'text-bg-secondary'}`}>{statusLabels[item.status] || item.status}</span></td>
                            </tr>)}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}
