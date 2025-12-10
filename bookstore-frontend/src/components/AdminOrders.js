import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import OrderService from '../services/OrderService';
import './AdminUsers.css'; // Tận dụng CSS bảng đẹp của Admin

const AdminOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadOrders();
    }, []);

    const loadOrders = () => {
        OrderService.getAllOrders()
            .then(res => {
                // Sắp xếp đơn mới nhất lên đầu
                const sortedOrders = res.data.sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate));
                setOrders(sortedOrders);
                setLoading(false);
            })
            .catch(err => {
                console.error("Lỗi tải đơn hàng:", err);
                setLoading(false);
            });
    };

    const handleStatusChange = (id, newStatus) => {
        if (window.confirm(`Bạn muốn đổi trạng thái đơn #${id} sang "${newStatus}"?`)) {
            OrderService.updateOrderStatus(id, newStatus)
                .then(() => {
                    alert("Cập nhật thành công!");
                    // Cập nhật lại state trực tiếp để không cần gọi lại API loadOrders (tối ưu hơn)
                    setOrders(prevOrders => prevOrders.map(order => 
                        order.id === id ? { ...order, status: newStatus } : order
                    ));
                })
                .catch(err => alert("Lỗi cập nhật: " + (err.response?.data || err.message)));
        } else {
            // Nếu bấm Cancel, load lại để reset dropdown về giá trị cũ (tránh hiển thị sai)
            loadOrders();
        }
    };

    // Danh sách các trạng thái có thể chọn
    const statusOptions = ["Chờ xác nhận", "Đang chuẩn bị", "Đang giao", "Đã giao", "Đã hủy"];

    // Màu sắc cho từng trạng thái (Badge)
    const getStatusBadge = (status) => {
        switch(status) {
            case 'Chờ xác nhận': return 'badge bg-warning text-dark';
            case 'Đang chuẩn bị': return 'badge bg-info text-dark';
            case 'Đang giao': return 'badge bg-primary';
            case 'Đã giao': return 'badge bg-success';
            case 'Đã hủy': return 'badge bg-danger';
            default: return 'badge bg-secondary';
        }
    };

    return (
        <div className="admin-user-container">
            <h2 className="text-center mb-4 fw-bold text-uppercase">Quản lý Đơn Hàng</h2>

            {loading ? (
                <div className="text-center py-5">
                    <div className="spinner-border text-primary" role="status"></div>
                    <p className="mt-2">Đang tải dữ liệu...</p>
                </div>
            ) : (
                <div className="table-card shadow-sm">
                    <table className="table custom-table mb-0 table-hover align-middle">
                        <thead className="table-light">
                            <tr>
                                <th>Mã đơn</th>
                                <th>Khách hàng</th>
                                <th>Ngày đặt</th>
                                <th>Tổng tiền</th>
                                <th>Trạng thái hiện tại</th>
                                <th className="text-center">Hành động</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.map(order => (
                                <tr key={order.id}>
                                    <td className="fw-bold text-primary">#{order.id}</td>
                                    <td>
                                        <div className="fw-bold">{order.user?.username || "Guest"}</div>
                                        <small className="text-muted"><i className="fas fa-phone-alt me-1"></i>{order.phone}</small>
                                    </td>
                                    <td>{new Date(order.orderDate).toLocaleDateString('vi-VN')}</td>
                                    <td className="fw-bold text-danger">
                                        {order.totalAmount.toLocaleString('vi-VN')} đ
                                    </td>
                                    <td>
                                        <span className={getStatusBadge(order.status)} style={{fontSize: '0.85rem'}}>
                                            {order.status}
                                        </span>
                                    </td>
                                    <td>
                                        <div className="d-flex justify-content-center align-items-center gap-2">
                                            {/* Dropdown chọn trạng thái nhanh */}
                                            <select 
                                                className="form-select form-select-sm"
                                                style={{width: '150px', cursor: 'pointer'}}
                                                value={order.status}
                                                onChange={(e) => handleStatusChange(order.id, e.target.value)}
                                            >
                                                {statusOptions.map(st => (
                                                    <option key={st} value={st}>{st}</option>
                                                ))}
                                            </select>

                                            {/* Nút xem chi tiết (Đã sửa link đúng) */}
                                            <Link 
                                                to={`/order-detail/${order.id}`} 
                                                className="btn btn-sm btn-outline-info fw-bold" 
                                                title="Xem chi tiết đơn hàng"
                                                style={{whiteSpace: 'nowrap'}}
                                            >
                                                <i className="fas fa-eye me-1"></i> Chi tiết
                                            </Link>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default AdminOrders;