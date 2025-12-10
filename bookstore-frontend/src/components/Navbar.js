import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import AuthService from '../services/AuthService';
import { useCart } from '../context/CartContext';
import SearchBar from './SearchBar';
import './Navbar.css';

const Navbar = () => {
    const [currentUser, setCurrentUser] = useState(undefined);
    const [showAdminBoard, setShowAdminBoard] = useState(false);
    const { cartItems } = useCart();
    const navigate = useNavigate();
    const location = useLocation();

    const totalQuantity = cartItems.reduce((total, item) => total + item.quantity, 0);

    useEffect(() => {
        const user = AuthService.getCurrentUser();
        if (user) {
            setCurrentUser(user);
            setShowAdminBoard(user.roles.includes("ROLE_ADMIN"));
        }
    }, []);

    const logOut = () => {
        AuthService.logout();
        setCurrentUser(undefined);
        setShowAdminBoard(false);
        navigate("/login");
        window.location.reload();
    };

    // Logic ẩn thanh tìm kiếm
    const hideSearchBarRoutes = ['/login', '/register'];
    const showSearchBar = !hideSearchBarRoutes.includes(location.pathname);

    return (
        <nav className="navbar">
            
            <Link to={"/home"} className="navbar-brand">
                Bookstore
            </Link>

            {/* THANH TÌM KIẾM */}
            {showSearchBar && <SearchBar />}

            <div className="navbar-nav">
                
                {/* === PHẦN CỦA ADMIN === */}
                {showAdminBoard && (
                    <> 
                        <li className="nav-item">
                            <Link to={"/add-book"} className="nav-link">
                                Thêm Sách
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link to={"/admin/orders"} className="nav-link">
                                Quản lý Đơn Hàng
                            </Link>
                        </li>
                        
                        <li className="nav-item">
                            <Link to={"/admin/users"} className="nav-link">
                                Quản Lý Khách Hàng
                            </Link>
                        </li>
                        
                        {/* Admin có nút Đăng xuất riêng cho tiện */}
                        <li className="nav-item">
                            <button onClick={logOut} className="nav-link-button" style={{marginLeft: '10px'}}>
                                Đăng xuất
                            </button>
                        </li>
                    </>
                )}

                {/* === PHẦN CỦA USER (KHÔNG PHẢI ADMIN) === */}    
                {currentUser && !showAdminBoard ? (
                    <div className="nav-item-user">
                        
                        <Link to="/my-orders" className="nav-link">
                            Lịch sử Đơn
                        </Link>

                        {/* GIỎ HÀNG (Chỉ User thấy) */}
                        <Link to="/cart" className="nav-link nav-cart">
                            Giỏ hàng
                            {totalQuantity > 0 && (
                                <span className="badge-cart">{totalQuantity}</span>
                            )}
                        </Link>
                            <Link to="/contact" className='nav-link'>
                            Liên Hệ
                            </Link>
                            
                        {/* TÀI KHOẢN & ĐĂNG XUẤT */}
                        <Link to="/profile" className="nav-link" >
                            Tài khoản
                        </Link>
                        <button onClick={logOut} className="nav-link-button">
                            Đăng xuất
                        </button>
                    </div>
                    
                ) : (
                    // === PHẦN KHÁCH VÃNG LAI (CHƯA ĐĂNG NHẬP) ===
                    !currentUser && (
                        <div className="nav-item-guest">
                            <Link to={"/register"} className="nav-link">
                                Đăng ký
                            </Link>
                            <Link to={"/login"} className="nav-link">
                                Đăng nhập
                            </Link>
                        </div>
                    )
                )}
            </div>
        </nav>
    );
};

export default Navbar;