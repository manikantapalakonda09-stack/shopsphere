package com.shopsphere.ai;

import com.shopsphere.dto.AiSentimentResponse;
import com.shopsphere.entity.Product;
import com.shopsphere.entity.Review;
import com.shopsphere.entity.SentimentLabel;
import com.shopsphere.repository.ProductRepository;
import com.shopsphere.repository.ReviewRepository;
import com.shopsphere.service.ReviewService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;

@Service
public class AiReviewAnalysisService {

    private static final Set<String> POSITIVE_KEYWORDS = Set.of(
            "excellent", "amazing", "great", "love", "best", "perfect", "good", "fast",
            "durable", "comfortable", "quality", "recommended", "smooth", "high-end", "delighted"
    );

    private static final Set<String> NEGATIVE_KEYWORDS = Set.of(
            "bad", "terrible", "worst", "poor", "broken", "scam", "slow", "delay",
            "fake", "cheap", "damaged", "awful", "defect", "useless", "disappointed", "refund"
    );

    @Autowired
    private ReviewRepository reviewRepository;

    @Autowired
    private ProductRepository productRepository;

    public ReviewService.SentimentAnalysisResult analyzeSingleComment(String text, int rating) {
        if (text == null || text.isBlank()) {
            if (rating >= 4) return new ReviewService.SentimentAnalysisResult(SentimentLabel.POSITIVE, new BigDecimal("0.750"));
            if (rating <= 2) return new ReviewService.SentimentAnalysisResult(SentimentLabel.NEGATIVE, new BigDecimal("-0.750"));
            return new ReviewService.SentimentAnalysisResult(SentimentLabel.NEUTRAL, BigDecimal.ZERO);
        }

        String lower = text.toLowerCase();
        int posHits = 0;
        int negHits = 0;

        for (String word : POSITIVE_KEYWORDS) {
            if (lower.contains(word)) posHits++;
        }
        for (String word : NEGATIVE_KEYWORDS) {
            if (lower.contains(word)) negHits++;
        }

        // Incorporate star rating weighting
        double score = (rating - 3) * 0.35 + (posHits * 0.2) - (negHits * 0.25);
        score = Math.max(-1.0, Math.min(1.0, score));

        SentimentLabel label;
        if (score > 0.15) {
            label = SentimentLabel.POSITIVE;
        } else if (score < -0.15) {
            label = SentimentLabel.NEGATIVE;
        } else {
            label = SentimentLabel.NEUTRAL;
        }

        return new ReviewService.SentimentAnalysisResult(label, BigDecimal.valueOf(score).setScale(3, RoundingMode.HALF_UP));
    }

    public AiSentimentResponse generateProductConsensus(Long productId) {
        List<Review> reviews = reviewRepository.findByProductIdOrderByCreatedAtDesc(productId);
        Product product = productRepository.findById(productId).orElse(null);

        AiSentimentResponse response = new AiSentimentResponse();
        response.setProductId(productId);
        response.setTotalAnalyzed(reviews.size());

        if (reviews.isEmpty()) {
            response.setSentimentLabel("NEUTRAL");
            response.setSentimentScore(BigDecimal.ZERO);
            response.setConsensusSummary("No verified customer reviews yet. Be the first to share your experience with this product!");
            response.setPositiveHighlights(List.of("Brand new marketplace listing", "Quality assured by seller"));
            response.setNegativeHighlights(List.of("Awaiting customer feedback"));
            return response;
        }

        double totalScore = 0;
        int positiveCount = 0;
        int negativeCount = 0;
        List<String> posHighlights = new ArrayList<>();
        List<String> negHighlights = new ArrayList<>();

        for (Review r : reviews) {
            totalScore += r.getSentimentScore() != null ? r.getSentimentScore().doubleValue() : (r.getRating() >= 4 ? 0.8 : -0.8);
            if (r.getSentimentLabel() == SentimentLabel.POSITIVE || r.getRating() >= 4) {
                positiveCount++;
                if (posHighlights.size() < 3 && r.getTitle() != null && !r.getTitle().isBlank()) {
                    posHighlights.add(r.getTitle());
                }
            } else if (r.getSentimentLabel() == SentimentLabel.NEGATIVE || r.getRating() <= 2) {
                negativeCount++;
                if (negHighlights.size() < 3 && r.getTitle() != null && !r.getTitle().isBlank()) {
                    negHighlights.add(r.getTitle());
                }
            }
        }

        double avgScore = totalScore / reviews.size();
        response.setSentimentScore(BigDecimal.valueOf(avgScore).setScale(3, RoundingMode.HALF_UP));

        String label = (avgScore > 0.15) ? "POSITIVE" : (avgScore < -0.15) ? "NEGATIVE" : "NEUTRAL";
        response.setSentimentLabel(label);

        int posPercent = (int) Math.round(((double) positiveCount / reviews.size()) * 100);

        String summary;
        if (posPercent >= 80) {
            summary = posPercent + "% of customers reported high satisfaction with exceptional build quality and functionality. Minor notes regarding packaging.";
        } else if (posPercent >= 50) {
            summary = "Generally favorable reception (" + posPercent + "% positive sentiment). Customers praised performance while suggesting minor delivery and documentation improvements.";
        } else {
            summary = "Mixed customer sentiment detected. Several reviews reported concerns with packaging, delays, or specifications mismatch.";
        }
        response.setConsensusSummary(summary);

        if (posHighlights.isEmpty()) posHighlights.add("Satisfied with overall design and features.");
        if (negHighlights.isEmpty()) negHighlights.add("Occasional remarks on transit handling.");

        response.setPositiveHighlights(posHighlights);
        response.setNegativeHighlights(negHighlights);

        return response;
    }
}
