import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Pagination from "../../../components/pagination/Pagination";
import useBorrowing from "./useBorrowing"
import BorrowingReason from "./BorrowingReason";
import './borrowing.css'
import { BookOpen, Filter, Search } from 'lucide-react';

const STATUS_TABS = [
    { key: '', label: 'Tất cả' },
    { key: 'borrowing', label: 'Đang mượn' },
    { key: 'pending', label: 'Chờ duyệt' },
    { key: 'overdue', label: 'Quá hạn' },
    { key: 'returned', label: 'Đã trả' },
    { key: 'cancelled', label: 'Đã huỷ' },
    { key: 'rejected', label: 'Từ chối' },
];

export default function BorrowingTable() {
    const { isLoading, totalPage, borrowings, cancelPendingAction, isActionLoading, isOverdue, status } = useBorrowing();
    const [isShow, setIsShow] = useState(false);
    const [currentBorrowing, setCurrentBorrowing] = useState(null);
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const returnConditions = {
        normal: { name: "Đã trả", class: 'badge rounded-pill text-bg-success' },
        damaged: { name: 'Hỏng', class: 'badge rounded-pill text-bg-warning' },
        lost: { name: 'Mất', class: 'badge rounded-pill text-bg-danger' }
    }

    const currentFromDate = searchParams.get('fromDate') || '';
    const currentToDate = searchParams.get('toDate') || '';

    function formatDate(date) {
        return new Intl.DateTimeFormat('vi-VN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        }).format(new Date(date))
    }

    function buildFilterUrl(overrides) {
        const params = new URLSearchParams(searchParams);
        Object.entries(overrides).forEach(([key, value]) => {
            if (value) {
                params.set(key, value);
            } else {
                params.delete(key);
            }
        });
        // Reset to page 1 when filter changes (unless page is explicitly set)
        if (!overrides.page) {
            params.set('page', '1');
        }
        return `?${params.toString()}`;
    }

    function handleDateApply(e) {
        e.preventDefault();
        const formData = new FormData(e.target);
        const fromDate = formData.get('fromDate') || '';
        const toDate = formData.get('toDate') || '';
        navigate(buildFilterUrl({ fromDate, toDate }));
    }

    function handleClearDate() {
        navigate(buildFilterUrl({ fromDate: '', toDate: '' }));
    }

    // Apply overdue filter client-side
    let displayBorrowings = borrowings;
    if (status === 'overdue') {
        displayBorrowings = borrowings.filter(b => isOverdue(b));
    }

    function getStatusBadge(b) {
        if (isOverdue(b)) {
            return <span className="badge rounded-pill overdue-badge">⚠️ Quá hạn</span>;
        }

        if (b.status === 'pending') {
            return <span className="borrowing-status-badge badge text-bg-info">Chờ duyệt...</span>;
        }
        if (b.status === 'borrowing') {
            return <span className="borrowing-status-badge badge text-bg-primary">Đang mượn</span>;
        }
        if (b.status === 'cancelled') {
            return <span className="borrowing-status-badge badge text-bg-secondary">Đã huỷ</span>;
        }
        if (b.status === 'rejected') {
            return <span className="borrowing-status-badge badge text-bg-danger">Từ chối</span>;
        }
        if (b.status === 'returned') {
            return <span className={`borrowing-status-badge ${returnConditions[b.returnCondition]?.class || 'badge text-bg-success'}`}>
                {returnConditions[b.returnCondition]?.name || 'Đã trả'}
            </span>;
        }
        return null;
    }

    return (
        <div className="borrowing-container">
            {/* Filter Bar */}
            <div className="filter-bar">
                <div className="filter-bar-header">
                    <Filter size={18} />
                    <span>Bộ lọc</span>
                </div>

                {/* Status Tabs */}
                <div className="filter-tabs">
                    {STATUS_TABS.map(tab => (
                        <button
                            key={tab.key}
                            onClick={() => navigate(buildFilterUrl({ status: tab.key }))}
                            className={`filter-tab ${status === tab.key ? 'active' : ''}`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Date Range Filter */}
                <form className="filter-date-form" onSubmit={handleDateApply}>
                    <div className="filter-date-group">
                        <h6>Ngày mượn: </h6>
                    </div>
                    <div className="filter-date-group">
                        <label className="filter-date-label">Từ ngày</label>
                        <input
                            type="date"
                            name="fromDate"
                            className="filter-date-input"
                            defaultValue={currentFromDate}
                        />
                    </div>
                    <div className="filter-date-group">
                        <label className="filter-date-label">Đến ngày</label>
                        <input
                            type="date"
                            name="toDate"
                            className="filter-date-input"
                            defaultValue={currentToDate}
                        />
                    </div>
                    <button type="submit" className="filter-date-btn filter-date-btn-apply">
                        <Search size={14} /> Áp dụng
                    </button>
                    {(currentFromDate || currentToDate) && (
                        <button type="button" className="filter-date-btn filter-date-btn-clear" onClick={handleClearDate}>
                            Xoá lọc
                        </button>
                    )}
                </form>
            </div>

            {/* Content */}
            {
                isLoading ?
                    <div className="borrowing-loading">
                        <div className="spinner-border text-secondary mb-3" role="status">
                            <span className="visually-hidden">Đang tải...</span>
                        </div>
                        <h5 className="text-muted">Đang tải danh sách mượn...</h5>
                    </div>
                    :
                    displayBorrowings.length > 0 ?
                        <div>
                            <div className="borrowing-card">
                                <table className="table borrowing-table">
                                    <thead>
                                        <tr>
                                            <th>STT</th>
                                            <th>Sách</th>
                                            <th>Trạng thái</th>
                                            <th>Ngày mượn</th>
                                            <th>Hạn trả</th>
                                            <th>Ngày trả</th>
                                            <th>Lý do</th>
                                            <th>Thao tác</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            displayBorrowings.map((b, i) => {
                                                const overdue = isOverdue(b);
                                                return (
                                                    <tr key={b.id} className={overdue ? 'overdue-row' : ''}>
                                                        <td>{i + 1}</td>
                                                        <td className="book-title-cell">{b.book?.title}</td>
                                                        <td>{getStatusBadge(b)}</td>
                                                        <td>{b.borrowDate ? formatDate(b.borrowDate) : '-'}</td>
                                                        <td className={overdue ? 'overdue-date' : ''}>
                                                            {b.dueDate ? formatDate(b.dueDate) : '-'}
                                                        </td>
                                                        <td>{b.returnDate ? formatDate(b.returnDate) : '-'}</td>
                                                        <td>
                                                            <button
                                                                className={`borrowing-btn borrowing-btn-info ${(!b.rejectReason && !b.returnNote) || isActionLoading ? 'disabled' : ''}`}
                                                                disabled={(!b.rejectReason && !b.returnNote) || isActionLoading}
                                                                onClick={() => {
                                                                    setIsShow(true)
                                                                    setCurrentBorrowing(b)
                                                                }}
                                                            >Xem</button>
                                                        </td>
                                                        <td>
                                                            <button
                                                                className={`borrowing-btn borrowing-btn-danger ${(b.status !== 'pending') || isActionLoading ? 'disabled' : ''}`}
                                                                disabled={(b.status !== 'pending') || isActionLoading}
                                                                onClick={() => { cancelPendingAction(b.id) }}
                                                            >Huỷ</button>
                                                        </td>
                                                    </tr>
                                                )
                                            })
                                        }
                                    </tbody>
                                </table>
                            </div>
                            {(isShow && currentBorrowing) && <BorrowingReason borrowing={currentBorrowing} onClose={() => { setIsShow(false) }} />}
                            <Pagination totalPage={totalPage} />
                        </div>
                        :
                        <div className="borrowing-empty">
                            <BookOpen size={48} />
                            <h5>Bạn chưa có phiếu mượn nào</h5>
                            <p className="text-muted">Không tìm thấy kết quả phù hợp với bộ lọc</p>
                        </div>
            }
        </div>
    )
}