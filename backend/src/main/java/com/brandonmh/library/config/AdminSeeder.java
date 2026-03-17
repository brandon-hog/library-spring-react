package com.brandonmh.library.config;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import com.brandonmh.library.model.User;
import com.brandonmh.library.repository.UserRepository;

@Component
public class AdminSeeder implements CommandLineRunner {
	private static final Logger log = LoggerFactory.getLogger(AdminSeeder.class);

	private final UserRepository userRepo;
	private final PasswordEncoder passwordEncoder;

	@Value("${app.admin.email:}")
	private String adminEmail;

	@Value("${app.admin.password:}")
	private String adminPassword;

	@Value("${app.admin.name:Admin}")
	private String adminName;

	public AdminSeeder(UserRepository userRepo, PasswordEncoder passwordEncoder) {
		this.userRepo = userRepo;
		this.passwordEncoder = passwordEncoder;
	}

	@Override
	public void run(String... args) {
		if (adminEmail == null || adminEmail.isBlank() || adminPassword == null || adminPassword.isBlank()) {
			log.info("AdminSeeder skipped (set app.admin.email and app.admin.password to enable).");
			return;
		}

		if (userRepo.findByEmail(adminEmail).isPresent()) {
			log.info("AdminSeeder skipped (admin user already exists).");
			return;
		}

		User admin = new User();
		admin.setName(adminName);
		admin.setEmail(adminEmail);
		admin.setPassword(passwordEncoder.encode(adminPassword));
		admin.setRole("ADMIN");

		userRepo.save(admin);
		log.info("Seeded admin user with email={}", adminEmail);
	}
}

