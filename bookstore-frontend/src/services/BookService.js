import axios from 'axios';
import authHeader from "./auth-header";

const API_URL = "http://localhost:8080/api/v1/books";

// ✅ CHÚ Ý: Thêm "/" khi nối ID
const getAllBooks = () => {
    return axios.get(API_URL);
};

const createBook = (bookData) => {
    return axios.post(API_URL, bookData, { headers: authHeader() });
};

const deleteBook = (bookId) => {
    return axios.delete(`${API_URL}/${bookId}`, { headers: authHeader() });
};

const getBookById = (id) => {
    return axios.get(API_URL + `/${id}`);
};

const updateBook = (bookId, bookData) => {
    return axios.put(`${API_URL}/${bookId}`, bookData, { headers: authHeader() });
};
const searchBooks = (query) => {
    // Gọi API (không cần Token vì nó public)
    return axios.get(API_URL + "/search", {
        params: { query: query } // (Gửi query lên)
    });
};

const BookService = {
    getAllBooks,
    createBook,
    deleteBook,
    updateBook,
    getBookById,
    searchBooks,
};

export default BookService;
