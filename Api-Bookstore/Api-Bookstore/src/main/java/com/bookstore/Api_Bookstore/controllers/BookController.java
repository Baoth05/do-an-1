package com.bookstore.Api_Bookstore.controllers;

import com.bookstore.Api_Bookstore.exception.NotFoundException;
import com.bookstore.Api_Bookstore.models.Book;
import com.bookstore.Api_Bookstore.models.BookImage;
import com.bookstore.Api_Bookstore.repositories.BookRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile; // Import quan trọng để xử lý file

import java.nio.file.*;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/books")
public class BookController {

    private final BookRepository bookRepository;

    @Autowired
    public BookController(BookRepository bookRepository){
        this.bookRepository =  bookRepository;
    }

    @GetMapping
    @PreAuthorize("permitAll()")
    public ResponseEntity<List<Book>> getAllBooks(){
        List<Book> books = bookRepository.findAll();
        return new ResponseEntity<>(books, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    @PreAuthorize("permitAll()")
    public ResponseEntity<Book> getBookById(@PathVariable Long id){
        Book book = bookRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Không tìm thấy sách với id:" + id));
        return ResponseEntity.ok(book);
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Book> createBook(@RequestBody Book newBook) {
        // Thiết lập quan hệ cho các ảnh phụ (nếu có)
        if (newBook.getImages() != null) {
            for (BookImage img : newBook.getImages()) {
                img.setBook(newBook);
            }
        }
        Book savedBook = bookRepository.save(newBook);
        return new ResponseEntity<>(savedBook, HttpStatus.CREATED);
    }


    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Book> updateBook(@PathVariable Long id, @RequestBody Book bookDetails) {
        Book existingBook = bookRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Không tìm thấy sách: " + id));

        // Cập nhật các thông tin cơ bản
        existingBook.setTitle(bookDetails.getTitle());
        existingBook.setAuthor(bookDetails.getAuthor());
        existingBook.setPrice(bookDetails.getPrice());
        existingBook.setCategory(bookDetails.getCategory());
        existingBook.setStatus(bookDetails.getStatus());
        existingBook.setDescription(bookDetails.getDescription());
        existingBook.setPageCount(bookDetails.getPageCount());
        existingBook.setPublicationYear(bookDetails.getPublicationYear());
        existingBook.setImageUrl(bookDetails.getImageUrl()); // Ảnh chính
        existingBook.setStockQuantity(bookDetails.getStockQuantity());

        // Cập nhật danh sách ảnh phụ (Xóa cũ thay mới cho đơn giản)
        if (bookDetails.getImages() != null) {
            existingBook.getImages().clear(); // Xóa list cũ
            for (BookImage img : bookDetails.getImages()) {
                img.setBook(existingBook);
                existingBook.getImages().add(img); // Thêm từng cái mới
            }
        }

        Book updatedBook = bookRepository.save(existingBook);
        return ResponseEntity.ok(updatedBook);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteBook(@PathVariable Long id){
        Book book = bookRepository.findById(id)
                .orElseThrow(()-> new NotFoundException("Không tìm thấy sách với id:" +id));
        bookRepository.delete(book);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/search")
    @PreAuthorize("permitAll()")
    public ResponseEntity<List<Book>> searchBooks(@RequestParam("query") String query) {
        List<Book> books = bookRepository.searchBooks(query);
        return new ResponseEntity<>(books, HttpStatus.OK);
    }

    // ==================================================================
    // === ĐÂY LÀ HÀM UPLOAD ẢNH CÒN THIẾU ===
    // ==================================================================
    @PostMapping("/upload")
    @PreAuthorize("hasRole('ADMIN')") // Chỉ Admin mới được up ảnh
    public ResponseEntity<String> uploadImage(@RequestParam("file") MultipartFile file) {
        try {
            // 1. Tạo thư mục uploads nếu chưa tồn tại
            String uploadDir = "uploads/";
            Path uploadPath = Paths.get(uploadDir);
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }

            // 2. Tạo tên file độc nhất (tránh trùng lặp)
            String originalFileName = StringUtils.cleanPath(file.getOriginalFilename());
            String fileName = UUID.randomUUID().toString() + "_" + originalFileName;

            // 3. Lưu file vào thư mục uploads
            Path filePath = uploadPath.resolve(fileName);
            Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

            // 4. Trả về đường dẫn ĐẦY ĐỦ (Full URL) để Frontend hiển thị
            String fileUrl = "http://localhost:8080/uploads/" + fileName;

            return ResponseEntity.ok(fileUrl);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Lỗi upload ảnh: " + e.getMessage());
        }
    }
}