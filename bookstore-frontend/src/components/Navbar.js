import React from 'react'; 
import { Link } from 'react-router-dom'; 
import { useCart } from '../context/CartContext'; 
import SearchBar from './SearchBar';
import './Navbar.css';

const Navbar = ({ currentUser, onLogout }) => {
    
    const showAdminBoard = currentUser?.roles?.includes("ROLE_ADMIN");
    const { cartItems } = useCart();
    const totalQuantity = cartItems.reduce((total, item) => total + item.quantity, 0);

    return (
        <nav className="navbar">
            <Link to={"/home"} className="navbar-brand">
                Bookstore
            </Link>
            <SearchBar />

            <div className="navbar-nav">
                {/* === PHẦN CỦA ADMIN === */}
                {showAdminBoard && (
                    <> {/* Dùng Fragment <>...</> để bọc các link Admin */}
                        <li className="nav-item">
                            <Link to={"/add-book"} className="nav-link">
                                Thêm Sách Mới
                            </Link>
                        </li>
                        
                        {/* 1. LINK ADMIN BỊ THIẾU CỦA BẠN LÀ ĐÂY */}
                        <li className="nav-item">
                            <Link to={"/admin/orders"} className="nav-link">
                                Quản lý Đơn hàng
                            </Link>
                        </li>
                    </>
                )}

                {/* === PHẦN CỦA USER ĐÃ ĐĂNG NHẬP === */}
                {currentUser ? (
                    <div className="nav-item-user">
                        
                        {/* 2. LINK USER (BẠN ĐÃ LÀM ĐÚNG) */}
                        <Link to="/my-orders" className="nav-link">
                            Lịch sử Đơn hàng
                        </Link>

                        {/* (Link Giỏ hàng giữ nguyên) */}
                        <Link to="/cart" className="nav-link nav-cart">
                            Giỏ hàng
                            {totalQuantity > 0 && (
                                <span className="badge-cart">{totalQuantity}</span>
                            )}
                        </Link>
                        
                        {/* (Phần Chào, user và Đăng xuất giữ nguyên) */}
                        <span className="nav-username">
                            Chào, {currentUser.username} ({(showAdminBoard ? "Admin" : "User")})
                        </span>
                        <button onClick={onLogout} className="nav-link-button">
                            Đăng xuất
                        </button>
                    </div>
                ) : (
                    // (Phần Đăng ký/Đăng nhập giữ nguyên)
                    <div className="nav-item-guest">
                        <Link to={"/register"} className="nav-link">
                            Đăng ký
                        </Link>
                        <Link to={"/login"} className="nav-link">
                            Đăng nhập
                        </Link>
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Navbar;