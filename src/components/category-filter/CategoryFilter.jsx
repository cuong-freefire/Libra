import { useEffect, useState } from "react"
import { getCategories } from "../../services/categoryService";
import { toast } from "react-toastify";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";

export default function CategoryFilter() {

    const [categories, setCategories] = useState([]);
    const [selected, setSelected] = useState(0);
    const [searchParams] = useSearchParams();
    const params = new URLSearchParams(searchParams);
    const navigate = useNavigate();
    const pathName = useLocation().pathname;

    useEffect(() => {
        async function fetchCategories() {
            try {
                const data = await getCategories();
                setCategories(data)
            }
            catch (error) {
                setCategories([])
                toast.dismiss()
                toast.error(error.message || 'Đăng nhập thất bại.')
            }
        }

        fetchCategories();
    }, [])

    useEffect(() => {
        setSelected(Number(searchParams.get('category')) || 0);
    }, [searchParams])

    const handleChange = (e) => {
        const newValue = e.target.value;
        setSelected(Number(newValue));
        handleSelect(Number(newValue));
    }

    const handleSelect = (value) => {
        if (value === 0) {
            params.delete('category')
        }
        else {
            params.set('category', value)
        }

        params.set('page', 1);
        navigate(`${pathName}?${params}`, { replace: true })
    }



    return (
        <div className="my-3">
            <strong>Thể loại: </strong>
            <select value={selected} defaultValue={0} className="form-select mt-2" onChange={(e) => {
                handleChange(e)
            }}>
                <option value={0}>Tất cả</option>
                {
                    categories.length > 0 &&
                    categories?.map(c => {
                        return (
                            <option value={c.id}>{c.name}</option>
                        )
                    })
                }
            </select>
        </div>
    )
}