package com.shopsphere.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class ReviewDto {
    private Long id;
    private Long productId;
    private String productName;
    private Long customerId;
    private String customerName;
    private Integer rating;
    private String title;
    private String comment;
    private String sentimentLabel;
    private BigDecimal sentimentScore;
    private Boolean isReported;
    private Boolean isModerated;
    private LocalDateTime createdAt;

    public ReviewDto() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getProductId() { return productId; }
    public void setProductId(Long productId) { this.productId = productId; }

    public String getProductName() { return productName; }
    public void setProductName(String productName) { this.productName = productName; }

    public Long getCustomerId() { return customerId; }
    public void setCustomerId(Long customerId) { this.customerId = customerId; }

    public String getCustomerName() { return customerName; }
    public void setCustomerName(String customerName) { this.customerName = customerName; }

    public Integer getRating() { return rating; }
    public void setRating(Integer rating) { this.rating = rating; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getComment() { return comment; }
    public void setComment(String comment) { this.comment = comment; }

    public String getSentimentLabel() { return sentimentLabel; }
    public void setSentimentLabel(String sentimentLabel) { this.sentimentLabel = sentimentLabel; }

    public BigDecimal getSentimentScore() { return sentimentScore; }
    public void setSentimentScore(BigDecimal sentimentScore) { this.sentimentScore = sentimentScore; }

    public Boolean getIsReported() { return isReported; }
    public void setIsReported(Boolean isReported) { this.isReported = isReported; }

    public Boolean getIsModerated() { return isModerated; }
    public void setIsModerated(Boolean isModerated) { this.isModerated = isModerated; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
