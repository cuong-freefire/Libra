import { useNavigate } from "react-router-dom";
import { BookOpen, Library, BookMarked, Heart, ArrowRight } from 'lucide-react';
import './user_home.css';

export default function UserHome() {
    const navigate = useNavigate();

    const navItems = [
        {
            icon: <BookOpen size={32} />,
            title: "Khám phá sách",
            description: "Duyệt qua hàng trăm đầu sách chất lượng từ lập trình, khoa học đến văn học.",
            action: "Xem thư viện",
            path: "/books",
            color: "nav-blue"
        },
        {
            icon: <BookMarked size={32} />,
            title: "Đơn mượn của tôi",
            description: "Theo dõi tình trạng đơn mượn, lịch sử mượn trả và gia hạn sách.",
            action: "Xem đơn mượn",
            path: "/my-borrowings",
            color: "nav-green"
        },
        {
            icon: <Heart size={32} />,
            title: "Sách yêu thích",
            description: "Xem lại danh sách những cuốn sách bạn đã đánh dấu yêu thích.",
            action: "Xem yêu thích",
            path: "/favorites",
            color: "nav-rose"
        },
    ];

    return (
        <div className="home-page">
            {/* ========== Hero Banner ========== */}
            <section className="home-hero">
                <div className="home-hero-overlay"></div>
                <div className="home-hero-content">
                    <div className="home-hero-badge">
                        <Library size={18} />
                        <span>Thư viện trực tuyến Libra</span>
                    </div>
                    <h1 className="home-hero-title">
                        Khám phá thế giới<br />
                        <span className="home-hero-highlight">tri thức</span> cùng Libra
                    </h1>
                    <p className="home-hero-subtitle">
                        Hàng trăm đầu sách chất lượng từ lập trình, khoa học đến văn học.<br />
                        Mượn sách trực tuyến dễ dàng – nhanh chóng – miễn phí.
                    </p>
                    <div className="home-hero-actions">
                        <button className="home-hero-btn home-hero-btn-primary" onClick={() => navigate('/books')}>
                            <BookOpen size={18} />
                            Khám phá ngay
                        </button>
                        <button className="home-hero-btn home-hero-btn-outline" onClick={() => navigate('/my-borrowings')}>
                            <BookMarked size={18} />
                            Đơn mượn của tôi
                        </button>
                    </div>
                </div>
                <div className="home-hero-shapes">
                    <div className="home-hero-shape home-hero-shape-1"></div>
                    <div className="home-hero-shape home-hero-shape-2"></div>
                    <div className="home-hero-shape home-hero-shape-3"></div>
                </div>
            </section>

            {/* ========== Quick Navigation Cards ========== */}
            <section className="home-navigation">
                <div className="home-section-header">
                    <div>
                        <h2 className="home-section-title">Bắt đầu khám phá</h2>
                        <p className="home-section-desc">Truy cập nhanh đến các chức năng chính của thư viện</p>
                    </div>
                </div>
                <div className="home-nav-grid">
                    {navItems.map((item, index) => (
                        <div
                            key={index}
                            className={`home-nav-card ${item.color}`}
                            onClick={() => navigate(item.path)}
                        >
                            <div className="home-nav-card-icon">{item.icon}</div>
                            <h3 className="home-nav-card-title">{item.title}</h3>
                            <p className="home-nav-card-desc">{item.description}</p>
                            <span className="home-nav-card-action">
                                {item.action} <ArrowRight size={14} />
                            </span>
                        </div>
                    ))}
                </div>
            </section>

            {/* ========== CTA Section ========== */}
            <section className="home-cta">
                <div className="home-cta-content">
                    <h2 className="home-cta-title">Sẵn sàng khám phá thế giới sách?</h2>
                    <p className="home-cta-desc">
                        Hãy ghé thăm thư viện để tìm cho mình những cuốn sách thú vị và bắt đầu hành trình đọc sách ngay hôm nay.
                    </p>
                    <button className="home-hero-btn home-hero-btn-primary" onClick={() => navigate('/books')}>
                        <BookOpen size={18} />
                        Khám phá thư viện
                    </button>
                </div>
            </section>
        </div>
    );
}