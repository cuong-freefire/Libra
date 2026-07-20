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
import { AuthProvider } from "./context/AuthContext";
import BookList from "./pages/user-pages/books/BookList";
import MyBorrowing from "./pages/user-pages/my-borrowings/MyBorrowing";
import BookDetail from "./pages/user-pages/books/BookDetail";
import AdminLayout from "./layouts/AdminLayout";
import AdminBookList from "./pages/admin-pages/AdminBookList";
import AdminReaderList from "./pages/admin-pages/AdminReaderList";
import AdminDashboard from "./pages/admin-pages/AdminDashboard";
import AdminBooksView from "./pages/admin-pages/AdminBooksView";
import AdminProfile from "./pages/admin-pages/AdminProfile";
import AdminBorrowing from "./pages/admin-pages/AdminBorrowing";
import AdminBookDetail from "./pages/admin-pages/AdminBookDetail";
import AdminBookBorrowers from "./pages/admin-pages/AdminBookBorrowers";
import UserProfile from "./pages/user-pages/user-profile/UserProfile";



const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      {/* Các Route cho Xác thực */}
      <Route element={<AuthLayout />}>
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />
      </Route>

      {/* Các Route cho Reader (Người dùng thông thường) */}
      <Route path="/" element={<UserLayout />}>
        <Route index element={<UserHome />} />
        <Route path="/books" element={<BookList />} />
        <Route path="/books/detail" element={<BookDetail />} />
        <Route path="/my-borrowings" element={<MyBorrowing />} />
        <Route path="/profile" element={<UserProfile/>} />
      </Route>

      {/* --- THÊM KHỐI ROUTE CHO ADMIN --- */}
      <Route path="/admin" element={<AdminLayout/>}>
        <Route path="books" element={<AdminBookList/>} />
        <Route path="readers" element={<AdminReaderList/>} />
        <Route path="dashboard" element={<AdminDashboard/>} />
        <Route path="book-views" element={<AdminBooksView/>} />
        <Route path="books/detail" element={<AdminBookDetail />} />
        <Route path="books/borrowers" element={<AdminBookBorrowers />} />
        <Route path="profile" element={<AdminProfile/>} />        
        <Route path="borrowing" element={<AdminBorrowing/>} />        
      </Route>
    </>
  )
)

export default function App() {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
}