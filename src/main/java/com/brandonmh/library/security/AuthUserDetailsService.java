package com.brandonmh.library.security;

import com.brandonmh.library.model.User;
import com.brandonmh.library.repository.UserRepository;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class AuthUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;

    public AuthUserDetailsService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        // Fetch the user from your database using the existing repository method
        User dbUser = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + email));

        // Map your database entity to Spring Security's UserDetails object
        return org.springframework.security.core.userdetails.User.builder()
                .username(dbUser.getEmail())
                .password(dbUser.getPassword()) // Must be BCrypt hashed in the DB
                .roles(dbUser.getRole())        // Translates to "ROLE_USER" internally
                .build();
    }
}