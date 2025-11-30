import React from 'react';
import './Banner.css'; // Sẽ tạo ngay sau đây
import { Link } from 'react-router-dom'; // Dùng để điều hướng đến trang sách

const Banner = () => {
    return (
        <div className="banner-container">
            <div className="banner-content">
                <h1 className="banner-title">Khám Phá Thế Giới Sách Đa Dạng</h1>
                <p className="banner-subtitle">
                    Hàng ngàn đầu sách mới nhất và kinh điển đang chờ đón bạn.
                    Tìm đọc cuốn sách yêu thích của bạn ngay hôm nay!
                </p>
                {/* Nút "Khám phá ngay" sẽ dẫn về trang chủ (hoặc trang `/books` nếu có) */}
                <Link to="/home" className="banner-button">
                    Khám phá ngay
                </Link>
            </div>
        </div>
    );
};

export default Banner;