import { axiosApi } from "../api/axios";

export async function getCategories(includeInactive = false) {
    try {
        const { data } = await axiosApi.get("categories");
        const categories = data || [];

        if (includeInactive) {
            return categories;
        }

        return categories.filter((category) => category.is_active !== false);
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