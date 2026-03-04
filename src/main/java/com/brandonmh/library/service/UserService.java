package com.brandonmh.library.service;

import com.brandonmh.library.dto.RegisterRequest;
import com.brandonmh.library.dto.UserResponse;
import com.brandonmh.library.model.User;
import com.brandonmh.library.repository.UserRepository;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class UserService {
    private final UserRepository userRepo;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepo, PasswordEncoder passwordEncoder) {
        this.userRepo = userRepo;
        this.passwordEncoder = passwordEncoder;
    }

    @Transactional
    public UserResponse create(RegisterRequest user) throws Exception {
        // Validate that no email already exists
        if (userRepo.findByEmail(user.email).isPresent()) {
            throw new Exception("Account with email already exists.");
        }

        // Create the user and hash the password
        User hashedUser = new User();
        hashedUser.setName(user.name);
        hashedUser.setEmail(user.email);
        hashedUser.setPassword(passwordEncoder.encode(user.password));
        hashedUser.setRole("USER"); // Default role

        User savedUser = userRepo.save(hashedUser);

        UserResponse userRes = new UserResponse();
        userRes.email = savedUser.getEmail();
        userRes.name = savedUser.getName();
        userRes.id = savedUser.getId();
        userRes.role = savedUser.getRole();

        return userRes;
    }

    public User update(Long id, User user) {
        user.setId(id);
        return userRepo.save(user);
    }

    public void delete(Long id) {
        userRepo.deleteById(id);
    }

    public List<User> getAllUsers() {
        return userRepo.findAll();
    }

    public Optional<User> getUserById(Long id) {
        return userRepo.findById(id);
    }
}
