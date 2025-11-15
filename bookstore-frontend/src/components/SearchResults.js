import React, { useState, useEffect } from "react";
import { useSearchParams, Link } from 'react-router-dom';
import BookService from "../services/BookService";
import { useCart } from '../context/CartContext'; 
import AuthService from '../services/AuthService'; 
import './Home.css'; 

const SearchResults = () => {
    const [searchParams] = useSearchParams();
    const query = searchParams.get('q'); 

    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState('');
    
    const { addToCart } = useCart();
    const currentUser = AuthService.getCurrentUser();
    const showAdminBoard = currentUser?.roles?.includes("ROLE_ADMIN");

    useEffect(() => {
        if (query) {
            setLoading(true);
            BookService.searchBooks(query).then(
                (response) => {
                    setBooks(response.data);
                    setLoading(false);
                },
                (error) => {
                    const resMessage =
                        (error.response?.data?.message) ||
                        error.message ||
                        error.toString();
                    setMessage(resMessage);
                    setLoading(false);
                }
            );
        }
    }, [query]); 

    // === 1. COPY HÀM NÀY TỪ HOME.JS ===
    const handleDelete = (id) => {
        if (window.confirm('Bạn có chắc muốn xóa cuốn sách này?')) {
            BookService.deleteBook(id).then(
                () => {
                    // Tải lại danh sách sách sau khi xóa
                    setBooks(books.filter((book) => book.id !== id));
                },
                (error) => {
                    const resMessage = (error.response?.data?.message) || error.message || error.toString();
                    alert("Lỗi khi xóa: " + resMessage);
                }
            );
        }
    };

    // === 2. COPY HÀM NÀY TỪ HOME.JS ===
    const handleAddToCart = (book) => {
        addToCart(book);
        alert('Đã thêm "' + book.title + '" vào giỏ hàng!');
    };


    if (loading) {
        return <div className="loading"><h2>Đang tìm sách...</h2></div>;
    }

    if (message) {
        return <div className="message-error">Lỗi: {message}</div>;
    }

    return (
        <div className="book-list-container">
            <h2 className="search-results-title">
                Kết quả tìm kiếm cho: "{query}"
            </h2>

            {books.length === 0 && !loading && (
                <p>Không tìm thấy cuốn sách nào khớp với từ khóa của bạn.</p>
            )}

            {/* (Phần .map() y hệt Home.js) */}
            {books.map((book) => (
                <div className="book-card" key={book.id}>
                    <Link to={`/book/${book.id}`}>
                        <img 
                            src={book.imageUrl || 'https://via.placeholder.com/150x220.png?text=No+Image'} 
                            alt={book.title} 
                            className="book-card-image"
                        />
                    </Link>
                    <div className="book-card-content">
                        <Link to={`/book/${book.id}`} className="book-card-title-link">
                            <h3 className="book-card-title">{book.title}</h3>
                        </Link>
                        <p className="book-card-author">Tác giả: {book.author}</p>
                        <p className="book-card-price">{book.price.toLocaleString('vi-VN')} VND</p>
                        
                        <div className="book-card-actions">
                            <button className="btn-add" onClick={() => handleAddToCart(book)}>
                                Thêm vào giỏ
                            </button>
                            {showAdminBoard && (
                                <div className="admin-actions">
                                    <Link to={`/edit-book/${book.id}`} className="btn-edit">Sửa</Link>
                                    <button className="btn-delete" onClick={() => handleDelete(book.id)}>Xóa</button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

// (Dòng export của bạn đã đúng)
export default SearchResults;