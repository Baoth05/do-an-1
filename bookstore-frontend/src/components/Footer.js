    import React from 'react';
import { Link } from 'react-router-dom'; // Dùng Link để điều hướng nội bộ
import './Footer.css'; // Sẽ tạo ngay sau đây

const Footer = () => {
    return (
        <footer className="footer-container">
            <div className="footer-content">
                
                {/* Cột 1: Giới thiệu */}
                <div className="footer-section about">
                    <h3 className="footer-title">Bookstore</h3>
                    <p>
                        Đây là dự án demo website bán sách trực tuyến sử dụng
                        React (Frontend) và Spring Boot (Backend) để hoàn thành
                        đồ án môn học.
                    </p>
                </div>

                {/* Cột 2: Liên hệ */}
                <div className="footer-section contact">
                    <h3 className="footer-title">Liên hệ</h3>
                    <p>Email: Baotruonghoang01@gmail.com</p>
                    <p>Điện thoại: (097) 169 4448</p>
                    <p>Địa chỉ: 123 Nguyễn Văn Cừ, P.4, TP Cần Thơ</p>
                </div>

                {/* Cột 3: Liên kết nhanh */}
                <div className="footer-section links">
                    <h3 className="footer-title">Liên kết nhanh</h3>
                    <ul>
                        <li><Link to="/home">Trang chủ</Link></li>
                        <li><Link to="/cart">Giỏ hàng</Link></li>
                        <li><Link to="/my-orders">Lịch sử đơn hàng</Link></li>
                    </ul>
                </div>

            </div>
            
            {/* Dòng Copyright ở dưới cùng */}
            <div className="footer-bottom">
                <p>&copy; 2025 Bookstore | Thiết kế bởi Trương Hoàng Bảo
                </p>
            </div>
        </footer>
    );
};

export default Footer;