
import { axiosApi } from "../api/axios";

export async function LoginService(data) {
    try {
        const res = await axiosApi.get('users', {
            params: {
                username: data.username,
                password: data.password
            }
        })

        const user = res.data[0]; //get sẽ trả về một mảng các object tìm được 

        if (!user) {
            throw new Error('Tài khoản hoặc mật khẩu không đúng.')
        }

        return {
            id: user.id,
            username: user.username,
            name: user.name,
            image: user.image,
            role: user.role,
            hasPassword: !!user.password,
            isActive: user.is_active
        };
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

export async function RegisterService(data) {
    try {
        const existedUser = await axiosApi.get('users', {
            params: {
                username: data.username
            }
        }
        )

        if (existedUser.data && existedUser.data.length > 0) {
            throw new Error('Tên tài khoản đã tồn tại vui lòng chọn tên khác.')
        }

        const res = await axiosApi.post('users', {
            ...data,
            role: 'reader',
            active: true
        })

        const user = res.data; // post sẽ trả về 1 object vừa tạo

        if (!user) {
            throw new Error('Đăng ký thất bại.')
        }

        return {
            id: user.id,
            username: user.username,
            name: user.name,
            image: user.image,
            role: user.role,
            hasPassword: !!user.password,
            isActive: user.is_active
        };
    }
    catch (error) {
        if (error.response?.status === 404) {
            throw new Error("Không tìm thấy API đăng ký!")
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

export function LogOut(removeUser, navigate) {
    removeUser();
    navigate('/login', {replace: true})
    console.log("Đăng xuất thành công!")
}