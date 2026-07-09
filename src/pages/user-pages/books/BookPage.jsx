
import Pagination from "../../../components/pagination/Pagination";
import Search from "../../../components/search/Search";
import useBook from "./useBook"
import BookCard from "./BookCard";
import './book.css'
import CategoryFilter from "../../../components/category-filter/CategoryFilter";

export default function BookPage() {
    const { books, isLoading, totalPage } = useBook();
    return (
        <div>
            <Search placeholder={'Nội dung tìm kiếm...'} />
            <CategoryFilter/>
            {
                isLoading ?
                    <h1>Đang tải dữ liệu...</h1> :
                    totalPage === 0 ?
                        <div>
                            <h3>Hiện chưa có đầu sách nào.</h3>
                        </div> :

                        <div className="row">
                            {
                                books.map(book => {
                                    return (
                                        <div key={book.id} className="mb-5 col-12 col-md-6 col-lg-4 col-xl-3">
                                            <BookCard book={book} />
                                        </div>
                                    )
                                })
                            }
                            <Pagination totalPage={totalPage} />
                        </div>
            }
        </div>
    )
}