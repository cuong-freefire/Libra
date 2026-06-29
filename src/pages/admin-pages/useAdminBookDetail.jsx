import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { axiosApi } from "../../api/axios";
import { toast } from "react-toastify";

export default function useAdminBookDetail() {
    const [searchParams] = useSearchParams();
    const id = searchParams.get('id');
    const [book, setBook] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (!id) return;
        async function fetchBook() {
            setIsLoading(true);
            try {
                const params = new URLSearchParams();
                // Lấy kèm dữ liệu kệ sách và thể loại
                params.append('_embed', 'shelf');
                params.append('_embed', 'category');
                
                // SỬ DỤNG CHUẨN _where NHƯ BÊN LUỒNG READER CỦA BẠN
                params.append('_where', JSON.stringify({ id: { eq: id } }));

                const res = await axiosApi.get('books', { params });
                
                // Trích xuất dữ liệu trả về an toàn để tránh lỗi
                let bookData = null;
                if (res.data && Array.isArray(res.data) && res.data.length > 0) {
                    bookData = res.data[0];
                } else if (res.data && Array.isArray(res.data.data) && res.data.data.length > 0) {
                    bookData = res.data.data[0];
                }

                setBook(bookData);
            } catch (error) {
                toast.error("Lỗi khi tải chi tiết sách.");
                console.error("Fetch book detail error:", error);
            } finally {
                setIsLoading(false);
            }
        }
        fetchBook();
    }, [id]);

    return { book, isLoading };
}