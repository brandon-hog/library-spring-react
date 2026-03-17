package com.brandonmh.library.repository;

import com.brandonmh.library.model.Checkout;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface CheckoutRepository extends JpaRepository<Checkout, Long> {
    public List<Checkout> findByBookIdAndUserIdAndReturnDateIsNull(Long bookId, Long userId);
    public boolean existsByBookIdAndReturnDateIsNull(Long bookId);
    public boolean existsByUserIdAndBookIdAndReturnDateIsNull(Long userId, Long bookId);
    public List<Checkout> findByUserIdAndReturnDateIsNull(Long userId);

    Page<Checkout> findByReturnDateIsNull(Pageable pageable);
    Page<Checkout> findByUserId(Long userId, Pageable pageable);
    Page<Checkout> findByBookId(Long bookId, Pageable pageable);
    Page<Checkout> findByUserIdAndBookId(Long userId, Long bookId, Pageable pageable);
    Page<Checkout> findByUserIdAndReturnDateIsNull(Long userId, Pageable pageable);
    Page<Checkout> findByBookIdAndReturnDateIsNull(Long bookId, Pageable pageable);
    Page<Checkout> findByUserIdAndBookIdAndReturnDateIsNull(Long userId, Long bookId, Pageable pageable);
}

