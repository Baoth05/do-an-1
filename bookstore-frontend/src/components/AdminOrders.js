import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import OrderService from '../services/OrderService';
import './AdminUsers.css'; // Tận dụng CSS bảng đẹp

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
                setOrders(res.data.sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate)));
                setLoading(false);
            })
            .catch(err => console.error(err));
    };

    const handleStatusChange = (id, newStatus) => {
        if (window.confirm(`Bạn muốn đổi trạng thái đơn #${id} sang "${newStatus}"?`)) {
            OrderService.updateOrderStatus(id, newStatus)
                .then(() => {
                    alert("Cập nhật thành công!");
                    loadOrders(); // Tải lại danh sách
                })
                .catch(err => alert("Lỗi cập nhật: " + err.message));
        }
    };

    // Danh sách các trạng thái có thể chọn
    const statusOptions = ["Chờ xác nhận", "Đang chuẩn bị", "Đang giao", "Đã giao", "Đã hủy"];

    // Màu sắc cho từng trạng thái
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
            <h2 className="text-center mb-4 fw-bold text-uppercase">Quản lý Đơn Hàng</h2>

            {loading ? <p className="text-center">Đang tải...</p> : (
                <div className="table-card">
                    <table className="table custom-table mb-0">
                        <thead>
                            <tr>
                                <th>Mã đơn</th>
                                <th>Khách hàng</th>
                                <th>Ngày đặt</th>
                                <th>Tổng tiền</th>
                                <th>Trạng thái hiện tại</th>
                                <th>Hành động</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.map(order => (
                                <tr key={order.id}>
                                    <td><strong>#{order.id}</strong></td>
                                    <td>
                                        <div>{order.user?.username}</div>
                                        <small className="text-muted">{order.phone}</small>
                                    </td>
                                    <td>{new Date(order.orderDate).toLocaleDateString()}</td>
                                    <td className="fw-bold text-danger">
                                        {order.totalAmount.toLocaleString()} đ
                                    </td>
                                    <td>
                                        <span className={getStatusBadge(order.status)}>{order.status}</span>
                                    </td>
                                    <td>
                                        <div className="d-flex gap-2">
                                            {/* Dropdown chọn trạng thái nhanh */}
                                            <select 
                                                className="form-select form-select-sm"
                                                style={{width: '140px'}}
                                                value={order.status}
                                                onChange={(e) => handleStatusChange(order.id, e.target.value)}
                                            >
                                                {statusOptions.map(st => (
                                                    <option key={st} value={st}>{st}</option>
                                                ))}
                                            </select>

                                            {/* Nút xem chi tiết */}
                                            <Link to={`/order/${order.id}`} className="btn btn-sm btn-outline-info" title="Xem chi tiết">
                                                <i className="fas fa-eye"></i>
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