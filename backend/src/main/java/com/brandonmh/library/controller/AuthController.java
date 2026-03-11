package com.brandonmh.library.controller;

import com.brandonmh.library.dto.LoginRequest;
import com.brandonmh.library.dto.RegisterRequest;
import com.brandonmh.library.dto.TokenPair;
import com.brandonmh.library.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    private final UserService userService;

    public AuthController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/register")
    public ResponseEntity<Object> register(@RequestBody RegisterRequest registerRequest) {
        try {
            return ResponseEntity.ok(userService.create(registerRequest));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/login")
    public ResponseEntity<Object> login(@RequestBody LoginRequest loginRequest) {
        // Authenticate the user
        TokenPair tokenPair = userService.login(loginRequest);
        // Return access token
        return ResponseEntity.ok(tokenPair);
    }
}
