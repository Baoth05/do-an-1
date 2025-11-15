import React,{ useState} from "react";
import { useNavigate } from "react-router-dom";
import AuthService from "../services/AuthService";
import "./Register.css";


const Register = ()=> {
    const[username, setUsername] = useState("");
    const[password, setPassword] = useState("");
    const[email,setEmail] = useState("");
    const [fullName, setFullName] = useState('');
    const [address, setAddress] = useState('');

    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();
    const handleRegister = (e) =>{
        e.preventDefault();
        setMessage("");
        setLoading(true);



        AuthService.register(username, password, email, fullName, address)
        .then((Response)=>{
            setMessage("Đăng ký thành công! Bạn sẽ được chuyển đến trang đăng nhập.");
            setLoading(false);

            setTimeout(()=>{
                navigate("/login");
            }, 2000);

        },
        (error)=> {
            const resMessage =(
                error.response &&
                error.response.data &&
                error.response.data.message)  ||
                error.message||
                error.toString();
            setMessage(resMessage);
            setLoading(false);

            
        }
        
    );

} ;  
return(
    <div className="form-container">
            <form onSubmit={handleRegister}>
                <h2>Đăng ký tài khoản</h2>

                <div className="form-group">
                    <label htmlFor="username">Tên đăng nhập (*)</label>
                    <input
                        type="text"
                        id="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </div>
                
                <div className="form-group">
                    <label htmlFor="password">Mật khẩu (*)</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="email">Email (*)</label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="fullName">Họ và tên</label>
                    <input
                        type="text"
                        id="fullName"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="address">Địa chỉ</label>
                    <input
                        type="text"
                        id="address"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                    />
                </div>
                
                <button type="submit" disabled={loading}>
                    {loading ? "Đang xử lý..." : "Đăng ký"}
                </button>
                
                {message && (
                    <p className={loading ? "message-info" : "message-error"}>
                        {message}
                    </p>
                )}
            </form>
        </div>
);

};
export default Register;