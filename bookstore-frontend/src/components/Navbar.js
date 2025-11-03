import React from 'react'; // 1. Xóa useState, useEffect
import { Link } from 'react-router-dom'; // 2. Xóa useNavigate
// 3. Xóa AuthService
import './Navbar.css';

// 4. Nhận props từ App.js
const Navbar = ({ currentUser, onLogout }) => {

    // 5. XÓA tất cả state và useEffect (vì App.js đã lo)
    
    // 6. Tính toán showAdminBoard dựa trên prop
    // (Dùng ?. gọi là "optional chaining" để an toàn tuyệt đối)
    const showAdminBoard = currentUser?.roles?.includes("ROLE_ADMIN");

    return (
        <nav className="navbar">
            <Link to={"/home"} className="navbar-brand">
                Bookstore
            </Link>

            <div className="navbar-nav">
                {showAdminBoard && (
                    <li className="nav-item">
                        <Link to={"/add-book"} className="nav-link">
                            Thêm Sách Mới
                        </Link>
                    </li>
                )}

                {currentUser ? (
                    // === Nếu đã đăng nhập ===
                    <div className="nav-item-user">
                        <span className="nav-username">
                            Chào, {currentUser.username} ({(showAdminBoard ? "Admin" : "User")})
                        </span>
                        {/* 7. Gọi prop onLogout */}
                        <button onClick={onLogout} className="nav-link-button">
                            Đăng xuất
                        </button>
                    </div>
                ) : (
                    // === Nếu chưa đăng nhập (Thêm nút Đăng ký) ===
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