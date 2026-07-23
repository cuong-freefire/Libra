import { axiosApi } from "../api/axios";

export async function getFavoritesByUser(userId, page = 1, limit = 8) {
    try {
        const res = await axiosApi.get('favorites', {
            params: {
                _where: JSON.stringify({
                    userId: { eq: userId }
                }),
                _page: page,
                _per_page: limit,
                _embed: 'book'
            }
        });

        const favorites = res.data;

        if (favorites.data.length === 0) {
            throw new Error('Bạn chưa có sách yêu thích nào.');
        }

        return {
            data: favorites.data,
            totalPage: favorites.pages
        };
    } catch (error) {
        if (error.response?.status === 404) {
            throw new Error("Không tìm thấy API!");
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

export async function addFavorite(userId, bookId) {
    const newFavorite = {
        userId: userId,
        bookId: bookId,
        createdAt: new Date().toISOString()
    };

    try {
        const response = await axiosApi.post('favorites', newFavorite);
        if (response.status === 201) {
            return {
                success: true,
                message: 'Đã thêm vào danh sách yêu thích.',
                data: response.data
            };
        }
    } catch (error) {
        if (error.response?.status === 404) {
            throw new Error("Không tìm thấy API!");
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

export async function removeFavorite(favoriteId) {
    try {
        const response = await axiosApi.delete(`favorites/${favoriteId}`);
        if (response.status === 200) {
            return {
                success: true,
                message: 'Đã xoá khỏi danh sách yêu thích.'
            };
        }
    } catch (error) {
        if (error.response?.status === 404) {
            throw new Error("Không tìm thấy API!");
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

export async function checkIsFavorite(userId, bookId) {
    try {
        const res = await axiosApi.get('favorites', {
            params: {
                _where: JSON.stringify({
                    userId: { eq: userId },
                    bookId: { eq: bookId }
                })
            }
        });

        if (res.data.length > 0) {
            return { isFavorite: true, favoriteId: res.data[0].id };
        }
        return { isFavorite: false, favoriteId: null };
    } catch (error) {
        if (error.response?.status === 404) {
            return { isFavorite: false, favoriteId: null };
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