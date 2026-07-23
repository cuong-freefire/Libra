export default function AdminPagination({
    currentPage,
    totalPages,
    onPageChange
}) {
    const pages = Array.from({ length: totalPages }, (_, index) => index + 1);

    return (
        <div className="mt-4">
            <p className="text-center text-muted mb-2">
                Trang {currentPage} / {totalPages}
            </p>

            <div
                className="d-flex justify-content-center align-items-center"
                role="group"
                aria-label="Phân trang"
            >
                <button
                    type="button"
                    className="btn btn-light btn-sm"
                    disabled={currentPage <= 1}
                    onClick={() => onPageChange(currentPage - 1)}
                >
                    Trước
                </button>

                {pages.map(page => (
                    <button
                        type="button"
                        key={page}
                        className={`btn btn-sm ${
                            currentPage === page
                                ? "btn-dark"
                                : "btn-light"
                        }`}
                        onClick={() => onPageChange(page)}
                    >
                        {page}
                    </button>
                ))}

                <button
                    type="button"
                    className="btn btn-light btn-sm"
                    disabled={currentPage >= totalPages}
                    onClick={() => onPageChange(currentPage + 1)}
                >
                    Sau
                </button>
            </div>
        </div>
    );
}
