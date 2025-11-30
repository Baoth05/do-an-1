import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import OrderService from '../services/OrderService';
import './AdminUsers.css'; // Tận dụng CSS bảng đẹp của Admin

const OrderHistory = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        OrderService.getOrderHistory()
            .then(res => {
                // Sắp xếp đơn mới nhất lên đầu
                setOrders(res.data.sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate)));
                setLoading(false);
            })
            .catch(err => console.error(err));
    }, []);

    // Hàm chọn màu cho trạng thái
    const getStatusBadge = (status) => {
        switch(status) {
            case 'Chờ xác nhận': return 'badge bg-warning text-dark';
            case 'Đang giao': return 'badge bg-primary';
            case 'Đã giao': return 'badge bg-success';
            case 'Đã hủy': return 'badge bg-danger';
            default: return 'badge bg-secondary';
        }
    };

    return (
        <div className="admin-user-container">
            <h2 className="text-center mb-4 fw-bold text-uppercase">Lịch Sử Đơn Hàng</h2>

            {loading ? <p className="text-center">Đang tải...</p> : (
                orders.length === 0 ? (
                    <div className="text-center">
                        <p>Bạn chưa có đơn hàng nào.</p>
                        <Link to="/home" className="btn btn-primary">Mua sắm ngay</Link>
                    </div>
                ) : (
                    <div className="table-card">
                        <table className="table custom-table mb-0">
                            <thead>
                                <tr>
                                    <th>Mã đơn</th>
                                    <th>Ngày đặt</th>
                                    <th>Tổng tiền</th>
                                    <th>Trạng thái</th>
                                    <th>Hành động</th>
                                </tr>
                            </thead>
                            <tbody>
                                {orders.map(order => (
                                    <tr key={order.id}>
                                        <td><strong>#{order.id}</strong></td>
                                        <td>{new Date(order.orderDate).toLocaleDateString()}</td>
                                        <td className="fw-bold text-danger">
                                            {order.totalAmount.toLocaleString()} đ
                                        </td>
                                        <td>
                                            <span className={getStatusBadge(order.status)}>
                                                {order.status}
                                            </span>
                                        </td>
                                        <td>
                                            <Link to={`/order-detail/${order.id}`} className="btn btn-sm btn-outline-primary">
                                                    <i className="fas fa-eye me-1"></i> Chi tiết
                                            </Link>

                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )
            )}
        </div>
    );
};

export default OrderHistory;