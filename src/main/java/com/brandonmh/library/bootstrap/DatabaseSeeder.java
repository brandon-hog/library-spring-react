package com.brandonmh.library.bootstrap;

import com.brandonmh.library.model.Book;
import com.brandonmh.library.model.User;
import com.brandonmh.library.repository.BookRepository;
import com.brandonmh.library.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;
import java.util.Random;

// @Component ensures Spring Boot automatically detects and runs this class on startup.
@Component
public class DatabaseSeeder implements CommandLineRunner {

    private final BookRepository bookRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder pwEncoder;

    public DatabaseSeeder(BookRepository bookRepository, UserRepository userRepository, PasswordEncoder pwEncoder) {
        this.bookRepository = bookRepository;
        this.userRepository = userRepository;
        this.pwEncoder = pwEncoder;
    }

    @Override
    public void run(String... args) {
        if (userRepository.count() == 0) {
            // Save a default user to I don't need to create one
            User defaultUser = new User();
            defaultUser.setName("Brandon");
            defaultUser.setEmail("brandon.m.hoggatt@gmail.com");
            defaultUser.setPassword(pwEncoder.encode("password123"));
            defaultUser.setRole("USER");

            userRepository.save(defaultUser);

            System.out.println("Default user successfully created.");
        }

        // Prevent duplicating your dataset every time the application restarts.
        if (bookRepository.count() == 0) {
            List<Book> booksToSeed = generateRandomBooks(50); // Generate 50 books
            
            // saveAll() is significantly more efficient than looping and calling save() individually.
            bookRepository.saveAll(booksToSeed);
            
            System.out.println("Database successfully seeded with " + booksToSeed.size() + " books.");
        }
    }

    private List<Book> generateRandomBooks(int count) {
        List<Book> books = new ArrayList<>();
        Random random = new Random();

        String[] adjectives = {"The Quantum", "Effective", "Clean", "Advanced", "The Silent", "Dark", "Hidden", "Practical", "Modern", "Essential"};
        String[] nouns = {"Network", "Code", "Architecture", "Algorithms", "Shadow", "Systems", "Security", "Patterns", "Protocol", "Framework"};
        String[] authors = {"Alan Turing", "Grace Hopper", "Ada Lovelace", "Linus Torvalds", "Margaret Hamilton", "Ken Thompson", "Dennis Ritchie", "Tim Berners-Lee"};

        for (int i = 0; i < count; i++) {
            String randomTitle = adjectives[random.nextInt(adjectives.length)] + " " + nouns[random.nextInt(nouns.length)];
            String randomAuthor = authors[random.nextInt(authors.length)];
            
            // 80% chance the book is available, 20% chance it is already checked out
            boolean isAvailable = random.nextInt(100) < 80;

            // ID is passed as null because the @GeneratedValue strategy in the entity handles it
            books.add(new Book(null, randomTitle, randomAuthor, isAvailable));
        }

        return books;
    }
}