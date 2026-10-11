package com.shopsphere.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class DisputeCreateRequest {

    @NotNull(message = "Order ID is required")
    private Long orderId;

    @NotNull(message = "Seller ID is required")
    private Long sellerId;

    @NotBlank(message = "Issue type is required")
    private String issueType;

    @NotBlank(message = "Details are required")
    private String details;

    public DisputeCreateRequest() {}

    public Long getOrderId() { return orderId; }
    public void setOrderId(Long orderId) { this.orderId = orderId; }

    public Long getSellerId() { return sellerId; }
    public void setSellerId(Long sellerId) { this.sellerId = sellerId; }

    public String getIssueType() { return issueType; }
    public void setIssueType(String issueType) { this.issueType = issueType; }

    public String getDetails() { return details; }
    public void setDetails(String details) { this.details = details; }
}
