import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom';
import './App.css';
import Login from './components/Login';
import Home from './components/Home';
import Navbar from './components/Navbar';
import CreateBook from './components/CreateBook';
import AuthService from './services/AuthService'; 
import Register from './components/Register';
import EditBook from './components/EditBook';
import { CartProvider } from './context/CartContext';
import Cart from './components/Cart';
import Checkout from './components/Checkout';
import OrderHistory from './components/OrderHistory';
import AdminOrders from './components/AdminOrders';
import BookDetail from './components/BookDetail';
import SearchResults from './components/SearchResults';
import Footer from './components/Footer';
import AdminUsers from './components/AdminUsers';   
import OrderDetail from './components/OrderDetail';
import UserProfile from './components/UserProfile';
import AdminDashboard from './components/AdminDashboard';

const AppContent = () => {
    // Đã xóa useLocation vì không cần dùng ở đây nữa
    const [currentUser, setCurrentUser] = useState(AuthService.getCurrentUser());
    const navigate = useNavigate();

    const handleLoginSuccess = () => {
        setCurrentUser(AuthService.getCurrentUser());
        navigate('/home');
    };
 
    const handleLogout = () => {
        AuthService.logout();
        setCurrentUser(undefined);
        navigate('/login');
    };

    return (    
        <>
            <Navbar currentUser={currentUser} onLogout={handleLogout} /> 
            
            <div className="container mt-3">
                <Routes>
                    <Route path="/" element={<Login onLoginSuccess={handleLoginSuccess} />} />
                    <Route path="/login" element={<Login onLoginSuccess={handleLoginSuccess} />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/home" element={<Home />} />
                    <Route path="/add-book" element={<CreateBook />} />
                    <Route path="/edit-book/:id" element={<EditBook />} />
                    <Route path="/cart" element={<Cart />} />
                    <Route path="/checkout" element={<Checkout />} />
                    <Route path="/my-orders" element={<OrderHistory />} />  
                    <Route path="/admin/orders" element={<AdminOrders />} />
                    <Route path="/book/:id" element={<BookDetail />} />
                    <Route path="/search-results" element={<SearchResults />} />
                    <Route path="/admin/users" element={<AdminUsers />} />
                    <Route path="/order-detail/:id" element={<OrderDetail />} />
                    <Route path="/profile" element={<UserProfile />} />
                    <Route path="/admin/dashboard" element={<AdminDashboard />} />
                    
                </Routes>
                
                <Footer />
            </div>
        </>
    );
}

const App = () => {
    return (
        <CartProvider>
            <Router>
                <AppContent />
            </Router>
        </CartProvider>
    );
};

export default App;