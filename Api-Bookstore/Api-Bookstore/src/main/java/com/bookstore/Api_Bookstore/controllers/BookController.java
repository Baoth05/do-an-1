package com.bookstore.Api_Bookstore.controllers;

import com.bookstore.Api_Bookstore.models.Book;
import com.bookstore.Api_Bookstore.repositories.BookRepository;
import org.apache.catalina.users.SparseUserDatabase;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping
public class BookController {

    private final BookRepository bookRepository;

    @Autowired
    public BookController(BookRepository bookRepository){
        this.bookRepository =  bookRepository;
    }

    @GetMapping
    public ResponseEntity<List<Book>> getAllBooks(){// ResponseEntity  Đây là một lớp đặc biệt của Spring Boot dùng để đóng gói toàn bộ phản hồi HTTP trả về cho client
        List<Book> books = bookRepository.findAll();

        return new ResponseEntity<>(books, HttpStatus.OK);
    }
    @PostMapping
    public ResponseEntity<Book> createBook(@RequestBody Book newBook){
        Book saveBook = bookRepository.save(newBook);

        // Nên dùng
        return new ResponseEntity<>(saveBook, HttpStatus.CREATED);
    }
}
