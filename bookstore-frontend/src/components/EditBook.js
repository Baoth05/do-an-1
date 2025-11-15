import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import BookService from '../services/BookService';
import './CreateBook.css'; // Dùng chung style

const EditBook = () => {
    const { id } = useParams(); 
    
    // === 1. STATE CHO 7 TRƯỜNG ===
    const [title, setTitle] = useState('');
    const [author, setAuthor] = useState('');
    const [price, setPrice] = useState(0);
    const [imageUrl, setImageUrl] = useState('');
    const [description, setDescription] = useState('');
    const [pageCount, setPageCount] = useState(0);
    const [publicationYear, setPublicationYear] = useState(2000);

    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    
    const navigate = useNavigate();

    // Tải dữ liệu cũ (Đã bao gồm 7 trường)
    useEffect(() => {
        BookService.getBookById(id).then(
            (response) => {
                const book = response.data;
                setTitle(book.title);
                setAuthor(book.author);
                setPrice(book.price);
                setImageUrl(book.imageUrl || '');
                setDescription(book.description || ''); 
                setPageCount(book.pageCount || 0);
                setPublicationYear(book.publicationYear || 2000);
            },
            (error) => {
                // (Log của bạn chứng minh API GET /books/id đã chạy OK)
                const resMessage = (error.response?.data?.message) || error.message || error.toString();
                setMessage("Lỗi tải dữ liệu: " + resMessage);
            }
        );
    }, [id]); 

    // 2. Hàm xử lý Cập nhật (Gửi 7 trường)
    const handleUpdateBook = (e) => {
        e.preventDefault();
        setMessage('');
        setLoading(true);

        const bookData = {
            title,
            author,
            price: parseFloat(price),
            imageUrl,
            description,
            pageCount: parseInt(pageCount),
            publicationYear: parseInt(publicationYear)
        };

       BookService.updateBook(id, bookData)
    .then((response) => {
        navigate('/home');
    })
    .catch((error) => {
        const resMessage = (error.response?.data?.message) || error.message || error.toString();
        setMessage("Lỗi cập nhật: " + resMessage);
    })
    .finally(() => setLoading(false)); // ✅ luôn chạy sau cùng

    };

    return (
        <div className="form-container">
            {/* 3. Dùng hàm handleUpdateBook */}
            <form onSubmit={handleUpdateBook}> 
                <h2>Sửa thông tin sách (ID: {id})</h2>

                {/* (4 trường cũ) */}
                <div className="form-group">
                    <label htmlFor="title">Tiêu đề sách</label>
                    <input type="text" id="title" value={title} onChange={(e) => setTitle(e.target.value)} required />
                </div>
                <div className="form-group">
                    <label htmlFor="author">Tác giả</label>
                    <input type="text" id="author" value={author} onChange={(e) => setAuthor(e.target.value)} required />
                </div>
                <div className="form-group">
                    <label htmlFor="price">Giá (VND)</label>
                    <input type="number" id="price" value={price} onChange={(e) => setPrice(e.target.value)} required />
                </div>
                <div className="form-group">
                    <label htmlFor="imageUrl">Link hình ảnh (URL)</label>
                    <input type="text" id="imageUrl" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} />
                </div>

                {/* === 4. THÊM 3 FORM "XỊN" === */}
                <div className="form-group">
                    <label htmlFor="description">Mô tả</label>
                    <textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} />
                </div>
                <div className="form-group">
                    <label htmlFor="pageCount">Số trang</label>
                    <input type="number" id="pageCount" value={pageCount} onChange={(e) => setPageCount(e.target.value)} />
                </div>
                <div className="form-group">
                    <label htmlFor="publicationYear">Năm xuất bản</label>
                    <input type="number" id="publicationYear" value={publicationYear} onChange={(e) => setPublicationYear(e.target.value)} />
                </div>
                
                <button type="submit" disabled={loading}>
                    {loading ? "Đang xử lý..." : "Cập nhật sách"}
                </button>
                
                {message && (
                    <p className="message-error">{message}</p>
                )}
            </form>
        </div>
    );
};

export default EditBook;