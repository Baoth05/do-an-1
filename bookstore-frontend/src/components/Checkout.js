import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import OrderService from '../services/OrderService';
import './Checkout.css'; // Import CSS xịn

const Checkout = () => {
    const { cartItems, clearCart } = useCart();
    const navigate = useNavigate();

    const [address, setAddress] = useState('');
    const [phone, setPhone] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('COD');
    const [loading, setLoading] = useState(false);
    const [showSavedAlert, setShowSavedAlert] = useState(false); // Biến hiện thông báo

    const totalAmount = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

    // --- LOGIC LOAD ĐỊA CHỈ CŨ ---
    useEffect(() => {
        const savedAddress = localStorage.getItem('last_address');
        const savedPhone = localStorage.getItem('last_phone');

        if (savedAddress && savedPhone) {
            setAddress(savedAddress);
            setPhone(savedPhone);
            setShowSavedAlert(true); // Bật thông báo lên
        }
    }, []);

    const handlePlaceOrder = () => {
        if (cartItems.length === 0) {
            alert("Giỏ hàng trống!");
            return;
        }
        if (!address.trim() || !phone.trim()) {
            alert("Vui lòng điền đầy đủ các trường bắt buộc (*)");
            return;
        }

        setLoading(true);

        const orderRequest = {
            address,
            phone,
            paymentMethod,
            cartItems: cartItems.map(item => ({
                id: item.id,
                quantity: item.quantity,
                price: item.price
            }))
        };

        OrderService.createOrder(orderRequest)
            .then(response => {
                // Lưu địa chỉ lại cho lần sau
                localStorage.setItem('last_address', address);
                localStorage.setItem('last_phone', phone);

                alert("🎉 Đặt hàng thành công! Mã đơn: " + response.data.id);
                clearCart();
                navigate('/my-orders');
            })
            .catch(error => {
                alert("Lỗi đặt hàng: " + (error.response?.data || "Vui lòng thử lại"));
            })
            .finally(() => setLoading(false));
    };

    return (
        <div className="checkout-container">
            <h2 className="checkout-title">Thanh Toán Đơn Hàng</h2>

            {/* --- THÔNG BÁO TỰ ĐIỀN ĐỊA CHỈ --- */}
            {showSavedAlert && (
                <div className="address-alert">
                    <div>
                        <i className="fas fa-check-circle me-2"></i>
                        <strong>Đã tự động điền!</strong> 
                        Chúng tôi đã điền địa chỉ từ đơn hàng trước của bạn.
                    </div>
                    <button 
                        className="btn btn-sm btn-outline-success" 
                        onClick={() => {
                            setAddress(''); 
                            setPhone('');
                            setShowSavedAlert(false);
                        }}
                    >
                        Nhập địa chỉ khác
                    </button>
                </div>
            )}

            <div className="row">
                {/* --- CỘT TRÁI: FORM NHẬP LIỆU (NỀN XÁM) --- */}
                <div className="col-md-7">
                    <div className="checkout-card">
                        <div className="card-header-custom">
                            <i className="fas fa-map-marker-alt me-2"></i> Thông tin nhận hàng
                        </div>
                        <div className="card-body p-4">
                            
                            <div className="form-group-custom">
                                <label className="form-label-custom">
                                    Địa chỉ nhận hàng <span className="required-mark">*</span>
                                </label>
                                <input 
                                    type="text" 
                                    className="custom-input"
                                    placeholder="Ví dụ: 123 Đường Nguyễn Văn Cừ, Quận 5, TP.HCM"
                                    value={address}
                                    onChange={(e) => setAddress(e.target.value)}
                                />
                            </div>

                            <div className="form-group-custom">
                                <label className="form-label-custom">
                                    Số điện thoại <span className="required-mark">*</span>
                                </label>
                                <input 
                                    type="text" 
                                    className="custom-input"
                                    placeholder="Ví dụ: 0987654321"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                />
                            </div>

                            <div className="form-group-custom">
                                <label className="form-label-custom">
                                    Phương thức thanh toán
                                </label>
                                <select 
                                    className="custom-input custom-select"
                                    value={paymentMethod}
                                    onChange={(e) => setPaymentMethod(e.target.value)}
                                >
                                    <option value="COD">Thanh toán khi nhận hàng (COD)</option>
                                    <option value="BANKING">Chuyển khoản ngân hàng</option>
                                </select>
                            </div>

                        </div>
                    </div>
                </div>

                {/* --- CỘT PHẢI: TÓM TẮT (NỀN TRẮNG/XANH) --- */}
                <div className="col-md-5">
                    <div className="checkout-card">
                        <div className="card-header-custom bg-summary">
                            <i className="fas fa-shopping-bag me-2"></i> Tóm tắt đơn hàng
                        </div>
                        <div className="card-body p-4">
                            {cartItems.map((item, index) => (
                                <div className="summary-item" key={index}>
                                    <div className="d-flex flex-column">
                                        <span className="item-name">{item.title}</span>
                                        <small className="text-muted">Số lượng: {item.quantity}</small>
                                    </div>
                                    <span className="item-price">
                                        {(item.price * item.quantity).toLocaleString()} đ
                                    </span>
                                </div>
                            ))}

                            <div className="total-section">
                                <span className="total-text">Tổng thanh toán:</span>
                                <span className="total-amount">{totalAmount.toLocaleString()} đ</span>
                            </div>

                            <button 
                                className="btn-confirm"
                                onClick={handlePlaceOrder}
                                disabled={loading}
                            >
                                {loading ? "Đang xử lý..." : "XÁC NHẬN ĐẶT HÀNG"}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Checkout;