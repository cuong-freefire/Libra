import { useForm } from 'react-hook-form'
import { zodResolver } from "@hookform/resolvers/zod";
import { RegisterFormObject } from './RegisterFormSchema';
import { RegisterService } from '../../../services/authService';
import { useAuthContext } from '../../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { toast } from "react-toastify";
import { useState } from 'react';

export default function useRegisterPage() {
    const { saveUser } = useAuthContext();
    const [isLoading, setIsLoading] = useState(false);

    const navigate = useNavigate();
    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm({
        resolver: zodResolver(RegisterFormObject)
    })

    async function onSubmit(data) {
        try {
            setIsLoading(true);
            const user = await RegisterService(data);
            saveUser(user);
            toast.success("Đăng ký thành công");
            toast.clearWaitingQueue(); // Clear những toast trong hàng chờ khác   
            console.log("Đăng ký thành công: ", user.name);
            navigate('/', { replace: true });
        }
        catch (error) {
            toast.error(error.message || 'Đăng nhập thất bại.');
            toast.clearWaitingQueue(); // Clear những toast trong hàng chờ khác
            console.log("Đăng ký thất bại.")
        }
        finally {
            setIsLoading(false);
        }
    }

    const submitHandler = handleSubmit(onSubmit);

    return { register, errors, submitHandler, isLoading }
}