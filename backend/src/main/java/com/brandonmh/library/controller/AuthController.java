package com.brandonmh.library.controller;

import com.brandonmh.library.dto.LoginRequest;
import com.brandonmh.library.dto.RegisterRequest;
import com.brandonmh.library.dto.Token;
import com.brandonmh.library.service.JwtService;
import com.brandonmh.library.service.UserService;

import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    private final UserService userService;
    private JwtService jwtService;

    public AuthController(UserService userService, JwtService jwtService) {
        this.userService = userService;
        this.jwtService = jwtService;
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
        Token token = userService.login(loginRequest);

        // Create the cookie
        ResponseCookie jwtCookie = ResponseCookie.from("accessToken", token.getAccessToken())
                .httpOnly(true)       // Mitigates Cross-Site Scripting (XSS)
                .secure(false)        // Set to TRUE in production (requires HTTPS)
                .path("/")            // Cookie is valid for all routes
                .maxAge(jwtService.getJwtExpirationMs() / 1000) 
                .sameSite("Lax")      // Mitigates Cross-Site Request Forgery (CSRF). Use "Strict" if frontend and backend share the exact same domain.
                .build();

        // Return access token with cookie
        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, jwtCookie.toString())
                .build();
    }
}
