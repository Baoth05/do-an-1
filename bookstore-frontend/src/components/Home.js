import React, { useState, useEffect } from "react";
import { Link } from 'react-router-dom';
import BookService from "../services/BookService";
import { useCart } from '../context/CartContext'; 
import AuthService from '../services/AuthService'; 
import Banner from './Banner';
import AdminDashboard from "./AdminDashboard"; 
import './Home.css'; // Import CSS

const Home = () => {
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState('');
    const { addToCart } = useCart();
    
    const currentUser = AuthService.getCurrentUser();
    const isAdmin = currentUser?.roles?.includes("ROLE_ADMIN");

    // 1. TẢI SÁCH
    useEffect(() => {
        BookService.getAllBooks().then(
            (response) => {
                const rawData = response.data || [];
                const sortedBooks = rawData.slice().reverse(); 
                setBooks(sortedBooks);
                setLoading(false);
            },
            (error) => {
                const resMessage = (error.response?.data?.message) || error.message || error.toString();
                setMessage(resMessage);
                setLoading(false);
            }
        );
    }, []); 

    // 2. HÀM XỬ LÝ
    const handleDelete = (id) => {
        if (window.confirm('Bạn có chắc muốn xóa cuốn sách này?')) {
            BookService.deleteBook(id).then(
                () => {
                    setBooks(books.filter((book) => book.id !== id));
                    alert("Đã xóa sách.");
                },
                (error) => alert("Lỗi: " + error.message)
            );
        }
    };

    const handleAddToCart = (book) => {
        addToCart(book);
        alert('Đã thêm "' + book.title + '" vào giỏ hàng!');
    };

    // 3. RENDER NÚT BẤM (Tách logic CSS ra class)
    const renderActionButtons = (book) => {
        // A. ADMIN: Nút Sửa / Xóa
        if (isAdmin) {
            return (
                <>
                    <Link to={`/edit-book/${book.id}`} className="btn-add btn-edit">
                        <i className="fas fa-edit me-1"></i> Sửa
                    </Link>
                    <button className="btn-add btn-delete" onClick={() => handleDelete(book.id)}>
                        <i className="fas fa-trash-alt me-1"></i> Xóa
                    </button>
                </>
            );
        }

        // B. USER: Nút Mua
        const quantity = book.stockQuantity || 0;
        const isOutOfStock = quantity <= 0 || book.status === 'Hết hàng' || book.status === 'Ngừng kinh doanh';

        if (isOutOfStock) {
            return (
                <button className="btn-add btn-disabled" disabled>
                    {quantity <= 0 ? "Tạm hết" : book.status}
                </button>
            );
        }
        return (
            <button className="btn-add btn-buy" onClick={() => handleAddToCart(book)}>
                <i className="fas fa-cart-plus me-2"></i> Chọn mua
            </button>
        );
    };

    if (loading) return <div className="loading"><h2>Đang tải dữ liệu...</h2></div>;
    if (message) return <div className="message-error">Lỗi: {message}</div>;

    return (
        <div className="home-container">
            {/* NẾU LÀ ADMIN: HIỆN DASHBOARD + PHÂN CÁCH */}
            {isAdmin ? (
                <div className="mb-5">
                    <AdminDashboard />
                    <div className="admin-separator">
                        <span className="admin-separator-text">QUẢN LÝ SÁCH</span>
                    </div>
                </div>
            ) : (
                <Banner />
            )}

            {/* KHUNG HIỂN THỊ SÁCH */}
            <div className="book-list-container">
                {!isAdmin && <h2 className="section-title">Sách Mới Tuyển Chọn</h2>}

                {Array.isArray(books) && books.length > 0 ? (
                    books.map((book) => {
                        if (!book) return null;
                        const quantity = book.stockQuantity || 0;
                        const isOutOfStock = quantity <= 0 || book.status === 'Hết hàng' || book.status === 'Ngừng kinh doanh';
                        const priceDisplay = (book.price || 0).toLocaleString('vi-VN');

                        return (
                            <div className="book-card" key={book.id}>
                                {isOutOfStock && <div className="badge-stock">HẾT HÀNG</div>}
                                
                                <Link to={`/book/${book.id}`} style={{position: 'relative'}}>
                                    {isOutOfStock && <div className="out-of-stock-overlay"></div>}
                                    <img 
                                        src={book.imageUrl || 'https://via.placeholder.com/250x350.png?text=No+Image'} 
                                        alt={book.title} 
                                        className="book-card-image"
                                    />
                                </Link>

                                <div className="book-card-content">
                                    <Link to={`/book/${book.id}`} className="book-card-title-link">
                                        <h3 className="book-card-title" title={book.title}>{book.title}</h3>
                                    </Link>
                                    <p className="book-card-author">{book.author}</p>
                                    
                                    <div className="book-card-footer">
                                        <p className="book-card-price">{priceDisplay} đ</p>
                                        
                                        <div className="book-meta">
                                            <span className="book-category">{book.category || 'Khác'}</span>
                                            {isOutOfStock ? (
                                                <span className="status-danger">Hết hàng</span>
                                            ) : (
                                                <span className="status-success">Kho: {quantity}</span>
                                            )}
                                        </div>

                                        <div className="book-card-actions">
                                            {renderActionButtons(book)}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })
                ) : (
                    <p style={{textAlign: 'center', width: '100%', gridColumn: '1 / -1'}}>Chưa có cuốn sách nào.</p>
                )}
            </div>
        </div>
    );
};

export default Home;