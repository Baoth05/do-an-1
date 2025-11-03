import React, { useState, useEffect } from 'react';
import BookService from '../services/BookService';
import './BookList.css'; // Chúng ta sẽ tạo file CSS này sau

const BookList = () => {
    const [books, setBooks] = useState([]); // Lưu danh sách sách
    const [error, setError] = useState(''); // Lưu lỗi

    // useEffect sẽ chạy 1 lần duy nhất khi component được tải
    useEffect(() => {
        BookService.getAllBooks().then(
            (response) => {
                // Nếu gọi API thành công, lưu sách vào state
                setBooks(response.data);
            },
            (error) => {
                // Nếu thất bại (vd: token hết hạn, server sập)
                const resMessage =
                    (error.response &&
                        error.response.data &&
                        error.response.data.message) ||
                    error.message ||
                    error.toString();
                setError(resMessage);
            }
        );
    }, []); // Dấu [] rỗng nghĩa là "chỉ chạy 1 lần"

    return (
        <div className="book-list-container">
            <h2>Danh sách Sách</h2>
            {error && <p className="error-message">{error}</p>}

            <div className="book-grid">
                {/* Dùng .map() để "vẽ" từng cuốn sách */}
                {books.map((book) => (
                    <div key={book.id} className="book-card">
                        <img src={book.imageUrl || 'https://via.placeholder.com/150'} alt={book.title} />
                        <h3>{book.title}</h3>
                        <p>Tác giả: {book.author}</p>
                        <p>Giá: {book.price.toLocaleString('vi-VN')} VND</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default BookList;