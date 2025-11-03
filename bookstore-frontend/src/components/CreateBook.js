import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BookService from '../services/BookService';
import './CreateBook.css'; // Sẽ tạo file CSS sau

const CreateBook = () => {
    const [title, setTitle] = useState('');
    const [author, setAuthor] = useState('');
    const [price, setPrice] = useState(0);
    const [imageUrl, setImageUrl] = useState('');

    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const handleCreateBook = (e) => {
        e.preventDefault();

        setMessage('');
        setLoading(true);

        // 1. Gói dữ liệu sách
        const bookData = {
            title,
            author,
            price: parseFloat(price), // Chuyển giá về số
            imageUrl
        };

        // 2. Gọi API
        BookService.createBook(bookData).then(
            (response) => {
                // Nếu thành công, chuyển về trang chủ
                navigate('/home');
            },
            (error) => {
                // Nếu thất bại (vd: không phải Admin, lỗi server...)
                const resMessage =
                    (error.response &&
                        error.response.data &&
                        error.response.data.message) ||
                    error.message ||
                    error.toString();

                setLoading(false);
                setMessage(resMessage); // Hiển thị lỗi
            }
        );
    };

    return (
        <div className="form-container">
            <form onSubmit={handleCreateBook}>
                <h2>Thêm Sách Mới</h2>

                <div className="form-group">
                    <label htmlFor="title">Tiêu đề sách</label>
                    <input
                        type="text"
                        id="title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="author">Tác giả</label>
                    <input
                        type="text"
                        id="author"
                        value={author}
                        onChange={(e) => setAuthor(e.target.value)}
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="price">Giá (VND)</label>
                    <input
                        type="number"
                        id="price"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="imageUrl">Link hình ảnh (URL)</label>
                    <input
                        type="text"
                        id="imageUrl"
                        value={imageUrl}
                        onChange={(e) => setImageUrl(e.target.value)}
                    />
                </div>

                <button type="submit" disabled={loading}>
                    {loading ? "Đang xử lý..." : "Tạo sách"}
                </button>

                {message && (
                    <p className="message-error">{message}</p>
                )}
            </form>
        </div>
    );
};

export default CreateBook;