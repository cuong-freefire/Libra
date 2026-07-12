import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { axiosApi } from "../../../api/axios";
import { useAuthContext } from "../../../context/AuthContext";

const statusConfig = {
  borrowing: { badge: "badge bg-primary", label: "Đang mượn" },
  pending: { badge: "badge bg-warning text-dark", label: "Chờ duyệt" },
  returned: { badge: "badge bg-success", label: "Đã trả" },
  rejected: { badge: "badge bg-danger", label: "Bị từ chối" },
  cancelled: { badge: "badge bg-secondary", label: "Đã hủy" },
};

const formatDate = (value) => {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("vi-VN");
};

export default function Dashboard() {
  const { user } = useAuthContext();
  const [stats, setStats] = useState({
    totalBorrowings: 0,
    activeBorrowings: 0,
    pendingRequests: 0,
    returnedBorrowings: 0,
    overdue: 0,
  });
  const [recentBorrowings, setRecentBorrowings] = useState([]);
  const [activeBorrowings, setActiveBorrowings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const [borrowingsResponse, booksResponse] = await Promise.all([
          axiosApi.get("borrowings"),
          axiosApi.get("books"),
        ]);

        const borrowings = (borrowingsResponse.data || []).filter(
          (item) => item.userId === user?.id
        );
        const books = booksResponse.data || [];
        const bookMap = Object.fromEntries(books.map((book) => [book.id, book]));

        const activeItems = borrowings.filter((item) => item.status === "borrowing");
        const pendingRequests = borrowings.filter((item) => item.status === "pending").length;
        const returnedBorrowings = borrowings.filter((item) => item.status === "returned").length;
        const overdue = borrowings.filter((item) => {
          if (item.status !== "borrowing" || !item.dueDate) return false;
          return new Date(item.dueDate) < new Date();
        }).length;

        const sortedBorrowings = [...borrowings]
          .sort((a, b) => {
            const first = a.borrowDate ? new Date(a.borrowDate) : new Date(0);
            const second = b.borrowDate ? new Date(b.borrowDate) : new Date(0);
            return second - first;
          })
          .slice(0, 6)
          .map((item) => ({
            ...item,
            bookTitle: bookMap[item.bookId]?.title || item.bookTitle || "Sách không xác định",
          }));

        setStats({
          totalBorrowings: borrowings.length,
          activeBorrowings: activeItems.length,
          pendingRequests,
          returnedBorrowings,
          overdue,
        });
        setRecentBorrowings(sortedBorrowings);
        setActiveBorrowings(activeItems);
      } catch (error) {
        console.error("Không thể tải dữ liệu dashboard", error);
      } finally {
        setLoading(false);
      }
    };

    if (user?.id) {
      loadDashboardData();
    }
  }, [user?.id]);

  const cards = [
    {
      title: "Tổng mượn sách",
      value: stats.totalBorrowings,
      detail: `${stats.overdue} đơn quá hạn`,
      icon: "📚",
    },
    {
      title: "Đang mượn",
      value: stats.activeBorrowings,
      detail: "Sách hiện đang ở với bạn",
      icon: "🔄",
    },
    {
      title: "Chờ duyệt",
      value: stats.pendingRequests,
      detail: "Yêu cầu đang chờ xử lý",
      icon: "⏳",
    },
    {
      title: "Đã trả",
      value: stats.returnedBorrowings,
      detail: "Lịch sử trả sách đã hoàn tất",
      icon: "✅",
    },
  ];

  return (
    <div className="container py-4">
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-2 mb-4">
        <div>
          <h2 className="mb-1">Dashboard</h2>
          <p className="text-muted mb-0">Chào mừng, {user?.name || "bạn"}! Theo dõi hoạt động mượn sách của bạn.</p>
        </div>
        <div className="d-flex gap-2">
          <Link to="/my-borrowings" className="btn btn-outline-secondary">
            Xem đơn mượn
          </Link>
          <Link to="/books" className="btn btn-primary">
            Khám phá sách
          </Link>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-5 text-muted">Đang tải dữ liệu dashboard...</div>
      ) : (
        <>
          <div className="row g-3 mb-4">
            {cards.map((card) => (
              <div className="col-12 col-md-6 col-xl-3" key={card.title}>
                <div className="card border-0 shadow-sm h-100">
                  <div className="card-body">
                    <div className="d-flex justify-content-between align-items-start">
                      <div>
                        <p className="text-muted mb-1">{card.title}</p>
                        <h3 className="mb-0">{card.value}</h3>
                      </div>
                      <div className="fs-3">{card.icon}</div>
                    </div>
                    <div className="mt-3 small text-muted">{card.detail}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="row g-4">
            <div className="col-lg-8">
              <div className="card border-0 shadow-sm">
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <h5 className="mb-0">Hoạt động gần đây</h5>
                    <Link to="/my-borrowings" className="btn btn-outline-secondary btn-sm">
                      Xem tất cả
                    </Link>
                  </div>

                  <div className="table-responsive">
                    <table className="table table-hover align-middle mb-0">
                      <thead>
                        <tr>
                          <th>Mã đơn</th>
                          <th>Sách</th>
                          <th>Trạng thái</th>
                          <th>Ngày mượn</th>
                        </tr>
                      </thead>
                      <tbody>
                        {recentBorrowings.map((item) => (
                          <tr key={item.id}>
                            <td>#{item.id}</td>
                            <td>{item.bookTitle}</td>
                            <td>
                              <span className={statusConfig[item.status]?.badge || "badge bg-secondary"}>
                                {statusConfig[item.status]?.label || item.status}
                              </span>
                            </td>
                            <td>{formatDate(item.borrowDate)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-lg-4">
              <div className="card border-0 shadow-sm">
                <div className="card-body">
                  <h5 className="mb-3">Sách đang mượn</h5>
                  {activeBorrowings.length > 0 ? (
                    <ul className="list-group list-group-flush">
                      {activeBorrowings.map((item) => (
                        <li key={item.id} className="list-group-item px-0">
                          <div className="d-flex justify-content-between align-items-start gap-2">
                            <div>
                              <div className="fw-semibold">{item.bookTitle || "Sách không xác định"}</div>
                              <div className="small text-muted">Hạn trả: {formatDate(item.dueDate)}</div>
                            </div>
                            <span className={`badge ${new Date(item.dueDate) < new Date() ? "bg-danger" : "bg-success"}`}>
                              {new Date(item.dueDate) < new Date() ? "Quá hạn" : "Đang giữ"}
                            </span>
                          </div>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="text-muted small">Bạn hiện chưa có sách nào đang mượn.</div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
