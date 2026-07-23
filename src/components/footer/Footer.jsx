import { ExternalLink, ZodiacLibra } from "lucide-react";

export default function Footer() {
    return (
        <footer className="app-footer mt-5 py-4">
            <div className="container d-flex flex-column flex-md-row justify-content-between align-items-center gap-3">
                <div>
                    <div className="d-flex align-items-center gap-2 mb-2">
                        <span className="footer-logo-icon">
                            <ZodiacLibra size={22} />
                        </span>
                        <h5 className="footer-logo-text mb-0">Nhà sách Libra</h5>
                    </div>
                    <p className="footer-desc mb-0">
                        Nơi chia sẻ những cuốn sách hay, giúp bạn dễ dàng tìm kiếm và lưu giữ tri thức mỗi ngày.
                    </p>
                </div>

                <div className="d-flex align-items-center gap-3">
                    <a
                        href="https://github.com/"
                        target="_blank"
                        rel="noreferrer"
                        className="footer-link d-flex align-items-center gap-2"
                    >
                        <ExternalLink size={18} />
                        <span>GitHub</span>
                    </a>
                    <a
                        href="https://facebook.com/"
                        target="_blank"
                        rel="noreferrer"
                        className="footer-link d-flex align-items-center gap-2"
                    >
                        <ExternalLink size={18} />
                        <span>Facebook</span>
                    </a>
                </div>
            </div>
        </footer>
    );
}
