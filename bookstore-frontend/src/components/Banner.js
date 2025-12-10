import React from 'react';
import './Home.css'; // Sử dụng file CSS chung để định kiểu
import bannerImg from '../assets/banner.jpg'; // Import hình ảnh banner mới

const Banner = () => {
    return (
        <div className="banner-container">
            {/* Hình ảnh banner làm nền */}
            <img src={bannerImg} alt="Banner Bookstore" className="banner-image" />

            {/* Nội dung chữ hiển thị trên banner */}
            <div className="banner-content">
                <h1 className="banner-title">KHÁM PHÁ THẾ GIỚI SÁCH</h1>
                <p className="banner-subtitle">
                    Hàng ngàn đầu sách mới nhất và kinh điển đang chờ đón bạn.
                </p>
                <button className="btn-explore">Khám phá ngay</button>
            </div>
        </div>
    );
};

export default Banner;