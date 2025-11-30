package com.bookstore.Api_Bookstore.controllers;

import com.bookstore.Api_Bookstore.exception.NotFoundException;
import com.bookstore.Api_Bookstore.models.*;
import com.bookstore.Api_Bookstore.repositories.BookRepository;
import com.bookstore.Api_Bookstore.repositories.OrderRepository;
import com.bookstore.Api_Bookstore.repositories.UserRepository;
import com.bookstore.Api_Bookstore.security.services.UserDetailsImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.stream.Collectors;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/v1/orders")
public class OrderController {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private BookRepository bookRepository;

    // --- 1. DTO: SẢN PHẨM TRONG GIỎ ---
    public static class CartItemDTO {
        private Long id;
        private int quantity;
        private Double price;
        public Long getId() { return id; }
        public int getQuantity() { return quantity; }
        public Double getPrice() { return price; }
    }

    // --- 2. DTO: YÊU CẦU TẠO ĐƠN HÀNG ---
    public static class CreateOrderRequest {
        private String address;
        private String phone;
        private String paymentMethod;
        private List<CartItemDTO> cartItems;
        public String getAddress() { return address; }
        public String getPhone() { return phone; }
        public String getPaymentMethod() { return paymentMethod; }
        public List<CartItemDTO> getCartItems() { return cartItems; }
    }

    // --- 3. DTO CON: THỐNG KÊ SÁCH (MỚI) ---
    public static class BookStatDTO {
        public String title;
        public int soldQuantity;
        public double totalRevenue;

        public BookStatDTO(String title, int soldQuantity, double totalRevenue) {
            this.title = title;
            this.soldQuantity = soldQuantity;
            this.totalRevenue = totalRevenue;
        }
    }

    // --- 4. DTO CHÍNH: DASHBOARD STATS
    public static class DashboardStats {
        public Double totalRevenue;
        public int totalOrders;
        public int totalBooksSold;
        public int totalUsers;

        // Thêm 2 trường này để Frontend vẽ bảng Top và biểu đồ Tròn
        public List<BookStatDTO> topSellingBooks;
        public Map<String, Long> orderStatusCounts;

        public DashboardStats() {} // Constructor mặc định
    }



    @GetMapping("/admin/all")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<Order>> getAllOrders() {
        return ResponseEntity.ok(orderRepository.findAll());
    }

    // === HÀM TẠO ĐƠN HÀNG (GIỮ NGUYÊN LOGIC TRỪ KHO) ===
    @PostMapping
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    @Transactional
    public ResponseEntity<?> createOrder(@RequestBody CreateOrderRequest request) {
        try {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            UserDetailsImpl userDetails = (UserDetailsImpl) auth.getPrincipal();
            User user = userRepository.findById(userDetails.getId())
                    .orElseThrow(() -> new NotFoundException("User not found"));

            Order newOrder = new Order();
            newOrder.setUser(user);
            newOrder.setAddress(request.getAddress());
            newOrder.setPhone(request.getPhone());
            newOrder.setPaymentMethod(request.getPaymentMethod());
            newOrder.setStatus("Chờ xác nhận");

            double totalAmount = 0;

            for (CartItemDTO item : request.getCartItems()) {
                Book book = bookRepository.findById(item.getId())
                        .orElseThrow(() -> new NotFoundException("Sách không tồn tại ID: " + item.getId()));

                if (book.getStockQuantity() < item.getQuantity()) {
                    throw new RuntimeException("Sách '" + book.getTitle() + "' không đủ hàng (Còn: " + book.getStockQuantity() + ")");
                }

                int newStock = book.getStockQuantity() - item.getQuantity();
                book.setStockQuantity(newStock);

                if (newStock == 0) {
                    book.setStatus("Hết hàng");
                }
                bookRepository.save(book);

                OrderItem orderItem = new OrderItem();
                orderItem.setBookId(book.getId());
                orderItem.setQuantity(item.getQuantity());
                orderItem.setPrice(item.getPrice());

                newOrder.addOrderItem(orderItem);
                totalAmount += (item.getPrice() * item.getQuantity());
            }

            newOrder.setTotalAmount(totalAmount);
            Order savedOrder = orderRepository.save(newOrder);

            return new ResponseEntity<>(savedOrder, HttpStatus.CREATED);

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @GetMapping("/my-history")
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    public ResponseEntity<List<Order>> getOrderHistory() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        UserDetailsImpl userDetails = (UserDetailsImpl) auth.getPrincipal();
        return ResponseEntity.ok(orderRepository.findByUserId(userDetails.getId()));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    public ResponseEntity<?> getOrderById(@PathVariable Long id) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        UserDetailsImpl userDetails = (UserDetailsImpl) auth.getPrincipal();

        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Order not found"));

        boolean isAdmin = userDetails.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));

