import { ExternalLink, ZodiacLibra } from "lucide-react";

export default function Footer() {
    return (
        <footer className="bg-dark text-light mt-5 py-4">
            <div className="container d-flex flex-column flex-md-row justify-content-between align-items-center gap-3">
                <div>
                    <div className="d-flex align-items-center gap-2 mb-2">
                        <span className="bg-success px-2 py-2 rounded-2 d-inline-flex rainbow text-dark">
                            <ZodiacLibra size={22} />
                        </span>
                        <h5 className="mb-0">Nhà sách Libra</h5>
                    </div>
                    <p className="mb-0 text-light">
                        Nơi chia sẻ những cuốn sách hay, giúp bạn dễ dàng tìm kiếm và lưu giữ tri thức mỗi ngày.
                    </p>
                </div>

                <div className="d-flex align-items-center gap-3">
                    <a
                        href="https://github.com/"
                        target="_blank"
                        rel="noreferrer"
                        className="text-light text-decoration-none d-flex align-items-center gap-2"
                    >
                        <ExternalLink size={18} />
                        <span>GitHub</span>
                    </a>
                    <a
                        href="https://facebook.com/"
                        target="_blank"
                        rel="noreferrer"
                        className="text-light text-decoration-none d-flex align-items-center gap-2"
                    >
                        <ExternalLink size={18} />
                        <span>Facebook</span>
                    </a>
                </div>
            </div>
        </footer>
    );
}
