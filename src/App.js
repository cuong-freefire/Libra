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

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route element={<AuthLayout />}>
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />
      </Route>

      <Route path="/" element={<UserLayout />}>
        <Route index element={<UserHome />} />
        <Route path="/books" element={<BookList />} />
        <Route path="/books/detail" element={<BookDetail />} />
        <Route path="/my-borrowings" element={<MyBorrowing />} />
      </Route>

  {/*Route Admin*/}
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
