package com.shopsphere.dto;

import java.util.List;

public class AiFraudCheckResponse {
    private Long productId;
    private Boolean isSuspicious;
    private Integer riskScore; // 0 to 100
    private String riskLevel; // LOW, MEDIUM, HIGH, CRITICAL
    private List<String> flaggedReasons;
    private String recommendation;

    public AiFraudCheckResponse() {}

    public AiFraudCheckResponse(Long productId, Boolean isSuspicious, Integer riskScore, String riskLevel, List<String> flaggedReasons, String recommendation) {
        this.productId = productId;
        this.isSuspicious = isSuspicious;
        this.riskScore = riskScore;
        this.riskLevel = riskLevel;
        this.flaggedReasons = flaggedReasons;
        this.recommendation = recommendation;
    }

    public Long getProductId() { return productId; }
    public void setProductId(Long productId) { this.productId = productId; }

    public Boolean getIsSuspicious() { return isSuspicious; }
    public void setIsSuspicious(Boolean isSuspicious) { this.isSuspicious = isSuspicious; }

    public Integer getRiskScore() { return riskScore; }
    public void setRiskScore(Integer riskScore) { this.riskScore = riskScore; }

    public String getRiskLevel() { return riskLevel; }
    public void setRiskLevel(String riskLevel) { this.riskLevel = riskLevel; }

    public List<String> getFlaggedReasons() { return flaggedReasons; }
    public void setFlaggedReasons(List<String> flaggedReasons) { this.flaggedReasons = flaggedReasons; }

    public String getRecommendation() { return recommendation; }
    public void setRecommendation(String recommendation) { this.recommendation = recommendation; }
}
