import { useEffect, useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom"
import { useDebouncedCallback } from "use-debounce"
import { Search as SearchComponent } from 'lucide-react';

export default function Search({ placeholder }) {
    const [searchParams] = useSearchParams(); //Sẽ bị re-render khi url thay đổi
    const params = new URLSearchParams(searchParams);
    const navigate = useNavigate();
    const pathName = useLocation().pathname;
    const [value, setValue] = useState('');

    useEffect(() => {
        setValue(searchParams.get('query') || '');
    }, [searchParams])

    const handleChange = (e) => {
        const newValue = e.target.value;
        setValue(newValue);
        handleSearch(newValue);
    }

    const handleSearch = useDebouncedCallback((query) => {
        if (query) {
            params.set('query', query);
        }
        else {
            params.delete('query')
        }
        params.set('page', '1');
        navigate(`${pathName}?${params}`, { replace: true })

    }, 100)

    return (
        <div className="input-group my-4">
            <span className="input-group-text"><SearchComponent /></span>
            <input
                type="text"
                className="form-control"
                value={value}
                placeholder={placeholder}
                onChange={(e) => { handleChange(e) }}
                autoFocus
            />
        </div>
    )
}