package com.bookstore.Api_Bookstore.models;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.Data;
@Data
@Entity
@Table(name = "book_images")
public class BookImage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String imageUrl; // Đường dẫn ảnh

    @ManyToOne
    @JoinColumn(name = "book_id")
    @JsonBackReference // Ngăn lặp vô tận
    private Book book;
}
