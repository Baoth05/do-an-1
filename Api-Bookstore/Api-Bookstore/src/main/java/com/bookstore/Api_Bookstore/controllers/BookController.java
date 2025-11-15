package com.bookstore.Api_Bookstore.controllers;

import com.bookstore.Api_Bookstore.exception.NotFoundException;
import com.bookstore.Api_Bookstore.models.Book;
import com.bookstore.Api_Bookstore.repositories.BookRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.lang.module.ResolutionException;
import java.util.List;
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
    public ResponseEntity<List<Book>> getAllBooks(){// ResponseEntity  Đây là một lớp đặc biệt của Spring Boot dùng để đóng gói toàn bộ phản hồi HTTP trả về cho client
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
    public  ResponseEntity<Book> createBook(@RequestBody Book newBook){
        Book saveBook = bookRepository.save(newBook);
        return new ResponseEntity<>(saveBook, HttpStatus.CREATED);
    }
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Book> updateBook(@PathVariable Long id, @RequestBody Book bookDetails){
        Book eXistingBook = bookRepository.findById(id)
                .orElseThrow(()-> new NotFoundException("Không tìm thấy sách với id:" +id));
        eXistingBook.setAuthor(bookDetails.getAuthor());
        eXistingBook.setTitle(bookDetails.getTitle());
        eXistingBook.setAuthor(bookDetails.getAuthor());
        eXistingBook.setPrice(bookDetails.getPrice());
        eXistingBook.setPageCount(bookDetails.getPageCount());
        eXistingBook.setDescription(bookDetails.getDescription());
        eXistingBook.setImageUrl(bookDetails.getImageUrl());
        eXistingBook.setPublicationYear(bookDetails.getPublicationYear());

        Book updateBook = bookRepository.save(eXistingBook);
        return ResponseEntity.ok(updateBook);
    }
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteBook(@PathVariable Long id){
        Book book = bookRepository.findById(id)
                .orElseThrow(()-> new NotFoundException("Không tìm thấy sách với id:" +id));
        bookRepository.delete(book);
        return ResponseEntity.noContent().build();
    }@GetMapping("/search")
    @PreAuthorize("permitAll()") // Ai cũng được tìm kiếm
    public ResponseEntity<List<Book>> searchBooks(@RequestParam("query") String query) {

        // Dùng hàm mới của Repository để tìm
        List<Book> books = bookRepository.findByTitleContainingIgnoreCase(query);

        // Trả về danh sách (kể cả khi nó rỗng)
        return new ResponseEntity<>(books, HttpStatus.OK);
    }



}
