import { useEffect, useMemo, useState } from "react";
import { Edit, Plus, Save, Search, Trash2, X } from "lucide-react";
import { toast } from "react-toastify";
import { axiosApi } from "../../api/axios";
import "./adminManagement.css";

const emptyShelf = { name: "", location: "", maxCapacity: 1, is_active: true };

export default function AdminShelfList() {
    const [shelves, setShelves] = useState([]);
    const [books, setBooks] = useState([]);
    const [form, setForm] = useState(emptyShelf);
    const [editingId, setEditingId] = useState(null);
    const [query, setQuery] = useState("");
    const [status, setStatus] = useState("");
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        Promise.all([axiosApi.get("shelves"), axiosApi.get("books")])
            .then(([shelfRes, bookRes]) => { setShelves(shelfRes.data); setBooks(bookRes.data); })
            .catch(() => toast.error("Không thể tải dữ liệu kệ sách."))
            .finally(() => setLoading(false));
    }, []);

    const countBooks = id => books.filter(book => String(book.shelfId) === String(id)).reduce((sum, book) => sum + Number(book.totalCopies || 0), 0);
    const filtered = useMemo(() => shelves.filter(item => {
        const keyword = query.trim().toLowerCase();
        return (!keyword || `${item.name} ${item.location}`.toLowerCase().includes(keyword)) && (!status || (status === "active" ? item.is_active : !item.is_active));
    }), [shelves, query, status]);
    const reset = () => { setForm(emptyShelf); setEditingId(null); };

    const submit = async event => {
        event.preventDefault();
        if (!form.name.trim() || !form.location.trim() || Number(form.maxCapacity) < 1) return toast.error("Vui lòng nhập đầy đủ thông tin kệ.");
        const duplicate = shelves.some(item => item.name.trim().toLowerCase() === form.name.trim().toLowerCase() && item.id !== editingId);
        if (duplicate) return toast.error("Tên kệ đã tồn tại.");
        setSaving(true);
        const payload = { ...form, name: form.name.trim(), location: form.location.trim(), maxCapacity: Number(form.maxCapacity) };
        try {
            if (editingId) {
                const response = await axiosApi.patch(`shelves/${editingId}`, payload);
                setShelves(current => current.map(item => item.id === editingId ? response.data : item));
                toast.success("Cập nhật kệ thành công.");
            } else {
                const response = await axiosApi.post("shelves", payload);
                setShelves(current => [...current, response.data]);
                toast.success("Thêm kệ thành công.");
            }
            reset();
        } catch { toast.error("Không thể lưu thông tin kệ."); }
        finally { setSaving(false); }
    };

    const edit = item => { setEditingId(item.id); setForm(item); window.scrollTo({top: 0, behavior: "smooth"}); };
    const toggle = async item => {
        try {
            const response = await axiosApi.patch(`shelves/${item.id}`, { is_active: !item.is_active });
            setShelves(current => current.map(shelf => shelf.id === item.id ? response.data : shelf));
            toast.success(item.is_active ? "Đã ngừng sử dụng kệ." : "Đã mở lại kệ.");
        } catch { toast.error("Không thể thay đổi trạng thái kệ."); }
    };

    const remove = async item => {
        const assignedBooks = books.filter(book => String(book.shelfId) === String(item.id));
        if (assignedBooks.length > 0) {
            toast.error(`Không thể xóa: kệ đang chứa ${assignedBooks.length} đầu sách. Hãy chuyển sách sang kệ khác trước.`);
            return;
        }
        if (!window.confirm(`Xóa vĩnh viễn kệ “${item.name}”? Thao tác này không thể hoàn tác.`)) return;
        try {
            await axiosApi.delete(`shelves/${item.id}`);
            setShelves(current => current.filter(shelf => shelf.id !== item.id));
            if (editingId === item.id) reset();
            toast.success("Đã xóa kệ sách.");
        } catch { toast.error("Không thể xóa kệ sách."); }
    };

    return <div className="admin-management pb-5">
        <header className="mb-4"><div className="text-uppercase text-secondary fw-bold small">Admin</div><h1 className="fw-bold fs-2 mb-1">Quản lý kệ sách</h1><p className="text-muted">Thêm, sửa, ẩn hoặc mở lại vị trí lưu trữ sách.</p></header>
        <form className="card management-card mb-4" onSubmit={submit}><div className="card-body p-4">
            <div className="d-flex justify-content-between mb-3"><h2 className="fs-5 fw-bold mb-0">{editingId ? "Cập nhật kệ" : "Thêm kệ mới"}</h2>{editingId && <button type="button" className="btn btn-sm btn-outline-secondary" onClick={reset}><X size={16}/> Hủy sửa</button>}</div>
            <div className="row g-3 align-items-end"><div className="col-md-3"><label className="form-label fw-semibold">Tên kệ</label><input className="form-control" value={form.name} onChange={e => setForm({...form,name:e.target.value})} placeholder="Ví dụ: Kệ A1" /></div>
                <div className="col-md-4"><label className="form-label fw-semibold">Vị trí</label><input className="form-control" value={form.location} onChange={e => setForm({...form,location:e.target.value})} placeholder="Ví dụ: Tầng 1 - Khu kỹ thuật" /></div>
                <div className="col-md-2"><label className="form-label fw-semibold">Sức chứa</label><input type="number" min="1" className="form-control" value={form.maxCapacity} onChange={e => setForm({...form,maxCapacity:e.target.value})} /></div>
                <div className="col-md-1"><div className="form-check form-switch mb-2"><input id="shelf-active" type="checkbox" className="form-check-input" checked={form.is_active} onChange={e => setForm({...form,is_active:e.target.checked})}/><label htmlFor="shelf-active" className="form-check-label">Mở</label></div></div>
                <div className="col-md-2"><button className="btn btn-dark w-100" disabled={saving}>{editingId ? <Save size={17}/> : <Plus size={17}/>} {saving ? "Đang lưu" : editingId ? "Lưu" : "Thêm kệ"}</button></div>
            </div></div></form>
        <div className="card management-card mb-3"><div className="card-body p-3"><div className="row g-2"><div className="col-md-8 position-relative"><Search className="filter-icon" size={18}/><input className="form-control ps-5" placeholder="Tìm theo tên hoặc vị trí kệ" value={query} onChange={e => setQuery(e.target.value)}/></div><div className="col-md-4"><select className="form-select" value={status} onChange={e => setStatus(e.target.value)}><option value="">Tất cả trạng thái</option><option value="active">Đang sử dụng</option><option value="inactive">Ngưng sử dụng</option></select></div></div></div></div>
        <div className="table-responsive management-table"><table className="table table-hover align-middle mb-0"><thead><tr><th>Tên kệ</th><th>Vị trí</th><th>Số bản sách</th><th>Sức chứa</th><th>Trạng thái</th><th className="text-end">Thao tác</th></tr></thead><tbody>
            {loading ? <tr><td colSpan="6" className="text-center py-5">Đang tải dữ liệu...</td></tr> : filtered.length === 0 ? <tr><td colSpan="6" className="text-center text-muted py-5">Không có kệ phù hợp.</td></tr> : filtered.map(item => { const used=countBooks(item.id); return <tr key={item.id}><td className="fw-bold">{item.name}</td><td>{item.location}</td><td>{used}</td><td><strong>{used}/{item.maxCapacity}</strong><div className="progress mt-1" style={{height:6}}><div className={`progress-bar ${used > item.maxCapacity ? "bg-danger" : "bg-success"}`} style={{width:`${Math.min(100,used/item.maxCapacity*100)}%`}} /></div></td><td><span className={`badge ${item.is_active ? "text-bg-success" : "text-bg-secondary"}`}>{item.is_active ? "Đang sử dụng" : "Ngưng sử dụng"}</span></td><td className="text-end text-nowrap"><button className="btn btn-sm btn-outline-dark me-2" onClick={()=>edit(item)}><Edit size={15}/> Sửa</button><button className={`btn btn-sm me-2 ${item.is_active ? "btn-outline-warning" : "btn-outline-success"}`} onClick={()=>toggle(item)}>{item.is_active ? "Ẩn" : "Mở lại"}</button><button className="btn btn-sm btn-outline-danger" onClick={()=>remove(item)} title="Xóa vĩnh viễn"><Trash2 size={15}/> Xóa</button></td></tr>; })}
        </tbody></table></div>
    </div>;
}
