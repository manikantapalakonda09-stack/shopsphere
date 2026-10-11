package com.shopsphere.dto;

import jakarta.validation.constraints.NotBlank;
import java.util.List;

public class AiDescriptionRequest {

    @NotBlank(message = "Product title or keywords are required")
    private String title;

    private String category;
    private String targetAudience;
    private List<String> keyFeatures;

    public AiDescriptionRequest() {}

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public String getTargetAudience() { return targetAudience; }
    public void setTargetAudience(String targetAudience) { this.targetAudience = targetAudience; }

    public List<String> getKeyFeatures() { return keyFeatures; }
    public void setKeyFeatures(List<String> keyFeatures) { this.keyFeatures = keyFeatures; }
}
