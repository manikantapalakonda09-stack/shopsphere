package com.shopsphere.dto;

import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;

public class AiFraudCheckRequest {

    @NotNull(message = "Product ID is required")
    private Long productId;

    private BigDecimal price;
    private BigDecimal originalPrice;
    private String title;
    private String description;

    public AiFraudCheckRequest() {}

    public Long getProductId() { return productId; }
    public void setProductId(Long productId) { this.productId = productId; }

    public BigDecimal getPrice() { return price; }
    public void setPrice(BigDecimal price) { this.price = price; }

    public BigDecimal getOriginalPrice() { return originalPrice; }
    public void setOriginalPrice(BigDecimal originalPrice) { this.originalPrice = originalPrice; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
}
