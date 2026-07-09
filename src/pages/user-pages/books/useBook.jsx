import { useEffect, useState } from "react";
import { getBookList } from "../../../services/bookService";
import { useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";

export default function useBook() {

    const [searchParams] = useSearchParams();
    const page = Number(searchParams.get('page')) || 1;
    const query = searchParams.get('query') || '';
    const category = searchParams.get('category') || 0;
    const limit = 20;
    const [totalPage, setTotalPage] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [books, setBooks] = useState([]);

    useEffect(() => {
        async function fetchData() {
            try {
                setIsLoading(true);
                const res = await getBookList(page, limit, query, category);
                console.log("API Response of BookList:", res.data);
                setBooks(res.data);
                setTotalPage(res.totalPage);
            }
            catch (error) {
                setBooks([]);
                setTotalPage(0);
                toast.error(error.message || 'Đăng nhập thất bại.');
                toast.clearWaitingQueue(); // Clear những toast trong hàng chờ khác
                console.log("Lấy danh sách books thất bại.")
            }
            finally {
                setIsLoading(false);
            }
        }
        fetchData();
    }, [page, query, category])

    return { books, isLoading, totalPage }
}