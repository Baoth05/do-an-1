import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import OrderService from '../services/OrderService';
import './AdminUsers.css'; 

const OrderHistory = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadOrders();
    }, []);

    const loadOrders = () => {
        OrderService.getOrderHistory()
            .then(res => {
                // Sắp xếp đơn mới nhất lên đầu
                const sortedOrders = res.data.sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate));
                setOrders(sortedOrders);
                setLoading(false);
            })
            .catch(err => {
                console.error("Lỗi tải đơn:", err);
                setLoading(false);
            });
    };

    const handleCancelOrder = (id) => {
        if (window.confirm("Bạn có chắc chắn muốn hủy đơn hàng này không?")) {
            OrderService.cancelOrder(id)
                .then((res) => {
                    // Hiển thị thông báo từ backend hoặc mặc định
                    alert(res.data || "Đã hủy đơn hàng thành công!");
                    
                    // Cập nhật giao diện ngay lập tức
                    setOrders(prevOrders => prevOrders.map(order => 
                        order.id === id ? { ...order, status: 'Đã hủy' } : order
                    ));
                })
                .catch(err => {
                    console.error("Chi tiết lỗi:", err); // In lỗi ra console để bạn dễ kiểm tra
                    
                    // Xử lý thông báo lỗi hiển thị ra màn hình
                    let errorMessage = "Có lỗi xảy ra khi hủy đơn.";
                    if (err.response) {
                        // Nếu backend trả về message string
                        if (typeof err.response.data === 'string') {
                            errorMessage = err.response.data;
                        } 
                        // Nếu backend trả về object JSON (Spring Boot default error)
                        else if (err.response.data && err.response.data.message) {
                            errorMessage = err.response.data.message;
                        }
                    }
                    alert("Lỗi: " + errorMessage);
                });
        }
    };

    const getStatusBadge = (status) => {
        switch(status) {
            case 'Chờ xác nhận': return 'badge bg-warning text-dark';
            case 'Đang giao':    return 'badge bg-primary';
            case 'Đã giao':      return 'badge bg-success';
            case 'Đã hủy':       return 'badge bg-danger';
            default:             return 'badge bg-secondary';
        }
    };

    return (
        <div className="admin-user-container">
            <h2 className="text-center mb-4 fw-bold text-uppercase" style={{color: '#444'}}>
                Lịch Sử Đơn Hàng
            </h2>

            {loading ? (
                <div className="text-center py-5">Đang tải dữ liệu...</div>
            ) : (
                orders.length === 0 ? (
                    <div className="text-center py-5">
                        <p className="fs-5">Bạn chưa có đơn hàng nào.</p>
                        <Link to="/home" className="btn btn-primary rounded-pill px-4">
                            Mua sắm ngay
                        </Link>
                    </div>
                ) : (
                    <div className="table-card shadow-sm" >
                        <table className="table custom-table mb-0 table-hover">
                            <thead className="table-light">
                                <tr>
                                    <th className="py-3">Mã đơn</th>
                                    <th className="py-3">Ngày đặt</th>
                                    <th className="py-3">Tổng tiền</th>
                                    <th className="py-3">Trạng thái</th>
                                    
                                    {/* === CHỈNH ĐỘ RỘNG CỘT HÀNH ĐỘNG TẠI ĐÂY === */}
                                    <th className="py-3 text-center" >
                                        Hành động
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {orders.map(order => (
                                    <tr key={order.id}>
                                        <td className="fw-bold text-primary">#{order.id}</td>
                                        <td>{new Date(order.orderDate).toLocaleDateString('vi-VN')}</td>
                                        <td className="fw-bold text-danger">
                                            {order.totalAmount.toLocaleString('vi-VN')} đ
                                        </td>
                                        <td>
                                            <span className={getStatusBadge(order.status)} style={{fontSize: '0.85rem'}}>
                                                {order.status}
                                            </span>
                                        </td>
                                        <td className="text-center">
                                            <div className="d-flex justify-content-center gap-2">
                                                <Link to={`/order-detail/${order.id}`} className="btn btn-sm btn-outline-primary" title="Xem chi tiết">
                                                    <i className="fas fa-eye"></i> Chi tiết
                                                </Link>

                                                {order.status === 'Chờ xác nhận' && (
                                                    <button 
                                                        className="btn btn-sm btn-outline-danger"
                                                        onClick={() => handleCancelOrder(order.id)}
                                                        title="Hủy đơn hàng này"
                                                    >
                                                        <i className="fas fa-times"></i> Hủy đơn
                                                    </button>
                                                )}
                                            </div>
                                            
                                            {order.status === 'Đã hủy' && (
                                                <span className="text-muted small fst-italic">--</span>
                                            )}
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