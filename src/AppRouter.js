import React from "react";
import {
    createBrowserRouter,
    createRoutesFromElements,
    RouterProvider,
    Route
} from "react-router-dom";
import LoginPage from "./pages/auth-pages/login/LoginPage";
import RegisterPage from "./pages/auth-pages/register/RegisterPage";
import AuthLayout from "./layouts/AuthLayout";
import UserLayout from "./layouts/UserLayout";
import UserHome from "./pages/user-pages/user-home/UserHome";
import BookPage from "./pages/user-pages/books/BookPage";
import BorrowingPage from "./pages/user-pages/my-borrowings/BorrowingPage";
import BookDetail from "./pages/user-pages/books/BookDetail";
import { useAuthContext } from "./context/AuthContext";
import AdminLayout from "./layouts/AdminLayout";
import NotFoundPage from "./components/NotFountPage";

const routeAuth =
    <Route element={<AuthLayout />}>
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />
    </Route>

const routerUser = createBrowserRouter(
    createRoutesFromElements(
        <>
            {routeAuth}
            <Route path="/" element={<UserLayout />}>
                <Route index element={<UserHome />} />
                <Route path="/books" element={<BookPage />} />
                <Route path="/books/detail" element={<BookDetail />} />
                <Route path="/my-borrowings" element={<BorrowingPage />} />
            </Route>

            <Route path="*" element={<NotFoundPage />} />
        </>
    )
)

const routerAdmin = createBrowserRouter(
    createRoutesFromElements(
        <>
            {routeAuth}
            <Route path="/" element={<AdminLayout />}>
                {/* <Route index element={<UserHome />} />
        <Route path="/books" element={<BookPage />} />
        <Route path="/books/detail" element={<BookDetail />} />
        <Route path="/my-borrowings" element={<BorrowingPage />} /> */}
            </Route>
            <Route path="*" element={<NotFoundPage />} />
        </>
    )
)

export default function AppRouter() {
    const { isAuthenticated, user } = useAuthContext();
    return (
        user?.role === 'reader' || !isAuthenticated ?
            <RouterProvider router={routerUser} />
            :
            <RouterProvider router={routerAdmin} />
    );
}
