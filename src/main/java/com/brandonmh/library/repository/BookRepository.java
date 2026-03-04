package com.brandonmh.library.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.brandonmh.library.model.Book;
import org.springframework.stereotype.Repository;

@Repository
public interface BookRepository extends JpaRepository<Book, Long> {
    // Standard CRUD operations are inherited from JpaRepository
}