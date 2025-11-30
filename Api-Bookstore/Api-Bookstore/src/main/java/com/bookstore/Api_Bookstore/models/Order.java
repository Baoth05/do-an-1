package com.bookstore.Api_Bookstore.models;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import lombok.Data;

@Data
@Entity
@Table(name = "orders") // Tên bảng trong MySQL
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private LocalDateTime orderDate; // Ngày đặt hàng

    @Column(nullable = false)
    private Double totalAmount; // Tổng số tiền

    // === Mối quan hệ: Một User có thể có NHIỀU Order ===
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user; // Đơn hàng này của ai?
    @Column(nullable = false)
    private String address; // Địa chỉ giao hàng

    @Column(nullable = false)
    private String phone;   // Số điện thoại

    @Column(nullable = false)
    private String paymentMethod; // Phương thức thanh toán (COD, Banking)

    @Column(nullable = false)
    private String status = "Chờ xác nhận";

    // === Mối quan hệ: Một Order có NHIỀU OrderItem (sách) ===
    // cascade = CascadeType.ALL: Khi tạo Order, tự động tạo OrderItem
    // orphanRemoval = true: Khi xóa Order, tự động xóa OrderItem
    @JsonManagedReference
    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.EAGER)
    private List<OrderItem> orderItems = new ArrayList<>();


    public Order() {
        this.orderDate = LocalDateTime.now(); // Tự động lấy ngày giờ hiện tại
    }



    // Hàm tiện ích để thêm sách vào đơn hàng
    public void addOrderItem(OrderItem item) {
        orderItems.add(item);
        item.setOrder(this); // Đặt quan hệ 2 chiều
    }
}