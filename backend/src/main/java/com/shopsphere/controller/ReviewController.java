package com.shopsphere.controller;

import com.shopsphere.dto.ReviewCreateRequest;
import com.shopsphere.dto.ReviewDto;
import com.shopsphere.entity.Customer;
import com.shopsphere.exception.ResourceNotFoundException;
import com.shopsphere.repository.CustomerRepository;
import com.shopsphere.security.UserPrincipal;
import com.shopsphere.service.ReviewService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reviews")
public class ReviewController {

    @Autowired
    private ReviewService reviewService;

    @Autowired
    private CustomerRepository customerRepository;

    private Long getCustomerId(UserPrincipal user) {
        Customer customer = customerRepository.findByUserId(user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Customer profile not found"));
        return customer.getId();
    }

    @GetMapping("/product/{productId}")
    public ResponseEntity<List<ReviewDto>> getProductReviews(@PathVariable Long productId) {
        return ResponseEntity.ok(reviewService.getProductReviews(productId));
    }

    @PostMapping
    public ResponseEntity<ReviewDto> createReview(
            @AuthenticationPrincipal UserPrincipal currentUser,
            @Valid @RequestBody ReviewCreateRequest request) {
        return ResponseEntity.ok(reviewService.createReview(getCustomerId(currentUser), request));
    }

    @PostMapping("/{id}/report")
    public ResponseEntity<Void> reportReview(@PathVariable Long id) {
        reviewService.reportReview(id);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/reported")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<ReviewDto>> getReportedReviews() {
        return ResponseEntity.ok(reviewService.getReportedReviews());
    }

    @PutMapping("/{id}/moderate")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> moderateReview(
            @PathVariable Long id,
            @RequestParam boolean remove) {
        reviewService.moderateReview(id, remove);
        return ResponseEntity.ok().build();
    }
}
