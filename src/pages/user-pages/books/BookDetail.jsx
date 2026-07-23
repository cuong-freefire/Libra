import { Link, useSearchParams } from "react-router-dom";
import { ArrowLeft } from 'lucide-react';
import useBookDetail from "./useBookDetail";
import './book.css'
import { SquareUserRound } from 'lucide-react';
import { BookHeart } from 'lucide-react';
import { ShelvingUnit } from 'lucide-react';
import { Telescope } from 'lucide-react';

export default function BookDetail() {
    const [searchParams] = useSearchParams();
    const id = searchParams.get('id') || undefined;
    const { isLoading, book } = useBookDetail({ id: id })
    return (
        <div>
            <div className="mb-3">
                <Link
                    className="btn btn-outline-dark pe-4"
                    to={'/books'}
                ><ArrowLeft className="me-1 pb-1" />Quay lại</Link>
            </div>

            <div>
                {
                    typeof id === 'undefined' || !book ?
                        <h1>Nội dung không xác định</h1>
                        : isLoading ?
                            <h1>Đang tải ...</h1>
                            :
                            <div className="rounded border border-dark row">
                                <div className="col col-4 px-3 py-3">
                                    <img
                                        src={book.coverImage}
                                        alt={book.title}
                                        className="img-fluid rounded"
                                    />
                                </div>
                                <div className="col col-8">
                                    <h3 className="my-3 fs-2 fw-bold">{book.title}</h3>
                                    <div>
                                        <h3><SquareUserRound /> <strong>Tác giả:</strong> {book.author}</h3>
                                        <h3><BookHeart /> <strong>Thể loại:</strong> {book.category.name}</h3>
                                        <h3><ShelvingUnit /> <strong>Kệ:</strong> {book.shelf.name}</h3>
                                        <h3><Telescope /> <strong>Vị trí:</strong> {book.shelf.location}</h3>
                                    </div>
                                    <hr></hr>
                                    <h3 className="mt-4">Mô tả: </h3>
                                    <div className="overflow border border-dark rounded mt-2 px-3 py-3">
                                        <p className="card-text">{book.description}</p>
                                    </div>
                                </div>
                            </div>
                }
            </div>
        </div>

    )
}