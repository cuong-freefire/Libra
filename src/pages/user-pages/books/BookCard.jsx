import { Link } from "react-router-dom";
import { useAuthContext } from "../../../context/AuthContext";
import { useEffect, useState } from "react";
import { cancelPending, checkBorrowingCondition, createPendingBorrowing, getPendingBorrowingByUserIdAndBookId } from "../../../services/borrowingService";
import { toast } from "react-toastify";

export default function BookCard({ book }) {
    const { isAuthenticated, user } = useAuthContext();
    const [condition, setCondition] = useState(null);
    const availableBook = (book.totalCopies - (book.borrowedCopies + book.damagedCopies + book.lostCopies));
    const [trigger, setTrigger] = useState(0)

    useEffect(() => {
        const fetchCondition = async () => {
            if (!isAuthenticated || !user?.id) {
                setCondition('none');
                return;
            }

            try {
                const data = await checkBorrowingCondition(user.id, book.id);
                if (data === 'pending') {
                    setCondition('pending')
                }
                if (data === 'borrowing') {
                    setCondition('borrowing')
                }
                if (data === 'none') {
                    setCondition('none')
                }
            }
            catch (error) {
                setCondition(null);
                toast.dismiss()
                toast.error(error.message || 'Đăng nhập thất bại.')
            }
        }
        fetchCondition()
    },
        [book.id, user?.id, isAuthenticated, trigger])

    const onCreate = async () => {
        try {
            const response = await createPendingBorrowing(user.id, book.id);
            if (response.success && response.message) {
                toast.dismiss()
                toast.success(response.message);
                setTrigger(trigger + 1);
            }
        }
        catch (error) {
            toast.dismiss();
            toast.error(error.message || 'Đăng nhập thất bại.')
        }
    }

    const oncancel = async () => {
        try {
            const data = await getPendingBorrowingByUserIdAndBookId(user.id, book.id);
            if (data.length > 0) {
                const response = await cancelPending(data[0].id)
                if (response.success && response.message) {
                    toast.dismiss()
                    toast.success(response.message);
                    setCondition(null);
                }
            }
            else {
                toast.dismiss()
                toast.error('Có lỗi xảy ra');
            }
        }
        catch (error) {
            toast.dismiss()
            toast.error(error.message || 'Đăng nhập thất bại.')
        }
    }

    return (
        <div className="card border border-dark shadow" style={{ height: '36rem' }}>
            {
                availableBook <= 0 ?
                    <span className="badge pill-rounded text-bg-danger position-absolute top-0 end-0 p-2 mx-1 my-1">Hết sách</span>
                    :
                    condition === 'pending' ?
                        <span className="badge pill-rounded text-bg-info position-absolute top-0 end-0 p-2 mx-1 my-1">Chờ duyệt</span>
                        :
                        condition === 'borrowing' ?
                            <span className="badge pill-rounded text-bg-success position-absolute top-0 end-0 p-2 mx-1 my-1">Đã mượn</span>
                            :
                            <span className="badge pill-rounded text-bg-warning position-absolute top-0 end-0 p-2 mx-1 my-1">Sách khả dụng: {availableBook}</span>
            }
            <img
                className="card-img-top positon-relative"
                src={book.coverImage}
                alt={book.title}
                style={{ height: '180px' }}
            />
            <div className="card-body">
                <h5 className="card-title text-one-line">
                    {book.title}
                </h5>
                <p className="card-text text-one-line">Tác giả: {book.author}</p>
                <div className="story border border-dark rounded px-3">
                    <p className="card-text">{book.description}</p>
                </div>
                <div className="mt-5 d-flex justify-content-center alig-items-center">
                    {
                        !isAuthenticated ?
                            <Link className="btn btn-dark" to={'/login'}>Xem chi tiêt</Link>
                            :
                            (availableBook <= 0) ?
                                <div className="d-flex justify-content-center gap-3 ">
                                    <Link className="btn btn-dark" to={`/books/detail?id=${book.id}`}>Xem chi tiêt</Link>
                                    <button className="btn btn-danger" disabled>Hết sách...</button>
                                </div>
                                :
                                (condition === 'pending') ?
                                    <div className="d-flex justify-content-center gap-3">
                                        <Link className="btn btn-dark" to={`/books/detail?id=${book.id}`}>Xem chi tiêt</Link>
                                        <button className="btn btn-danger" onClick={() => { oncancel() }}>Huỷ đơn</button>
                                    </div>
                                    :
                                    (condition === 'borrowing') ?
                                        <div className="d-flex justify-content-center gap-3 ">
                                            <Link className="btn btn-dark" to={`/books/detail?id=${book.id}`}>Xem chi tiêt</Link>
                                            <button className="btn btn-success shadow-lg">Đã mượn</button>
                                        </div>
                                        :
                                        <div className="d-flex justify-content-center gap-3 ">
                                            <Link className="btn btn-dark" to={`/books/detail?id=${book.id}`}>Xem chi tiêt</Link>
                                            <button className="btn btn-dark" onClick={() => { onCreate() }}>Mượn sách</button>
                                        </div>
                    }
                </div>
            </div>
        </div>
    )
}
