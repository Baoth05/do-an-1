import React from 'react';

import { useCart } from '../context/CartContext';
import './Cart.css'; 
import { Link } from 'react-router-dom';

const Cart = () => {
    // 2. LẤY HÀM MỚI TỪ "KHO"
    const { cartItems, removeFromCart, updateQuantity } = useCart();

    // (Hàm calculateTotal)
    const calculateTotal = () => { 
        return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
    };
    
    // (Hàm handleRemove )
    const handleRemove = (bookId) => { 
        if (window.confirm('Bạn có chắc muốn xóa sản phẩm này khỏi giỏ hàng?')) {
            removeFromCart(bookId);
        }
    };


    const handleIncrease = (bookId, currentQuantity) => {
        updateQuantity(bookId, currentQuantity + 1);
    };

    const handleDecrease = (bookId, currentQuantity) => {
        updateQuantity(bookId, currentQuantity - 1);
    };

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
                           
                        </div>
                        
                        <div className="cart-item-actions">
                        
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
               
                <h3>Tổng cộng: {calculateTotal().toLocaleString('vi-VN')} VND</h3>
                <Link to="/checkout" className="btn-checkout">
                    Tiến hành thanh toán
                </Link>
            </div>
        </div>
    );
};

export default Cart;