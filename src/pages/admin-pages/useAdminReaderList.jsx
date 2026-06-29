import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { axiosApi } from "../../api/axios"; // Đường dẫn tuỳ vào vị trí file của bạn
import { toast } from "react-toastify";

export default function useAdminReaderList() {
    const [searchParams] = useSearchParams();
    const page = Number(searchParams.get('page')) || 1;
    const query = searchParams.get('query') || '';
    const statusFilter = searchParams.get('status') || '';
    
    const [readers, setReaders] = useState([]);
    const [totalPage, setTotalPage] = useState(0);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        async function fetchReaders() {
            setIsLoading(true);
            try {
                const conditions = {
                    _page: page,
                    _per_page: 10,
                    role: 'reader' // Chỉ lấy những user có role là reader
                };

                // Logic tìm kiếm & lọc áp dụng cho db.json
                let whereClause = {};
                if (query) {
                    whereClause.or = [
                        { name: { contains: query } },
                        { username: { contains: query } }
                    ];
                }
                if (statusFilter === 'active') {
                    whereClause.is_active = { eq: true };
                } else if (statusFilter === 'locked') {
                    whereClause.is_active = { eq: false };
                }

                if (Object.keys(whereClause).length > 0) {
                    conditions._where = JSON.stringify(whereClause);
                }

                const res = await axiosApi.get('users', { params: conditions });
                setReaders(res.data.data);
                setTotalPage(res.data.pages);
            } catch (error) {
                toast.error("Lỗi khi tải danh sách người dùng.");
            } finally {
                setIsLoading(false);
            }
        }
        fetchReaders();
    }, [page, query, statusFilter]);

    // Hàm Khoá / Mở khoá tài khoản
    const toggleLockStatus = async (id, currentStatus) => {
        try {
            await axiosApi.patch(`users/${id}`, { is_active: !currentStatus });
            toast.success(currentStatus ? "Đã khóa tài khoản!" : "Đã mở khóa tài khoản!");
            // Cập nhật state cục bộ để UI đổi ngay lập tức mà không cần gọi lại API
            setReaders(readers.map(r => r.id === id ? { ...r, is_active: !currentStatus } : r));
        } catch (error) {
            toast.error("Thao tác thất bại.");
        }
    };

    return { readers, isLoading, totalPage, toggleLockStatus };
}