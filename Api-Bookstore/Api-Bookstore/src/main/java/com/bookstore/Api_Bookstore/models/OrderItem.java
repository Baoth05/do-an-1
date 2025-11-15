package com.bookstore.Api_Bookstore.models;


import jakarta.persistence.*;
import jakarta.persistence.Id;
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

    // === Mối quan hệ: Nhiều OrderItem trỏ đến MỘT Sách ===
    // Chúng ta chỉ lưu ID sách, hoặc bạn có thể dùng @ManyToOne
    @Column(name = "book_id", nullable = false)
    private Long bookId;
    // (Lưu ý: Chúng ta chỉ lưu ID sách, không phải toàn bộ đối tượng Book
    //  để tránh thay đổi đơn hàng cũ khi Sách (Book) bị sửa/xóa)

    @Column(nullable = false)
    private int quantity; // Số lượng

    @Column(nullable = false)
    private Double price; // Giá tại thời điểm mua

    // Getters and Setters
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
