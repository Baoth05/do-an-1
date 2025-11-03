    export default function authHeader() {
    // Lấy user (có chứa token) từ Local Storage
    const user = JSON.parse(localStorage.getItem('user'));

    if (user && user.token) {
        // Nếu có, trả về header Authorization
        return { Authorization: 'Bearer ' + user.token };
    } else {
        // Nếu không, trả về object rỗng
        return {};
    }
}