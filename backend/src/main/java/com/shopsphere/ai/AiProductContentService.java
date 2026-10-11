package com.shopsphere.ai;

import com.shopsphere.dto.AiDescriptionRequest;
import com.shopsphere.dto.AiDescriptionResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

@Service
public class AiProductContentService {

    @Value("${shopsphere.ai.api-key:}")
    private String apiKey;

    public AiDescriptionResponse generateContent(AiDescriptionRequest request) {
        String baseTitle = request.getTitle() != null ? request.getTitle().trim() : "Premium Product";
        String category = request.getCategory() != null ? request.getCategory().trim() : "General";

        // Enhanced Title Suggestion
        String suggestedTitle = "ShopSphere Premium " + baseTitle + " - Edition 2026";
        if (baseTitle.toLowerCase().contains("laptop") || baseTitle.toLowerCase().contains("phone") || baseTitle.toLowerCase().contains("watch")) {
            suggestedTitle = "Next-Gen " + baseTitle + " with Ultra-Fast Performance & Premium Ergonomics";
        } else if (baseTitle.toLowerCase().contains("coffee") || baseTitle.toLowerCase().contains("tea")) {
            suggestedTitle = "Artisan Reserve " + baseTitle + " (Micro-Batch Fresh Roasted)";
        } else if (baseTitle.toLowerCase().contains("jacket") || baseTitle.toLowerCase().contains("shirt")) {
            suggestedTitle = "Signature Tailored " + baseTitle + " in Breathable Luxury Fabric";
        }

        // Engaging Description
        StringBuilder desc = new StringBuilder();
        desc.append("Elevate your everyday lifestyle with the ").append(suggestedTitle).append(". ");
        desc.append("Meticulously engineered to deliver uncompromised quality, exceptional durability, and refined aesthetics. ");
        if (request.getKeyFeatures() != null && !request.getKeyFeatures().isEmpty()) {
            desc.append("Key standout benefits include: ").append(String.join(", ", request.getKeyFeatures())).append(". ");
        }
        desc.append("Designed for discerning customers seeking performance, comfort, and unmatched value.");

        // Key Bullet Highlights
        List<String> highlights = new ArrayList<>();
        highlights.add("Crafted with industrial-grade premium materials for long-lasting performance.");
        highlights.add("Ergonomically engineered for optimal comfort and effortless daily utility.");
        highlights.add("Backed by ShopSphere verified multi-vendor marketplace authenticity guarantee.");
        highlights.add("Fast tracked dispatch with doorstep delivery and easy 7-day hassle-free returns.");
        if (request.getKeyFeatures() != null) {
            for (String f : request.getKeyFeatures()) {
                if (f != null && !f.isBlank()) highlights.add(f.trim());
            }
        }

        // Suitable SEO keywords
        List<String> keywords = new ArrayList<>(Arrays.asList(
                baseTitle.toLowerCase(),
                category.toLowerCase(),
                "premium " + category.toLowerCase(),
                "best " + baseTitle.toLowerCase() + " 2026",
                "authentic marketplace verified",
                "fast shipping"
        ));

        return new AiDescriptionResponse(suggestedTitle, desc.toString(), highlights, keywords, "Professional & Persuasive");
    }
}