        if (order.getUser().getId() != userDetails.getId() && !isAdmin) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Access Denied");
        }
        return ResponseEntity.ok(order);
    }

    @PutMapping("/{id}/status")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<?> updateOrderStatus(@PathVariable Long id, @RequestBody Map<String, String> body) {
        try {
            Order order = orderRepository.findById(id).orElseThrow(() -> new NotFoundException("Not found"));
            order.setStatus(body.get("status"));
            orderRepository.save(order);
            return ResponseEntity.ok("Cập nhật trạng thái thành công");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // === API THỐNG KÊ (ĐÃ CẬP NHẬT LOGIC MỚI) ===
    @GetMapping("/admin/stats")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<DashboardStats> getDashboardStats() {
        List<Order> allOrders = orderRepository.findAll();
        List<User> allUsers = userRepository.findAll();
        List<Book> allBooks = bookRepository.findAll(); // Lấy sách để map tên

        DashboardStats stats = new DashboardStats();

        // 1. Các chỉ số cơ bản
        stats.totalRevenue = allOrders.stream().mapToDouble(Order::getTotalAmount).sum();
        stats.totalOrders = allOrders.size();
        stats.totalBooksSold = allOrders.stream().flatMap(o -> o.getOrderItems().stream()).mapToInt(OrderItem::getQuantity).sum();
        stats.totalUsers = allUsers.size();

        // 2. Tính Top Sách Bán Chạy
        Map<Long, Integer> bookSalesMap = new HashMap<>();
        Map<Long, Double> bookRevenueMap = new HashMap<>();

        for (Order order : allOrders) {
            for (OrderItem item : order.getOrderItems()) {
                bookSalesMap.put(item.getBookId(), bookSalesMap.getOrDefault(item.getBookId(), 0) + item.getQuantity());
                bookRevenueMap.put(item.getBookId(), bookRevenueMap.getOrDefault(item.getBookId(), 0.0) + (item.getPrice() * item.getQuantity()));
            }
        }

        // Sort Map theo value (số lượng) giảm dần và lấy Top 5
        stats.topSellingBooks = bookSalesMap.entrySet().stream()
                .sorted(Map.Entry.<Long, Integer>comparingByValue().reversed())
                .limit(5)
                .map(entry -> {
                    Long bookId = entry.getKey();
                    // Tìm tên sách (hoặc "Unknown" nếu đã bị xóa)
                    String bookTitle = allBooks.stream()
                            .filter(b -> b.getId().equals(bookId))
                            .findFirst()
                            .map(Book::getTitle)
                            .orElse("Sách đã xóa (ID: " + bookId + ")");

                    return new BookStatDTO(bookTitle, entry.getValue(), bookRevenueMap.get(bookId));
                })
                .collect(Collectors.toList());

        // 3. Tính Tỷ lệ Trạng thái Đơn hàng (Cho biểu đồ tròn)
        stats.orderStatusCounts = allOrders.stream()
                .collect(Collectors.groupingBy(Order::getStatus, Collectors.counting()));

        return ResponseEntity.ok(stats);
    }
}