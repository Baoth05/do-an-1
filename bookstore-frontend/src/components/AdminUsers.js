import React, { useState, useEffect } from 'react';
import UserService from '../services/UserService';
import './AdminUsers.css';

const AdminUsers = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    // State cho Modal
    const [selectedUser, setSelectedUser] = useState(null);
    const [userOrders, setUserOrders] = useState([]);
    const [showHistoryModal, setShowHistoryModal] = useState(false);
    const [showLockModal, setShowLockModal] = useState(false);
    const [showInfoModal, setShowInfoModal] = useState(false); // Modal xem thông tin chi tiết

    useEffect(() => {
        loadUsers();
    }, []);

    const loadUsers = () => {
        UserService.getAllUsers()
            .then(res => {
                setUsers(res.data);
                setLoading(false);
            })
            .catch(err => console.error(err));
    };

    // Lọc user
    const filteredUsers = users.filter(user => {
        const lowerSearch = searchTerm.toLowerCase();
        return (
            user.username.toLowerCase().includes(lowerSearch) ||
            user.email.toLowerCase().includes(lowerSearch) ||
            user.id.toString().includes(lowerSearch)
        );
    });

    // --- CÁC HÀM XỬ LÝ ---
    const openUserInfo = (user) => {
        setSelectedUser(user);
        setShowInfoModal(true);
    };

    const openHistory = (user) => {
        setSelectedUser(user);
        UserService.getUserOrders(user.id).then(res => {
            setUserOrders(res.data);
            setShowHistoryModal(true);
        });
    };

    const openLock = (user) => {
        setSelectedUser(user);
        setShowLockModal(true);
    };

    const handleLock = (hours) => {
        if (!selectedUser) return;
        UserService.lockUser(selectedUser.id, hours).then(() => {
            alert(hours === 0 ? "Đã mở khóa!" : `Đã khóa tài khoản ${hours} tiếng!`);
            setShowLockModal(false);
            loadUsers();
        });
    };

    const isLocked = (user) => {
        return user.lockedUntil && new Date(user.lockedUntil) > new Date();
    };

    return (
        <div className="admin-user-container">
            <h2 className="text-center mb-4 fw-bold text-uppercase text-dark">Quản lý Khách hàng</h2>

            {/* Thanh tìm kiếm */}
            <div className="search-container">
                <div className="search-box">
                    <i className="fas fa-search search-icon"></i>
                    <input 
                        type="text" 
                        className="search-input" 
                        placeholder="Tìm theo Tên, Email, ID..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {loading ? <p className="text-center">Đang tải...</p> : (
                <div className="table-card">
                    <table className="table custom-table mb-0">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Thông tin tài khoản</th>
                                <th>Quyền hạn</th>
                                <th>Trạng thái</th>
                                <th>Hành động</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredUsers.map(user => (
                                <tr key={user.id}>
                                    <td>#{user.id}</td>
                                    <td>
                                        <div className="fw-bold">{user.username}</div>
                                        <small className="text-muted">{user.email}</small>
                                    </td>
                                    <td>
                                        {user.roles?.map(r => (
                                            <span key={r.id} className="badge-role">{r.name.replace('ROLE_', '')}</span>
                                        ))}
                                    </td>
                                    <td>
                                        {isLocked(user) ? (
                                            <span className="status-locked"><i className="fas fa-lock"></i> Bị khóa</span>
                                        ) : (
                                            <span className="status-active"><i className="fas fa-check-circle"></i> Hoạt động</span>
                                        )}
                                    </td>
                                    <td>
                                        {/* Nút Xem Chi Tiết Thông Tin */}
                                        <button className="action-btn" style={{backgroundColor: '#17a2b8', color: 'white'}}
                                            title="Xem chi tiết thông tin"
                                            onClick={() => openUserInfo(user)}>
                                            ℹ️
                                        </button>

                                        {/* Nút xem lịch sử */}
                                        <button className="action-btn btn-history" title="Xem lịch sử mua hàng"
                                            onClick={() => openHistory(user)}>
                                            📜
                                        </button>

                                        {/* Nút Khóa */}
                                        {isLocked(user) ? (
                                            <button className="action-btn btn-unlock" title="Mở khóa"
                                                onClick={() => handleLock(0)}>
                                                🔓
                                            </button>
                                        ) : (
                                            <button className="action-btn btn-lock" title="Khóa tài khoản"
                                                onClick={() => openLock(user)}>
                                                ⛔
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            
            {/* === MODAL THÔNG TIN KHÁCH HÀNG (GIAO DIỆN CHUẨN) === */}
            {/* === MODAL THÔNG TIN CHI TIẾT & CẤP LẠI MẬT KHẨU === */}
            {showInfoModal && selectedUser && (
                <div className="modal-overlay" onClick={() => setShowInfoModal(false)}>
                    {/* Tăng maxWidth lên 900px cho rộng rãi */}
                    <div className="modal-box" style={{maxWidth: '900px', padding: 0, borderRadius: '12px'}} onClick={e => e.stopPropagation()}>
                        
                        {/* HEADER */}
                        <div className="profile-modal-header">
                            <div className="d-flex justify-content-between align-items-start">
                                <h5 className="text-white opacity-75 mb-0">Quản lý hồ sơ người dùng</h5>
                                <button className="btn-close btn-close-white" onClick={() => setShowInfoModal(false)}></button>
                            </div>
                        </div>

                        <div className="modal-body px-5 pb-5">
                            {/* AVATAR & TÊN */}
                            <div className="avatar-container">
                                <div className="avatar-large">
                                    {selectedUser.username.charAt(0).toUpperCase()}
                                </div>
                                <h3 className="profile-name">{selectedUser.fullName || selectedUser.username}</h3>
                                <span className="profile-role-badge">
                                    {selectedUser.roles.map(r => r.name.replace('ROLE_', '')).join(', ')}
                                </span>
                            </div>

                            {/* NỘI DUNG CHÍNH - CHIA 2 CỘT */}
                            <div className="row g-4 mt-2">
                                {/* CỘT TRÁI: THÔNG TIN CƠ BẢN */}
                                <div className="col-md-7" style={{borderRight: '1px solid #eee'}}>
                                    <h6 className="text-uppercase text-muted fw-bold mb-3">📌 Thông tin cá nhân</h6>
                                    
                                    <div className="row g-3">
                                        <div className="col-md-6">
                                            <label className="info-label">ID Tài khoản</label>
                                            <div className="info-value-box">#{selectedUser.id}</div>
                                        </div>
                                        <div className="col-md-6">
                                            <label className="info-label">Tên đăng nhập</label>
                                            <div className="info-value-box fw-bold text-primary">{selectedUser.username}</div>
                                        </div>
                                        <div className="col-12">
                                            <label className="info-label">Email</label>
                                            <div className="info-value-box">{selectedUser.email}</div>
                                        </div>
                                        <div className="col-12">
                                            <label className="info-label">Địa chỉ</label>
                                            <div className="info-value-box">{selectedUser.address || "Chưa cập nhật"}</div>
                                        </div>
                                        <div className="col-12 mt-3">
                                            <label className="info-label">Trạng thái</label>
                                            <div>
                                                {isLocked(selectedUser) ? 
                                                    <span className="badge bg-danger p-2">⛔ Đang bị khóa</span> : 
                                                    <span className="badge bg-success p-2">✅ Đang hoạt động</span>
                                                }
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* CỘT PHẢI: QUẢN LÝ MẬT KHẨU */}
                                <div className="col-md-5">
                                    <h6 className="text-uppercase text-danger fw-bold mb-3">🔑 Cấp lại mật khẩu</h6>
                                    <div className="p-3 bg-light rounded border border-warning">
                                        <p className="small text-muted mb-2">
                                            <i className="fas fa-exclamation-triangle text-warning me-1"></i>
                                            Nếu người dùng quên mật khẩu, bạn có thể đặt lại mật khẩu mới tại đây.
                                        </p>
                                        
                                        <label className="info-label mt-2">Mật khẩu mới</label>
                                        <input 
                                            type="text" 
                                            className="form-control mb-2" 
                                            placeholder="Nhập mật khẩu mới..." 
                                            id="newPassInput"
                                        />
                                        
                                        <button 
                                            className="btn btn-warning w-100 fw-bold text-dark mt-2"
                                            onClick={() => {
                                                const newPass = document.getElementById('newPassInput').value;
                                                if(!newPass) return alert("Vui lòng nhập mật khẩu mới!");
                                                if(window.confirm(`Bạn chắc chắn muốn đổi mật khẩu cho user ${selectedUser.username}?`)) {
                                                    UserService.resetPasswordAdmin(selectedUser.id, newPass)
                                                        .then(() => {
                                                            alert("Đã đổi mật khẩu thành công!");
                                                            document.getElementById('newPassInput').value = "";
                                                        })
                                                        .catch(err => alert("Lỗi: " + err.message));
                                                }
                                            }}
                                        >
                                            <i className="fas fa-sync-alt me-1"></i> Đổi mật khẩu
                                        </button>
                                    </div>

                                    <div className="mt-4">
                                        <h6 className="text-uppercase text-muted fw-bold mb-2">Chuỗi Hash hiện tại</h6>
                                        <div className="info-value-box password text-break" style={{fontSize: '0.7rem', height: '60px', overflowY: 'auto'}}>
                                            {selectedUser.password}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* === MODAL LỊCH SỬ (Giữ nguyên) === */}
            {showHistoryModal && selectedUser && (
                <div className="modal-overlay" onClick={() => setShowHistoryModal(false)}>
                    <div className="modal-box" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <h5 className="mb-0">Lịch sử đơn hàng: {selectedUser.username}</h5>
                            <button className="btn-close" onClick={() => setShowHistoryModal(false)}></button>
                        </div>
                        <div className="modal-body">
                            {userOrders.length === 0 ? (
                                <p className="text-center text-muted">Khách này chưa mua đơn hàng nào.</p>
                            ) : (
                                <ul className="list-group">
                                    {userOrders.map(order => (
                                        <li key={order.id} className="list-group-item d-flex justify-content-between align-items-center">
                                            <div>
                                                <strong>Đơn #{order.id}</strong>
                                                <br/>
                                                <small className="text-muted">{new Date(order.orderDate).toLocaleDateString()}</small>
                                            </div>
                                            <div className="text-end">
                                                <span className="fw-bold text-danger">{order.totalAmount.toLocaleString()} đ</span>
                                                <br/>
                                                <span className="badge bg-secondary">{order.status}</span>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* === MODAL KHÓA (Giữ nguyên) === */}
            {showLockModal && selectedUser && (
                <div className="modal-overlay" onClick={() => setShowLockModal(false)}>
                    <div className="modal-box" style={{width: '400px'}} onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <h5 className="mb-0">Khóa tài khoản: {selectedUser.username}</h5>
                            <button className="btn-close" onClick={() => setShowLockModal(false)}></button>
                        </div>
                        <div className="modal-body">
                            <p>Vui lòng chọn thời gian khóa:</p>
                            <div className="lock-options">
                                <button className="lock-option-btn" onClick={() => handleLock(1)}>1 Giờ</button>
                                <button className="lock-option-btn" onClick={() => handleLock(24)}>1 Ngày</button>
                                <button className="lock-option-btn" onClick={() => handleLock(168)}>1 Tuần</button>
                            </div>
                            <button className="btn btn-danger w-100 mt-3" onClick={() => handleLock(87600)}>Khóa vĩnh viễn</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminUsers;