import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import './Cart.css'; // Dùng chung style

// 1. IMPORT ORDER SERVICE MỚI
import OrderService from '../services/OrderService';

const Checkout = () => {
    const { cartItems, clearCart } = useCart();
    const navigate = useNavigate();
    
    const [isOrderComplete, setIsOrderComplete] = useState(false);
    
    // 2. Thêm state để báo lỗi và đang tải
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    // (Hàm calculateTotal giữ nguyên)
    const calculateTotal = () => {
        return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
    };

    // === 3. NÂNG CẤP HÀM XỬ LÝ "XÁC NHẬN" ===
    const handleConfirmOrder = () => {
        setLoading(true);
        setMessage('');

        // Gọi API Backend
        OrderService.createOrder(cartItems).then(
            (response) => {
                // THÀNH CÔNG (Backend đã lưu vào DB)
                setLoading(false);
                setIsOrderComplete(true); // Hiển thị thông báo "Cảm ơn"
                clearCart(); // Xóa sạch giỏ hàng (localStorage)
                
                // Tự động quay về trang chủ sau 3 giây
                setTimeout(() => {
                    navigate('/home');
                }, 3000);
            },
            (error) => {
                // THẤT BẠI
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
    // ==========================================

    // (Giao diện "Đặt hàng thành công" giữ nguyên)
    if (isOrderComplete) {
        return (
            <div className="cart-container">
                <h2>Đặt hàng thành công!</h2>
                <p>Cảm ơn bạn đã mua sắm. Đơn hàng của bạn đã được lưu.</p>
                <p>Bạn sẽ được chuyển về trang chủ trong 3 giây...</p>
            </div>
        );
    }
    
    // (Giao diện "Giỏ hàng rỗng" giữ nguyên)
    if (cartItems.length === 0 && !loading) {
         return (
            <div className="cart-container">
                <h2>Giỏ hàng rỗng</h2>
                <p>Bạn không có sản phẩm nào để thanh toán.</p>
            </div>
        );
    }

    // (Giao diện Xác nhận đơn hàng giữ nguyên)
    return (
        <div className="cart-container">
            <h2>Xác nhận Đơn hàng</h2>
            
            {/* (Phần map() hiển thị tóm tắt đơn hàng giữ nguyên) */}
            <div className="cart-items-list">
                {cartItems.map((item) => (
                    <div className="cart-item" key={item.id}>
                        <img src={item.imageUrl || '...'} alt={item.title} className="cart-item-image" />
                        <div className="cart-item-details">
                            <h3>{item.title}</h3>
                            <p>Giá: {item.price.toLocaleString('vi-VN')} VND</p>
                            <p>Số lượng: {item.quantity}</p>
                        </div>
                        <div className="cart-item-actions">
                            <strong>{(item.price * item.quantity).toLocaleString('vi-VN')} VND</strong>
                        </div>
                    </div>
                ))}
            </div>

            <div className="cart-summary">
                <h3>Tổng cộng: {calculateTotal().toLocaleString('vi-VN')} VND</h3>
                
                {/* 4. SỬA LẠI NÚT (THÊM disabled KHI ĐANG TẢI) */}
                <button 
                    className="btn-checkout" 
                    onClick={handleConfirmOrder}
                    disabled={loading} // Vô hiệu hóa nút khi đang gửi
                >
                    {loading ? "Đang xử lý..." : "Xác nhận đặt hàng"}
                </button>

                {/* 5. HIỂN THỊ LỖI (NẾU CÓ) */}
                {message && (
                    <div className="message-error" style={{marginTop: '20px'}}>
                        {message}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Checkout;