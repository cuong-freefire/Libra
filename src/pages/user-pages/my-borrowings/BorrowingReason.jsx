import './borrowing.css'
import { X } from 'lucide-react';

export default function BorrowingReason({ borrowing, onClose }) {
    return (
        <div className="borrowing-reason-overlay">
            <div className="borrowing-reason-card">
                <div className="borrowing-reason-header">
                    <h3>Lý do / Ghi chú phiếu mượn</h3>
                    <button className="borrowing-reason-close-btn" onClick={onClose}>
                        <X size={18} />
                    </button>
                </div>
                <div className="borrowing-reason-body">
                    <p className="borrowing-reason-book-title">Sách: {borrowing.book.title}</p>
                    {
                        borrowing.rejectReason ?
                            <div className="borrowing-reason-content">
                                <p>{borrowing.rejectReason}</p>
                            </div> :
                        borrowing.returnNote ?
                            <div className="borrowing-reason-content">
                                <p>{borrowing.returnNote}</p>
                            </div> :
                            <div className="borrowing-reason-content">
                                <p className="text-muted">Không có ghi chú</p>
                            </div>
                    }
                </div>
            </div>
        </div>
    )
}