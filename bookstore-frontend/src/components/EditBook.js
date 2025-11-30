import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import BookService from '../services/BookService';
import './CreateBook.css'; // Tái sử dụng CSS đẹp của trang Tạo sách

const EditBook = () => {
    const { id } = useParams(); 
    
    // State thông tin cơ bản
    const [title, setTitle] = useState('');
    const [author, setAuthor] = useState('');
    const [price, setPrice] = useState(0);
    const [category, setCategory] = useState('');
    const [status, setStatus] = useState('Còn hàng');
    const [description, setDescription] = useState('');
    const [pageCount, setPageCount] = useState(0);
    const [publicationYear, setPublicationYear] = useState(2000);

    // === MỚI: State Tồn kho & Ảnh ===
    const [stockQuantity, setStockQuantity] = useState(0); // Số lượng tồn
    const [imageUrl, setImageUrl] = useState(''); 
    const [secondaryImages, setSecondaryImages] = useState([]);

    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [dataLoading, setDataLoading] = useState(true);
    
    const navigate = useNavigate();

    // 1. Tải dữ liệu sách từ Server
    useEffect(() => {
        BookService.getBookById(id).then(
            (response) => {
                const book = response.data;
                setTitle(book.title);
                setAuthor(book.author);
                setCategory(book.category || '');
                setStatus(book.status || 'Còn hàng');
                setPrice(book.price);
                setImageUrl(book.imageUrl || '');
                setDescription(book.description || ''); 
                setPageCount(book.pageCount || 0);
                setPublicationYear(book.publicationYear || 2000);
                
                // Load ảnh phụ
                setSecondaryImages(book.images || []); 
                
                // === QUAN TRỌNG: Load số lượng tồn kho hiện tại ===
                setStockQuantity(book.stockQuantity || 0);

                setDataLoading(false);
            },
            (error) => {
                const resMessage = (error.response?.data?.message) || error.message || error.toString();
                setMessage("Lỗi tải dữ liệu: " + resMessage);
                setDataLoading(false);
            }
        );
    }, [id]); 

    // 2. Logic: Thay đổi số lượng -> Tự động cập nhật Trạng thái
    const handleStockChange = (e) => {
        const qty = parseInt(e.target.value) || 0;
        setStockQuantity(qty);
        
        // Logic tự động
        if (qty > 0) {
            setStatus('Còn hàng');
        } else {
            setStatus('Hết hàng');
        }
    };

    // 3. Upload ảnh
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

    // 4. Xóa ảnh phụ
    const removeSecondaryImage = (index) => {
        const newList = [...secondaryImages];
        newList.splice(index, 1);
        setSecondaryImages(newList);
    };

    // 5. Gửi dữ liệu cập nhật về Server
    const handleUpdateBook = (e) => {
        e.preventDefault();
        setMessage('');
        setLoading(true);

        const bookData = {
            title, author, price: parseFloat(price), 
            imageUrl, images: secondaryImages,
            description, category, status,
            pageCount: parseInt(pageCount),
            publicationYear: parseInt(publicationYear),
            
            // === QUAN TRỌNG: Gửi số lượng tồn kho mới ===
            stockQuantity: parseInt(stockQuantity) 
        };

        BookService.updateBook(id, bookData)
            .then(() => {
                alert("Cập nhật thành công!");
                navigate('/home'); 
            })
            .catch((error) => {
                const resMessage = (error.response?.data?.message) || error.message || error.toString();
                setMessage("Lỗi cập nhật: " + resMessage);
            })
            .finally(() => setLoading(false)); 
    };

    if (dataLoading) { 
        return <div className="form-container" style={{textAlign: 'center', marginTop: '50px'}}><h3>Đang tải dữ liệu sách...</h3></div>;
    };

    return (
        <div className="form-container">
            <form onSubmit={handleUpdateBook}> 
                <h2>Sửa thông tin sách (ID: {id})</h2>

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

                {/* === KHU VỰC SỬA TỒN KHO (MỚI) === */}
                <div className="form-group stock-box">
                    <label className="stock-label">Cập nhật số lượng Tồn Kho</label>
                    <div style={{display: 'flex', alignItems: 'center', gap: '10px'}}>
                        <input 
                            type="number" 
                            className="form-control" 
                            value={stockQuantity} 
                            onChange={handleStockChange} 
                            min="0"
                            style={{fontWeight: 'bold', color: '#d35400', fontSize: '1.1rem'}}
                        />
                        <span style={{whiteSpace: 'nowrap', color: '#666'}}>Quyển</span>
                    </div>
                    <small style={{color: '#666', fontStyle: 'italic'}}>
                        (Nhập 0 hệ thống sẽ tự chuyển sang trạng thái "Hết hàng")
                    </small>
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
                    <label>Giá (VND) <span className="required-star">*</span></label>
                    <input type="number" className="form-control" value={price} onChange={(e) => setPrice(e.target.value)} required />
                </div>

                {/* Khu vực Ảnh Chính */}
                <div className="form-group upload-box main">
                    <label className="label-main">1. Ảnh bìa chính</label>
                    <input type="file" className="form-control" accept="image/*" onChange={(e) => handleUpload(e, true)} />
                    {imageUrl && (
                        <div className="preview-container">
                            <img src={imageUrl} alt="Main Preview" className="preview-img main-preview" />
                        </div>
                    )}
                </div>
                
                {/* Khu vực Ảnh Phụ */}
                <div className="form-group upload-box sub">
                    <label className="label-sub">2. Ảnh chi tiết (Thêm nhiều)</label>
                    <input 
                        type="file" 
                        className="form-control" 
                        accept="image/*" 
                        onChange={(e) => { handleUpload(e, false); e.target.value = null; }} 
                    />
                    
                    <div className="preview-container">
                        {secondaryImages.length === 0 && <p style={{fontSize: '0.9rem', color: '#888', width: '100%'}}>Chưa có ảnh chi tiết.</p>}
                        {secondaryImages.map((img, index) => (
                            <div key={index} className="img-wrapper">
                                <img src={img.imageUrl} alt={`Sub ${index}`} className="preview-img" />
                                <button type="button" className="btn-remove-img" onClick={() => removeSecondaryImage(index)}>✕</button>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="form-group mt-3">
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
                    {loading ? "Đang lưu..." : "Cập nhật thông tin sách"}
                </button>
                
                {message && <p className="message-error">{message}</p>}
            </form>
        </div>
    );
};

export default EditBook;