import { Link, useSearchParams } from "react-router-dom";
import { ArrowLeft, Heart, SquareUserRound, BookHeart, ShelvingUnit, Telescope } from 'lucide-react';
import { useEffect, useState } from "react";
import useBookDetail from "./useBookDetail";
import './book.css'
import { useAuthContext } from "../../../context/AuthContext";
import { addFavorite, checkIsFavorite, removeFavorite } from "../../../services/favoriteService";
import { toast } from "react-toastify";

export default function BookDetail() {
    const [searchParams] = useSearchParams();
    const id = searchParams.get('id') || undefined;
    const { isLoading, book } = useBookDetail({ id: id });
    const { isAuthenticated, user } = useAuthContext();
    const [isFav, setIsFav] = useState(false);
    const [favoriteId, setFavoriteId] = useState(null);
    const [favLoading, setFavLoading] = useState(false);

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
    }, [book?.id, isAuthenticated, user?.id]);

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
    return (
        <div>
            <Link
                className="book-detail-back-btn"
                to={'/books'}
            >
                <ArrowLeft size={18} /> Quay lại
            </Link>

            <div>
                {
                    typeof id === 'undefined' || !book ?
                        <div className="text-center py-5">
                            <h4 className="text-muted">Nội dung không xác định</h4>
                        </div>
                        : isLoading ?
                            <div className="text-center py-5">
                                <div className="spinner-border text-secondary mb-3" role="status">
                                    <span className="visually-hidden">Đang tải...</span>
                                </div>
                                <h5 className="text-muted">Đang tải thông tin sách...</h5>
                            </div>
                            :
                            <div className="book-detail-card">
                                <div className="row g-0">
                                    <div className="col-md-4 book-detail-image-col">
                                        <img
                                            src={book.coverImage}
                                            alt={book.title}
                                            className="book-detail-image"
                                        />
                                    </div>
                                    <div className="col-md-8 book-detail-info-col">
                                        <div className="book-detail-header">
                                            <h1 className="book-detail-title">{book.title}</h1>
                                            {isAuthenticated &&
                                                <button
                                                    className={`book-detail-fav-btn ${isFav ? 'active' : ''}`}
                                                    onClick={handleToggleFavorite}
                                                    disabled={favLoading}
                                                >
                                                    <Heart
                                                        size={18}
                                                        fill={isFav ? '#fff' : 'none'}
                                                        color={isFav ? '#fff' : '#dc3545'}
                                                    />
                                                    {isFav ? 'Đã thích' : 'Yêu thích'}
                                                </button>
                                            }
                                        </div>
                                        {book.category?.name &&
                                            <span className="book-card-category mb-3 d-inline-block">{book.category.name}</span>
                                        }
                                        <div className="book-detail-meta-row">
                                            <div className="book-detail-meta">
                                                <SquareUserRound size={18} />
                                                <strong>Tác giả:</strong> {book.author}
                                            </div>
                                            <div className="book-detail-meta">
                                                <BookHeart size={18} />
                                                <strong>Thể loại:</strong> {book.category?.name}
                                            </div>
                                            <div className="book-detail-meta">
                                                <ShelvingUnit size={18} />
                                                <strong>Kệ:</strong> {book.shelf?.name}
                                            </div>
                                            <div className="book-detail-meta">
                                                <Telescope size={18} />
                                                <strong>Vị trí:</strong> {book.shelf?.location}
                                            </div>
                                        </div>
                                        <div className="book-detail-divider"></div>
                                        <div className="book-detail-desc-section">
                                            <h3 className="book-detail-desc-title">Mô tả</h3>
                                            <div className="book-detail-desc">
                                                <p className="mb-0">{book.description}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                }
            </div>
        </div>
    )
}