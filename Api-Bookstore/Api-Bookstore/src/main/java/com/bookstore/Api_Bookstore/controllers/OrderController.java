package com.bookstore.Api_Bookstore.controllers;

import com.bookstore.Api_Bookstore.exception.NotFoundException;
import com.bookstore.Api_Bookstore.models.Order;
import com.bookstore.Api_Bookstore.models.OrderItem;
import com.bookstore.Api_Bookstore.models.User;
import com.bookstore.Api_Bookstore.repositories.OrderRepository;
import com.bookstore.Api_Bookstore.repositories.UserRepository;
import com.bookstore.Api_Bookstore.security.services.UserDetailsImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/orders")
public class OrderController {
    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private UserRepository userRepository;
    public static class CartItemDTO {
        private Long id; // bookId
        private int quantity;
        private Double price;

        // Getters
        public Long getId() { return id; }
        public int getQuantity() { return quantity; }
        public Double getPrice() { return price; }
    }
    @GetMapping("/admin/all")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<Order>> getAllOrders() {
        List<Order> orders = orderRepository.findAll();
        return new ResponseEntity<>(orders, HttpStatus.OK);
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    public ResponseEntity<Order> createOrder(@RequestBody List<CartItemDTO>cartItems) {
        // 1. Lấy thông tin User đang đăng nhập
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        Long userId = userDetails.getId();
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new NotFoundException("Không tìm thấy User với ID: " + userId));


        Order newOrder = new Order();
        newOrder.setUser(user);


        double totalAmount = 0;
        for (CartItemDTO cartItem : cartItems) {
            OrderItem orderItem = new OrderItem();
            orderItem.setBookId(cartItem.getId());
            orderItem.setQuantity(cartItem.getQuantity());
            orderItem.setPrice(cartItem.getPrice());

            newOrder.addOrderItem(orderItem);

            totalAmount += (cartItem.getPrice() * cartItem.getQuantity());

        }
        newOrder.setTotalAmount(totalAmount);
        Order savedOrder = orderRepository.save(newOrder);
        return new ResponseEntity<>(savedOrder, HttpStatus.CREATED);
    }
    @GetMapping("/my-history")
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')") // Ai đăng nhập cũng được xem
    public ResponseEntity<List<Order>> getOrderHistory() {

        // 1. Lấy thông tin User đang đăng nhập (giống hệt hàm createOrder)
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        Long userId = userDetails.getId();

        // 2. Dùng hàm mới của Repository để tìm tất cả đơn hàng của User này
        // (Lưu ý: List<Order> này đã bao gồm List<OrderItem> bên trong,
        //  vì chúng ta đã cài đặt FetchType.EAGER trong Order.java)
        List<Order> userOrders = orderRepository.findByUserId(userId);

        // 3. Trả về danh sách đơn hàng
        return new ResponseEntity<>(userOrders, HttpStatus.OK);
    }

}
