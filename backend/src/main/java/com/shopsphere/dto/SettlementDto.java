package com.shopsphere.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class SettlementDto {
    private Long id;
    private Long sellerOrderId;
    private String sellerOrderNumber;
    private Long sellerId;
    private String storeName;
    private BigDecimal grossAmount;
    private BigDecimal platformCommission;
    private BigDecimal netPayable;
    private String status;
    private String transactionReference;
    private LocalDateTime releasedAt;
    private LocalDateTime createdAt;

    public SettlementDto() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getSellerOrderId() { return sellerOrderId; }
    public void setSellerOrderId(Long sellerOrderId) { this.sellerOrderId = sellerOrderId; }

    public String getSellerOrderNumber() { return sellerOrderNumber; }
    public void setSellerOrderNumber(String sellerOrderNumber) { this.sellerOrderNumber = sellerOrderNumber; }

    public Long getSellerId() { return sellerId; }
    public void setSellerId(Long sellerId) { this.sellerId = sellerId; }

    public String getStoreName() { return storeName; }
    public void setStoreName(String storeName) { this.storeName = storeName; }

    public BigDecimal getGrossAmount() { return grossAmount; }
    public void setGrossAmount(BigDecimal grossAmount) { this.grossAmount = grossAmount; }

    public BigDecimal getPlatformCommission() { return platformCommission; }
    public void setPlatformCommission(BigDecimal platformCommission) { this.platformCommission = platformCommission; }

    public BigDecimal getNetPayable() { return netPayable; }
    public void setNetPayable(BigDecimal netPayable) { this.netPayable = netPayable; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getTransactionReference() { return transactionReference; }
    public void setTransactionReference(String transactionReference) { this.transactionReference = transactionReference; }

    public LocalDateTime getReleasedAt() { return releasedAt; }
    public void setReleasedAt(LocalDateTime releasedAt) { this.releasedAt = releasedAt; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
