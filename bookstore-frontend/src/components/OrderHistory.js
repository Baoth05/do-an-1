import React, { useState, useEffect } from 'react';
import OrderService from '../services/OrderService';
import './OrderHistory.css'; 

const OrderHistory = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState('');

    useEffect(() => {
        OrderService.getOrderHistory().then(
            (response) => {
                
                // === BẠN ĐÃ SỬA PHẦN NÀY (RẤT TỐT) ===
                if (Array.isArray(response.data)) {
                    setOrders(response.data.reverse()); 
                } else {
                    setOrders([]);
                }
                setLoading(false);
            },
            (error) => {
                // ... (phần error giữ nguyên) ...
                const resMessage = (error.response?.data?.message) || error.message || error.toString();
                setMessage(resMessage);
                setLoading(false);
            }
        );
    }, []); 

    const formatDate = (dateTimeString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
        return new Date(dateTimeString).toLocaleDateString('vi-VN', options);
    };

    if (loading) {
        return <div className="cart-container"><h2>Đang tải lịch sử đơn hàng...</h2></div>;
    }

    if (message) {
        return <div className="cart-container message-error">Lỗi: {message}</div>;
    }
    
    // (Phần "chưa có đơn hàng" giữ nguyên)
    if (orders.length === 0) {
        return (
            <div className="cart-container">
                <h2>Lịch sử Đơn hàng</h2>
                <p>Bạn chưa đặt đơn hàng nào.</p>
            </div>
        );
    }

    return (
        <div className="history-container">
            <h2>Lịch sử Đơn hàng</h2>
            {orders.map((order) => (
                <div className="order-card" key={order.id}>
                    <div className="order-header">
                        <h3>Đơn hàng #{order.id}</h3>
                        <p>Ngày đặt: {formatDate(order.orderDate)}</p>
                        
                        {/* === SỬA LỖI VẪN CÒN Ở ĐÂY === */}
                        {/* Thêm (order.totalAmount || 0) để tránh lỗi null */}
                        <strong>
                            Tổng tiền: {(order.totalAmount || 0).toLocaleString('vi-VN')} VND
                        </strong>
                    </div>
                    
                    <div className="order-items-list">
                        <h4>Chi tiết đơn hàng:</h4>
                        {/* Thêm (order.orderItems && ... ) để tránh lỗi null item */}
                        {order.orderItems && order.orderItems.map((item) => (
                            <div className="order-item" key={item.id}>
                                <p>
                                    (ID Sách: {item.bookId}) - SL: {item.quantity} x 
                                    {/* Thêm (item.price || 0) để tránh lỗi null */}
                                    {(item.price || 0).toLocaleString('vi-VN')} VND
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default OrderHistory;