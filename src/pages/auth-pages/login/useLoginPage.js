import { useForm } from 'react-hook-form'
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginFormObject } from './LoginFormSchema';
import { LoginService } from '../../../services/authService';
import { useAuthContext } from '../../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { toast } from "react-toastify";
import { useState } from 'react';

export default function useLoginPage() {
    const { saveUser } = useAuthContext();
    const [isLoading, setIsLoading] = useState(false);

    const navigate = useNavigate();
    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm({
        resolver: zodResolver(LoginFormObject)
    })

    async function onSubmit(data) {
        try {
            setIsLoading(true);
            const user = await LoginService(data);
            saveUser(user);
            console.log("Đăng nhập thành công: ", user.name);
            //Chỉnh sửa để sau khi đăng nhập admin thì chuyển sang trang dashboard.
            if (user.role === "admin") {
                navigate("/admin/dashboard", { replace: true });
            } else {
            navigate('/', { replace: true });
            }
        }catch (error) {
            toast.error(error.message || 'Đăng nhập thất bại.');
            toast.clearWaitingQueue(); // Clear những toast trong hàng chờ khác
            console.log("Đăng nhập thất bại.")
        }
        finally {
            setIsLoading(false);
        }
    }

    const submitHandler = handleSubmit(onSubmit);

    return { register, errors, submitHandler, isLoading }
}
