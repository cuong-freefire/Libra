import { useEffect, useState } from "react";

export default function useOnlineStatus() {
    const naviagtor = window.navigator;
    const [isOnline, setIsOnline] = useState(naviagtor.onLine);
    useEffect(() => {
        function changeStatus() {
            setIsOnline(naviagtor.onLine);
        }
        changeStatus();
        window.addEventListener('online', changeStatus);
        window.addEventListener('offline', changeStatus);
        return () => {
            window.removeEventListener('online', changeStatus);
            window.removeEventListener('offline', changeStatus);
        };
    }, [naviagtor.onLine]);
    return isOnline;
}