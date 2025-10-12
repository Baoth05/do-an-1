package com.bookstore.Api_Bookstore.repositories;

import com.bookstore.Api_Bookstore.models.Book;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface BookRepository extends JpaRepository<Book, Long> {

}
