package com.brandonmh.library.service;

import com.brandonmh.library.dto.CheckoutResponse;
import com.brandonmh.library.model.Book;
import com.brandonmh.library.model.Checkout;
import com.brandonmh.library.model.User;
import com.brandonmh.library.repository.CheckoutRepository;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;
import java.util.Optional;

@Service
public class CheckoutService {
    private final CheckoutRepository checkoutRepo;
    private final UserService userService;
    private final BookService bookService;

    public CheckoutService(CheckoutRepository checkoutRepo, UserService userService, BookService bookService) {
        this.checkoutRepo = checkoutRepo;
        this.bookService = bookService;
        this.userService = userService;
    }

    public CheckoutResponse checkoutBook(Long bookId, Long userId) throws Exception {
        Checkout checkout = new Checkout();

        // Get the book and the user
        Optional<User> user = userService.getUserById(userId);
        Optional<Book> book = bookService.getBookById(bookId);

        // Validate the user and book exists, and they do not already have the book
        if (user.isEmpty() || book.isEmpty()) {
            throw new Exception("Either user or book does not exist.");
        }

        if (checkoutRepo.existsByUserIdAndBookIdAndReturnDateIsNull(userId, bookId)) {
            throw new Exception("The user already has this book.");
        }

        // Set data
        checkout.setBook(book.get());
        checkout.setUser(user.get());
        checkout.setCheckoutDate(new Date());

        // Save to DB
        checkoutRepo.save(checkout);

        // To prevent infinite looping by Jackson mapper, wrap into dto
        CheckoutResponse checkoutRes = new CheckoutResponse();
        checkoutRes.checkoutId = checkout.getId();
        checkoutRes.bookId = checkout.getBook().getId();
        checkoutRes.bookTitle = checkout.getBook().getTitle();
        checkoutRes.userName = checkout.getUser().getName();
        checkoutRes.userId = checkout.getUser().getId();

        return checkoutRes;
    }

    public CheckoutResponse returnBook(Long bookId, Long userId) throws Exception {
        List<Checkout> checkouts = checkoutRepo.findByBookIdAndUserIdAndReturnDateIsNull(bookId, userId);

        if (checkouts.isEmpty()) {
            throw new Exception("No checkout records for book and user.");
        }

        Checkout checkout = checkouts.get(0);

        checkout.setReturnDate(new Date());
        checkoutRepo.save(checkout);

        // To prevent infinite looping by Jackson mapper, wrap into dto
        CheckoutResponse checkoutRes = new CheckoutResponse();
        checkoutRes.checkoutId = checkout.getId();
        checkoutRes.bookId = checkout.getBook().getId();
        checkoutRes.bookTitle = checkout.getBook().getTitle();
        checkoutRes.userName = checkout.getUser().getName();
        checkoutRes.userId = checkout.getUser().getId();

        return checkoutRes;
    }

    public List<Checkout> getAllCheckouts() {
        return checkoutRepo.findAll();
    }

    public Optional<Checkout> getCheckoutById(Long id) {
        return checkoutRepo.findById(id);
    }
}
