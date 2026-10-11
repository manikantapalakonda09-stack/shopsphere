package com.shopsphere.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "coupons")
public class Coupon {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 50)
    private String code;

    @Enumerated(EnumType.STRING)
    @Column(name = "discount_type", nullable = false, length = 20)
    private DiscountType discountType;

    @Column(name = "discount_value", nullable = false, precision = 10, scale = 2)
    private BigDecimal discountValue;

    @Column(name = "min_order_value", precision = 10, scale = 2)
    private BigDecimal minOrderValue = BigDecimal.ZERO;

    @Column(name = "max_discount", precision = 10, scale = 2)
    private BigDecimal maxDiscount;

    @Column(name = "start_date")
    private LocalDateTime startDate;

    @Column(name = "expiry_date")
    private LocalDateTime expiryDate;

    @Column(name = "usage_limit")
    private Integer usageLimit = 1000;

    @Column(name = "times_used")
    private Integer timesUsed = 0;

    private Boolean active = true;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    public Coupon() {}

    public boolean isValid(BigDecimal orderAmount) {
        if (Boolean.FALSE.equals(active)) return false;
        if (usageLimit != null && timesUsed >= usageLimit) return false;
        LocalDateTime now = LocalDateTime.now();
        if (startDate != null && now.isBefore(startDate)) return false;
        if (expiryDate != null && now.isAfter(expiryDate)) return false;
        if (minOrderValue != null && orderAmount.compareTo(minOrderValue) < 0) return false;
        return true;
    }

    public BigDecimal calculateDiscount(BigDecimal orderAmount) {
        if (!isValid(orderAmount)) return BigDecimal.ZERO;
        BigDecimal calculated;
        if (discountType == DiscountType.PERCENTAGE) {
            calculated = orderAmount.multiply(discountValue).divide(BigDecimal.valueOf(100));
            if (maxDiscount != null && calculated.compareTo(maxDiscount) > 0) {
                calculated = maxDiscount;
            }
        } else {
            calculated = discountValue;
            if (calculated.compareTo(orderAmount) > 0) {
                calculated = orderAmount;
            }
        }
        return calculated;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getCode() { return code; }
    public void setCode(String code) { this.code = code; }

    public DiscountType getDiscountType() { return discountType; }
    public void setDiscountType(DiscountType discountType) { this.discountType = discountType; }

    public BigDecimal getDiscountValue() { return discountValue; }
    public void setDiscountValue(BigDecimal discountValue) { this.discountValue = discountValue; }

    public BigDecimal getMinOrderValue() { return minOrderValue; }
    public void setMinOrderValue(BigDecimal minOrderValue) { this.minOrderValue = minOrderValue; }

    public BigDecimal getMaxDiscount() { return maxDiscount; }
    public void setMaxDiscount(BigDecimal maxDiscount) { this.maxDiscount = maxDiscount; }

    public LocalDateTime getStartDate() { return startDate; }
    public void setStartDate(LocalDateTime startDate) { this.startDate = startDate; }

    public LocalDateTime getExpiryDate() { return expiryDate; }
    public void setExpiryDate(LocalDateTime expiryDate) { this.expiryDate = expiryDate; }

    public Integer getUsageLimit() { return usageLimit; }
    public void setUsageLimit(Integer usageLimit) { this.usageLimit = usageLimit; }

    public Integer getTimesUsed() { return timesUsed; }
    public void setTimesUsed(Integer timesUsed) { this.timesUsed = timesUsed; }

    public Boolean getActive() { return active; }
    public void setActive(Boolean active) { this.active = active; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
