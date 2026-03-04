package com.brandonmh.library.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.brandonmh.library.model.User;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
}
