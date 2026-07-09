import { axiosApi } from "../api/axios";

export async function getBookList(page, limit, query, category) {
    try {
        const conditions = {
            _page: page, // Số trang hiện tại
            _per_page: limit, // Số lượng phần tử mỗi trang
            // _where chỉ chấp nhận Json Object
            _where: JSON.stringify({
                "or": [
                    { 'title': { 'contains': query } },
                    { 'description': { 'contains': query } },
                    { 'author': { 'contains': query } },
                ],
                ...(category && { categoryId: { eq: category } }),
                'is_active': { eq: true }
            })
        }
        const res = await axiosApi.get('books', {
            params: conditions
        })

        const books = res.data;

        if (books.data.length === 0) {
            throw new Error('Không tìm thấy danh sách!')
        }

        return {
            data: books.data,
            totalPage: books.pages
        }
    }
    catch (error) {
        if (error.response?.status === 404) {
            throw new Error("Không tìm thấy API đăng nhập!")
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

export async function getBookById(id) {
    const params = new URLSearchParams();
    params.append('_embed', 'shelf');
    params.append('_embed', 'category');
    // params.append('_where', `{"id":{"eq": "${id}"}}`);
    params.append('_where', JSON.stringify({
        id: { eq: id }
    }));
    console.log('Dữ liệu của Params: ', params);
    try {

        const res = await axiosApi.get('books', {
            params: params
        })

        const book = res.data;
        if (book.length === 0) {
            throw new Error('Không tìm thấy danh sách!')
        }

        return {
            data: book
        }


    }
    catch (error) {
        if (error.response?.status === 404) {
            throw new Error("Không tìm thấy API đăng nhập!")
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