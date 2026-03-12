package com.brandonmh.library.service;

import java.util.Date;
import java.util.HashMap;
import java.util.Map;

import javax.crypto.SecretKey;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import com.brandonmh.library.dto.Token;

import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.MalformedJwtException;
import io.jsonwebtoken.UnsupportedJwtException;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class JwtService {
	@Value("${app.jwt.secret}")
	private String jwtSecret;

	@Value("${app.jwt.expiration}")
	private long jwtExpiration;

	@Value("${app.jwt.refresh-expiration}")
	private long refreshExpirationMs;

	public static final String TOKEN_PREFIX = "Bearer ";

	public String generateAccessToken(Authentication auth) {
		return generateToken(auth, jwtExpiration, null);
	}

	public String generateRefreshToken(Authentication auth) {
		Map<String, String> claims = new HashMap<>();
		claims.put("tokenType", "refresh");

		return generateToken(auth, refreshExpirationMs, claims);
	}

	public boolean isValidToken(String token, UserDetails userDetails) {
		final String username = extractUsernameFromToken(token);

		if (!username.equals(userDetails.getUsername())) {
			return false;
		}

		try {
			Jwts.parser()
				.verifyWith(getSignInKey())
				.build()
				.parseSignedClaims(token);
			return true;
		} catch (MalformedJwtException e) {
			log.error("Invalid JWT token: {}", e.getMessage());
		} catch (ExpiredJwtException e) {
			log.error("JWT token is expired: {}", e.getMessage());
		} catch (UnsupportedJwtException e) {
			log.error("JWT token is unsupported: {}", e.getMessage());
		} catch (IllegalArgumentException e) {
			log.error("JWT claims string is empty: {}", e.getMessage());
		} catch (Exception e) {
			log.error("Something went wrong: {}", e.getMessage());
		}

		return false;
	}

	public String generateToken(Authentication auth, long expirationMs, Map<String, String> claims) {
		UserDetails userPrincipal = (UserDetails) auth.getPrincipal();

		Date now = new Date(); // Time of token creation
		Date expiryDate = new Date(now.getTime() + expirationMs);

		return Jwts.builder()
				.header()
				.add("typ", "JWT")
				.and()
				.subject(userPrincipal.getUsername())
				.claims(claims)
				.issuedAt(now)
				.expiration(expiryDate)
				.signWith(getSignInKey())
				.compact();
	}

	public String extractUsernameFromToken(String token) {
		return Jwts.parser()
				.verifyWith(getSignInKey())
				.build()
				.parseSignedClaims(token)
				.getPayload()
				.getSubject();
	}

	private SecretKey getSignInKey() {
		byte[] keyBytes = Decoders.BASE64.decode(jwtSecret);
		return Keys.hmacShaKeyFor(keyBytes);
	}

    public Token generateToken(Authentication auth) {
        String accessToken = generateAccessToken(auth);
		return new Token(accessToken);
    }

    public long getJwtExpirationMs() {
        return jwtExpiration;
    }
}
