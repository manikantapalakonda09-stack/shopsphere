package com.shopsphere.controller;

import com.shopsphere.ai.*;
import com.shopsphere.dto.*;
import com.shopsphere.entity.Customer;
import com.shopsphere.repository.CustomerRepository;
import com.shopsphere.security.UserPrincipal;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/ai")
public class AiController {

    @Autowired
    private AiRecommendationService aiRecommendationService;

    @Autowired
    private AiProductContentService aiProductContentService;

    @Autowired
    private AiReviewAnalysisService aiReviewAnalysisService;

    @Autowired
    private AiFraudDetectionService aiFraudDetectionService;

    @Autowired
    private AiDemandPredictionService aiDemandPredictionService;

    @Autowired
    private CustomerRepository customerRepository;

    @GetMapping("/recommendations")
    public ResponseEntity<List<ProductDto>> getRecommendations(
            @AuthenticationPrincipal UserPrincipal currentUser,
            @RequestParam(defaultValue = "8") int limit) {
        Long customerId = null;
        if (currentUser != null) {
            customerId = customerRepository.findByUserId(currentUser.getId())
                    .map(Customer::getId).orElse(null);
        }
        return ResponseEntity.ok(aiRecommendationService.getPersonalizedRecommendations(customerId, limit));
    }

    @GetMapping("/related/{productId}")
    public ResponseEntity<List<ProductDto>> getRelatedProducts(
            @PathVariable Long productId,
            @RequestParam(defaultValue = "4") int limit) {
        return ResponseEntity.ok(aiRecommendationService.getRelatedProducts(productId, limit));
    }

    @PostMapping("/view-product/{productId}")
    public ResponseEntity<Void> recordProductView(
            @AuthenticationPrincipal UserPrincipal currentUser,
            @PathVariable Long productId) {
        if (currentUser != null) {
            customerRepository.findByUserId(currentUser.getId()).ifPresent(c -> {
                aiRecommendationService.recordProductView(c.getId(), productId);
            });
        }
        return ResponseEntity.ok().build();
    }

    @PostMapping("/generate-description")
    public ResponseEntity<AiDescriptionResponse> generateDescription(@Valid @RequestBody AiDescriptionRequest request) {
        return ResponseEntity.ok(aiProductContentService.generateContent(request));
    }

    @GetMapping("/sentiment-analysis/{productId}")
    public ResponseEntity<AiSentimentResponse> analyzeReviews(@PathVariable Long productId) {
        return ResponseEntity.ok(aiReviewAnalysisService.generateProductConsensus(productId));
    }

    @PostMapping("/fraud-check")
    public ResponseEntity<AiFraudCheckResponse> checkListingFraud(@Valid @RequestBody AiFraudCheckRequest request) {
        return ResponseEntity.ok(aiFraudDetectionService.evaluateProduct(request));
    }

    @GetMapping("/demand-prediction/{sellerId}")
    public ResponseEntity<List<AiDemandPredictionDto>> predictDemand(@PathVariable Long sellerId) {
        return ResponseEntity.ok(aiDemandPredictionService.predictDemandForSeller(sellerId));
    }
}
