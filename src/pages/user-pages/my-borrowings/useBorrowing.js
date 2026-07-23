import { useEffect, useState } from "react";
import { cancelPending, getBorrowingList } from "../../../services/borrowingService";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuthContext } from "../../../context/AuthContext";

export default function useBorrowing() {
    const [isLoading, setIsLoading] = useState(false);
    const [isActionLoading, setIsActionLoading] = useState(false);
    const [borrowings, setBorrowings] = useState([]);
    const [totalPage, setTotalPage] = useState(0);
    const [searchParams] = useSearchParams();
    const page = Number(searchParams.get('page')) || 1;
    const limit = 10;
    const query = searchParams.get('query') || '';
    const status = searchParams.get('status') || '';
    const fromDate = searchParams.get('fromDate') || '';
    const toDate = searchParams.get('toDate') || '';
    const [trigger, setTrigger] = useState(0);
    const { user, isAuthenticated } = useAuthContext();
    const navigate = useNavigate();

    // "overdue" is a virtual status — actual DB status is "borrowing"
    const apiStatus = status === 'overdue' ? 'borrowing' : status;

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/login');
            return;
        }

        async function fetchData() {
            try {
                setIsLoading(true);
                const { data, totalPage } = await getBorrowingList(page, limit, query, user?.id, apiStatus, fromDate, toDate);
                console.log('API Response of Borrowings: ', data);
                setBorrowings(data);
                setTotalPage(totalPage);
            }
            catch (error) {
                setBorrowings([]);
                setTotalPage(0);
                console.log("Lấy borrowings thất bại.")
            }
            finally {
                setIsLoading(false);
            }
        }

        fetchData();
    }, [page, query, apiStatus, fromDate, toDate, trigger, navigate, user.id, isAuthenticated])

    function isOverdue(b) {
        return b.status === 'borrowing' && b.dueDate && new Date(b.dueDate) < new Date() && !b.returnDate;
    }

    async function cancelPendingAction(borrowing_id) {
        try {
            setIsActionLoading(true)
            const res = await cancelPending(borrowing_id)
            if (res.success && res.message) {
                toast.success(res.message)
                toast.clearWaitingQueue();
                setTrigger(trigger + 1)
            }
        }
        catch (error) {
            toast.error(error.message || 'Đăng nhập thất bại.')
            toast.clearWaitingQueue();
            console.log("cancelPendingAction patch thất bại.")
        }
        finally {
            setIsActionLoading(false)
        }
    }

    return { isLoading, borrowings, totalPage, cancelPendingAction, isActionLoading, isOverdue, status }
}