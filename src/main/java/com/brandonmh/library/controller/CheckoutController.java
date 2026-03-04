package com.brandonmh.library.controller;

import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.brandonmh.library.dto.CheckoutRequest;
import com.brandonmh.library.dto.CheckoutResponse;
import com.brandonmh.library.model.Checkout;
import com.brandonmh.library.service.CheckoutService;

@RestController
@RequestMapping("/api/checkout")
public class CheckoutController {
    CheckoutService checkoutService;

    public CheckoutController(CheckoutService checkoutService) {
        this.checkoutService = checkoutService;
    }

    @GetMapping
    public List<Checkout> getAll() {
        return checkoutService.getAllCheckouts();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Checkout> getById(@PathVariable Long id) {
        return checkoutService.getCheckoutById(id)
            .map(book -> ResponseEntity.ok(book))
            .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Object> create(@RequestBody CheckoutRequest body) {
        try {
            CheckoutResponse checkout = checkoutService.checkoutBook(body.bookId, body.userId);
            return ResponseEntity.ok(checkout);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping
    public ResponseEntity<Object> returnBook(@RequestBody CheckoutRequest body) {
        try {
            CheckoutResponse checkout = checkoutService.returnBook(body.bookId, body.userId);
            return ResponseEntity.ok(checkout);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
