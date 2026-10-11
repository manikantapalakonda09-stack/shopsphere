package com.shopsphere.ai;

import com.shopsphere.dto.AiFraudCheckRequest;
import com.shopsphere.dto.AiFraudCheckResponse;
import com.shopsphere.entity.Product;
import com.shopsphere.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;

@Service
public class AiFraudDetectionService {

    private static final Set<String> HIGH_RISK_KEYWORDS = Set.of(
            "wire transfer", "direct wire", "pay direct", "telegram", "whatsapp only",
            "replica", "counterfeit", "fake", "western union", "bypass", "free money"
    );

    @Autowired
    private ProductRepository productRepository;

    public AiFraudCheckResponse evaluateProduct(AiFraudCheckRequest request) {
        int riskScore = 0;
        List<String> reasons = new ArrayList<>();

        Product product = null;
        if (request.getProductId() != null) {
            product = productRepository.findById(request.getProductId()).orElse(null);
        }

        String title = (request.getTitle() != null ? request.getTitle() : (product != null ? product.getName() : "")).toLowerCase();
        String desc = (request.getDescription() != null ? request.getDescription() : (product != null ? product.getDescription() : "")).toLowerCase();
        BigDecimal price = request.getPrice() != null ? request.getPrice() : (product != null ? product.getPrice() : BigDecimal.ZERO);
        BigDecimal originalPrice = request.getOriginalPrice() != null ? request.getOriginalPrice() : (product != null ? product.getOriginalPrice() : price);

        // 1. Keyword Spam Analysis
        for (String kw : HIGH_RISK_KEYWORDS) {
            if (title.contains(kw) || desc.contains(kw)) {
                riskScore += 45;
                reasons.add("Listing contains suspicious offline transaction or replica keyword: '" + kw + "'");
                break;
            }
        }

        // 2. Unrealistic Discount Anomaly (> 85% discount)
        if (originalPrice != null && originalPrice.compareTo(BigDecimal.ZERO) > 0) {
            double discount = (originalPrice.subtract(price).doubleValue() / originalPrice.doubleValue()) * 100.0;
            if (discount > 85.0) {
                riskScore += 35;
                reasons.add("Abnormally high discount of " + Math.round(discount) + "% detected, typical of fraudulent flash scams.");
            }
        }

        // 3. Price Floor Check (< ₹10 for luxury keywords)
        if (price.compareTo(new BigDecimal("50.00")) < 0 && (title.contains("laptop") || title.contains("iphone") || title.contains("diamond"))) {
            riskScore += 40;
            reasons.add("Price is unrealistically low for high-value asset category (under ₹50 for electronics/luxury).");
        }

        // 4. Excessive Capitalization in Title
        long upperChars = (request.getTitle() != null ? request.getTitle() : (product != null ? product.getName() : ""))
                .chars().filter(Character::isUpperCase).count();
        int totalChars = title.length();
        if (totalChars > 15 && ((double) upperChars / totalChars) > 0.65) {
            riskScore += 15;
            reasons.add("Aggressive all-caps promotional title pattern detected.");
        }

        riskScore = Math.min(100, riskScore);
        boolean isSuspicious = riskScore >= 50;

        String riskLevel;
        String recommendation;
        if (riskScore >= 75) {
            riskLevel = "CRITICAL";
            recommendation = "Flag immediately for Admin moderation. Restrict storefront visibility until merchant credentials are re-verified.";
        } else if (riskScore >= 50) {
            riskLevel = "HIGH";
            recommendation = "Moderate listing. Request invoice or proof of authenticity from the seller.";
        } else if (riskScore >= 25) {
            riskLevel = "MEDIUM";
            recommendation = "Low anomaly risk. Automated periodic monitoring enabled.";
        } else {
            riskLevel = "LOW";
            recommendation = "Listing passes standard security screening checks.";
        }

        if (reasons.isEmpty()) {
            reasons.add("No anomalies detected in pricing, description text, or keywords.");
        }

        return new AiFraudCheckResponse(request.getProductId(), isSuspicious, riskScore, riskLevel, reasons, recommendation);
    }
}
