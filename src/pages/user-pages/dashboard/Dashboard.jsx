import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { axiosApi } from "../../../api/axios";
import { useAuthContext } from "../../../context/AuthContext";

const statusBadge = {
  borrowing: "badge bg-primary",
  pending: "badge bg-warning text-dark",
  returned: "badge bg-success",
  rejected: "badge bg-danger",
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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const borrowingsResponse = await axiosApi.get("borrowings");
        const borrowings = (borrowingsResponse.data || []).filter(
          (item) => item.userId === user?.id
        );

        const activeBorrowings = borrowings.filter((item) => item.status === "borrowing").length;
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
          .slice(0, 6);

        setStats({
          totalBorrowings: borrowings.length,
          activeBorrowings,
          pendingRequests,
          returnedBorrowings,
          overdue,
        });
        setRecentBorrowings(sortedBorrowings);
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
      detail: "Sách đang trong tay bạn",
      icon: "🔄",
    },
    {
      title: "Chờ duyệt",
      value: stats.pendingRequests,
      detail: "Yêu cầu mượn chờ xử lý",
      icon: "⏳",
    },
    {
      title: "Đã trả",
      value: stats.returnedBorrowings,
      detail: "Sách đã trả lại",
      icon: "✅",
    },
  ];

  return (
    <div className="container py-4">
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-2 mb-4">
        <div>
          <h2 className="mb-1">Dashboard</h2>
          <p className="text-muted mb-0">Chào mừng, {user?.name}! Xem thống kê mượn sách của bạn.</p>
        </div>
        <Link to="/books" className="btn btn-primary">
          Khám phá sách
        </Link>
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
                    <h5 className="mb-0">Mượn sách gần đây</h5>
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
                            <td>{item.bookTitle || item.bookId || "—"}</td>
                            <td>
                              <span className={statusBadge[item.status] || "badge bg-secondary"}>
                                {item.status}
                              </span>
                            </td>
                            <td>{item.borrowDate || "—"}</td>
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
                  <h5 className="mb-3">Tóm tắt hoạt động</h5>
                  <ul className="list-group list-group-flush">
                    <li className="list-group-item px-0 d-flex justify-content-between">
                      <span>Tổng mượn</span>
                      <strong>{stats.totalBorrowings}</strong>
                    </li>
                    <li className="list-group-item px-0 d-flex justify-content-between">
                      <span>Đang mượn</span>
                      <strong>{stats.activeBorrowings}</strong>
                    </li>
                    <li className="list-group-item px-0 d-flex justify-content-between">
                      <span>Chờ duyệt</span>
                      <strong>{stats.pendingRequests}</strong>
                    </li>
                    <li className="list-group-item px-0 d-flex justify-content-between">
                      <span>Quá hạn</span>
                      <strong className="text-danger">{stats.overdue}</strong>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
