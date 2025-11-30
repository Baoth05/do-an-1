import axios from 'axios';

const API_URL = "http://localhost:8080/api/v1/orders";

// --- HÀM LẤY TOKEN CHUẨN (QUAN TRỌNG NHẤT) ---
const authHeader = () => {
    const user = JSON.parse(localStorage.getItem('user'));

    if (user?.token) {
        return { Authorization: 'Bearer ' + user.token };
    } else {
        console.error("⚠️ Không tìm thấy Token! Kiểm tra lại localStorage.");
        return {};
    }
};

// 1. Gửi đơn hàng (Checkout)
const createOrder = (orderRequest) => {
    // orderRequest đã có đủ data (address, phone, cartItems...) từ Checkout.js
    // Gửi thẳng đi kèm Header
    return axios.post(API_URL, orderRequest, { headers: authHeader() });
};

// 2. Lấy lịch sử đơn hàng (User)
const getOrderHistory = () => {
    return axios.get(API_URL + "/my-history", { headers: authHeader() });
};

// 3. Lấy tất cả đơn hàng (Admin)
const getAllOrders = () => {
    return axios.get(API_URL + "/admin/all", { headers: authHeader() });
};
const getOrderById = (id) => {
    return axios.get(API_URL + "/" + id, { headers: authHeader() });
};
const updateOrderStatus = (id, status) => {
    return axios.put(`${API_URL}/${id}/status`, { status }, { headers: authHeader() });
};
const getDashboardStats = () => {
    return axios.get(API_URL + "/admin/stats", { headers: authHeader() });
};

const OrderService = {
    createOrder,
    getOrderHistory,
    getAllOrders,
    getOrderById,
    updateOrderStatus,
    getDashboardStats,
};

export default OrderService;