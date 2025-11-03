import React, { useState } from 'react';
import AuthService from '../services/AuthService';
import './Login.css'; 


const Login = ({ onLoginSuccess }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
  

    const handleLogin = (e) => {
        e.preventDefault(); 
        setMessage('');

        AuthService.login(username, password).then(
            () => {
               
                onLoginSuccess(); 
            },
            (error) => {
                const resMessage =
                    (error.response &&
                        error.response.data &&
                        error.response.data.message) ||
                    error.message ||
                    error.toString();

                setMessage(resMessage);
            }
        );
    };

    return (
        
        <div className='login-container'> 
            <form onSubmit={handleLogin}>
                <h2>Đăng nhập</h2>
                
                <div className='form-group'>
                    <label htmlFor='username'>Tên đăng nhập</label>
                    <input
                        type='text'
                        id='username'
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </div>
                
                <div className='form-group'>
                    <label htmlFor='password'> Mật Khẩu</label> 
                    <input
                        type='password'
                        id='password'
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                
                <button type='submit'>Đăng nhập</button>
                {message && <p className="message">{message}</p>}
            </form>
        </div>
    );
};

export default Login;