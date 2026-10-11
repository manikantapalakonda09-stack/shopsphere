package com.shopsphere.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class CouponDto {
    private Long id;
    private String code;
    private String discountType;
    private BigDecimal discountValue;
    private BigDecimal minOrderValue;
    private BigDecimal maxDiscount;
    private LocalDateTime startDate;
    private LocalDateTime expiryDate;
    private Integer usageLimit;
    private Integer timesUsed;
    private Boolean active;
    private BigDecimal calculatedDiscount;

    public CouponDto() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getCode() { return code; }
    public void setCode(String code) { this.code = code; }

    public String getDiscountType() { return discountType; }
    public void setDiscountType(String discountType) { this.discountType = discountType; }

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

    public BigDecimal getCalculatedDiscount() { return calculatedDiscount; }
    public void setCalculatedDiscount(BigDecimal calculatedDiscount) { this.calculatedDiscount = calculatedDiscount; }
}
