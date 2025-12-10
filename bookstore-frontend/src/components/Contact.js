import React, { useState } from 'react';
import './Contact.css'; // Import CSS

const Contact = () => {
    // State lưu dữ liệu form
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });

    const [isSubmitting, setIsSubmitting] = useState(false);

    // Xử lý khi nhập liệu
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    // Xử lý khi bấm Gửi
    const handleSubmit = (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Giả lập gọi API (đợi 1.5 giây)
        setTimeout(() => {
            alert(`Cảm ơn ${formData.name}! Chúng tôi đã nhận được tin nhắn và sẽ phản hồi sớm nhất.`);
            setFormData({ name: '', email: '', subject: '', message: '' }); // Reset form
            setIsSubmitting(false);
        }, 1500);
    };

    return (
        <div className="contact-container">
            <h2 className="contact-title">Liên Hệ & Hỗ Trợ</h2>

            <div className="contact-wrapper">
                
                {/* CỘT TRÁI: THÔNG TIN LIÊN HỆ */}
                <div className="contact-info">
                    <div className="info-item">
                        <div className="icon-box"><i className="fas fa-map-marker-alt"></i></div>
                        <div className="info-content">
                            <h5>Địa chỉ cửa hàng</h5>
                            <p>Đường Nguyễn Văn Linh, Phường Ninh Kiều, Cần Thơ</p>
                        </div>
                    </div>

                    <div className="info-item">
                        <div className="icon-box"><i className="fas fa-phone-alt"></i></div>
                        <div className="info-content">
                            <h5>Hotline hỗ trợ</h5>
                            <p>1900 123 456 (8:00 - 22:00)</p>
                        </div>
                    </div>

                    <div className="info-item">
                        <div className="icon-box"><i className="fas fa-envelope"></i></div>
                        <div className="info-content">
                            <h5>Email liên hệ</h5>
                            <p>Baotruonghoang05@gmail.com</p>
                        </div>
                    </div>

                    {/* Google Map (Iframe mẫu) */}
                    <div className="map-container">
                        <iframe 
                            title="Google Map"
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.424647363402!2d106.6984893147489!3d10.77926999231976!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752f385570472f%3A0x1787491df0ed8d6a!2zTmjDoCBiw6FuIFPhuqFjaCBI4buTIENow60gTWluaA!5e0!3m2!1svi!2s!4v1625628105745!5m2!1svi!2s" 
                            width="100%" 
                            height="100%" 
                            style={{border:0}} 
                            allowFullScreen="" 
                            loading="lazy">
                        </iframe>
                    </div>
                </div>

                {/* CỘT PHẢI: FORM GỬI TIN NHẮN */}
                <div className="contact-form-box">
                    <form onSubmit={handleSubmit}>
                        <h4 style={{marginBottom: '20px', color: '#333'}}>Gửi thắc mắc cho chúng tôi</h4>
                        
                        <div className="form-group">
                            <label>Họ và tên <span style={{color:'red'}}>*</span></label>
                            <input 
                                type="text" 
                                name="name" 
                                className="form-control" 
                                placeholder="Nhập tên của bạn" 
                                value={formData.name}
                                onChange={handleChange}
                                required 
                            />
                        </div>

                        <div className="form-group">
                            <label>Email <span style={{color:'red'}}>*</span></label>
                            <input 
                                type="email" 
                                name="email" 
                                className="form-control" 
                                placeholder="example@email.com" 
                                value={formData.email}
                                onChange={handleChange}
                                required 
                            />
                        </div>

                        <div className="form-group">
                            <label>Tiêu đề</label>
                            <input 
                                type="text" 
                                name="subject" 
                                className="form-control" 
                                placeholder="Vấn đề cần hỗ trợ (VD: Đổi trả sách)" 
                                value={formData.subject}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="form-group">
                            <label>Nội dung tin nhắn <span style={{color:'red'}}>*</span></label>
                            <textarea 
                                name="message" 
                                className="form-control" 
                                placeholder="Mô tả chi tiết vấn đề của bạn..." 
                                value={formData.message}
                                onChange={handleChange}
                                required
                            ></textarea>
                        </div>

                        <button type="submit" className="btn-submit-contact" disabled={isSubmitting}>
                            {isSubmitting ? 'Đang gửi...' : (
                                <>
                                    <i className="fas fa-paper-plane"></i> Gửi tin nhắn
                                </>
                            )}
                        </button>
                    </form>
                </div>

            </div>
        </div>
    );
};

export default Contact;