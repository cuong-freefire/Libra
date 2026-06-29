import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { axiosApi } from "../../api/axios";

export default function useAdminBookBorrowers() {
    const [searchParams] = useSearchParams();
    const id = searchParams.get('id');
    const [borrowers, setBorrowers] = useState([]);
    const [book, setBook] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (!id) return;
        async function fetchData() {
            setIsLoading(true);
            try {
                // 1. Lấy thông tin sách chuẩn cú pháp _where (giống hệt userService.js của bạn)
                const bookParams = new URLSearchParams();
                bookParams.append('_where', JSON.stringify({ id: { eq: id } }));
                const bookRes = await axiosApi.get('books', { params: bookParams });
                
                // Trích xuất dữ liệu sách an toàn
                if (bookRes.data && Array.isArray(bookRes.data)) {
                    setBook(bookRes.data[0]);
                } else if (bookRes.data && Array.isArray(bookRes.data.data)) {
                    setBook(bookRes.data.data[0]);
                }

                // 2. Lấy danh sách phiếu mượn
                const borrowRes = await axiosApi.get('borrowings', {
                    params: { 
                        bookId: id,
                        _expand: 'user' 
                    }
                });
                
                // Trích xuất dữ liệu người mượn an toàn (Đảm bảo luôn là Mảng để không văng lỗi .map)
                if (Array.isArray(borrowRes.data)) {
                    setBorrowers(borrowRes.data);
                } else if (borrowRes.data && Array.isArray(borrowRes.data.data)) {
                    setBorrowers(borrowRes.data.data);
                } else {
                    setBorrowers([]);
                }

            } catch (error) {
                console.log("Không lấy được dữ liệu phiếu mượn", error);
                setBorrowers([]); // Tránh lỗi crash giao diện
            } finally {
                setIsLoading(false);
            }
        }
        fetchData();
    }, [id]);

    return { borrowers, book, isLoading };
}