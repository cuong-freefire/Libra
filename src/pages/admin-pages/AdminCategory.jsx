import { useState, useEffect } from "react";
import { Search, Plus, Edit, Trash2, ChevronUp, ChevronDown } from "lucide-react";
import { axiosApi } from "../../api/axios";
import { toast } from "react-toastify";
import Pagination from "../../components/pagination/Pagination";

export default function AdminCategory() {
    const [categories, setCategories] = useState([]);
    const [filteredCategories, setFilteredCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [sortBy, setSortBy] = useState("name"); // name, date
    const [sortOrder, setSortOrder] = useState("asc"); // asc, desc
    const [showModal, setShowModal] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const [formData, setFormData] = useState({
        name: "",
        description: ""
    });

    // Fetch categories
    useEffect(() => {
        loadCategories();
    }, []);

    const loadCategories = async () => {
        try {
            setLoading(true);
            const response = await axiosApi.get("categories");
            setCategories(response.data || []);
            setFilteredCategories(response.data || []);
        } catch (error) {
            toast.error(error.message || "Lỗi tải danh sách thể loại");
        } finally {
            setLoading(false);
        }
    };

    // Search and sort categories
    useEffect(() => {
        let filtered = categories.filter(cat =>
            cat.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (cat.description && cat.description.toLowerCase().includes(searchTerm.toLowerCase()))
        );

        // Sort
        filtered.sort((a, b) => {
            let compareValue = 0;
            if (sortBy === "name") {
                compareValue = a.name.localeCompare(b.name);
            } else if (sortBy === "date") {
                compareValue = new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
            }
            return sortOrder === "asc" ? compareValue : -compareValue;
        });

        setFilteredCategories(filtered);
        setCurrentPage(1);
    }, [searchTerm, categories, sortBy, sortOrder]);

    // Handle form submit
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.name.trim()) {
            toast.error("Vui lòng nhập tên thể loại");
            return;
        }

        try {
            if (editingId) {
                // Update
                await axiosApi.put(`categories/${editingId}`, formData);
                toast.success("Cập nhật thể loại thành công");
            } else {
                // Create
                await axiosApi.post("categories", formData);
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

    // Handle edit
    const handleEdit = (category) => {
        setEditingId(category.id);
        setFormData({
            name: category.name,
            description: category.description || ""
        });
        setShowModal(true);
    };

    // Reset form
    const resetForm = () => {
        setFormData({ name: "", description: "" });
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
                            <h3 className="text-dark fw-bold">{filteredCategories.length}</h3>
                            <p className="text-muted mb-0">Thể loại tìm được</p>
                        </div>
                    </div>
                </div>
                <div className="col-md-4">
                    <div className="card border-dark shadow-sm">
                        <div className="card-body text-center">
                            <h3 className="text-dark fw-bold">{filteredCategories.reduce((sum, cat) => sum + (cat.bookCount || 0), 0)}</h3>
                            <p className="text-muted mb-0">Tổng sách</p>
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
                                <option value="date">Ngày tạo</option>
                            </select>
                        </div>
                    </div>

                    <div className="mt-3">
                        <button
                            className={`btn btn-sm ${sortOrder === 'asc' ? 'btn-dark' : 'btn-outline-dark'}`}
                            onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                        >
                            {sortOrder === 'asc' ? <ChevronUp size={16} className="me-1" /> : <ChevronDown size={16} className="me-1" />}
                            {sortOrder === 'asc' ? 'Tăng dần' : 'Giảm dần'}
                        </button>
                    </div>
                </div>
            </div>

            {/* Table */}
            <div className="table-responsive rounded-4 shadow border border-dark mb-4">
                <table className="table table-hover align-middle mb-0">
                    <thead className="table-dark">
                        <tr>
                            <th className="py-3 px-3" style={{ cursor: 'pointer' }} onClick={() => setSortBy('name')}>
                                Tên thể loại
                                {sortBy === 'name' && (sortOrder === 'asc' ? <ChevronUp size={14} className="ms-1" style={{ display: 'inline' }} /> : <ChevronDown size={14} className="ms-1" style={{ display: 'inline' }} />)}
                            </th>
                            <th className="py-3">Mô tả</th>
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
                                        <span className="badge bg-info text-dark">{category.bookCount || 0}</span>
                                    </td>
                                    <td className="text-end px-3">
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
                                <td colSpan="4" className="text-center py-4 text-muted">
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

            {totalPages > 1 && (
                <Pagination
                    totalPage={totalPages}
                    currentPage={currentPage}
                    onPageChange={setCurrentPage}
                />
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
