package com.shopsphere.dto;

import java.math.BigDecimal;

public class AiDemandPredictionDto {
    private Long productId;
    private String productName;
    private String categoryName;
    private Integer currentStock;
    private Integer historicalSales30Days;
    private Double dailyRunRate;
    private Integer projectedSalesNext30Days;
    private Integer estimatedDaysUntilStockout;
    private String demandTier; // HIGH_DEMAND, STABLE, LOW_DEMAND
    private String stockRecommendation;
    private BigDecimal predictedRevenue;

    public AiDemandPredictionDto() {}

    // Getters and Setters
    public Long getProductId() { return productId; }
    public void setProductId(Long productId) { this.productId = productId; }

    public String getProductName() { return productName; }
    public void setProductName(String productName) { this.productName = productName; }

    public String getCategoryName() { return categoryName; }
    public void setCategoryName(String categoryName) { this.categoryName = categoryName; }

    public Integer getCurrentStock() { return currentStock; }
    public void setCurrentStock(Integer currentStock) { this.currentStock = currentStock; }

    public Integer getHistoricalSales30Days() { return historicalSales30Days; }
    public void setHistoricalSales30Days(Integer historicalSales30Days) { this.historicalSales30Days = historicalSales30Days; }

    public Double getDailyRunRate() { return dailyRunRate; }
    public void setDailyRunRate(Double dailyRunRate) { this.dailyRunRate = dailyRunRate; }

    public Integer getProjectedSalesNext30Days() { return projectedSalesNext30Days; }
    public void setProjectedSalesNext30Days(Integer projectedSalesNext30Days) { this.projectedSalesNext30Days = projectedSalesNext30Days; }

    public Integer getEstimatedDaysUntilStockout() { return estimatedDaysUntilStockout; }
    public void setEstimatedDaysUntilStockout(Integer estimatedDaysUntilStockout) { this.estimatedDaysUntilStockout = estimatedDaysUntilStockout; }

    public String getDemandTier() { return demandTier; }
    public void setDemandTier(String demandTier) { this.demandTier = demandTier; }

    public String getStockRecommendation() { return stockRecommendation; }
    public void setStockRecommendation(String stockRecommendation) { this.stockRecommendation = stockRecommendation; }

    public BigDecimal getPredictedRevenue() { return predictedRevenue; }
    public void setPredictedRevenue(BigDecimal predictedRevenue) { this.predictedRevenue = predictedRevenue; }
}
