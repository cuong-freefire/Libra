import { useState } from "react";
import Pagination from "../../../components/pagination/Pagination";
import useBorrowing from "./useBorrowing"
import BorrowingReason from "./BorrowingReason";
import './borrowing.css'

export default function BorrowingTable() {
    const { isLoading, totalPage, borrowings, cancelPendingAction, isActionLoading } = useBorrowing();
    const [isShow, setIsShow] = useState(false);
    const [currentBorrowing, setCurrentBorrowing] = useState(null);
    const returnConditions = {
        normal: { name: "Đã trả", class: 'badge rounded-pill text-bg-success' },
        damaged: { name: 'Hỏng', class: 'badge rounded-pill text-bg-warning' },
        lost: { name: 'Mất', class: 'badge rounded-pill text-bg-danger' }
    }

    function formatDate(date) {
        return new Intl.DateTimeFormat('vi-VN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        }).format(new Date(date))
    }

    return (
        <>

            {
                isLoading ?
                    <>Đang tải...</>
                    :
                    borrowings.length > 0 ?
                        <div>
                            <table border={2} className="table table-bordered table-hover">
                                <thead className="table-dark">
                                    <tr>
                                        <th>ID</th>
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
                                        borrowings?.map(b => {
                                            return (
                                                <>
                                                    <tr key={b.id}>
                                                        <td>{b.id}</td>
                                                        <td>{b.book.title}</td>
                                                        <td>
                                                            <span
                                                                className={
                                                                    b.status === 'pending'
                                                                        ?
                                                                        'badge rounded-pill text-bg-info'
                                                                        :
                                                                        b.status === 'borrowing'
                                                                            ?
                                                                            'badge rounded-pill text-bg-primary'
                                                                            :
                                                                            b.status === 'cancelled'
                                                                                ?
                                                                                'badge rounded-pill text-bg-secondary'
                                                                                :
                                                                                b.status === 'rejected'
                                                                                    ?
                                                                                    'badge rounded-pill text-bg-danger'
                                                                                    :
                                                                                    returnConditions[`${b.returnCondition}`]?.class
                                                                }
                                                            >
                                                                {b.status === 'pending' ?
                                                                    'Chờ duyệt...' :
                                                                    b.status === 'borrowing' ?
                                                                        'Đang mượn' :
                                                                        b.status === 'cancelled' ?
                                                                            'Đã huỷ' :
                                                                            b.status === 'rejected' ?
                                                                                'Từ chối' :
                                                                                returnConditions[`${b.returnCondition}`]?.name}
                                                            </span>
                                                        </td>
                                                        <td>{b.borrowDate ? formatDate(b.borrowDate) : '-'}</td>
                                                        <td>{b.dueDate ? formatDate(b.dueDate) : '-'}</td>
                                                        <td>{b.returnDate ? formatDate(b.returnDate) : '-'}</td>
                                                        <td>
                                                            <button className={`btn ${(!b.rejectReason && !b.returnNote) || isActionLoading ? 'btn-outline-secondary disabled' : 'btn-outline-success'}`} onClick={() => {
                                                                setIsShow(!isShow)
                                                                setCurrentBorrowing(b)
                                                            }}>Xem</button>
                                                        </td>
                                                        <td>
                                                            <button
                                                                className={`btn ${(b.status !== 'pending') || isActionLoading ? 'btn-outline-secondary disabled' : 'btn-outline-danger'}`}
                                                                onClick={() => { cancelPendingAction(b.id) }}
                                                            >
                                                                Huỷ</button></td>
                                                    </tr>
                                                </>
                                            )
                                        })
                                    }
                                </tbody>
                            </table>
                            {/* Khi isShow = true thì hiện */}
                            {(isShow && currentBorrowing) && <BorrowingReason borrowing={currentBorrowing} onClose={() => { setIsShow(false) }} />}
                            <Pagination totalPage={totalPage} />
                        </div>
                        :
                        <>Danh sách không tồn tại</>
            }
        </>
    )
}