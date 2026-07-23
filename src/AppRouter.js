import React from "react";
import {
    Route,
    BrowserRouter,
    Routes,
    Navigate
} from "react-router-dom";

import LoginPage from "./pages/auth-pages/login/LoginPage";
import RegisterPage from "./pages/auth-pages/register/RegisterPage";
import AuthLayout from "./layouts/AuthLayout";
import UserLayout from "./layouts/UserLayout";
import UserHome from "./pages/user-pages/user-home/UserHome";
import Dashboard from "./pages/user-pages/dashboard/Dashboard";
import BookPage from "./pages/user-pages/books/BookPage";
import BorrowingPage from "./pages/user-pages/my-borrowings/BorrowingPage";
import FavoritesPage from "./pages/user-pages/favorites/FavoritesPage";
import BookDetail from "./pages/user-pages/books/BookDetail";
import { useAuthContext } from "./context/AuthContext";
import AdminLayout from "./layouts/AdminLayout";
import NotFoundPage from "./components/NotFountPage";
import AdminBookList from "./pages/admin-pages/AdminBookList";
import AdminReaderList from "./pages/admin-pages/AdminReaderList";
import AdminDashboard from "./pages/admin-pages/AdminDashboard";
import AdminBooksView from "./pages/admin-pages/AdminBooksView";
import AdminBookDetail from "./pages/admin-pages/AdminBookDetail";
import AdminBookBorrowers from "./pages/admin-pages/AdminBookBorrowers";
import AdminProfile from "./pages/admin-pages/AdminProfile";
import AdminBorrowing from "./pages/admin-pages/AdminBorrowing";
import AdminShelfList from "./pages/admin-pages/AdminShelfList";
import AdminCategory from "./pages/admin-pages/AdminCategory.jsx";

export default function AppRouter() {
    const { isAuthenticated, user } = useAuthContext();

    return (
        <BrowserRouter>
            <Routes>
                {user?.role === "admin" && isAuthenticated ? (
                    <>
                        <Route
                            path="/"
                            element={
                                <Navigate
                                    to="/admin/dashboard"
                                    replace
                                />
                            }
                        />

                        <Route
                            path="/admin"
                            element={<AdminLayout />}
                        >
                            <Route
                                index
                                element={
                                    <Navigate
                                        to="dashboard"
                                        replace
                                    />
                                }
                            />

                            <Route
                                path="dashboard"
                                element={<AdminDashboard />}
                            />

                            <Route
                                path="books"
                                element={<AdminBookList />}
                            />

                            <Route
                                path="shelves"
                                element={<AdminShelfList />}
                            />

                            <Route
                                path="categories"
                                element={<AdminCategory />}
                            />

                            <Route
                                path="readers"
                                element={<AdminReaderList />}
                            />

                            <Route
                                path="book-views"
                                element={<AdminBooksView />}
                            />

                            <Route
                                path="books/detail"
                                element={<AdminBookDetail />}
                            />

                            <Route
                                path="books/borrowers"
                                element={<AdminBookBorrowers />}
                            />

                            <Route
                                path="profile"
                                element={<AdminProfile />}
                            />

                            <Route
                                path="borrowing"
                                element={<AdminBorrowing />}
                            />
                        </Route>
                    </>
                ) : (
                    <Route path="/" element={<UserLayout />}>
                        <Route index element={<UserHome />} />

                        <Route
                            path="dashboard"
                            element={<Dashboard />}
                        />

                        <Route
                            path="books"
                            element={<BookPage />}
                        />

                        <Route
                            path="books/detail"
                            element={<BookDetail />}
                        />

                        <Route
                            path="my-borrowings"
                            element={<BorrowingPage />}
                        />

                        <Route
                            path="favorites"
                            element={<FavoritesPage />}
                        />
                    </Route>
                )}

                <Route element={<AuthLayout />}>
                    <Route
                        path="login"
                        element={<LoginPage />}
                    />

                    <Route
                        path="register"
                        element={<RegisterPage />}
                    />
                </Route>

                <Route path="*" element={<NotFoundPage />} />
            </Routes>
        </BrowserRouter>
    );
}