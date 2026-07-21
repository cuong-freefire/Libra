import { useState, useEffect } from "react";
import { Search, Plus, Edit, Trash2, Eye, EyeOff } from "lucide-react";
import { axiosApi } from "../../api/axios";
import { toast } from "react-toastify";
import Pagination from "../../components/pagination/Pagination";

export default function AdminCategory() {
    const [categories, setCategories] = useState([]);
    const [filteredCategories, setFilteredCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [sortBy, setSortBy] = useState("name");
    const [showModal, setShowModal] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const [formData, setFormData] = useState({
        name: "",
        description: "",
        is_active: true
    });

    const visibleCategoriesCount = categories.filter((cat) => cat.is_active !== false).length;
    const hiddenCategoriesCount = categories.length - visibleCategoriesCount;

    // Fetch categories
    useEffect(() => {
        loadCategories();
    }, []);

    const loadCategories = async () => {
        try {
            setLoading(true);
            // Fetch categories and books in parallel and compute book counts per category
            const [catRes, bookRes] = await Promise.all([
                axiosApi.get("categories"),
                axiosApi.get("books")
            ]);

            const cats = Array.isArray(catRes.data) ? catRes.data : (catRes.data?.data || []);
            const books = Array.isArray(bookRes.data) ? bookRes.data : (bookRes.data?.data || []);

            const counts = {};
            books.forEach((b) => {
                if (!b) return;
                const cid = b.categoryId;
                if (!cid) return;
                counts[cid] = (counts[cid] || 0) + 1;
            });

            const catsWithCount = cats.map((c) => ({ ...c, bookCount: counts[c.id] || 0 }));

            setCategories(catsWithCount);
            setFilteredCategories(catsWithCount);
        } catch (error) {
            toast.error(error.message || "Lỗi tải danh sách thể loại");
        } finally {
            setLoading(false);
        }
    };

    // Search and sort categories
    useEffect(() => {
        let filtered = categories.filter(cat =>
            cat.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (cat.description && cat.description.toLowerCase().includes(searchTerm.toLowerCase()))
        );

        filtered.sort((a, b) => {
            if (sortBy === "name") {
                return a.name.localeCompare(b.name, "vi");
            }

            if (sortBy === "date") {
                return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
            }

            if (sortBy === "bookCount") {
                return (b.bookCount || 0) - (a.bookCount || 0);
            }

            return 0;
        });

        setFilteredCategories(filtered);
        setCurrentPage(1);
    }, [searchTerm, categories, sortBy]);

    // Handle form submit
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.name.trim()) {
            toast.error("Vui lòng nhập tên thể loại");
            return;
        }

        const payload = {
            name: formData.name.trim(),
            description: formData.description.trim(),
            is_active: formData.is_active
        };

        try {
            if (editingId) {
                await axiosApi.put(`categories/${editingId}`, payload);
                toast.success("Cập nhật thể loại thành công");
            } else {
                await axiosApi.post("categories", payload);
                toast.success("Thêm thể loại thành công");
            }

            resetForm();
            loadCategories();
        } catch (error) {
            toast.error(error.message || "Lỗi xử lý thể loại");
        }
    };

    // Handle delete
    const handleDelete = async (id) => {
        if (window.confirm("Bạn có chắc muốn xóa thể loại này?")) {
            try {
                await axiosApi.delete(`categories/${id}`);
                toast.success("Xóa thể loại thành công");
                loadCategories();
            } catch (error) {
                toast.error(error.message || "Lỗi xóa thể loại");
            }
        }
    };

    const handleToggleVisibility = async (category) => {
        const nextValue = category.is_active === false ? true : false;

        try {
            await axiosApi.patch(`categories/${category.id}`, { is_active: nextValue });
            toast.success(nextValue ? "Đã hiển thị thể loại cho bạn đọc" : "Đã ẩn thể loại khỏi bạn đọc");
            loadCategories();
        } catch (error) {
            toast.error(error.message || "Lỗi cập nhật trạng thái hiển thị");
        }
    };

    // Handle edit
    const handleEdit = (category) => {
        setEditingId(category.id);
        setFormData({
            name: category.name,
            description: category.description || "",
            is_active: category.is_active !== false
        });
        setShowModal(true);
    };

    // Reset form
    const resetForm = () => {
        setFormData({ name: "", description: "", is_active: true });
        setEditingId(null);
        setShowModal(false);
    };

    // Pagination
    const totalPages = Math.ceil(filteredCategories.length / itemsPerPage);
    const startIdx = (currentPage - 1) * itemsPerPage;
    const paginatedData = filteredCategories.slice(startIdx, startIdx + itemsPerPage);

    if (loading) {
        return <div className="text-center py-5">Đang tải...</div>;
    }

    return (
        <div>
            {/* Stats */}
            <div className="row mb-4">
                <div className="col-md-4">
                    <div className="card border-dark shadow-sm">
                        <div className="card-body text-center">
                            <h3 className="text-dark fw-bold">{categories.length}</h3>
                            <p className="text-muted mb-0">Tổng thể loại</p>
                        </div>
                    </div>
                </div>
                <div className="col-md-4">
                    <div className="card border-dark shadow-sm">
                        <div className="card-body text-center">
                            <h3 className="text-dark fw-bold">{visibleCategoriesCount}</h3>
                            <p className="text-muted mb-0">Đang hiển thị</p>
                        </div>
                    </div>
                </div>
                <div className="col-md-4">
                    <div className="card border-dark shadow-sm">
                        <div className="card-body text-center">
                            <h3 className="text-dark fw-bold">{hiddenCategoriesCount}</h3>
                            <p className="text-muted mb-0">Đã ẩn</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Header */}
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h2 className="fw-bold text-uppercase text-secondary fs-6 mb-1">Admin</h2>
                    <h1 className="fw-bold fs-2 mb-0">Quản lý Thể Loại</h1>
                </div>
                <button
                    className="btn btn-dark d-flex align-items-center gap-2 px-3 py-2 shadow"
                    onClick={() => { resetForm(); setShowModal(true); }}
                >
                    <Plus size={20} /> Thêm thể loại
                </button>
            </div>

            {/* Search and Sort Bar */}
            <div className="card border-dark shadow mb-5 rounded-4">
                <div className="card-body p-4">
                    <div className="row g-3">
                        <div className="col-12 col-md-8">
                            <label className="form-label fw-bold">Tìm kiếm</label>
                            <div className="input-group">
                                <span className="input-group-text bg-white border-dark"><Search size={18} /></span>
                                <input
                                    type="text"
                                    className="form-control border-dark"
                                    placeholder="Tên hoặc mô tả thể loại"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="col-12 col-md-4">
                            <label className="form-label fw-bold">Sắp xếp theo</label>
                            <select
                                className="form-select border-dark"
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                            >
                                <option value="name">Tên thể loại</option>
                                <option value="date">Ngày tạo mới nhất</option>
                                <option value="bookCount">Số lượng sách</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>

            {/* Table */}
            <div className="table-responsive rounded-4 shadow border border-dark mb-4">
                <table className="table table-hover align-middle mb-0">
                    <thead className="table-dark">
                        <tr>
                            <th className="py-3 px-3">
                                Tên thể loại
                            </th>
                            <th className="py-3">Mô tả</th>
                            <th className="py-3 text-center">Trạng thái</th>
                            <th className="py-3 text-center">Số lượng</th>
                            <th className="py-3 text-end px-4">Thao tác</th>
                        </tr>
                    </thead>
                    <tbody>
                        {paginatedData.length > 0 ? (
                            paginatedData.map(category => (
                                <tr key={category.id}>
                                    <td className="px-3 fw-medium">{category.name}</td>
                                    <td>{category.description || "—"}</td>
                                    <td className="text-center">
                                        <span className={`badge ${category.is_active === false ? "bg-secondary" : "bg-success"}`}>
                                            {category.is_active === false ? "Đã ẩn" : "Đang hiển thị"}
                                        </span>
                                    </td>
                                    <td className="text-center">
                                        <span className="badge bg-info text-dark">{category.bookCount || 0}</span>
                                    </td>
                                    <td className="text-end px-3">
                                        <button
                                            className={`btn btn-sm ${category.is_active === false ? "btn-outline-success" : "btn-outline-secondary"} me-2`}
                                            onClick={() => handleToggleVisibility(category)}
                                            title={category.is_active === false ? "Hiển thị cho bạn đọc" : "Ẩn khỏi bạn đọc"}
                                        >
                                            {category.is_active === false ? <Eye size={16} /> : <EyeOff size={16} />}
                                        </button>
                                        <button
                                            className="btn btn-sm btn-outline-dark me-2"
                                            onClick={() => handleEdit(category)}
                                            title="Cập nhật"
                                        >
                                            <Edit size={16} />
                                        </button>
                                        <button
                                            className="btn btn-sm btn-outline-danger"
                                            onClick={() => handleDelete(category.id)}
                                            title="Xóa"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="5" className="text-center py-4 text-muted">
                                    Không có thể loại nào
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {filteredCategories.length > 0 && (
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <small className="text-muted">
                        Hiển thị {startIdx + 1} - {Math.min(startIdx + itemsPerPage, filteredCategories.length)} của {filteredCategories.length} thể loại
                    </small>
                    {totalPages > 1 && (
                        <Pagination
                            totalPage={totalPages}
                            currentPage={currentPage}
                            onPageChange={setCurrentPage}
                        />
                    )}
                </div>
            )}

            {/* Modal */}
            {showModal && (
                <div
                    className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center"
                    style={{ backgroundColor: "rgba(0,0,0,0.5)", zIndex: 1050 }}
                >
                    <div
                        className="card border-dark shadow-lg rounded-4"
                        style={{ width: "500px", maxHeight: "90vh", overflowY: "auto" }}
                    >
                        <div className="card-header bg-dark text-white py-3 d-flex justify-content-between align-items-center">
                            <h5 className="mb-0">
                                {editingId ? "Cập nhật thể loại" : "Thêm thể loại mới"}
                            </h5>
                            <button
                                className="btn-close btn-close-white"
                                onClick={resetForm}
                            ></button>
                        </div>

                        <form onSubmit={handleSubmit}>
                            <div className="card-body p-4">
                                <div className="mb-3">
                                    <label className="form-label fw-bold">Tên thể loại *</label>
                                    <input
                                        type="text"
                                        className="form-control border-dark"
                                        value={formData.name}
                                        onChange={(e) =>
                                            setFormData({ ...formData, name: e.target.value })
                                        }
                                        placeholder="Nhập tên thể loại"
                                        maxLength="50"
                                    />
                                    <small className="text-muted">{formData.name.length}/50</small>
                                </div>

                                <div className="mb-3">
                                    <label className="form-label fw-bold">Mô tả</label>
                                    <textarea
                                        className="form-control border-dark"
                                        rows="4"
                                        value={formData.description}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                description: e.target.value
                                            })
                                        }
                                        placeholder="Nhập mô tả thể loại"
                                        maxLength="200"
                                    ></textarea>
                                    <small className="text-muted">{formData.description.length}/200</small>
                                </div>

                                <div className="mb-3">
                                    <label className="form-label fw-bold">Trạng thái hiển thị</label>
                                    <div className="form-check form-switch mt-2">
                                        <input
                                            className="form-check-input"
                                            type="checkbox"
                                            role="switch"
                                            id="category-visibility"
                                            checked={formData.is_active}
                                            onChange={(e) =>
                                                setFormData({ ...formData, is_active: e.target.checked })
                                            }
                                        />
                                        <label className="form-check-label" htmlFor="category-visibility">
                                            {formData.is_active ? "Hiển thị cho bạn đọc" : "Ẩn khỏi bạn đọc"}
                                        </label>
                                    </div>
                                </div>
                            </div>

                            <div className="card-footer bg-light p-3 d-flex gap-2 justify-content-end">
                                <button
                                    type="button"
                                    className="btn btn-outline-dark"
                                    onClick={resetForm}
                                >
                                    Hủy
                                </button>
                                <button type="submit" className="btn btn-dark">
                                    {editingId ? "Cập nhật" : "Thêm"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
