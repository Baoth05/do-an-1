import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './SearchBar.css'; // Sẽ tạo ngay sau đây

const SearchBar = () => {
    const [query, setQuery] = useState('');
    const navigate = useNavigate(); // Dùng để chuyển trang

    const handleSearch = (e) => {
        // Ngăn trình duyệt reload (F5)
        e.preventDefault(); 
        
        if (query.trim()) {
            // Chuyển người dùng đến trang Kết quả
            // (Chúng ta sẽ tạo trang /search-results ở bước sau)
            navigate(`/search-results?q=${query}`);
            setQuery(''); // Xóa nội dung ô tìm kiếm
        }
    };

    return (
        // Dùng <form> để có thể nhấn Enter
        <form className="search-bar-form" onSubmit={handleSearch}>
            <input
                type="text"
                className="search-bar-input"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Tìm kiếm sách..."
            />
            <button type="submit" className="search-bar-button">
                Tìm
            </button>
        </form>
    );
};

export default SearchBar;