package com.brandonmh.library.controller;

import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.brandonmh.library.dto.AdminCheckoutLogItem;
import com.brandonmh.library.model.Checkout;
import com.brandonmh.library.repository.CheckoutRepository;

@RestController
@RequestMapping("/api/admin/checkouts")
public class AdminCheckoutController {
	private final CheckoutRepository checkoutRepo;

	public AdminCheckoutController(CheckoutRepository checkoutRepo) {
		this.checkoutRepo = checkoutRepo;
	}

	@GetMapping
	public Page<AdminCheckoutLogItem> getCheckoutLog(
		@RequestParam(required = false) Long userId,
		@RequestParam(required = false) Long bookId,
		@RequestParam(required = false) Boolean active,
		@PageableDefault(size = 20, sort = "checkoutDate", direction = Sort.Direction.DESC) Pageable pageable
	) {
		Page<Checkout> page = findCheckouts(userId, bookId, active, pageable);
		return page.map(this::toDto);
	}

	private Page<Checkout> findCheckouts(Long userId, Long bookId, Boolean active, Pageable pageable) {
		Optional<Boolean> activeOpt = Optional.ofNullable(active);

		if (userId != null && bookId != null) {
			if (activeOpt.orElse(false)) {
				return checkoutRepo.findByUserIdAndBookIdAndReturnDateIsNull(userId, bookId, pageable);
			}
			return checkoutRepo.findByUserIdAndBookId(userId, bookId, pageable);
		}

		if (userId != null) {
			if (activeOpt.orElse(false)) {
				return checkoutRepo.findByUserIdAndReturnDateIsNull(userId, pageable);
			}
			return checkoutRepo.findByUserId(userId, pageable);
		}

		if (bookId != null) {
			if (activeOpt.orElse(false)) {
				return checkoutRepo.findByBookIdAndReturnDateIsNull(bookId, pageable);
			}
			return checkoutRepo.findByBookId(bookId, pageable);
		}

		if (activeOpt.orElse(false)) {
			return checkoutRepo.findByReturnDateIsNull(pageable);
		}

		return checkoutRepo.findAll(pageable);
	}

	private AdminCheckoutLogItem toDto(Checkout checkout) {
		AdminCheckoutLogItem item = new AdminCheckoutLogItem();
		item.checkoutId = checkout.getId();
		item.checkoutDate = checkout.getCheckoutDate();
		item.returnDate = checkout.getReturnDate();

		if (checkout.getBook() != null) {
			item.bookId = checkout.getBook().getId();
			item.bookTitle = checkout.getBook().getTitle();
		}

		if (checkout.getUser() != null) {
			item.userId = checkout.getUser().getId();
			item.userName = checkout.getUser().getName();
		}

		return item;
	}
}

