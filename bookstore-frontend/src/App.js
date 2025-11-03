import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom';
import './App.css';
import Login from './components/Login';
import Home from './components/Home';
import Navbar from './components/Navbar';
import CreateBook from './components/CreateBook';
import AuthService from './services/AuthService'; 

const AppContent = () => {
   
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
                    
                    <Route path="/home" element={<Home />} />
                    <Route path="/add-book" element={<CreateBook />} />
                    
                </Routes>
            </div>
        </>
    );
}

// 9. <Router> bọc AppContent
function App() {
    return (
        <Router>
            <AppContent />
        </Router>
    );
}

export default App;