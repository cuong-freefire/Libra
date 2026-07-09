import { axiosApi } from "../api/axios";

export async function getBorrowingList(page, limit, query, userId = 0) {
    try {
        const bookWithQuery = await axiosApi.get('books', {
            params: {
                _where: JSON.stringify({
                    or: [
                        { title: { contains: query } },
                        { author: { contains: query } }
                    ]
                })
            }
        })

        console.log('bookWithQuery:', bookWithQuery)

        if (bookWithQuery.data.length === 0) {
            throw new Error("Không tìm thấy danh sách!")
        }

        const bookIds = bookWithQuery.data.map(b => b.id.toString());

        const borrowings = await axiosApi.get('borrowings', {
            params: {
                _where: JSON.stringify({
                    bookId: { in: bookIds },
                    ...(userId !== 0 && { userId: { eq: userId } })
                }),
                _page: page,
                _per_page: limit,
                _embed: 'book'
            }
        })

        // console.log('borrowings:', borrowings)

        if (borrowings.data.data.length === 0) {
            throw new Error("Không tìm thấy danh sách!")
        }
        return {
            data: borrowings.data.data,
            totalPage: borrowings.data.pages
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

export async function getPendingBorrowingByUserIdAndBookId(userId, bookId) {
    const conditions = {
        _where: JSON.stringify({
            userId: { eq: userId },
            bookId: { eq: bookId },
            status: { eq: 'pending' }
        })
    }

    try {
        const res = await axiosApi.get(`borrowings`, {
            params: conditions
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
        // console.log("Dữ liệu sau patch là: ", res.data)
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
    const conditions = {
        _where: JSON.stringify({
            'userId': { eq: userId },
            'bookId': { eq: bookId }
        })
    }

    try {
        const { data } = await axiosApi.get(`borrowings`, {
            params: conditions
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
        "borrowDate": null,
        "dueDate": null,
        "returnDate": null,
        "status": "pending",
        "rejectReason": "",
        "returnCondition": null,
        "returnNote": ""
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