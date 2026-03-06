package com.brandonmh.library.service;

import org.springframework.beans.factory.annotation.Value;

public class JwtService {
	@Value("${app.jwt.secret}")
	private long jwtSecret;

	@Value("${app.jwt.expiration}")
	private long jwtExpiration;

	@Value("${app.jwt.refresh-expiration}")
	private long refreshExpirationMs;

	private static final String TOKEN_PREFIX = "Bearer ";

	// TODO generate access token
	// TODO generate refresh token
	// TODO validate token
	// TODO validate refresh token
}
