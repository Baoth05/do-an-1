import axios from 'axios';

// Hàm lấy Header chứa Token (Authorization)
const authHeader = () => {
    const raw = localStorage.getItem('user');
    if (!raw) return {};

    const user = JSON.parse(raw);

    if (user.token) {
        return { Authorization: `Bearer ${user.token}` };
    }

    return {};
};
const API_URL = "http://localhost:8080/api/v1/books";

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
    return axios.get(API_URL + "/search", {
        params: { query: query }
    });
};

// === ĐÃ SỬA HÀM NÀY ===
const uploadImage = (file) => {
    const formData = new FormData();
    formData.append("file", file);

    return axios.post(API_URL + "/upload", formData, {
        headers: {
            "Content-Type": "multipart/form-data",
            ...authHeader() // Gửi kèm Token Admin
        },
    });
}

const BookService = {
    getAllBooks,
    createBook,
    deleteBook,
    updateBook,
    getBookById,
    searchBooks,
    uploadImage,
};

export default BookService;