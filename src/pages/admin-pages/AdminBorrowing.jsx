import { useEffect, useMemo, useState } from "react";
import { Eye, RefreshCw, Search, X } from "lucide-react";
import { toast } from "react-toastify";
import { axiosApi } from "../../api/axios";
import "./admin-borrowing.css";

const PAGE_SIZE = 8;

const statusMeta = {
    pending: { label: "Chờ duyệt", className: "pending" },
    borrowing: { label: "Đang mượn", className: "borrowing" },
    rejected: { label: "Bị từ chối", className: "rejected" },
    cancelled: { label: "Đã hủy", className: "cancelled" },
    returned: { label: "Đã trả", className: "returned" },
};

const conditionMeta = {
    normal: { label: "Đã trả", className: "returned" },
    damaged: { label: "Sách hỏng", className: "damaged" },
    lost: { label: "Sách mất", className: "lost" },
};

function toInputDate(value) {
    return value ? String(value).slice(0, 10) : "";
}

function displayDate(value) {
    if (!value) return "-";
    const [year, month, day] = toInputDate(value).split("-");
    return year ? `${day}/${month}/${year}` : "-";
}

function addDays(date, amount) {
    const result = new Date(`${date}T00:00:00`);
    result.setDate(result.getDate() + amount);
    return result.toISOString().slice(0, 10);
}

function isOverdue(item) {
    return item.status === "borrowing" && item.dueDate && toInputDate(item.dueDate) < new Date().toISOString().slice(0, 10);
}

function asCollection(payload) {
    if (Array.isArray(payload)) return payload;
    if (Array.isArray(payload?.data)) return payload.data;
    return [];
}

