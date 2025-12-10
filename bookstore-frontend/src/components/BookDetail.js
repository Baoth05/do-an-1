import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import BookService from '../services/BookService';
import { useCart } from '../context/CartContext'; 
import './BookDetail.css'; // Import file CSS vừa tạo

const BookDetail = () => {
    const [book, setBook] = useState(null);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState('');
    
    // STATE MỚI: Để lưu ảnh đang được hiển thị to
    const [mainImage, setMainImage] = useState(''); 

    const { id } = useParams(); 
    const { addToCart } = useCart();

    useEffect(() => {
        BookService.getBookById(id).then(
            (response) => {
                setBook(response.data);
                // Mặc định hiển thị ảnh bìa chính khi mới vào
                setMainImage(response.data.imageUrl); 
                setLoading(false);
            },
            (error) => {
                const resMessage = (error.response?.data?.message) || error.message || error.toString();
                setMessage(resMessage);
                setLoading(false);
            }
        );
    }, [id]);

    // Logic kiểm tra hết hàng
    const quantity = book?.stockQuantity || 0;
    const isOutOfStock = quantity <= 0 || 
                         (book && book.status === 'Hết hàng') || 
                         (book && book.status === 'Ngừng kinh doanh');

    const handleAddToCart = () => {
        if (book) {
            addToCart(book);
            alert('Đã thêm "' + book.title + '" vào giỏ hàng!');
        }
    };

    if (loading) return <div className="loading-container"><h2>Đang tải dữ liệu...</h2></div>;
    if (message) return <div className="error-container message-error">Lỗi: {message}</div>;
    if (!book) return <div className="error-container"><h2>Không tìm thấy sách.</h2></div>;

    return (
        <div className="detail-container">
            
            {/* --- CỘT TRÁI: HÌNH ẢNH (GALLERY) --- */}
            <div className="detail-image-section">
                {/* 1. Ảnh lớn */}
                <div className="main-image-frame">
                    <img 
                        src={mainImage || 'https://via.placeholder.com/300x450.png?text=No+Image'} 
                        alt={book.title} 
                        className="main-image"
                    />
                </div>

                {/* 2. Danh sách ảnh nhỏ (Thumbnails) */}
                <div className="thumbnails-list">
                    {/* Ảnh gốc */}
                    <img 
                        src={book.imageUrl} 
                        onClick={() => setMainImage(book.imageUrl)}
                        className={`thumbnail-img ${mainImage === book.imageUrl ? 'active' : ''}`}
                        alt="Gốc"
                    />
                    {/* Ảnh phụ (Lặp qua danh sách images) */}
                    {book.images && book.images.map((img, idx) => (
                        <img 
                            key={idx}
                            src={img.imageUrl} 
                            onClick={() => setMainImage(img.imageUrl)}
                            className={`thumbnail-img ${mainImage === img.imageUrl ? 'active' : ''}`}
                            alt={`Phụ ${idx}`}
                        />
                    ))}
                </div>
            </div>

            {/* --- CỘT PHẢI: THÔNG TIN --- */}
            <div className="detail-content">
                <h1 className="detail-title">{book.title}</h1>
                
                <div className="book-meta-info">
                    <span>Tác giả: <strong>{book.author}</strong></span>
                    <span>|</span>
                    <span>Thể loại: {book.category}</span>
                </div>

                {/* GIÁ VÀ TRẠNG THÁI KHO */}
                <div className="price-box">
                    <h2 className="detail-price">
                        {book.price.toLocaleString('vi-VN')} ₫
                    </h2>
                    
                    <div className="stock-status">
                        Trạng thái: 
                        {isOutOfStock ? (
                            <span className="status-text out">
                                🚫 Hết hàng {quantity <= 0 ? "(Kho đã hết)" : "(Ngừng bán)"}
                            </span>
                        ) : (
                            <span className="status-text in">
                                ✅ Còn hàng (Sẵn có: {quantity})
                            </span>
                        )}
                    </div>
                </div>
                
                <div className="details-grid">
                    <p><strong>Năm XB:</strong> {book.publicationYear}</p>
                    <p><strong>Số trang:</strong> {book.pageCount}</p>
                </div>
                
                <h3 className="detail-desc-title">Mô tả sản phẩm</h3>
                <p className="detail-description">{book.description}</p>
                
                {/* NÚT MUA HÀNG */}
                <div className="action-buttons">
                    {isOutOfStock ? (
                        <button className="btn-add-to-cart disabled" disabled>
                            Hết hàng
                        </button>
                    ) : (
                        <button className="btn-add-to-cart buy" onClick={handleAddToCart}>
                            <i className="fas fa-cart-plus"></i> Thêm vào giỏ hàng
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default BookDetail;