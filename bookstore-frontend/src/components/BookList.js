import React, { useState, useEffect } from 'react';
import BookService from '../services/BookService';
import { Link } from 'react-router-dom';
import AuthService from '../services/AuthService'; 
import './BookList.css';

// 1. SỬA LỖI: THÊM DÒNG IMPORT NÀY
import { useCart } from '../context/CartContext';

const BookList = () => {
    const [books, setBooks] = useState([]);
    const [message, setMessage] = useState(''); 
    const [isAdmin, setIsAdmin] = useState(false);
    
    // 2. Dòng này bây giờ sẽ hoạt động
    const { addToCart } = useCart(); 

    const handleAddToCart = (book) => {
        addToCart(book);
        alert(`Đã thêm "${book.title}" vào giỏ hàng!`); 
    };

    useEffect(() => {
        const currentUser = AuthService.getCurrentUser();
        if (currentUser) {
            setIsAdmin(currentUser.roles && currentUser.roles.includes("ROLE_ADMIN"));
        }
        fetchBooks();
    }, []); 

    const fetchBooks = () => {
        BookService.getAllBooks().then(
            (response) => {
                setBooks(response.data);
            },
            (error) => { 
                const resMessage = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
                setMessage(resMessage);
            }
        );
    };

    const handleDelete = (bookId) => { 
        if (window.confirm('Bạn có chắc chắn muốn xóa cuốn sách này?')) {
            BookService.deleteBook(bookId).then(
                () => {
                    fetchBooks(); 
                },
                (error) => { 
                    const resMessage = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
                    setMessage(resMessage);
                }
            );
        }
    }; 

    if (message) { 
        return <div className="message-error">{message}</div>;
    }

    return (
        <div className="book-list-container">
            <h2>Danh sách Sách</h2>
            
            <div className="book-grid">
                {books.map((book) => (
                    <div className="book-card" key={book.id}>
                        <img src={book.imageUrl || 'https://via.placeholder.com/150x220.png?text=No+Image'} alt={book.title} />
                        <h3>{book.title}</h3>
                        <p>Tác giả: {book.author}</p>
                        <p className="price">{book.price.toLocaleString('vi-VN')} VND</p>
                        
                        {/* Nút thêm vào giỏ */}
                        <div className="user-actions">
                        <button 
                            className="btn-add-to-cart"
                            onClick={() => handleAddToCart(book)}
                        >
                            Thêm vào giỏ
                        </button>
                        </div>
                        
                        {/* Nút Admin */}
                        {isAdmin && (
                            <div className="admin-actions">
                                <Link to={`/edit-book/${book.id}`} className="btn-edit">
                                    Sửa
                                </Link>
                                <button 
                                    className="btn-delete" 
                                    onClick={() => handleDelete(book.id)}
                                >
                                    Xóa
                                </button>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default BookList;