package com.shopsphere.service;

import com.shopsphere.ai.AiReviewAnalysisService;
import com.shopsphere.dto.AiSentimentResponse;
import com.shopsphere.dto.ReviewCreateRequest;
import com.shopsphere.dto.ReviewDto;
import com.shopsphere.entity.*;
import com.shopsphere.exception.BadRequestException;
import com.shopsphere.exception.ResourceNotFoundException;
import com.shopsphere.repository.CustomerRepository;
import com.shopsphere.repository.ProductRepository;
import com.shopsphere.repository.ReviewRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ReviewService {

    @Autowired
    private ReviewRepository reviewRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private CustomerRepository customerRepository;

    @Autowired
    private AiReviewAnalysisService aiReviewAnalysisService;

    @Transactional(readOnly = true)
    public List<ReviewDto> getProductReviews(Long productId) {
        return reviewRepository.findByProductIdOrderByCreatedAtDesc(productId).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public ReviewDto createReview(Long customerId, ReviewCreateRequest request) {
        Customer customer = customerRepository.findById(customerId)
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found"));

        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + request.getProductId()));

        Review review = new Review(
                product,
                customer,
                customer.getUser().getFullName(),
                request.getRating(),
                request.getTitle(),
                request.getComment()
        );

        // Perform AI sentiment analysis on the review comment
        SentimentAnalysisResult analysis = aiReviewAnalysisService.analyzeSingleComment(request.getComment(), request.getRating());
        review.setSentimentLabel(analysis.label);
        review.setSentimentScore(analysis.score);

        Review saved = reviewRepository.save(review);

        // Recompute product ratings
        Double avg = reviewRepository.calculateAverageRating(product.getId());
        Long count = reviewRepository.countReviewsByProductId(product.getId());
        product.setAverageRating(avg != null ? BigDecimal.valueOf(avg).setScale(2, BigDecimal.ROUND_HALF_UP) : BigDecimal.ZERO);
        product.setTotalReviews(count != null ? count.intValue() : 0);
        productRepository.save(product);

        return mapToDto(saved);
    }

    @Transactional
    public void reportReview(Long reviewId) {
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new ResourceNotFoundException("Review not found with id: " + reviewId));
        review.setIsReported(true);
        reviewRepository.save(review);
    }

    @Transactional(readOnly = true)
    public List<ReviewDto> getReportedReviews() {
        return reviewRepository.findByIsReportedTrue().stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public void moderateReview(Long reviewId, boolean remove) {
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new ResourceNotFoundException("Review not found with id: " + reviewId));
        if (remove) {
            Product product = review.getProduct();
            reviewRepository.delete(review);
            Double avg = reviewRepository.calculateAverageRating(product.getId());
            Long count = reviewRepository.countReviewsByProductId(product.getId());
            product.setAverageRating(avg != null ? BigDecimal.valueOf(avg).setScale(2, BigDecimal.ROUND_HALF_UP) : BigDecimal.ZERO);
            product.setTotalReviews(count != null ? count.intValue() : 0);
            productRepository.save(product);
        } else {
            review.setIsReported(false);
            review.setIsModerated(true);
            reviewRepository.save(review);
        }
    }

    public ReviewDto mapToDto(Review review) {
        ReviewDto dto = new ReviewDto();
        dto.setId(review.getId());
        dto.setProductId(review.getProduct().getId());
        dto.setProductName(review.getProduct().getName());
        dto.setCustomerId(review.getCustomer().getId());
        dto.setCustomerName(review.getCustomerName());
        dto.setRating(review.getRating());
        dto.setTitle(review.getTitle());
        dto.setComment(review.getComment());
        dto.setSentimentLabel(review.getSentimentLabel().name());
        dto.setSentimentScore(review.getSentimentScore());
        dto.setIsReported(review.getIsReported());
        dto.setIsModerated(review.getIsModerated());
        dto.setCreatedAt(review.getCreatedAt());
        return dto;
    }

    public static class SentimentAnalysisResult {
        public SentimentLabel label;
        public BigDecimal score;
        public SentimentAnalysisResult(SentimentLabel label, BigDecimal score) {
            this.label = label;
            this.score = score;
        }
    }
}
