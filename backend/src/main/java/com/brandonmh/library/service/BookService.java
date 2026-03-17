package com.brandonmh.library.service;

import com.brandonmh.library.model.Book;
import com.brandonmh.library.repository.BookRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class BookService {
    private final BookRepository bookRepo;

    public BookService(BookRepository bookRepo) {
        this.bookRepo = bookRepo;
    }

    public Book addBook(Book book) {
        return bookRepo.save(book);
    }

    public List<Book> getAllBooks() {
        return bookRepo.findAll();
    }

    public Page<Book> getBooks(Pageable pageable, String title, String author) {
        if (title != null && !title.isEmpty()) {
            return bookRepo.findByTitleContainingIgnoreCaseOrAuthorContainingIgnoreCase(title, author, pageable);
        }
        return bookRepo.findAll(pageable);
    }

    public Optional<Book> getBookById(Long id) {
        return bookRepo.findById(id);
    }

    public Book updateBook(Long id, Book updated) {
        // Ensure it updates the correct book
        updated.setId(id);
        return bookRepo.save(updated);
    }

    public void deleteBook(Long id) {
        bookRepo.deleteById(id);
    }
}
