import { useEffect, useMemo, useState } from "react";
import { Edit, Plus, Save, Search, Trash2, X } from "lucide-react";
import { toast } from "react-toastify";
import { axiosApi } from "../../api/axios";
import AdminPagination from "../../components/admin-pagination/AdminPagination";
import "./adminManagement.css";

const PAGE_SIZE = 10;

const emptyForm = {
    title: "", author: "", categoryId: "", shelfId: "", description: "",
    totalCopies: 1, borrowedCopies: 0, pendingCopies: 0, damagedCopies: 0, lostCopies: 0,
    coverImage: "", is_active: true
};

export default function AdminBookList() {
    const [books, setBooks] = useState([]);
    const [categories, setCategories] = useState([]);
    const [shelves, setShelves] = useState([]);
    const [borrowings, setBorrowings] = useState([]);
    const [form, setForm] = useState(emptyForm);
    const [editingId, setEditingId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [query, setQuery] = useState("");
    const [category, setCategory] = useState("");
    const [shelf, setShelf] = useState("");
    const [status, setStatus] = useState("");
    const [quantity, setQuantity] = useState("");
    const [currentPage, setCurrentPage] = useState(1);

    const loadData = async () => {
        setLoading(true);
        try {
            const [bookRes, categoryRes, shelfRes, borrowingRes] = await Promise.all([
                axiosApi.get("books"), axiosApi.get("categories"), axiosApi.get("shelves"), axiosApi.get("borrowings")
            ]);
            setBooks(bookRes.data);
            setCategories(categoryRes.data);
            setShelves(shelfRes.data);
            setBorrowings(borrowingRes.data);
        } catch {
            toast.error("Không thể tải dữ liệu quản lý sách.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { loadData(); }, []);

    const getCategory = id => categories.find(item => String(item.id) === String(id));
    const getShelf = id => shelves.find(item => String(item.id) === String(id));
    const available = book => Math.max(0, Number(book.totalCopies) - Number(book.borrowedCopies) - Number(book.damagedCopies) - Number(book.lostCopies));
    const borrowingCount = (bookId, status) => borrowings.filter(item => String(item.bookId) === String(bookId) && item.status === status).length;

    const filteredBooks = useMemo(() => books.filter(book => {
        const keyword = query.trim().toLowerCase();
        const matchesQuery = !keyword || `${book.title} ${book.author}`.toLowerCase().includes(keyword);
        const matchesCategory = !category || String(book.categoryId) === category;
        const matchesShelf = !shelf || String(book.shelfId) === shelf;
        const matchesStatus = !status || (status === "active" ? book.is_active : !book.is_active);
        const matchesQuantity = !quantity || (quantity === "available" ? available(book) > 0 : available(book) === 0);
        return matchesQuery && matchesCategory && matchesShelf && matchesStatus && matchesQuantity;
    }), [books, query, category, shelf, status, quantity]);

    const totalPages = Math.max(1, Math.ceil(filteredBooks.length / PAGE_SIZE));
    const paginatedBooks = useMemo(() => {
        const start = (currentPage - 1) * PAGE_SIZE;
        return filteredBooks.slice(start, start + PAGE_SIZE);
    }, [filteredBooks, currentPage]);

    useEffect(() => {
        setCurrentPage(1);
    }, [query, category, shelf, status, quantity]);

    useEffect(() => {
        if (currentPage > totalPages) {
            setCurrentPage(totalPages);
        }
    }, [currentPage, totalPages]);

    const onChange = event => {
        const { name, value, type, checked } = event.target;
        setForm(current => ({ ...current, [name]: type === "checkbox" ? checked : value }));
    };

    const resetForm = () => { setForm(emptyForm); setEditingId(null); };

    const validate = () => {
        if (!form.title.trim() || !form.author.trim() || !form.categoryId || !form.shelfId) {
            toast.error("Vui lòng nhập tên sách, tác giả, thể loại và kệ sách.");
            return false;
        }
        const counts = [form.totalCopies, form.borrowedCopies, form.damagedCopies, form.lostCopies].map(Number);
        if (counts.some(value => value < 0) || counts.slice(1).reduce((sum, value) => sum + value, 0) > counts[0]) {
            toast.error("Số bản đang mượn, hỏng và mất không được vượt quá tổng số bản.");
            return false;
        }
        return true;
    };

    const handleSubmit = async event => {
        event.preventDefault();
        if (!validate()) return;
        setSaving(true);
        const { pendingCopies, ...formData } = form;
        const payload = {
            ...formData,
            title: form.title.trim(), author: form.author.trim(), description: form.description.trim(),
            totalCopies: Number(form.totalCopies), borrowedCopies: Number(form.borrowedCopies),
            damagedCopies: Number(form.damagedCopies), lostCopies: Number(form.lostCopies)
        };
        try {
            if (editingId) {
                const response = await axiosApi.patch(`books/${editingId}`, payload);
                setBooks(current => current.map(book => book.id === editingId ? response.data : book));
                toast.success("Cập nhật sách thành công.");
            } else {
                const response = await axiosApi.post("books", payload);
                setBooks(current => [response.data, ...current]);
                toast.success("Thêm sách thành công.");
            }
            resetForm();
        } catch {
            toast.error("Không thể lưu thông tin sách.");
        } finally {
            setSaving(false);
        }
    };

    const editBook = book => {
        setEditingId(book.id);
        setForm({
            ...emptyForm,
            ...book,
            borrowedCopies: borrowingCount(book.id, "borrowing"),
            pendingCopies: borrowingCount(book.id, "pending")
        });
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const toggleStatus = async book => {
        try {
            const response = await axiosApi.patch(`books/${book.id}`, { is_active: !book.is_active });
            setBooks(current => current.map(item => item.id === book.id ? response.data : item));
            toast.success(book.is_active ? "Đã ngừng phục vụ sách." : "Đã mở phục vụ sách.");
        } catch {
            toast.error("Không thể thay đổi trạng thái sách.");
        }
    };

    const deleteBook = async book => {
        const hasBorrowingHistory = borrowings.some(item => String(item.bookId) === String(book.id));
        if (hasBorrowingHistory) {
            toast.error("Sách đã có lịch sử phiếu mượn. Hãy dùng Ngừng phục vụ thay vì xóa.");
            return;
        }
        if (!window.confirm(`Xóa vĩnh viễn sách “${book.title}”? Thao tác này không thể hoàn tác.`)) return;
        try {
            await axiosApi.delete(`books/${book.id}`);
            setBooks(current => current.filter(item => item.id !== book.id));
            if (editingId === book.id) resetForm();
            toast.success("Đã xóa sách.");
        } catch {
            toast.error("Không thể xóa sách.");
        }
    };

    return (
        <div className="admin-management pb-5">
            <header className="mb-4">
                <div className="text-uppercase text-secondary fw-bold small">Admin</div>
                <h1 className="fw-bold fs-2 mb-1">Quản lý sách</h1>
                <p className="text-muted mb-0">Thêm, sửa, ẩn hoặc hiện lại sách trong danh mục.</p>
            </header>

            <form className="card management-card mb-4" onSubmit={handleSubmit}>
                <div className="card-body p-4">
                    <div className="d-flex align-items-center justify-content-between mb-3">
                        <h2 className="fs-5 fw-bold mb-0">{editingId ? "Cập nhật sách" : "Thêm sách mới"}</h2>
                        {editingId && <button type="button" className="btn btn-sm btn-outline-secondary" onClick={resetForm}><X size={16} /> Hủy sửa</button>}
                    </div>
                    <div className="row g-3">
                        <Field label="Tên sách" name="title" value={form.title} onChange={onChange} col="col-md-4" />
                        <Field label="Tác giả" name="author" value={form.author} onChange={onChange} col="col-md-4" />
                        <div className="col-md-4"><label className="form-label fw-semibold">Thể loại</label><select className="form-select" name="categoryId" value={form.categoryId} onChange={onChange}><option value="">Chọn thể loại</option>{categories.filter(c => c.is_active).map(c => <option key={c.id} value={c.id}>{c.name}</option>)}</select></div>
                        <div className="col-md-4"><label className="form-label fw-semibold">Kệ sách</label><select className="form-select" name="shelfId" value={form.shelfId} onChange={onChange}><option value="">Chọn kệ sách</option>{shelves.filter(s => s.is_active).map(s => <option key={s.id} value={s.id}>{s.name} — {s.location}</option>)}</select></div>
                        <NumberField label="Tổng bản" name="totalCopies" value={form.totalCopies} onChange={onChange} col="col-6 col-md-3" />
                        <NumberField label="Đang mượn" name="borrowedCopies" value={form.borrowedCopies} onChange={onChange} col="col-6 col-md-3" disabled />
                        <NumberField label="Chờ duyệt" name="pendingCopies" value={form.pendingCopies} onChange={onChange} col="col-6 col-md-3" disabled />
                        <NumberField label="Hỏng" name="damagedCopies" value={form.damagedCopies} onChange={onChange} col="col-6 col-md-3" />
                        <Field label="Ảnh bìa URL" name="coverImage" value={form.coverImage} onChange={onChange} col="col-12" />
                        <div className="col-12"><label className="form-label fw-semibold">Mô tả</label><textarea className="form-control" rows="3" name="description" value={form.description} onChange={onChange} /></div>
                        <div className="col-12 d-flex align-items-center justify-content-between">
                            <div className="form-check form-switch"><input className="form-check-input" type="checkbox" name="is_active" checked={form.is_active} onChange={onChange} id="book-active" /><label className="form-check-label fw-semibold" htmlFor="book-active">Đang phục vụ</label></div>
                            <button className="btn btn-dark px-4" disabled={saving}>{editingId ? <Save size={18} /> : <Plus size={18} />} {saving ? "Đang lưu..." : editingId ? "Lưu thay đổi" : "Thêm sách"}</button>
                        </div>
                    </div>
                </div>
            </form>

            <div className="card management-card mb-3"><div className="card-body p-3"><div className="row g-2">
                <div className="col-lg-4 position-relative"><Search className="filter-icon" size={18} /><input className="form-control ps-5" placeholder="Tìm sách theo tên hoặc tác giả" value={query} onChange={e => setQuery(e.target.value)} /></div>
                <Filter value={category} onChange={setCategory} label="Tất cả thể loại" items={categories} />
                <Filter value={shelf} onChange={setShelf} label="Tất cả kệ" items={shelves} />
                <Filter value={status} onChange={setStatus} label="Tất cả trạng thái" items={[{id:"active",name:"Đang phục vụ"},{id:"inactive",name:"Ngưng phục vụ"}]} />
                <Filter value={quantity} onChange={setQuantity} label="Tất cả số lượng" items={[{id:"available",name:"Còn sách"},{id:"empty",name:"Hết sách"}]} />
            </div></div></div>

            <div className="table-responsive management-table">
                <table className="table table-hover align-middle mb-0"><thead><tr><th>Sách</th><th>Thể loại</th><th>Kệ</th><th>Số lượng</th><th>Trạng thái</th><th className="text-end">Thao tác</th></tr></thead>
                    <tbody>{loading ? <tr><td colSpan="6" className="text-center py-5">Đang tải dữ liệu...</td></tr> : filteredBooks.length === 0 ? <tr><td colSpan="6" className="text-center text-muted py-5">Không có sách phù hợp.</td></tr> : paginatedBooks.map(book => <tr key={book.id}>
                        <td><div className="fw-bold">{book.title}</div><small className="text-muted">{book.author}</small></td>
                        <td>{getCategory(book.categoryId)?.name || "—"}</td><td>{getShelf(book.shelfId)?.name || "—"}<small className="d-block text-muted">{getShelf(book.shelfId)?.location}</small></td>
                        <td><strong>{available(book)}/{book.totalCopies}</strong> có thể mượn<small className="d-block text-muted">Đang mượn: {book.borrowedCopies} · Hỏng: {book.damagedCopies} · Mất: {book.lostCopies}</small></td>
                        <td><span className={`badge ${book.is_active ? "text-bg-success" : "text-bg-secondary"}`}>{book.is_active ? "Đang phục vụ" : "Ngưng phục vụ"}</span></td>
                        <td className="text-end text-nowrap"><button className="btn btn-sm btn-outline-dark me-2" onClick={() => editBook(book)}><Edit size={15} /> Sửa</button><button className={`btn btn-sm me-2 ${book.is_active ? "btn-outline-warning" : "btn-outline-success"}`} onClick={() => toggleStatus(book)}>{book.is_active ? "Ngừng phục vụ" : "Mở phục vụ"}</button><button className="btn btn-sm btn-outline-danger" onClick={() => deleteBook(book)} title="Xóa vĩnh viễn"><Trash2 size={15} /> Xóa</button></td>
                    </tr>)}</tbody>
                </table>
            </div>

            {!loading && (
                <AdminPagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                />
            )}
        </div>
    );
}

function Field({ label, col, ...props }) { return <div className={col}><label className="form-label fw-semibold">{label}</label><input className="form-control" {...props} /></div>; }
function NumberField({ col = "col-6 col-md-2", ...props }) { return <Field {...props} type="number" min="0" col={col} />; }
function Filter({ value, onChange, label, items }) { return <div className="col-6 col-lg-2"><select className="form-select" value={value} onChange={e => onChange(e.target.value)}><option value="">{label}</option>{items.map(item => <option key={item.id} value={item.id}>{item.name}</option>)}</select></div>; }
