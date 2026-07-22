import { useNavigate } from "react-router-dom";
import { LibraryBig } from 'lucide-react';
import { FileText } from 'lucide-react';
import { UserPen } from 'lucide-react';
import './user_home.css';
import { SquareChevronRight } from 'lucide-react';

export default function UserHome() {
    const navigate = useNavigate();

    const contents = [
        { logo: <LibraryBig className="text-success mb-4" />, title: "Khám phá kho sách", content: "Tìm kiếm tựa sách yêu thích, tác giả hoặc thể loại phù hợp với bạn chỉ trong vài giây." },
        { logo: <FileText className="text-warning mb-4" />, title: "Mượn sách dễ dàng", content: "Đăng ký mượn trực tuyến nhanh chóng, dễ dàng theo dõi thời hạn và lịch sử đơn mượn sách." },
        { logo: <UserPen className="text-primary mb-4" />, title: "Quản lý tài khoản", content: "Xem thông tin cá nhân, cập nhật thông tin và quản lý mật khẩu." },
    ]

    return (
        <div>
            <div className="my-5 row">
                <div className="col-12 col-md-6 col-xl-8">
                    <h1 className="fw-bold mb-5" style={{ fontSize: '60px' }}>Chào mừng bạn đến với Libra!</h1>
                    <p className="fw-lighter fs-6 ms-2">Không gian kết nối bạn với kho tàng tri thức.</p>
                    <p className="fw-lighter fs-6 ms-2"> Tìm kiếm cuốn sách yêu thích, đăng ký mượn trực tuyến nhanh chóng và theo dõi lịch trình đọc sách cá nhân của bạn.</p>
                </div>
                <div className="col-12 col-md-6 col-xl-4">
                    <img src="/images/libra.jpg" className="rounded-4 img-fluid" alt="Libra Banner" style={{ height: '100%', objectFit: 'cover' }} />
                </div>
            </div>

            <button className="btn btn-success" onClick={() => { navigate("/books") }}>Xem danh mục sách <SquareChevronRight className="ms-2 pb-1" size={20} /></button>

            <div className="row" style={{ marginTop: '100px', marginBottom: '150px' }}>
                {contents.map((item) => {
                    return (
                        <div className="col col-12 col-lg-6 col-xxl-4">
                            <div className="border border-1 border-secondary px-3 py-4 my-3 rounded-4 shadow">
                                {item.logo}
                                <h3>{item.title}</h3>
                                <p>{item.content}</p>
                            </div>
                        </div>
                    )
                })}
            </div>
            {/* 
            <div>
                <h1 className="fw-bold mb-5 text-decoration-underline"><Sprout className="text-success pb-3" size={58} /> Hành trình phát triển.</h1>
                {info.map(item => (
                    <div className="row mb-5 py-4 rounded-4 shadow hover">
                        <div className="col col-12 col-md-7 col-lg-8 col-xl-9">
                            <h3 className="fw-bold text-decoration-underline pb-3">{item.title}</h3>
                            <p>{item.content}</p>
                        </div>
                        <div className="col col-12 col-md-5 col-lg-4 col-xl-3">
                            <img src={item.src} className="rounded" alt="not Found" />
                        </div>
                    </div>
                ))}
            </div>

            <div className="" style={{ marginTop: '100px' }}>
                <h1 className="fw-bold mb-5 text-decoration-underline"><Users className="text-primary pb-3" size={58} />Đồng sáng lập thư viện.</h1>
                <div className="row">
                    {coFounder.map(item => {
                        return (
                            <div className="col-12 col-md-6 col-xl-4">
                                <div className="d-flex flex-column justify-content-center align-items-center gap-2">
                                    <img src={item.image} alt={item.name} className="img-fluid rounded-circle border border-4 border-success" style={{ width: '200px', height: '200px' }} />
                                    <h3>{item.name}</h3>
                                </div>
                            </div>
                        )
                    })}
                </div>
                <div className="px-5 py-4 border border-3 border-secondary rounded-4 story mt-4 shadow">
                    <h4 className="fw-bold text-dark mb-4 text-center d-flex align-items-center justify-content-center gap-2">
                        <Handshake className="text-primary" size={28} />
                        <span>KHÁM PHÁ CĂN HẦM CỔ VÀ CÁI BẮT TAY THẾ KỶ</span>
                    </h4>

                    <p className="text-secondary text-justify lh-lg mb-3">
                        Vào một buổi chiều mùa thu Hà Nội, <strong>Elon</strong>, <strong>Bill</strong> và <strong>Jensen</strong> cùng nhau rảo bước qua những con ngõ nhỏ của khu phố cổ để tìm kiếm một không gian yên tĩnh sau chuỗi sự kiện công nghệ căng thẳng. Đi sâu vào một lối nhỏ hun hút, cả ba vô tình đứng trước một cánh cửa gỗ sồi đã bạc màu thời gian. Phía trên hiên treo một tấm biển đồng rỉ sét khắc vỏn vẹn bốn chữ: <span className="text-primary fw-semibold">Nhà sách Libra</span>. Tò mò trước vẻ huyền bí đó, họ khẽ đẩy cửa bước vào và hoàn toàn sững sờ trước những gì hiện ra trước mắt.
                    </p>

                    <p className="text-secondary text-justify lh-lg mb-4">
                        Đó là một căn hầm sách cổ kính, ngập tràn mùi hương của gỗ sồi và những trang giấy da thuộc cũ kỹ. Giữa không gian nhuốm màu niên đại ấy, hàng chục bạn sinh viên Việt Nam đang ngồi say sưa đọc sách dưới ánh đèn vàng ấm áp. Có bạn vừa gặm bánh mì vừa miệt mài gõ code, có bạn lại đang chật vật lật dở những cuốn tài liệu chuyên ngành bản quyền dày cộp đã sờn gáy. Chứng kiến hình ảnh những người trẻ tuổi tràn đầy năng lượng nhưng phải học tập trong một không gian lưu trữ thủ công và hạn chế, <em>ba vị tỷ phú chợt nhìn nhau, và một ý tưởng lớn ngay lập tức được thắp lên</em>.
                    </p>

                    <h5 className="fw-bold text-dark h6 mb-3">
                        Ý tưởng đột phá từ cuộc thảo luận của ba vị tỷ phú:
                    </h5>

                    <ul className="list-unstyled ps-0 mb-4">
                        <li className="d-flex align-items-start gap-2 text-secondary text-justify lh-lg mb-3">
                            <span className="text-primary fw-bold">•</span>
                            <div>
                                <strong>Bill Gates</strong> bước đến bên một kệ sách lớn, khẽ chạm tay vào lớp bụi thời gian rồi lên tiếng:
                                <span className="text-muted italic"> "Các ông nhìn xem, Libra sở hữu một kho tàng bản thảo và tri thức vô giá, nhưng cách quản lý giấy tờ thủ công này đang kiềm hãm sức mạnh của nó. Người trẻ ở đây có tinh thần hiếu học đến kinh ngạc, cái họ thiếu là một bệ phóng số hóa. Tôi muốn đầu tư vào đây, biến Libra thành một <strong>'hệ điều hành tri thức'</strong> thực thụ, số hóa toàn bộ kho lưu trữ này để bất kỳ ai cũng có thể tiếp cận chỉ trong một cú click."</span>
                            </div>
                        </li>

                        <li className="d-flex align-items-start gap-2 text-secondary text-justify lh-lg mb-3">
                            <span className="text-success fw-bold">•</span>
                            <div>
                                <strong>Jensen Huang</strong>, lúc này đang lật giở một cuốn sách thiên văn cổ, mắt sáng lên đầy phấn khích khi nhìn ra sự dịch chuyển của làn sóng công nghệ tại Việt Nam:
                                <span className="text-muted italic"> "Đúng vậy! Bản thân cấu trúc cổ kính của Libra đã là một kiệt tác, nhưng nó cần một bộ não thế hệ mới. Hãy nhìn tốc độ học và ứng dụng AI của các bạn sinh viên xung quanh chúng ta xem. Tôi sẽ cùng các ông đầu tư nâng cấp nơi này, biến Libra thành một <strong>thư viện số thông minh</strong>, được tối ưu bằng chip xử lý Real-time để hệ thống tự động thấu hiểu người đọc."</span>
                            </div>
                        </li>

                        <li className="d-flex align-items-start gap-2 text-secondary text-justify lh-lg mb-3">
                            <span className="text-warning fw-bold">•</span>
                            <div>
                                <strong>Elon Musk</strong>, sau khi quan sát một bạn sinh viên phải làm thủ tục viết phiếu mượn qua ba bốn bước rườm rà, liền đập tay xuống chiếc bàn gỗ sồi:
                                <span className="text-muted italic"> "Thật lãng phí thời gian! Tốc độ chạy deadline của sinh viên Việt Nam nhanh như chớp, mà quy trình mượn trả lại chậm chạp thế này sao? Nếu chúng ta cùng đầu tư, tôi sẽ tối ưu toàn bộ luồng xử lý đơn mượn trực tuyến trực tiếp trên nền tảng web của Libra. <strong>Đăng ký mượn một chạm, hệ thống duyệt đơn chớp nhoáng</strong>, mọi trải nghiệm phải đạt đến tốc độ thần tốc!"</span>
                            </div>
                        </li>
                    </ul>

                    <p className="text-secondary text-justify lh-lg mb-0">
                        Ngay trong tối hôm đó, bên ly cà phê trứng tại góc phố Hà Nội, một bản thỏa thuận đầu tư chung đã chính thức được ký kết. Ba vị tỷ phú quyết định không phá bỏ, mà gom nguồn lực khổng lồ của mình để <strong>đồng tài trợ và lột xác hoàn toàn cho nhà sách Libra</strong>. Sự kết hợp giữa nền tảng dữ liệu chuẩn mực của Bill, hạ tầng chip AI tối tân của Jensen và hệ thống xử lý đơn mượn siêu tốc của Elon đã biến căn hầm cổ năm ấy thành một thư viện số huyền thoại tại Việt Nam – nơi kết nối vẹn nguyên giá trị hoài cổ với hơi thở của công nghệ tương lai.
                    </p>
                </div>
            </div> */}

        </div>
    )
}
