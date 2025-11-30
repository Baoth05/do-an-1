import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BookService from '../services/BookService';
import './CreateBook.css'; // Import CSS đã tách

const CreateBook = () => {
    const [title, setTitle] = useState('');
    const [author, setAuthor] = useState('');
    const [price, setPrice] = useState(0);
    const [category, setCategory] = useState('');
    
    // State Tồn kho & Trạng thái
    const [stockQuantity, setStockQuantity] = useState(0); 
    const [status, setStatus] = useState('Hết hàng');

    const [description, setDescription] = useState('');
    const [pageCount, setPageCount] = useState(0);
    const [publicationYear, setPublicationYear] = useState(2025);
    
    // State Ảnh
    const [imageUrl, setImageUrl] = useState(''); 
    const [secondaryImages, setSecondaryImages] = useState([]);

    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    // 1. Logic Tồn kho -> Tự động đổi Trạng thái
    const handleStockChange = (e) => {
        const qty = parseInt(e.target.value) || 0;
        setStockQuantity(qty);
        if (qty > 0) setStatus('Còn hàng');
        else setStatus('Hết hàng');
    };

    // 2. Upload ảnh
    const handleUpload = (e, isMainImage = true) => {
        const file = e.target.files[0];
        if (file) {
            setLoading(true);
            BookService.uploadImage(file).then(
                (response) => {
                    const url = response.data;
                    if (isMainImage) setImageUrl(url);
                    else setSecondaryImages([...secondaryImages, { imageUrl: url }]);
                    setLoading(false);
                },
                (error) => { setMessage("Lỗi upload ảnh!"); setLoading(false); }
            );
        }
    };

    // 3. Xóa ảnh phụ
    const removeSecondaryImage = (index) => {
        const newList = [...secondaryImages];
        newList.splice(index, 1);
        setSecondaryImages(newList);
    };

    // 4. Tạo sách
    const handleCreateBook = (e) => {
        e.preventDefault();
        setLoading(true);

        const bookData = {
            title, author, price: parseFloat(price), 
            imageUrl, images: secondaryImages,
            description, category, status,
            pageCount: parseInt(pageCount),
            publicationYear: parseInt(publicationYear),
            stockQuantity: parseInt(stockQuantity) // Gửi kèm tồn kho
        };

        BookService.createBook(bookData)
            .then(() => navigate('/home'))
            .catch((error) => setMessage("Lỗi: " + error.message))
            .finally(() => setLoading(false));
    };

    return (
        <div className="form-container">
            <form onSubmit={handleCreateBook}> 
                <h2>Thêm Sách Mới</h2>

                <div className="form-group">
                    <label>Tiêu đề <span className="required-star">*</span></label>
                    <input type="text" className="form-control" value={title} onChange={(e) => setTitle(e.target.value)} required />
                </div>
                <div className="form-group">
                    <label>Tác giả <span className="required-star">*</span></label>
                    <input type="text" className="form-control" value={author} onChange={(e) => setAuthor(e.target.value)} required />
                </div>
                <div className="form-group">
                    <label>Thể loại <span className="required-star">*</span></label>
                    <input type="text" className="form-control" value={category} onChange={(e) => setCategory(e.target.value)} required />
                </div>

                {/* KHU VỰC NHẬP KHO */}
                <div className="form-group stock-box">
                    <label className="stock-label">Số lượng nhập kho</label>
                    <input 
                        type="number" 
                        className="form-control" 
                        value={stockQuantity} 
                        onChange={handleStockChange} 
                        min="0"
                        required
                    />
                    <small style={{color: '#666'}}>Nhập số > 0, trạng thái sẽ tự chuyển "Còn hàng"</small>
                </div>

                <div className="form-group">
                    <label>Trạng thái</label>
                    <select className="form-control" value={status} onChange={(e) => setStatus(e.target.value)}>
                        <option value="Còn hàng">Còn hàng</option>
                        <option value="Hết hàng">Hết hàng</option>
                        <option value="Sắp về">Sắp về</option>
                        <option value="Ngừng kinh doanh">Ngừng kinh doanh</option>
                    </select>
                </div>

                <div className="form-group">
                    <label>Giá bán (VND)</label>
                    <input type="number" className="form-control" value={price} onChange={(e) => setPrice(e.target.value)} required />
                </div>

                {/* KHU VỰC ẢNH CHÍNH */}
                <div className="form-group upload-box main">
                    <label className="label-main">1. Ảnh bìa chính (Bắt buộc)</label>
                    <input type="file" className="form-control" accept="image/*" onChange={(e) => handleUpload(e, true)} />
                    {imageUrl && (
                        <div className="preview-container">
                            <img src={imageUrl} alt="Main" className="preview-img main-preview" />
                        </div>
                    )}
                </div>

                {/* KHU VỰC ẢNH PHỤ */}
                <div className="form-group upload-box sub">
                    <label className="label-sub">2. Ảnh chi tiết (Thêm nhiều)</label>
                    <input 
                        type="file" 
                        className="form-control" 
                        accept="image/*" 
                        onChange={(e) => { handleUpload(e, false); e.target.value = null; }} 
                    />
                    <div className="preview-container">
                        {secondaryImages.map((img, index) => (
                            <div key={index} className="img-wrapper">
                                <img src={img.imageUrl} alt="Sub" className="preview-img" />
                                <button type="button" className="btn-remove-img" onClick={() => removeSecondaryImage(index)}>✕</button>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="form-group">
                    <label>Mô tả</label>
                    <textarea className="form-control" value={description} onChange={(e) => setDescription(e.target.value)} />
                </div>
                <div className="form-group">
                    <label>Số trang</label>
                    <input type="number" className="form-control" value={pageCount} onChange={(e) => setPageCount(e.target.value)} />
                </div>
                <div className="form-group">
                    <label>Năm xuất bản</label>
                    <input type="number" className="form-control" value={publicationYear} onChange={(e) => setPublicationYear(e.target.value)} />
                </div>
                
                <button type="submit" disabled={loading} className="btn-submit">
                    {loading ? "Đang tạo..." : "Tạo sách mới"}
                </button>
                {message && <p className="message-error">{message}</p>}
            </form>
        </div>
    );
};

export default CreateBook;