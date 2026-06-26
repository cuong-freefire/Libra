import { useEffect, useState } from "react";
import { getBookById } from "../../../services/userService";
import { toast } from "react-toastify";

export default function useBookDetail({ id }) {

    const [isLoading, setIsLoading] = useState(false)
    const [book, setBook] = useState(null);

    useEffect(() => {
        async function fetchData() {
            try {
                setIsLoading(true);
                const res = await getBookById(id);
                console.log('API Response of BookDetail: ', res.data)
                setBook(res.data[0]);
            }
            catch (error) {
                setBook(null);
                toast.error(error.message || 'Đăng nhập thất bại.')
                toast.clearWaitingQueue();
                console.log("Lấy detail của book thất bại.")
            }
            finally {
                setIsLoading(false);
            }
        }

        fetchData();
    }, [id])

    return { isLoading, book }
}