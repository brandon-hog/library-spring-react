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
import jakarta.servlet.http.Cookie;
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
        final String username;
        final String jwt = getJwtFromRequest(req);

        // If they are not using JWT, pass the request down the filter chain
        if (jwt == null) {
            filterChain.doFilter(req, res);
            return;
        }

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

        filterChain.doFilter(req, res);
    }

    private String getJwtFromRequest(HttpServletRequest req) {
        // Check they are using JWT Cookie
        final Cookie[] accessTokenCookie = req.getCookies();
        if (accessTokenCookie != null) {
            for (Cookie cookie : accessTokenCookie) {
                if (cookie.getName().equals("accessToken")) {
                    return cookie.getValue();
                }
            }
        }
        
        // If they are not using Cookie, check for JWT Header
        String authHeader = req.getHeader("Authorization");
        if (authHeader == null || !authHeader.startsWith(JwtService.TOKEN_PREFIX)) {
            return null;
        }
        // Bearer <token> - token starts at index 7
        return authHeader.substring(7);
    }
}
