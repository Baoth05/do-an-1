package com.bookstore.Api_Bookstore.models;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Data
@Entity
@NoArgsConstructor
@AllArgsConstructor

public class Book {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title; // Tiêu đề
    private String author; // Tên tác giả
    private double price; // Giá tiền
    private int pageCount; // Số trang
    @Column(columnDefinition = "TEXT") // Giúp DB biết trường này có thể rất dài
    private String description; // Giới thiệu chi tiết
    private String imageUrl; // Đường dẫn hình ảnh
    private String category;// Thể loại
    private String status; // Trạng thái
    @Column(name = "stock_quantity")
    private Integer stockQuantity = 0;

    private int publicationYear; // Năm xuất bản
    //  THÊM MỚI: DANH SÁCH ẢNH PHỤ
    @OneToMany(mappedBy = "book", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference
    private List<BookImage> images = new ArrayList<>();
    // Helper để thêm ảnh dễ dàng
    public void addImage(BookImage image) {
        images.add(image);
        image.setBook(this);
    }

    public void removeImage(BookImage image) {
        images.remove(image);
        image.setBook(null);
    }




}
