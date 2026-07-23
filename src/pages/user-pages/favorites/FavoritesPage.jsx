import { Link } from "react-router-dom";
import { useAuthContext } from "../../../context/AuthContext";
import RequireLoginPage from "../../../components/RequireLoginPage";
import useFavorite from "./useFavorite";
import Pagination from "../../../components/pagination/Pagination";
import { Trash2, Heart } from "lucide-react";
import '../books/book.css';

export default function FavoritesPage() {
    const { isAuthenticated } = useAuthContext();
    const { isLoading, favorites, totalPage, removeFavoriteAction, isActionLoading } = useFavorite();

    return (
        <>
            {
                isAuthenticated ?
                    <>
                        <h2 className="mb-4">Sách yêu thích của bạn</h2>
                        {
                            isLoading ?
                                <div className="text-center py-5">
                                    <div className="spinner-border text-secondary mb-3" role="status">
                                        <span className="visually-hidden">Đang tải...</span>
                                    </div>
                                    <h5 className="text-muted">Đang tải dữ liệu...</h5>
                                </div>
                                :
                                favorites.length === 0 ?
                                    <div className="text-center py-5">
                                        <Heart size={48} className="text-muted mb-3" />
                                        <h4 className="text-muted">Bạn chưa có sách yêu thích nào</h4>
                                        <Link to="/books" className="btn btn-dark mt-3">Khám phá sách</Link>
                                    </div>
                                    :
                                    <div className="row">
                                        {
                                            favorites.map(favorite => {
                                                const book = favorite.book;
                                                return (
                                                    <div key={favorite.id} className="mb-4 col-12 col-md-6 col-lg-4 col-xl-3">
                                                        <div className="book-card shadow-sm">
                                                            <div className="book-card-image-wrapper">
                                                                <img
                                                                    src={book?.coverImage}
                                                                    alt={book?.title}
                                                                />
                                                                <div className="book-card-image-overlay"></div>
                                                            </div>
                                                            <div className="book-card-body">
                                                                {book?.category?.name &&
                                                                    <span className="book-card-category">{book.category.name}</span>
                                                                }
                                                                <h5 className="book-card-title">{book?.title}</h5>
                                                                <p className="book-card-author">Tác giả: {book?.author}</p>
                                                                <p className="book-card-desc">{book?.description}</p>
                                                                <div className="book-card-actions">
                                                                    <Link className="book-card-btn book-card-btn-outline" to={`/books/detail?id=${book?.id}`}>
                                                                        Xem chi tiết
                                                                    </Link>
                                                                    <button
                                                                        className="book-card-btn book-card-btn-danger"
                                                                        onClick={() => removeFavoriteAction(favorite.id)}
                                                                        disabled={isActionLoading}
                                                                    >
                                                                        <Trash2 size={16} /> Xoá
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )
                                            })
                                        }
                                        <Pagination totalPage={totalPage} />
                                    </div>
                        }
                    </>
                    :
                    <RequireLoginPage />
            }
        </>
    );
}