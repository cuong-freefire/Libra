import React from 'react'

const statItems = [
    { key: 'books', label: 'Sách active', value: 11, icon: 'book' },
    { key: 'readers', label: 'Reader active', value: 8, icon: 'users' },
    { key: 'pending', label: 'Chờ duyệt', value: 1, icon: 'clipboard' },
    { key: 'borrowing', label: 'Đang mượn', value: 3, icon: 'shelves' },
    { key: 'returned', label: 'Đã trả', value: 13, icon: 'check' },
    { key: 'rejected', label: 'Từ chối', value: 10, icon: 'thumbsDown' },
    { key: 'cancelled', label: 'Đã huỷ', value: 1, icon: 'xCircle' },
    { key: 'overdue', label: 'Quá hạn', value: 3, icon: 'clock' },
    { key: 'lost', label: 'Hỏng/mất', value: 9, icon: 'alert' },
]

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
    return (
        <div className="p-4">
            <h2 className="fw-bold text-uppercase text-secondary fs-6 mb-1">Admin</h2>
            <h1 className="fw-bold fs-2 mb-2">Dashboard tổng quan</h1>
            <p className="text-muted mb-4">Theo dõi sách active, reader active và toàn bộ trạng thái phiếu mượn.</p>

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
        </div>
    )
}
