import { Outlet } from "react-router-dom";
import Navbar from "../components/navbar/Navbar";
import Footer from "../components/footer/Footer";

export default function AdminLayout() {
    return (
        <div className="vh-100 d-flex flex-column">
            <Navbar />
            <main className="flex-grow-1 container" style={{ marginTop: '82px' }}>
                <Outlet />
            </main>
            <Footer />
        </div>
    )
}
