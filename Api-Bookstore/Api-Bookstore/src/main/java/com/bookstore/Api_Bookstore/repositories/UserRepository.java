package com.bookstore.Api_Bookstore.repositories;

import com.bookstore.Api_Bookstore.models.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    // Tự định nghĩa một phương thức để tìm người dùng bằng username
    Optional<User> findByUsername(String username);

    // Kiểm tra xem username đã tồn tại trong DB hay chưa
    Boolean existsByUsername(String username);

    // Kiểm tra xem email đã tồn tại trong DB hay chưa
    Boolean existsByEmail(String email);
}
