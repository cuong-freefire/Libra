import Search from "../../../components/search/Search";
import BorrowingTable from "./BorrowingTable";
import { useAuthContext } from "../../../context/AuthContext";
import RequireLoginPage from "../../../components/RequireLoginPage";

export default function BorrowingPage() {
    const { isAuthenticated } = useAuthContext();
    return (
        <>
            {
                isAuthenticated ?
                    <>
                        <Search />
                        <BorrowingTable />
                    </>
                    :
                    <RequireLoginPage />
            }
        </>
    )
}