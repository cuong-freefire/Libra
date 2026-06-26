import { Link, useSearchParams } from "react-router-dom"

export default function Pagination({ totalPage }) {

    const [seachParams] = useSearchParams();
    const currentPage = Number(seachParams.get('page')) || 1;
    const params = new URLSearchParams(seachParams);
    const arr = []

    function handlePagination(number) {
        params.set('page', number.toString());
        return `?${params.toString()}`
    }

    for (let i = 1; i <= totalPage; i++) {
        arr.push(
            <Link
                className={`btn ${currentPage === i ? 'btn-dark' : 'btn-light'}`}
                style={{ cursor: 'pointer' }}
                to={handlePagination(i)}
                key={i}
            >{i}</Link>
        )
    }

    return (
        <div>
            <p>{`Trang ${currentPage} / ${totalPage}`}</p>
            <div className="d-flex justify-content-center align-items-center">
                <Link
                    to={handlePagination(currentPage - 1)}
                    className={`btn btn-light ${currentPage <= 1 ? 'disabled' : ''}`}
                    style={{ cursor: 'pointer' }}
                >Trước</Link>
                {arr.map(item => item)}
                <Link
                    to={handlePagination(currentPage + 1)}
                    className={`btn btn-light ${currentPage >= totalPage ? 'disabled' : ''}`}
                    style={{ cursor: 'pointer' }}
                >Sau</Link>
            </div>
        </div>
    )
}