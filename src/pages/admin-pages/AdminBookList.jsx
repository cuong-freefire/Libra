import { useState } from "react";
import { Search, Plus, Edit, Trash2 } from "lucide-react";
import Pagination from "../../components/pagination/Pagination";


export default function AdminBookList() {
    // State giả lập cho form thêm sách
    const [showModal, setShowModal] = useState(false);

    return (
        <div>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h2 className="fw-bold text-uppercase text-secondary fs-6 mb-1">Admin</h2>
                    <h1 className="fw-bold fs-2 mb-0">Quản lý Sách</h1>
                </div>
                <button 
                    className="btn btn-dark d-flex align-items-center gap-2 px-3 py-2 shadow"
                    onClick={() => setShowModal(true)}
                >
                    <Plus size={20} /> Thêm sách mới
                </button>
            </div>

            {/* Advanced Search Bar */}
            <div className="card border-dark shadow mb-5 rounded-4">
                <div className="card-body row g-3 p-4">
                    <div className="col-12 col-md-4">
                        <label className="form-label fw-bold">Từ khóa</label>
                        <div className="input-group">
                            <span className="input-group-text bg-white border-dark"><Search size={18}/></span>
                            <input type="text" className="form-control border-dark" placeholder="Tên sách hoặc tác giả" />
                        </div>
                    </div>
                    <div className="col-12 col-md-3">
                        <label className="form-label fw-bold">Thể loại</label>
                        <select className="form-select border-dark">
                            <option value="">Tất cả</option>
                            <option value="IT">Công nghệ thông tin</option>
                            <option value="Literature">Văn học</option>
                        </select>
                    </div>
                    <div className="col-12 col-md-3">
                        <label className="form-label fw-bold">Kệ sách</label>
                        <select className="form-select border-dark">
                            <option value="">Tất cả</option>
                            <option value="A1">Kệ A - Tầng 1</option>
                            <option value="B2">Kệ B - Tầng 2</option>
                        </select>
                    </div>
                    <div className="col-12 col-md-2">
                        <label className="form-label fw-bold">Trạng thái</label>
                        <select className="form-select border-dark">
                            <option value="">Tất cả</option>
                            <option value="active">Đang phục vụ</option>
                            <option value="inactive">Ngưng phục vụ</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Chỗ này bạn có thể map danh sách sách ra dưới dạng Table hoặc Card tùy ý. Dưới đây là ví dụ dạng Table cho hợp Admin */}
            <div className="table-responsive rounded-4 shadow border border-dark mb-4">
                <table className="table table-hover align-middle mb-0">
                    <thead className="table-dark">
                        <tr>
                            <th className="py-3 px-3">Tên sách</th>
                            <th className="py-3">Tác giả</th>
                            <th className="py-3">Thể loại</th>
                            <th className="py-3">Kệ - Vị trí</th>
                            <th className="py-3 text-center">Số lượng</th>
                            <th className="py-3 text-center">Trạng thái</th>
                            <th className="py-3 text-end px-4">Thao tác</th>
                        </tr>
                    </thead>
                    <tbody>
                        {/* Map dữ liệu giả */}
                        <tr>
                            <td className="px-3 fw-medium">Clean Code</td>
                            <td>Robert C. Martin</td>
                            <td>CNTT</td>
                            <td>Kệ A - Tầng 1</td>
                            <td className="text-center">5</td>
                            <td className="text-center"><span className="badge bg-success px-2 py-2">Đang phục vụ</span></td>
                            <td className="text-end px-3">
                                <button className="btn btn-sm btn-outline-dark me-2"><Edit size={16}/></button>
                                <button className="btn btn-sm btn-outline-danger"><Trash2 size={16}/></button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <Pagination totalPage={5} />

            {/* Modal Thêm Sách Mới (Custom Overlay) */}
            {showModal && (
                <div className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center" style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1050 }}>
                    <div className="card border-dark shadow-lg rounded-4" style={{ width: '600px', maxHeight: '90vh', overflowY: 'auto' }}>
                        <div className="card-header bg-dark text-white py-3 d-flex justify-content-between align-items-center">
                            <h5 className="mb-0 fw-bold">Thêm sách mới</h5>
                            <button className="btn-close btn-close-white" onClick={() => setShowModal(false)}></button>
                        </div>
                        <div className="card-body p-4">
                            <form>
                                <div className="mb-3">
                                    <label className="form-label fw-bold">Tên sách</label>
                                    <input type="text" className="form-control border-dark" required />
                                </div>
                                <div className="row mb-3">
                                    <div className="col-md-6">
                                        <label className="form-label fw-bold">Tác giả</label>
                                        <input type="text" className="form-control border-dark" required />
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label fw-bold">Thể loại</label>
                                        <select className="form-select border-dark" required>
                                            <option value="">Chọn thể loại...</option>
                                            <option value="IT">Công nghệ thông tin</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="row mb-3">
                                    <div className="col-md-6">
                                        <label className="form-label fw-bold">Vị trí kệ vật lý</label>
                                        <select className="form-select border-dark" required>
                                            <option value="">Chọn kệ...</option>
                                            <option value="A1">Kệ A - Tầng 1</option>
                                            <option value="B2">Kệ B - Tầng 2</option>
                                        </select>
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label fw-bold">Số lượng</label>
                                        <input type="number" min="1" className="form-control border-dark" required />
                                    </div>
                                </div>
                                <div className="mb-4">
                                    <label className="form-label fw-bold">Trạng thái</label>
                                    <select className="form-select border-dark">
                                        <option value="active">Đang phục vụ</option>
                                        <option value="inactive">Ngưng phục vụ</option>
                                    </select>
                                </div>
                                <div className="d-flex justify-content-end gap-2">
                                    <button type="button" className="btn btn-light border-dark" onClick={() => setShowModal(false)}>Hủy</button>
                                    <button type="submit" className="btn btn-dark">Lưu thông tin</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}