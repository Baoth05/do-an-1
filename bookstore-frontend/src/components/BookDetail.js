import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import BookService from '../services/BookService';
import { useCart } from '../context/CartContext'; // Lấy "kho" giỏ hàng
import './BookDetail.css'; // Sẽ tạo ngay sau đây

const BookDetail = () => {
    const [book, setBook] = useState(null);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState('');
    
    // 1. Lấy "id" từ URL (ví dụ: /book/53)
    const { id } = useParams(); 
    
    // 2. Lấy hàm "thêm vào giỏ"
    const { addToCart } = useCart();


    useEffect(() => {
        // 3. Gọi API để lấy chi tiết sách
        BookService.getBookById(id).then(
            (response) => {
                setBook(response.data);
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
    }, [id]); // Chạy lại khi "id" thay đổi

    // 4. Hàm xử lý khi nhấn "Thêm vào giỏ"
    const handleAddToCart = () => {
        if (book) {
            addToCart(book);
            // Thông báo (hoặc chuyển hướng)
            alert('Đã thêm "' + book.title + '" vào giỏ hàng!');
            // (Bạn cũng có thể chuyển về /cart hoặc /home)
            // navigate('/cart'); 
        }
    };

    if (loading) {
        return <div className="detail-container"><h2>Đang tải...</h2></div>;
    }

    if (message) {
        return <div className="detail-container message-error">Lỗi: {message}</div>;
    }

    if (!book) {
        return <div className="detail-container"><h2>Không tìm thấy sách.</h2></div>;
    }

    // 5. Giao diện chi tiết sách
    return (
        <div className="detail-container">
            <div className="detail-image">
                <img 
                    src={book.imageUrl || 'https://via.placeholder.com/300x450.png?text=No+Image'} 
                    alt={book.title} 
                />
            </div>
            <div className="detail-content">
                <h1 className="detail-title">{book.title}</h1>
                <p className="detail-author">Tác giả: {book.author}</p>
                <p className="detail-year">Năm XB: {book.publicationYear}</p>
                <p className="detail-pages">Số trang: {book.pageCount}</p>
                
                <p className="detail-price">
                    Giá: {book.price.toLocaleString('vi-VN')} VND
                </p>
                
                <h3 className="detail-desc-title">Mô tả</h3>
                <p className="detail-description">{book.description}</p>
                
                <button className="btn-add-to-cart" onClick={handleAddToCart}>
                    Thêm vào giỏ hàng
                </button>
            </div>
        </div>
    );
};

export default BookDetail;