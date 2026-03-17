package com.brandonmh.library.repository;

import com.brandonmh.library.model.Checkout;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface CheckoutRepository extends JpaRepository<Checkout, Long> {
    public List<Checkout> findByBookIdAndUserIdAndReturnDateIsNull(Long bookId, Long userId);
    public boolean existsByBookIdAndReturnDateIsNull(Long bookId);
    public boolean existsByUserIdAndBookIdAndReturnDateIsNull(Long userId, Long bookId);
    public List<Checkout> findByUserIdAndReturnDateIsNull(Long userId);
}

