import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import BookService from '../services/BookService';
import { useCart } from '../context/CartContext'; 
import './BookDetail.css'; 

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

    // Logic kiểm tra hết hàng (Dựa vào số lượng HOẶC trạng thái)
    // Nếu book chưa tải xong (null) thì mặc định là 0 để không lỗi
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

    if (loading) return <div className="detail-container"><h2>Đang tải...</h2></div>;
    if (message) return <div className="detail-container message-error">Lỗi: {message}</div>;
    if (!book) return <div className="detail-container"><h2>Không tìm thấy sách.</h2></div>;

    return (
        <div className="detail-container" style={{ display: 'flex', gap: '40px', padding: '20px' }}>
            
            {/* --- CỘT TRÁI: HÌNH ẢNH (GALLERY) --- */}
            <div className="detail-image-section" style={{ flex: '1' }}>
                {/* 1. Ảnh lớn */}
                <div className="main-image-frame" style={{ marginBottom: '15px', textAlign: 'center', border: '1px solid #eee', padding: '10px', borderRadius: '8px' }}>
                    <img 
                        src={mainImage || 'https://via.placeholder.com/300x450.png?text=No+Image'} 
                        alt={book.title} 
                        style={{ maxWidth: '100%', maxHeight: '450px', objectFit: 'contain' }}
                    />
                </div>

                {/* 2. Danh sách ảnh nhỏ (Thumbnails) */}
                <div className="thumbnails-list" style={{ display: 'flex', gap: '10px', overflowX: 'auto', paddingBottom: '10px' }}>
                    {/* Ảnh gốc */}
                    <img 
                        src={book.imageUrl} 
                        onClick={() => setMainImage(book.imageUrl)}
                        style={{ 
                            width: '70px', height: '90px', objectFit: 'cover', cursor: 'pointer', 
                            border: mainImage === book.imageUrl ? '2px solid #007bff' : '1px solid #ddd',
                            borderRadius: '4px'
                        }}
                        alt="Gốc"
                    />
                    {/* Ảnh phụ (Lặp qua danh sách images) */}
                    {book.images && book.images.map((img, idx) => (
                        <img 
                            key={idx}
                            src={img.imageUrl} 
                            onClick={() => setMainImage(img.imageUrl)}
                            style={{ 
                                width: '70px', height: '90px', objectFit: 'cover', cursor: 'pointer', 
                                border: mainImage === img.imageUrl ? '2px solid #007bff' : '1px solid #ddd',
                                borderRadius: '4px'
                            }}
                            alt={`Phụ ${idx}`}
                        />
                    ))}
                </div>
            </div>

            {/* --- CỘT PHẢI: THÔNG TIN --- */}
            <div className="detail-content" style={{ flex: '1.5' }}>
                <h1 className="detail-title" style={{ fontSize: '2rem', marginBottom: '10px' }}>{book.title}</h1>
                
                <div style={{ display: 'flex', gap: '20px', color: '#666', marginBottom: '15px' }}>
                    <span>Tác giả: <strong>{book.author}</strong></span>
                    <span>|</span>
                    <span>Thể loại: {book.category}</span>
                </div>

                {/* GIÁ VÀ TRẠNG THÁI KHO */}
                <div style={{ background: '#f8f9fa', padding: '20px', borderRadius: '8px', marginBottom: '20px' }}>
                    <h2 className="detail-price" style={{ color: '#d32f2f', margin: '0 0 10px 0' }}>
                        {book.price.toLocaleString('vi-VN')} ₫
                    </h2>
                    
                    <div style={{ fontSize: '1.1rem' }}>
                        Trạng thái: 
                        {isOutOfStock ? (
                            <span style={{ color: 'red', fontWeight: 'bold', marginLeft: '10px' }}>
                                🚫 Hết hàng 
                                {quantity <= 0 ? " (Kho đã hết)" : " (Ngừng bán)"}
                            </span>
                        ) : (
                            <span style={{ color: 'green', fontWeight: 'bold', marginLeft: '10px' }}>
                                ✅ Còn hàng (Sẵn có: {quantity})
                            </span>
                        )}
                    </div>
                </div>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '20px', color: '#555' }}>
                    <p><strong>Năm XB:</strong> {book.publicationYear}</p>
                    <p><strong>Số trang:</strong> {book.pageCount}</p>
                </div>
                
                <h3 className="detail-desc-title" style={{ borderBottom: '1px solid #eee', paddingBottom: '10px' }}>Mô tả sản phẩm</h3>
                <p className="detail-description" style={{ lineHeight: '1.6', color: '#333' }}>{book.description}</p>
                
                {/* NÚT MUA HÀNG */}
                <div style={{ marginTop: '30px' }}>
                    {isOutOfStock ? (
                        <button className="btn-add-to-cart" style={{ 
                            backgroundColor: '#ccc', cursor: 'not-allowed', 
                            padding: '15px 40px', fontSize: '1.2rem', border: 'none', borderRadius: '5px', color: '#666' 
                        }} disabled>
                            Hết hàng
                        </button>
                    ) : (
                        <button className="btn-add-to-cart" onClick={handleAddToCart} style={{
                            backgroundColor: '#d32f2f', color: 'white',
                            padding: '15px 40px', fontSize: '1.2rem', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold'
                        }}>
                            <i className="fas fa-cart-plus"></i> Thêm vào giỏ hàng
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default BookDetail;