import { Link } from "react-router-dom";
import { useAuthContext } from "../../../context/AuthContext";
import { useEffect, useState } from "react";
import { cancelPending, checkBorrowingCondition, createPendingBorrowing, getPendingBorrowingByUserIdAndBookId } from "../../../services/borrowingService";
import { addFavorite, checkIsFavorite, removeFavorite } from "../../../services/favoriteService";
import { toast } from "react-toastify";
import { Heart } from "lucide-react";

export default function BookCard({ book }) {
    const { isAuthenticated, user } = useAuthContext();
    const [condition, setCondition] = useState(null);
    const availableBook = (book.totalCopies - (book.borrowedCopies + book.damagedCopies + book.lostCopies));
    const [trigger, setTrigger] = useState(0);
    const [isFav, setIsFav] = useState(false);
    const [favoriteId, setFavoriteId] = useState(null);
    const [favLoading, setFavLoading] = useState(false);

    useEffect(() => {
        // Khách chưa đăng nhập không có thông tin user. Chỉ kiểm tra điều kiện
        // mượn khi đã có user để tránh đọc `user.id` từ null.
        if (!isAuthenticated || !user?.id || !book?.id) {
            setCondition(null);
            return;
        }

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
        [book?.id, isAuthenticated, user?.id, trigger])

    useEffect(() => {
        if (!isAuthenticated || !user?.id || !book?.id) {
            setIsFav(false);
            setFavoriteId(null);
            return;
        }

        const fetchFavStatus = async () => {
            try {
                const { isFavorite, favoriteId } = await checkIsFavorite(user.id, book.id);
                setIsFav(isFavorite);
                setFavoriteId(favoriteId);
            } catch (error) {
                setIsFav(false);
                setFavoriteId(null);
            }
        };
        fetchFavStatus();
    }, [book?.id, isAuthenticated, user?.id, trigger]);

    const onCreate = async () => {
        try {
            const response = await createPendingBorrowing(user.id, book.id);
            if (response.success && response.message) {
                toast.dismiss()
                toast.success(response.message);
                setTrigger((current) => current + 1);
            }
        }
        catch (error) {
            toast.dismiss();
            toast.error(error.message || 'Đăng nhập thất bại.')
        }
    }

    const handleToggleFavorite = async () => {
        if (!isAuthenticated) return;
        try {
            setFavLoading(true);
            if (isFav && favoriteId) {
                const res = await removeFavorite(favoriteId);
                if (res.success) {
                    toast.dismiss();
                    toast.success(res.message);
                    setIsFav(false);
                    setFavoriteId(null);
                }
            } else {
                const res = await addFavorite(user.id, book.id);
                if (res.success) {
                    toast.dismiss();
                    toast.success(res.message);
                    setIsFav(true);
                    setFavoriteId(res.data?.id || null);
                }
            }
        } catch (error) {
            toast.dismiss();
            toast.error(error.message || 'Có lỗi xảy ra.');
        } finally {
            setFavLoading(false);
        }
    };

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

    const renderBadge = () => {
        if (availableBook <= 0) {
            return <span className="book-card-badge badge bg-danger">Hết sách</span>;
        }
        if (condition === 'pending') {
            return <span className="book-card-badge badge bg-info">Chờ duyệt</span>;
        }
        if (condition === 'borrowing') {
            return <span className="book-card-badge badge bg-success">Đã mượn</span>;
        }
        return <span className="book-card-badge badge bg-warning text-dark">Còn {availableBook}</span>;
    };

    const renderActions = () => {
        if (!isAuthenticated) {
            return (
                <div className="book-card-actions">
                    <Link className="book-card-btn book-card-btn-outline" to={'/login'}>
                        Xem chi tiết
                    </Link>
                </div>
            );
        }
        if (availableBook <= 0) {
            return (
                <div className="book-card-actions">
                    <Link className="book-card-btn book-card-btn-outline" to={`/books/detail?id=${book.id}`}>
                        Xem chi tiết
                    </Link>
                    <button className="book-card-btn book-card-btn-disabled" disabled>Hết sách</button>
                </div>
            );
        }
        if (condition === 'pending') {
            return (
                <div className="book-card-actions">
                    <Link className="book-card-btn book-card-btn-outline" to={`/books/detail?id=${book.id}`}>
                        Xem chi tiết
                    </Link>
                    <button className="book-card-btn book-card-btn-danger" onClick={() => { oncancel() }}>
                        Huỷ đơn
                    </button>
                </div>
            );
        }
        if (condition === 'borrowing') {
            return (
                <div className="book-card-actions">
                    <Link className="book-card-btn book-card-btn-outline" to={`/books/detail?id=${book.id}`}>
                        Xem chi tiết
                    </Link>
                    <button className="book-card-btn book-card-btn-success">Đã mượn</button>
                </div>
            );
        }
        return (
            <div className="book-card-actions">
                <Link className="book-card-btn book-card-btn-outline" to={`/books/detail?id=${book.id}`}>
                    Xem chi tiết
                </Link>
                <button className="book-card-btn book-card-btn-primary" onClick={() => { onCreate() }}>
                    Mượn sách
                </button>
            </div>
        );
    };

    return (
        <div className="book-card shadow-sm">
            <div className="book-card-image-wrapper">
                <img
                    src={book.coverImage}
                    alt={book.title}
                />
                <div className="book-card-image-overlay"></div>
                {isAuthenticated &&
                    <button
                        className="book-card-fav-btn"
                        onClick={handleToggleFavorite}
                        disabled={favLoading}
                        title={isFav ? 'Bỏ yêu thích' : 'Thêm yêu thích'}
                    >
                        <Heart
                            size={18}
                            fill={isFav ? '#dc3545' : 'none'}
                            color={isFav ? '#dc3545' : '#6c757d'}
                        />
                    </button>
                }
                {renderBadge()}
            </div>
            <div className="book-card-body">
                {book.category?.name &&
                    <span className="book-card-category">{book.category.name}</span>
                }
                <h5 className="book-card-title">{book.title}</h5>
                <p className="book-card-author">Tác giả: {book.author}</p>
                <p className="book-card-desc">{book.description}</p>
                {renderActions()}
            </div>
        </div>
    )
}
