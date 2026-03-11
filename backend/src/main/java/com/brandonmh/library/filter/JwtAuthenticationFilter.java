package com.brandonmh.library.filter;

import java.io.IOException;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import com.brandonmh.library.service.AuthUserDetailsService;
import com.brandonmh.library.service.JwtService;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {
    private final JwtService jwtService;
    private final AuthUserDetailsService userDetailsService;

    public JwtAuthenticationFilter(JwtService jwtService, AuthUserDetailsService userDetailsService) {
        this.jwtService = jwtService;
        this.userDetailsService = userDetailsService;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest req, HttpServletResponse res, FilterChain filterChain) throws IOException, ServletException {
        // Check they are using JWT
        final String authHeader = req.getHeader("Authorization");
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            // Pass the request down the filter chain
            filterChain.doFilter(req, res);
            return;
        }

        final String jwt;
        final String username;

        jwt = getJwtFromRequest(req);
        username = jwtService.extractUsernameFromToken(jwt);

        // Make sure they aren't already authenticated
        if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            // Authenticate user
            UserDetails userDetails = userDetailsService.loadUserByUsername(username);
            if (jwtService.isValidToken(jwt, userDetails)) {
                // Create the token, and add it to the security context holder
                UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                    userDetails,
                    null,
                    userDetails.getAuthorities()
                );
                authToken.setDetails(
                    new WebAuthenticationDetailsSource().buildDetails(req)
                );
                SecurityContextHolder.getContext().setAuthentication(authToken);
            }
        }
    }

    private String getJwtFromRequest(HttpServletRequest req) {
        final String authHeader = req.getHeader("Authorization");
        // Bearer <token> - token starts at index 7
        return authHeader.substring(7);
    }
}
