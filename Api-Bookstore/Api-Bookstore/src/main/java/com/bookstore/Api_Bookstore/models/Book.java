package com.bookstore.Api_Bookstore.models;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

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
    @Column(length = 2000) // Giúp DB biết trường này có thể rất dài
    private String description; // Giới thiệu chi tiết
    private String imageUrl; // Đường dẫn hình ảnh

    private int publicationYear; // Năm xuất bản




}
