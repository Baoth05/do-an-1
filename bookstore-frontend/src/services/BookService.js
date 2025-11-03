import axios from 'axios';
import authHeader from "./auth-header";

const API_URL = "http://localhost:8080/api/v1/books";


// Hàm lấy TẤT CẢ sách (yêu cầu "chìa khóa")
const getAllBooks = () => {
    return axios.get(API_URL,
         { headers: authHeader() }); // 2. Gửi "chìa khóa" theo
};
const createBook = (bookData) => {
    return axios.post(API_URL, bookData, { headers: authHeader() });
};

const BookService = {
        getAllBooks,
        createBook,
}
export default BookService;