export default function AdminBorrowing() {
    const [borrowings, setBorrowings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [workingId, setWorkingId] = useState("");
    const [query, setQuery] = useState("");
    const [status, setStatus] = useState("");
    const [dateField, setDateField] = useState("borrowDate");
    const [fromDate, setFromDate] = useState("");
    const [toDate, setToDate] = useState("");
    const [page, setPage] = useState(1);
    const [selected, setSelected] = useState(null);

    const loadBorrowings = async () => {
        try {
            setLoading(true);
            const [borrowingResponse, usersResponse, booksResponse] = await Promise.all([
                axiosApi.get("borrowings"),
                axiosApi.get("users"),
                axiosApi.get("books"),
            ]);
            const users = new Map(asCollection(usersResponse.data).map((user) => [String(user.id), user]));
            const books = new Map(asCollection(booksResponse.data).map((book) => [String(book.id), book]));
            const readerRequests = asCollection(borrowingResponse.data).map((item) => ({
                ...item,
                reader: users.get(String(item.userId)),
                book: books.get(String(item.bookId)),
            }));

            setBorrowings(readerRequests.sort((first, second) => {
                const firstDate = first.requestDate || first.createdAt || first.borrowDate || "";
                const secondDate = second.requestDate || second.createdAt || second.borrowDate || "";
                return String(secondDate).localeCompare(String(firstDate));
            }));
        } catch (error) {
            toast.error(error.message || "Không thể tải danh sách phiếu mượn.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { loadBorrowings(); }, []);

    const filteredBorrowings = useMemo(() => {
        const normalizedQuery = query.trim().toLocaleLowerCase("vi-VN");
        return borrowings.filter((item) => {
            const matchesQuery = !normalizedQuery || [item.reader?.name, item.reader?.username, item.book?.title]
                .filter(Boolean)
                .some((value) => value.toLocaleLowerCase("vi-VN").includes(normalizedQuery));
            const matchesStatus = !status || item.status === status;
            const value = toInputDate(item[dateField]);
            const matchesFrom = !fromDate || (value && value >= fromDate);
            const matchesTo = !toDate || (value && value <= toDate);
            return matchesQuery && matchesStatus && matchesFrom && matchesTo;
        });
    }, [borrowings, query, status, dateField, fromDate, toDate]);

    const totalPages = Math.max(1, Math.ceil(filteredBorrowings.length / PAGE_SIZE));
    const visibleBorrowings = filteredBorrowings.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

    useEffect(() => { setPage(1); }, [query, status, dateField, fromDate, toDate]);
    useEffect(() => { if (page > totalPages) setPage(totalPages); }, [page, totalPages]);

    const updateBorrowing = async (item, changes, successMessage) => {
        try {
            setWorkingId(String(item.id));
            const { data } = await axiosApi.patch(`borrowings/${item.id}`, changes);
            setBorrowings((current) => current.map((borrowing) => borrowing.id === item.id ? { ...borrowing, ...data } : borrowing));
            if (selected?.id === item.id) setSelected((current) => ({ ...current, ...data }));
            toast.success(successMessage);
        } catch (error) {
            toast.error(error.message || "Không thể cập nhật phiếu mượn.");
        } finally {
            setWorkingId("");
        }
    };

    const approve = (item) => {
        const today = new Date().toISOString().slice(0, 10);
        updateBorrowing(item, { status: "borrowing", borrowDate: today, dueDate: addDays(today, 14), rejectReason: "" }, "Đã duyệt phiếu mượn.");
    };

    const reject = (item) => {
        const reason = window.prompt("Nhập lý do từ chối phiếu mượn:");
        if (reason === null) return;
        updateBorrowing(item, { status: "rejected", rejectReason: reason.trim() || "Không đủ điều kiện mượn sách." }, "Đã từ chối phiếu mượn.");
    };

    const confirmReturn = (item, condition) => {
        const note = condition === "normal" ? "" : window.prompt(condition === "damaged" ? "Ghi chú tình trạng sách hỏng:" : "Ghi chú về sách mất:");
        if (note === null) return;
        updateBorrowing(item, {
            status: "returned",
            returnDate: new Date().toISOString().slice(0, 10),
            returnCondition: condition,
            returnNote: note?.trim() || "",
        }, condition === "normal" ? "Đã xác nhận trả sách." : "Đã cập nhật tình trạng sách.");
    };

    const isWorking = (item) => workingId === String(item.id);
    const actionDisabled = (item, allowed) => !allowed || Boolean(workingId);

    return (
        <section className="admin-borrowing">
            <header className="admin-borrowing__heading">
                <div>
                    <span>ADMIN</span>
                    <h1>Quản lý phiếu mượn</h1>
                    <p>Các đơn mượn do Reader gửi sẽ được duyệt và cập nhật tại đây.</p>
                </div>
                <button className="admin-borrowing__refresh" onClick={loadBorrowings} disabled={loading}>
                    <RefreshCw size={16} className={loading ? "is-spinning" : ""} /> Làm mới đơn
                </button>
            </header>

            <div className="admin-borrowing__filters">
                <label className="admin-borrowing__search">
                    <span>Tìm kiếm</span>
                    <div><Search size={18} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Tìm theo reader hoặc sách" /></div>
                </label>
                <label><span>Trạng thái phiếu</span><select value={status} onChange={(event) => setStatus(event.target.value)}><option value="">Tất cả trạng thái</option><option value="pending">Chờ duyệt</option><option value="borrowing">Đang mượn</option><option value="returned">Đã trả</option><option value="rejected">Bị từ chối</option><option value="cancelled">Đã hủy</option></select></label>
                <label><span>Lọc theo ngày</span><select value={dateField} onChange={(event) => setDateField(event.target.value)}><option value="borrowDate">Ngày mượn</option><option value="dueDate">Hạn trả</option><option value="returnDate">Ngày trả</option></select></label>
                <label><span>Từ ngày</span><input type="date" value={fromDate} onChange={(event) => setFromDate(event.target.value)} /></label>
                <label><span>Đến ngày</span><input type="date" value={toDate} min={fromDate} onChange={(event) => setToDate(event.target.value)} /></label>
            </div>

            <div className="admin-borrowing__table-wrap">
                <table className="admin-borrowing__table">
                    <thead><tr><th>Mã đơn</th><th>Reader</th><th>Sách</th><th>Ngày gửi</th><th>Trạng thái</th><th>Ngày mượn</th><th>Hạn trả</th><th>Ngày trả</th><th>Lý do</th><th>Thao tác</th></tr></thead>
                    <tbody>
                        {loading ? <tr><td colSpan="10" className="admin-borrowing__empty">Đang tải dữ liệu...</td></tr> : visibleBorrowings.length === 0 ? <tr><td colSpan="10" className="admin-borrowing__empty">Không tìm thấy phiếu mượn phù hợp.</td></tr> : visibleBorrowings.map((item) => {
                            const meta = item.status === "returned" ? conditionMeta[item.returnCondition] || statusMeta.returned : statusMeta[item.status];
                            const mayReturn = item.status === "borrowing";
                            return <tr key={item.id}>
                                <td>#{item.id}</td>
                                <td>{item.reader?.name || "Reader không tồn tại"}</td>
                                <td>{item.book?.title || "Sách không tồn tại"}</td>
                                <td>{displayDate(item.requestDate || item.createdAt)}</td>
                                <td><div className="admin-borrowing__status"><span className={`admin-borrowing__badge ${meta?.className}`}>{meta?.label || item.status}</span>{isOverdue(item) && <span className="admin-borrowing__badge overdue">Quá hạn</span>}</div></td>
                                <td>{displayDate(item.borrowDate)}</td><td>{displayDate(item.dueDate)}</td><td>{displayDate(item.returnDate)}</td>
                                <td><button className="admin-borrowing__view" onClick={() => setSelected(item)} aria-label="Xem lý do và ghi chú"><Eye size={15} /> Xem</button></td>
                                <td><div className="admin-borrowing__actions">
                                    <button className="approve" disabled={actionDisabled(item, item.status === "pending")} onClick={() => approve(item)}>{isWorking(item) ? "..." : "Duyệt"}</button>
                                    <button className="reject" disabled={actionDisabled(item, item.status === "pending")} onClick={() => reject(item)}>Từ chối</button>
                                    <button className="return" disabled={actionDisabled(item, mayReturn)} onClick={() => confirmReturn(item, "normal")}>Đã trả</button>
                                    <button className="damage" disabled={actionDisabled(item, mayReturn)} onClick={() => confirmReturn(item, "damaged")}>Hỏng</button>
                                    <button className="loss" disabled={actionDisabled(item, mayReturn)} onClick={() => confirmReturn(item, "lost")}>Mất</button>
                                </div></td>
                            </tr>;
                        })}
                    </tbody>
                </table>
            </div>
            {filteredBorrowings.length > 0 && <nav className="admin-borrowing__pagination" aria-label="Phân trang"><button disabled={page === 1} onClick={() => setPage((current) => current - 1)}>Trước</button>{Array.from({ length: totalPages }, (_, index) => <button key={index + 1} className={page === index + 1 ? "current" : ""} onClick={() => setPage(index + 1)}>{index + 1}</button>)}<button disabled={page === totalPages} onClick={() => setPage((current) => current + 1)}>Sau</button></nav>}

            {selected && <div className="admin-borrowing__modal-backdrop" role="presentation" onMouseDown={() => setSelected(null)}><div className="admin-borrowing__modal" role="dialog" aria-modal="true" aria-labelledby="borrowing-modal-title" onMouseDown={(event) => event.stopPropagation()}><button className="admin-borrowing__close" onClick={() => setSelected(null)} aria-label="Đóng"><X /></button><h2 id="borrowing-modal-title">Thông tin đơn mượn #{selected.id}</h2><p><strong>Reader:</strong> {selected.reader?.name || "-"}</p><p><strong>Sách:</strong> {selected.book?.title || "-"}</p><p><strong>Ngày gửi đơn:</strong> {displayDate(selected.requestDate || selected.createdAt)}</p><p><strong>Lý do từ chối:</strong> {selected.rejectReason || "Không có"}</p><p><strong>Ghi chú trả sách:</strong> {selected.returnNote || "Không có"}</p></div></div>}
        </section>
    );
}
