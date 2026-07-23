import { axiosApi } from "../api/axios";

export async function getBorrowingList(page, limit, query, userId = 0, status = '', fromDate = '', toDate = '') {
    try {
        const conditions = {};

        // User filter
        if (userId !== 0) {
            conditions.userId = { eq: userId };
        }

        // Status filter
        if (status) {
            conditions.status = { eq: status };
        }

        // Date range filter
        const borrowDate = {};
        if (fromDate) {
            borrowDate.gte = fromDate;
        }
        if (toDate) {
            borrowDate.lte = toDate;
        }
        if (Object.keys(borrowDate).length > 0) {
            conditions.borrowDate = borrowDate;
        }

        // If query is provided, filter by book title/author first
        if (query) {
            const bookWithQuery = await axiosApi.get('books', {
                params: {
                    _where: JSON.stringify({
                        or: [
                            { title: { contains: query } },
                            { author: { contains: query } }
                        ]
                    })
                }
            });

            const bookIds = bookWithQuery.data.map(b => b.id.toString());

            if (bookIds.length === 0) {
                return { data: [], totalPage: 0 };
            }

            conditions.bookId = { in: bookIds };
        }

        const params = {
            _page: page,
            _per_page: limit,
            _sort: '-created_at',
            _embed: 'book',
            _where: JSON.stringify(conditions)
        };

        const borrowings = await axiosApi.get('borrowings', { params });

        return {
            data: borrowings.data.data || [],
            totalPage: borrowings.data.pages || 0
        };
    }
    catch (error) {
        if (error.response?.status === 404) {
            return { data: [], totalPage: 0 };
        }
        if (error.request && !error.response) {
            throw new Error("Server mất kết nối!");
        }
        if (error.code === 'ECONNABORTED') {
            throw new Error("Server phản hồi quá lâu. Vui lòng thử lại.");
        }
        throw error;
    }
}

export async function getPendingBorrowingByUserIdAndBookId(userId, bookId) {
    try {
        const res = await axiosApi.get(`borrowings`, {
            params: {
                _where: JSON.stringify({
                    userId: { eq: userId },
                    bookId: { eq: bookId },
                    status: { eq: 'pending' }
                })
            }
        })

        return res.data
    }
    catch (error) {
        if (error.response?.status === 404) {
            throw new Error("Không tìm thấy API!")
        }
        if (error.request && !error.response) {
            throw new Error("Server mất kết nối!")
        }
        if (error.code === 'ECONNABORTED') {
            throw new Error("Server phản hồi quá lâu. Vui lòng thử lại.");
        }
        throw error
    }
}

export async function cancelPending(borrowing_id) {
    const changed = {
        status: 'cancelled'
    }

    try {
        const res = await axiosApi.patch(`borrowings/${borrowing_id}`, changed)
        if (res.status === 200) {
            return {
                success: true,
                message: "Đã huỷ đơn."
            }
        }
    }
    catch (error) {
        if (error.response?.status === 404) {
            throw new Error("Không tìm thấy API!")
        }
        if (error.request && !error.response) {
            throw new Error("Server mất kết nối!")
        }
        if (error.code === 'ECONNABORTED') {
            throw new Error("Server phản hồi quá lâu. Vui lòng thử lại.");
        }
        throw error
    }
}

export async function checkBorrowingCondition(userId, bookId) {
    try {
        const { data } = await axiosApi.get(`borrowings`, {
            params: {
                _where: JSON.stringify({
                    userId: { eq: userId },
                    bookId: { eq: bookId }
                })
            }
        })

        console.log(data)

        if (data.length <= 0) {
            return 'none'
        }

        if (data.some((b) => b.status === 'pending')) {
            return 'pending'
        }

        if (data.some((b) => b.status === 'borrowing')) {
            return 'borrowing'
        }
    }
    catch (error) {
        if (error.response?.status === 404) {
            throw new Error("Không tìm thấy API!")
        }
        if (error.request && !error.response) {
            throw new Error("Server mất kết nối!")
        }
        if (error.code === 'ECONNABORTED') {
            throw new Error("Server phản hồi quá lâu. Vui lòng thử lại.");
        }
        throw error
    }
}

export async function createPendingBorrowing(userId, bookId) {
    const newPending = {
        "userId": userId,
        "bookId": bookId,
        "requestDate": new Date().toISOString().slice(0, 10),
        "borrowDate": null,
        "dueDate": null,
        "returnDate": null,
        "status": "pending",
        "rejectReason": "",
        "returnCondition": null,
        "returnNote": "",
        "created_at": new Date().toISOString()
    }
    try {
        const response = await axiosApi.post(`borrowings`, newPending)
        if (response.status === 201) {
            return {
                success: true,
                message: 'Tạo đơn thành công.'
            }
        }
    }
    catch (error) {
        if (error.response?.status === 404) {
            throw new Error("Không tìm thấy API!")
        }
        if (error.request && !error.response) {
            throw new Error("Server mất kết nối!")
        }
        if (error.code === 'ECONNABORTED') {
            throw new Error("Server phản hồi quá lâu. Vui lòng thử lại.");
        }
        throw error
    }
}