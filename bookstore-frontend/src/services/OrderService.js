import axios from 'axios';
import authHeader from './auth-header'; // Dùng chung authHeader

const API_URL = "http://localhost:8080/api/v1/orders";

// Hàm gửi đơn hàng (chính là giỏ hàng)
const createOrder = (cartItems) => {
    // Chúng ta chỉ cần gửi 3 trường: id (là bookId), quantity, và price
    // Hàm map() sẽ "lọc" giỏ hàng, chỉ giữ lại 3 trường này
    const orderData = cartItems.map(item => ({
        id: item.id,
        quantity: item.quantity,
        price: item.price
    }));

    // Gửi mảng orderData này đến Backend, kèm theo Token
    return axios.post(API_URL, orderData, { headers: authHeader() });
};
const getOrderHistory = () => {
    // Gọi API GET, kèm theo Token
    return axios.get(API_URL + "/my-history", { headers: authHeader() });
};
const getAllOrders = () => {
    return axios.get(API_URL + "/admin/all", { headers: authHeader() });
};


const OrderService = {
    createOrder,
    getOrderHistory,
    getAllOrders,
};

export default OrderService;