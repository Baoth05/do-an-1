import React, { useState, useEffect } from 'react';
import OrderService from '../services/OrderService';
// Dùng chung style của OrderHistory
import './OrderHistory.css'; 

const AdminOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState('');

    useEffect(() => {
        // 1. Gọi API "getAllOrders" (của Admin)
        OrderService.getAllOrders().then(
    (response) => {
        console.log("===> Dữ liệu trả về từ backend:", response.data);
        if (Array.isArray(response.data)) {
            setOrders(response.data.reverse());
        } else if (response.data && Array.isArray(response.data.orders)) {
            setOrders(response.data.orders.reverse());
        } else {
            setOrders([]);
        }
        setLoading(false);
    },

            (error) => {
                // 3. Xử lý lỗi
                const resMessage =
                    (error.response &&
                        error.response.data &&
                        error.response.data.message) ||
                    error.message ||
                    error.toString();
                setMessage("Lỗi: " + resMessage); 
                setLoading(false);
            }
        );
    }, []); 

    // (Hàm format ngày giờ giữ nguyên)
    const formatDate = (dateTimeString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
        return new Date(dateTimeString).toLocaleDateString('vi-VN', options);
    };

    if (loading) {
        return <div className="cart-container"><h2>Đang tải TẤT CẢ đơn hàng...</h2></div>;
    }

    if (message) {
        return <div className="cart-container message-error">{message}</div>;
    }

    if (orders.length === 0) {
        return (
            <div className="cart-container">
                <h2>Quản lý Đơn hàng (Admin)</h2>
                <p>Chưa có bất kỳ đơn hàng nào trong hệ thống.</p>
            </div>
        );
    }

    return (
        <div className="history-container">
            <h2>Quản lý Đơn hàng (Admin)</h2>
            {orders.map((order) => (
                <div className="order-card" key={order.id}>
                    <div className="order-header">
                        <div>
                            <h3>Đơn hàng #{order.id}</h3>
                            {/* 2. SỬA LỖI (Thêm ?): Kiểm tra (order.user) an toàn */}
                            <p style={{ color: 'red', fontWeight: 'bold' }}>
                                Người đặt: User ID {order.user ? order.user.id : 'N/A'}
                            </p>
                            <p>Ngày đặt: {formatDate(order.orderDate)}</p>
                        </div>
                        
                        {/* 3. SỬA LỖI (Thêm || 0): Tổng tiền */}
                        <strong>
                            Tổng tiền: {(order.totalAmount || 0).toLocaleString('vi-VN')} VND
                        </strong>
                    </div>
                    
                    <div className="order-items-list">
                        <h4>Chi tiết đơn hàng:</h4>
                        {/* 4. SỬA LỖI (Thêm &&): Kiểm tra list item */}
                        {order.orderItems && order.orderItems.map((item) => (
                            <div className="order-item" key={item.id}>
                                <p>
                                    (ID Sách: {item.bookId}) - SL: {item.quantity} x 
                                    {/* 5. SỬA LỖI (Thêm || 0): Giá item */}
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

export default AdminOrders;