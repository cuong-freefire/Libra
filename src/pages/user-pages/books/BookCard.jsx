import { Link } from "react-router-dom";
import { useAuthContext } from "../../../context/AuthContext";

export default function BookCard({ book }) {
    const { isAuthenticated } = useAuthContext();
    return (
        <div className="card border border-dark shadow" style={{ height: '34rem' }}>
            <img
                className="card-img-top"
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
                            <div className="d-flex justify-content-center gap-3 ">
                                <Link className="btn btn-dark" to={`/books/detail?id=${book.id}`}>Xem chi tiêt</Link>
                                <Link className="btn btn-dark" to={`#`}>Mượn sách</Link>
                            </div>
                    }
                </div>
            </div>
        </div>
    )
}