package com.brandonmh.library.controller;

import com.brandonmh.library.model.Book;
import com.brandonmh.library.dto.CheckoutResponse;
import com.brandonmh.library.service.BookService;
import com.brandonmh.library.service.CheckoutService;
import com.brandonmh.library.service.UserService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

@RestController
@RequestMapping("/api/book")
public class BookController {

    private final BookService bookService;
    private final CheckoutService checkoutService;
    private final UserService userService;

    public BookController(BookService bookService, CheckoutService checkoutService, UserService userService) {
        this.bookService = bookService;
        this.checkoutService = checkoutService;
        this.userService = userService;
    }

    @GetMapping
    public Page<Book> getAllBooks(
        @PageableDefault(size = 20) Pageable pageable,
        @RequestParam(required = false) String search
    ) {
        return bookService.getBooks(pageable, search, search);
    }

    @GetMapping("/my")
    public ResponseEntity<?> getMyBooks() {
        try {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            String email = auth.getName();

            Long userId = userService.getUserByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"))
                .getId();

            return ResponseEntity.ok(checkoutService.getActiveBooksForUser(userId));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<Book> getBookById(@PathVariable Long id) {
        return bookService.getBookById(id)
            .map(book -> ResponseEntity.ok(book))
            .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Book> createBook(@RequestBody Book book) {
        return new ResponseEntity<>(bookService.addBook(book), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Book> updateBook(@PathVariable Long id, @RequestBody Book book) {
        return ResponseEntity.ok(bookService.updateBook(id, book));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBook(@PathVariable Long id) {
        bookService.deleteBook(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{id}/checkout")
    public ResponseEntity<?> checkoutBook(@PathVariable Long id) {
        try {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            String email = auth.getName();

            Long userId = userService.getUserByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"))
                .getId();

            CheckoutResponse checkout = checkoutService.checkoutBook(id, userId);
            return ResponseEntity.ok(checkout);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @DeleteMapping("/{id}/checkout")
    public ResponseEntity<?> returnBook(@PathVariable Long id) {
        try {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            String email = auth.getName();

            Long userId = userService.getUserByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"))
                .getId();

            CheckoutResponse checkout = checkoutService.returnBook(id, userId);
            return ResponseEntity.ok(checkout);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}