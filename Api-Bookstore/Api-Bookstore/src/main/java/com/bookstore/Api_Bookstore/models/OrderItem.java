package com.bookstore.Api_Bookstore.models;

import jakarta.persistence.*;
import com.fasterxml.jackson.annotation.JsonBackReference;

@Entity
@Table(name = "order_items")
public class OrderItem {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // === Mối quan hệ: Nhiều OrderItem thuộc về MỘT Order ===
    @JsonBackReference
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id", nullable = false)
    private Order order;

    // === GIỮ NGUYÊN CỘT NÀY ĐỂ LƯU ID (Write) ===
    @Column(name = "book_id", nullable = false)
    private Long bookId;

    // === THÊM MỚI: MỐI QUAN HỆ ĐỂ ĐỌC THÔNG TIN SÁCH (Read-Only) ===
    // insertable = false, updatable = false: Để tránh xung đột với cột bookId ở trên
    @ManyToOne
    @JoinColumn(name = "book_id", insertable = false, updatable = false)
    private Book book;
    // (Nhờ biến này, khi lấy OrderItem, ta sẽ có luôn thông tin book.title, book.imageUrl...)

    @Column(nullable = false)
    private int quantity; // Số lượng

    @Column(nullable = false)
    private Double price; // Giá tại thời điểm mua

    // === Getters and Setters ===
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Order getOrder() {
        return order;
    }

    public void setOrder(Order order) {
        this.order = order;
    }

    public Long getBookId() {
        return bookId;
    }

    public void setBookId(Long bookId) {
        this.bookId = bookId;
    }

    // Getter/Setter cho đối tượng Book mới thêm
    public Book getBook() {
        return book;
    }

    public void setBook(Book book) {
        this.book = book;
    }

    public int getQuantity() {
        return quantity;
    }

    public void setQuantity(int quantity) {
        this.quantity = quantity;
    }

    public Double getPrice() {
        return price;
    }

    public void setPrice(Double price) {
        this.price = price;
    }
}