import React, { createContext, useState, useContext, useEffect } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
    
    // 1. SỬA LỖI: Khi tải, hãy đọc từ localStorage
    const [cartItems, setCartItems] = useState(() => {
        try {
            const localData = localStorage.getItem('cartItems');
            return localData ? JSON.parse(localData) : [];
        } catch (error) {
            console.error("Không thể đọc giỏ hàng từ localStorage", error);
            return [];
        }
    });

    // 2. SỬA LỖI: Mỗi khi cartItems thay đổi, lưu nó vào localStorage
    useEffect(() => {
        localStorage.setItem('cartItems', JSON.stringify(cartItems));
    }, [cartItems]); // Chạy hàm này mỗi khi [cartItems] thay đổi

    // Hàm "addToCart" vẫn giữ nguyên, không cần sửa
    const addToCart = (book) => {
        setCartItems((prevItems) => {
            const itemExists = prevItems.find((item) => item.id === book.id);
            if (itemExists) {
                return prevItems.map((item) =>
                    item.id === book.id ? { ...item, quantity: item.quantity + 1 } : item
                );
            } else {
                return [...prevItems, { ...book, quantity: 1 }];
            }
        });
    };
    const updateQuantity = (bookId, newQuantity) => {
        setCartItems((prevItems) => {
            // Nếu số lượng mới là 0 (hoặc ít hơn), hãy xóa sản phẩm
            if (newQuantity <= 0) {
                return prevItems.filter((item) => item.id !== bookId);
            }
            
            // Ngược lại, cập nhật số lượng
            return prevItems.map((item) =>
                item.id === bookId ? { ...item, quantity: newQuantity } : item
            );
        });
    };
    // (Tạm thời chúng ta sẽ thêm hàm "removeFromCart" luôn nhé)
    const removeFromCart = (bookId) => {
        setCartItems((prevItems) => {
            return prevItems.filter((item) => item.id !== bookId);
        });
    };
    const clearCart = () => {
        setCartItems([]); // Đặt giỏ hàng về mảng rỗng
        // (useEffect sẽ tự động cập nhật localStorage thành rỗng)
    };

    // 3. Cung cấp hàm mới
    return (
        <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, updateQuantity, clearCart }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    return useContext(CartContext);
};