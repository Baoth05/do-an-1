import React from 'react';
// 1. SỬA LẠI IMPORT (LẤY CẢ HÀM UPDATEQUANTITY)
import { useCart } from '../context/CartContext';
import './Cart.css'; 
import { Link } from 'react-router-dom';

const Cart = () => {
    // 2. LẤY HÀM MỚI TỪ "KHO"
    const { cartItems, removeFromCart, updateQuantity } = useCart();

    // (Hàm calculateTotal giữ nguyên)
    const calculateTotal = () => { 
        return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
    };
    
    // (Hàm handleRemove giữ nguyên)
    const handleRemove = (bookId) => { 
        if (window.confirm('Bạn có chắc muốn xóa sản phẩm này khỏi giỏ hàng?')) {
            removeFromCart(bookId);
        }
    };

    // === 3. TẠO HÀM XỬ LÝ TĂNG/GIẢM ===
    const handleIncrease = (bookId, currentQuantity) => {
        updateQuantity(bookId, currentQuantity + 1);
    };

    const handleDecrease = (bookId, currentQuantity) => {
        updateQuantity(bookId, currentQuantity - 1); // (Hàm updateQuantity sẽ tự xóa nếu = 0)
    };
    // ==================================

    // (Hàm if (cartItems.length === 0) giữ nguyên)
    if (cartItems.length === 0) { 
        return (
            <div className="cart-container">
                <h2>Giỏ hàng của bạn</h2>
                <p>Giỏ hàng của bạn chưa có gì cả!</p>
            </div>
        );
    }

    return (
        <div className="cart-container">
            <h2>Giỏ hàng của bạn</h2>
            
            <div className="cart-items-list">
                {cartItems.map((item) => (
                    <div className="cart-item" key={item.id}>
                        {/* (Phần img giữ nguyên) */}
                        <img 
                            src={item.imageUrl || 'https://via.placeholder.com/100x150.png?text=No+Image'} 
                            alt={item.title} 
                            className="cart-item-image"
                        />
                        
                        <div className="cart-item-details">
                            <h3>{item.title}</h3>
                            <p>Tác giả: {item.author}</p>
                            <p>Giá: {item.price.toLocaleString('vi-VN')} VND</p>
                            
                            {/* === 4. THAY THẾ DÒNG SỐ LƯỢNG === */}
                            <div className="quantity-control">
                                <button 
                                    className="btn-quantity"
                                    onClick={() => handleDecrease(item.id, item.quantity)}
                                >
                                    -
                                </button>
                                <span className="quantity-display">{item.quantity}</span>
                                <button 
                                    className="btn-quantity"
                                    onClick={() => handleIncrease(item.id, item.quantity)}
                                >
                                    +
                                </button>
                            </div>
                            {/* ================================= */}
                        </div>
                        
                        <div className="cart-item-actions">
                            {/* (Nút "Xóa" giữ nguyên) */}
                            <button 
                                className="btn-remove"
                                onClick={() => handleRemove(item.id)}
                            >
                                Xóa
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            <div className="cart-summary">
                {/* (Phần tổng tiền và thanh toán giữ nguyên) */}
                <h3>Tổng cộng: {calculateTotal().toLocaleString('vi-VN')} VND</h3>
                <Link to="/checkout" className="btn-checkout">
                    Tiến hành thanh toán
                </Link>
            </div>
        </div>
    );
};

export default Cart;