package com.bookstore.Api_Bookstore.controllers;

import com.bookstore.Api_Bookstore.models.Order;
import com.bookstore.Api_Bookstore.models.User;
import com.bookstore.Api_Bookstore.repositories.OrderRepository; // Nhớ import cái này
import com.bookstore.Api_Bookstore.repositories.UserRepository;
import com.bookstore.Api_Bookstore.security.services.UserDetailsImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/v1/users")
public class UserController {

    @Autowired
    UserRepository userRepository;

    @Autowired
    OrderRepository orderRepository; // Autowired thêm OrderRepository


    @Autowired
    PasswordEncoder passwordEncoder;
    // 1. Lấy danh sách User
    @GetMapping
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    // 2. API Khóa/Mở khóa tài khoản (MỚI)
    @PostMapping("/{id}/lock")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<?> lockUser(@PathVariable Long id, @RequestBody Map<String, Integer> body) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy user"));

        int hours = body.get("hours"); // Nhận số giờ khóa từ Frontend

        if (hours > 0) {
            // Khóa X tiếng tính từ bây giờ
            user.setLockedUntil(LocalDateTime.now().plusHours(hours));
        } else {
            // Nếu hours = 0 nghĩa là Mở khóa
            user.setLockedUntil(null);
        }

        userRepository.save(user);
        return ResponseEntity.ok("Cập nhật trạng thái khóa thành công!");
    }

    // 3. API Xem lịch sử đơn hàng của 1 khách (MỚI)
    @GetMapping("/{id}/orders")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<List<Order>> getUserOrders(@PathVariable Long id) {
        List<Order> orders = orderRepository.findByUserId(id);
        return ResponseEntity.ok(orders);
    }

    // 4. Xóa User
    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<?> deleteUser(@PathVariable Long id) {
        if (userRepository.existsById(id)) {
            userRepository.deleteById(id);
            return ResponseEntity.ok("Đã xóa người dùng thành công!");
        }
        return ResponseEntity.badRequest().body("Không tìm thấy người dùng!");
    }
    // === 1. API LẤY THÔNG TIN CÁ NHÂN (ME) ===
    // === API LẤY THÔNG TIN CÁ NHÂN (QUAN TRỌNG) ===
    @GetMapping("/me")
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    public ResponseEntity<?> getCurrentUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        UserDetailsImpl userDetails = (UserDetailsImpl) auth.getPrincipal();

        // Tìm user trong DB theo ID lấy từ Token
        User user = userRepository.findById(userDetails.getId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        return ResponseEntity.ok(user);
    }

    // === 2. API CẬP NHẬT THÔNG TIN CÁ NHÂN ===
    @PutMapping("/me")
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    public ResponseEntity<?> updateCurrentUser(@RequestBody User updatedInfo) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        UserDetailsImpl userDetails = (UserDetailsImpl) auth.getPrincipal();

        User user = userRepository.findById(userDetails.getId()).orElseThrow();

        // Chỉ cho cập nhật các trường này
        user.setFullName(updatedInfo.getFullName());
        user.setAddress(updatedInfo.getAddress());
        user.setEmail(updatedInfo.getEmail());
        // Không cho sửa Username, Password ở đây

        userRepository.save(user);
        return ResponseEntity.ok("Cập nhật thông tin thành công!");
    }

    // === 3. API ĐỔI MẬT KHẨU ===
    @PostMapping("/change-password")
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    public ResponseEntity<?> changePassword(@RequestBody Map<String, String> request) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        UserDetailsImpl userDetails = (UserDetailsImpl) auth.getPrincipal();
        User user = userRepository.findById(userDetails.getId()).orElseThrow();

        String oldPass = request.get("oldPassword");
        String newPass = request.get("newPassword");

        // Kiểm tra mật khẩu cũ
        if (!passwordEncoder.matches(oldPass, user.getPassword())) {
            return ResponseEntity.badRequest().body("Mật khẩu cũ không đúng!");
        }

        // Lưu mật khẩu mới (đã mã hóa)
        user.setPassword(passwordEncoder.encode(newPass));
        userRepository.save(user);

        return ResponseEntity.ok("Đổi mật khẩu thành công!");
    }
    // API: Admin reset mật khẩu cho user bất kỳ (Không cần pass cũ)
    @PutMapping("/{id}/reset-password")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<?> resetUserPassword(@PathVariable Long id, @RequestBody Map<String, String> body) {
        User user = userRepository.findById(id).orElseThrow(() -> new RuntimeException("User not found"));

        String newPass = body.get("newPassword");
        if (newPass == null || newPass.length() < 6) {
            return ResponseEntity.badRequest().body("Mật khẩu mới phải từ 6 ký tự!");
        }

        user.setPassword(passwordEncoder.encode(newPass));
        userRepository.save(user);

        return ResponseEntity.ok("Đã cấp lại mật khẩu mới thành công!");
    }
}