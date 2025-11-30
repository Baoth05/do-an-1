import axios from "axios";

const API_URL = "http://localhost:8080/api/v1/users";

// Hàm lấy Authorization header
const authHeader = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  if (user && user.token) {
    return { Authorization: (user.type || "Bearer") + " " + user.token };
  }
  return {};
};

// Lấy danh sách tất cả users (ADMIN)
const getAllUsers = () => {
  return axios.get(API_URL, {
    headers: authHeader(),
    withCredentials: true
  });
};

// Xóa user theo id
const deleteUser = (id) => {
  return axios.delete(`${API_URL}/${id}`, {
    headers: authHeader(),
    withCredentials: true
  });
};
const lockUser = (id, hours) => {
    return axios.post(`${API_URL}/${id}/lock`, { hours }, { headers: authHeader() });
};

// MỚI: Lấy đơn hàng của user
const getUserOrders = (id) => {
    return axios.get(`${API_URL}/${id}/orders`, { headers: authHeader() });
};
const getMe = () => {
    return axios.get(API_URL + "/me", { headers: authHeader() });
};

// Cập nhật thông tin
const updateMe = (userData) => {
    return axios.put(API_URL + "/me", userData, { headers: authHeader() });
};

// Đổi mật khẩu
const changePassword = (data) => {
    return axios.post(API_URL + "/change-password", data, { headers: authHeader() });
};
const resetPasswordAdmin = (userId, newPassword) => {
    return axios.put(`${API_URL}/${userId}/reset-password`, { newPassword }, { headers: authHeader() });
};
const UserService = {
  getAllUsers,
  deleteUser,
  lockUser,
  getUserOrders,
  getMe,
  updateMe,
  changePassword,
  resetPasswordAdmin
};

export default UserService;
