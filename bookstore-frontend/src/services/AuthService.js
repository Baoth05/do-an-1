import axios from 'axios';

// Đây là URL của backend
const API_URL = "http://localhost:8080/api/v1/auth/";

const register = (username, password, email, fullName, address) => {
    // Gọi API /register
    return axios.post(API_URL + "register", {
        username,
        password,
        email,
        fullName,
        address,
    });
};

const login = (username, password) => {
    // Gọi API /login
    return axios
        .post(API_URL + "login", {
            username,
            password,
        })
        .then((response) => {
            // Nếu backend trả về token (trong response.data)
            if (response.data.token) {
                // Lưu token vào Local Storage của trình duyệt
                localStorage.setItem("user", JSON.stringify(response.data));
            }
            return response.data;
        });
};

const logout = () => {
    // Xóa token khỏi Local Storage
    localStorage.removeItem("user");
};

// Lấy thông tin user (bao gồm token) từ Local Storage
const getCurrentUser = () => {
    return JSON.parse(localStorage.getItem("user"));
};

// Export các hàm này ra để file khác có thể dùng
const AuthService = {
    register,
    login,
    logout,
    getCurrentUser,
};

export default AuthService;