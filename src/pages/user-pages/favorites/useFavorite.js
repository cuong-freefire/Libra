import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuthContext } from "../../../context/AuthContext";
import { getFavoritesByUser, removeFavorite } from "../../../services/favoriteService";

export default function useFavorite() {
    const [isLoading, setIsLoading] = useState(false);
    const [isActionLoading, setIsActionLoading] = useState(false);
    const [favorites, setFavorites] = useState([]);
    const [totalPage, setTotalPage] = useState(0);
    const [searchParams] = useSearchParams();
    const page = Number(searchParams.get('page')) || 1;
    const limit = 8;
    const [trigger, setTrigger] = useState(0);
    const { user, isAuthenticated } = useAuthContext();
    const navigate = useNavigate();

    useEffect(() => {
        async function fetchData() {
            try {
                setIsLoading(true);
                if (!isAuthenticated) {
                    navigate('/login');
                    return;
                }
                const { data, totalPage } = await getFavoritesByUser(user?.id, page, limit);
                setFavorites(data);
                setTotalPage(totalPage);
            }
            catch (error) {
                setFavorites([]);
                setTotalPage(0);
            }
            finally {
                setIsLoading(false);
            }
        }

        fetchData();
    }, [page, trigger, navigate, user?.id, isAuthenticated]);

    async function removeFavoriteAction(favoriteId) {
        try {
            setIsActionLoading(true);
            const res = await removeFavorite(favoriteId);
            if (res.success && res.message) {
                toast.success(res.message);
                toast.clearWaitingQueue();
                setTrigger(trigger + 1);
            }
        }
        catch (error) {
            toast.error(error.message || 'Có lỗi xảy ra.');
            toast.clearWaitingQueue();
        }
        finally {
            setIsActionLoading(false);
        }
    }

    return { isLoading, favorites, totalPage, removeFavoriteAction, isActionLoading };
}