import React, { useState, useEffect } from 'react';
import UserService from '../services/UserService';
import OrderHistory from './OrderHistory'; 
import './UserProfile.css';

const UserProfile = () => {
    const [activeTab, setActiveTab] = useState('info'); 
    
    // Khởi tạo state với giá trị rỗng an toàn
    const [user, setUser] = useState({
        id: '',
        username: '',
        email: '',
        fullName: '',
        address: ''
    });
    
    const [passwords, setPasswords] = useState({
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    useEffect(() => {
        loadUserData();
    }, []);

    const loadUserData = () => {
        // Gọi API lấy thông tin
        UserService.getMe().then(
            (res) => {
                console.log("✅ Dữ liệu User lấy được từ API:", res.data); // Xem log này ở F12 (Console)
                setUser(res.data);
            },
            (error) => {
                console.error("❌ Lỗi tải thông tin:", error);
                // Nếu lỗi 401/403 (Token hết hạn), thông báo và đẩy về trang login
                if (error.response && (error.response.status === 401 || error.response.status === 403)) {
                    alert("Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại!");
                    localStorage.removeItem("user"); // Xóa token cũ
                    window.location.href = "/login";
                }
            }
        );
    };

    const handleUpdateInfo = () => {
        UserService.updateMe(user)
            .then(() => alert("Cập nhật thông tin thành công!"))
            .catch(err => alert("Lỗi cập nhật: " + err.message));
    };

    const handleChangePassword = () => {
        if (passwords.newPassword !== passwords.confirmPassword) {
            alert("Mật khẩu xác nhận không khớp!");
            return;
        }
        UserService.changePassword(passwords)
            .then(() => {
                alert("Đổi mật khẩu thành công!");
                setPasswords({ oldPassword: '', newPassword: '', confirmPassword: '' });
            })
            .catch(err => alert("Lỗi đổi mật khẩu: " + (err.response?.data || err.message)));
    };

    return (
        <div className="profile-container">
            {/* --- SIDEBAR --- */}
            <div className="profile-sidebar">
                <div className="user-avatar-section">
                    <div className="avatar-circle">
                        {/* SỬA LỖI: Kiểm tra có username rồi mới lấy ký tự đầu, nếu chưa có thì hiện 'U' */}
                        {user.username ? user.username.charAt(0).toUpperCase() : "U"}
                    </div>
                    {/* Nếu chưa tải xong thì hiện Loading... */}
                    <h4>{user.fullName || user.username || "Đang tải..."}</h4>
                    <p className="text-muted">{user.email || "..."}</p>
                </div>
                
                <button 
                    className={`menu-btn ${activeTab === 'info' ? 'active' : ''}`}
                    onClick={() => setActiveTab('info')}
                >
                    <i className="fas fa-user me-2"></i> Thông tin tài khoản
                </button>
                
                <button 
                    className={`menu-btn ${activeTab === 'orders' ? 'active' : ''}`}
                    onClick={() => setActiveTab('orders')}
                >
                    <i className="fas fa-shopping-bag me-2"></i> Lịch sử đơn hàng
                </button>

                <button 
                    className={`menu-btn ${activeTab === 'password' ? 'active' : ''}`}
                    onClick={() => setActiveTab('password')}
                >
                    <i className="fas fa-key me-2"></i> Đổi mật khẩu
                </button>
            </div>

            {/* --- CONTENT --- */}
            <div className="profile-content">
                {/* TAB 1: THÔNG TIN */}
                {activeTab === 'info' && (
                    <div>
                        <h3 className="content-title">Hồ sơ của tôi</h3>
                        <div className="form-group">
                            <label className="form-label">Tên đăng nhập (Username)</label>
                            <input 
                                type="text" 
                                className="form-control" 
                                value={user.username || ''} 
                                disabled 
                                style={{backgroundColor: '#e9ecef', color: '#666'}} 
                            />
                            <small className="text-muted fst-italic">Tên đăng nhập không thể thay đổi.</small>
                        </div>
                        <div className="form-group">
                            <label className="form-label">Họ và tên</label>
                            <input 
                                type="text" 
                                className="form-control" 
                                value={user.fullName || ''} 
                                placeholder="Nhập họ và tên hiển thị..."
                                onChange={(e) => setUser({...user, fullName: e.target.value})}
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Email</label>
                            <input 
                                type="email" 
                                className="form-control" 
                                value={user.email || ''} 
                                onChange={(e) => setUser({...user, email: e.target.value})}
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Địa chỉ mặc định (Dùng khi đặt hàng)</label>
                            <input 
                                type="text" 
                                className="form-control" 
                                value={user.address || ''} 
                                placeholder="Nhập địa chỉ giao hàng..."
                                onChange={(e) => setUser({...user, address: e.target.value})}
                            />
                        </div>
                        <button className="btn-save" onClick={handleUpdateInfo}>
                            <i className="fas fa-save me-2"></i> Lưu thay đổi
                        </button>
                    </div>
                )}

                {/* TAB 2: ĐƠN HÀNG */}
                {activeTab === 'orders' && (
                    <div>
                        <h3 className="content-title">Lịch sử mua hàng</h3>
                        <OrderHistory />
                    </div>
                )}

                {/* TAB 3: ĐỔI MẬT KHẨU */}
                {activeTab === 'password' && (
                    <div>
                        <h3 className="content-title">Đổi mật khẩu</h3>
                        <div className="form-group">
                            <label className="form-label">Mật khẩu hiện tại</label>
                            <input 
                                type="password" 
                                className="form-control"
                                value={passwords.oldPassword}
                                onChange={(e) => setPasswords({...passwords, oldPassword: e.target.value})}
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Mật khẩu mới</label>
                            <input 
                                type="password" 
                                className="form-control"
                                value={passwords.newPassword}
                                onChange={(e) => setPasswords({...passwords, newPassword: e.target.value})}
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Xác nhận mật khẩu mới</label>
                            <input 
                                type="password" 
                                className="form-control"
                                value={passwords.confirmPassword}
                                onChange={(e) => setPasswords({...passwords, confirmPassword: e.target.value})}
                            />
                        </div>
                        <button className="btn-save" onClick={handleChangePassword}>Cập nhật mật khẩu</button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default UserProfile;