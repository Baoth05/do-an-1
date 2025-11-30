import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import OrderService from '../services/OrderService';
import './OrderDetail.css'; // Tận dụng CSS đẹp của trang Checkout

const OrderDetail = () => {
    const { id } = useParams(); // Lấy ID từ URL
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Kiểm tra xem service có hàm này không để tránh crash
        if (!OrderService.getOrderById) {
            console.error("Lỗi: Thiếu hàm getOrderById trong OrderService");
            setLoading(false);
            return;
        }

        OrderService.getOrderById(id)
            .then(res => {
                setOrder(res.data);
            })
            .catch(err => {
                console.error("Lỗi tải đơn hàng:", err);
                alert("Không thể tải đơn hàng (Lỗi: " + (err.response?.status || "Mạng") + ")");
            })
            .finally(() => {
                setLoading(false); // <--- QUAN TRỌNG: Luôn tắt loading dù thành công hay thất bại
            });
    }, [id]);

    if (loading) return <div className="text-center mt-5">Đang tải chi tiết đơn hàng...</div>;
    if (!order) return <div className="text-center mt-5">Không tìm thấy đơn hàng!</div>;

    return (
        <div className="checkout-container">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="checkout-title mb-0">Chi Tiết Đơn Hàng #{order.id}</h2>
                <Link to="/my-orders" className="btn btn-outline-secondary">
                    <i className="fas fa-arrow-left me-2"></i> Quay lại
                </Link>
            </div>

            {/* TRẠNG THÁI ĐƠN HÀNG */}
            <div className="alert alert-info d-flex justify-content-between align-items-center">
                <span>
                    <strong>Ngày đặt:</strong> {new Date(order.orderDate).toLocaleString()}
                </span>
                <span className="badge bg-primary fs-6">{order.status}</span>
            </div>

            <div className="row">
                {/* CỘT TRÁI: THÔNG TIN NHẬN HÀNG */}
                <div className="col-md-6">
                    <div className="checkout-card h-100">
                        <div className="card-header-custom">
                            <i className="fas fa-user me-2"></i> Thông tin người nhận
                        </div>
                        <div className="card-body p-4">
                            <p><strong>Họ tên:</strong> {order.user?.fullName || order.user?.username}</p>
                            <p><strong>Email:</strong> {order.user?.email}</p>
                            <hr />
                            <p><strong>Địa chỉ:</strong> {order.address}</p>
                            <p><strong>SĐT:</strong> {order.phone}</p>
                            <p><strong>Thanh toán:</strong> {order.paymentMethod}</p>
                        </div>
                    </div>
                </div>

                {/* CỘT PHẢI: DANH SÁCH SẢN PHẨM */}
                <div className="col-md-6">
                    <div className="checkout-card h-100">
                        <div className="card-header-custom bg-summary">
                            <i className="fas fa-box-open me-2"></i> Sản phẩm đã mua
                        </div>
                        <div className="card-body p-4">
                            {order.orderItems.map((item, index) => (
                                <div key={index} className="d-flex justify-content-between align-items-center mb-3 pb-3 border-bottom">
                                    
                                    {/* === PHẦN HIỂN THỊ ẢNH VÀ TÊN SÁCH === */}
                                    <div className="d-flex align-items-center">
                                        {/* 1. Hiển thị ảnh sách (Nếu có) */}
                                        {item.book && item.book.imageUrl ? (
                                            <img 
                                                src={item.book.imageUrl} 
                                                alt={item.book.title} 
                                                style={{ 
                                                    width: '60px', 
                                                    height: '85px', 
                                                    objectFit: 'cover', 
                                                    marginRight: '15px', 
                                                    borderRadius: '4px', 
                                                    border: '1px solid #eee' 
                                                }}
                                            />
                                        ) : (
                                            /* Placeholder nếu không có ảnh */
                                            <div style={{ 
                                                width: '60px', 
                                                height: '85px', 
                                                backgroundColor: '#eee', 
                                                marginRight: '15px', 
                                                display: 'flex', 
                                                alignItems: 'center', 
                                                justifyContent: 'center',
                                                borderRadius: '4px'
                                            }}>
                                                <i className="fas fa-book text-secondary"></i>
                                            </div>
                                        )}

                                        {/* 2. Hiển thị Tên sách & Số lượng */}
                                        <div>
                                            <h6 className="mb-1" style={{fontWeight: '600', color: '#333'}}>
                                                {/* Nếu Backend trả về object book thì hiện Title, nếu không thì hiện ID */}
                                                {item.book ? item.book.title : `Sách ID: ${item.bookId}`}
                                            </h6> 
                                            <small className="text-muted">Số lượng: {item.quantity}</small>
                                        </div>
                                    </div>
                                    {/* ===================================== */}

                                    <span className="fw-bold text-primary">
                                        {(item.price * item.quantity).toLocaleString()} đ
                                    </span>
                                </div>
                            ))}

                            <div className="d-flex justify-content-between mt-3 pt-2">
                                <span className="h5">Tổng tiền:</span>
                                <span className="h4 text-danger">{order.totalAmount.toLocaleString()} đ</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderDetail;