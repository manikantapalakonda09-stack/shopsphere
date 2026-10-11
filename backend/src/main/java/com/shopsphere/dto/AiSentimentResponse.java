package com.shopsphere.dto;

import java.math.BigDecimal;
import java.util.List;

public class AiSentimentResponse {
    private Long productId;
    private String sentimentLabel; // POSITIVE, NEUTRAL, NEGATIVE
    private BigDecimal sentimentScore; // -1.0 to 1.0
    private String consensusSummary;
    private List<String> positiveHighlights;
    private List<String> negativeHighlights;
    private Integer totalAnalyzed;

    public AiSentimentResponse() {}

    public Long getProductId() { return productId; }
    public void setProductId(Long productId) { this.productId = productId; }

    public String getSentimentLabel() { return sentimentLabel; }
    public void setSentimentLabel(String sentimentLabel) { this.sentimentLabel = sentimentLabel; }

    public BigDecimal getSentimentScore() { return sentimentScore; }
    public void setSentimentScore(BigDecimal sentimentScore) { this.sentimentScore = sentimentScore; }

    public String getConsensusSummary() { return consensusSummary; }
    public void setConsensusSummary(String consensusSummary) { this.consensusSummary = consensusSummary; }

    public List<String> getPositiveHighlights() { return positiveHighlights; }
    public void setPositiveHighlights(List<String> positiveHighlights) { this.positiveHighlights = positiveHighlights; }

    public List<String> getNegativeHighlights() { return negativeHighlights; }
    public void setNegativeHighlights(List<String> negativeHighlights) { this.negativeHighlights = negativeHighlights; }

    public Integer getTotalAnalyzed() { return totalAnalyzed; }
    public void setTotalAnalyzed(Integer totalAnalyzed) { this.totalAnalyzed = totalAnalyzed; }
}
