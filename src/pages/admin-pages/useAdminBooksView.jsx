import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { axiosApi } from "../../api/axios"; // Chỉnh lại đường dẫn cho đúng file axios của bạn
import { toast } from "react-toastify";

export default function useAdminBooksView() {
    const [searchParams] = useSearchParams();
    const page = Number(searchParams.get('page')) || 1;
    const query = searchParams.get('query') || '';
    const category = searchParams.get('category') || '';
    const status = searchParams.get('status') || '';

    const [books, setBooks] = useState([]);
    const [categories, setCategories] = useState([]);
    const [totalPage, setTotalPage] = useState(0);
    const [isLoading, setIsLoading] = useState(false);

    // Lấy danh sách thể loại cho ô Select
    useEffect(() => {
        axiosApi.get('categories')
            .then(res => setCategories(res.data))
            .catch(() => console.log("Không thể tải danh sách thể loại"));
    }, []);

    // Lấy danh sách sách dựa trên Filter
    useEffect(() => {
        async function fetchBooks() {
            setIsLoading(true);
            try {
                const params = new URLSearchParams();
                params.append('_page', page);
                params.append('_per_page', 12);
                // Lấy kèm dữ liệu thể loại và kệ sách giống hệt cách bạn làm ở BookDetail
                params.append('_embed', 'shelf');
                params.append('_embed', 'category');

                let whereClause = {};
                if (query) {
                    whereClause.or = [
                        { title: { contains: query } },
                        { author: { contains: query } }
                    ];
                }
                if (category) {
                    whereClause.categoryId = { eq: category }; 
                }
                if (status) {
                    whereClause.is_active = { eq: status === 'active' };
                }

                if (Object.keys(whereClause).length > 0) {
                    params.append('_where', JSON.stringify(whereClause));
                }

                const res = await axiosApi.get('books', { params });
                setBooks(res.data.data);
                setTotalPage(res.data.pages);
            } catch (error) {
                toast.error("Lỗi khi tải danh sách sách.");
            } finally {
                setIsLoading(false);
            }
        }
        fetchBooks();
    }, [page, query, category, status]);

    return { books, categories, isLoading, totalPage };
}