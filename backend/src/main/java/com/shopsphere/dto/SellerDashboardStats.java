package com.shopsphere.dto;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

public class SellerDashboardStats {
    private Long sellerId;
    private String storeName;
    private Long totalProducts;
    private Long totalOrders;
    private BigDecimal totalSales;
    private Long pendingOrders;
    private Long deliveredOrders;
    private Long returnRequests;
    private Long lowStockProductsCount;
    private BigDecimal pendingSettlementAmount;
    private BigDecimal releasedSettlementAmount;
    private BigDecimal averageRating;
    private List<Map<String, Object>> salesTrend;
    private List<ProductDto> lowStockAlerts;

    public SellerDashboardStats() {}

    // Getters and Setters
    public Long getSellerId() { return sellerId; }
    public void setSellerId(Long sellerId) { this.sellerId = sellerId; }

    public String getStoreName() { return storeName; }
    public void setStoreName(String storeName) { this.storeName = storeName; }

    public Long getTotalProducts() { return totalProducts; }
    public void setTotalProducts(Long totalProducts) { this.totalProducts = totalProducts; }

    public Long getTotalOrders() { return totalOrders; }
    public void setTotalOrders(Long totalOrders) { this.totalOrders = totalOrders; }

    public BigDecimal getTotalSales() { return totalSales; }
    public void setTotalSales(BigDecimal totalSales) { this.totalSales = totalSales; }

    public Long getPendingOrders() { return pendingOrders; }
    public void setPendingOrders(Long pendingOrders) { this.pendingOrders = pendingOrders; }

    public Long getDeliveredOrders() { return deliveredOrders; }
    public void setDeliveredOrders(Long deliveredOrders) { this.deliveredOrders = deliveredOrders; }

    public Long getReturnRequests() { return returnRequests; }
    public void setReturnRequests(Long returnRequests) { this.returnRequests = returnRequests; }

    public Long getLowStockProductsCount() { return lowStockProductsCount; }
    public void setLowStockProductsCount(Long lowStockProductsCount) { this.lowStockProductsCount = lowStockProductsCount; }

    public BigDecimal getPendingSettlementAmount() { return pendingSettlementAmount; }
    public void setPendingSettlementAmount(BigDecimal pendingSettlementAmount) { this.pendingSettlementAmount = pendingSettlementAmount; }

    public BigDecimal getReleasedSettlementAmount() { return releasedSettlementAmount; }
    public void setReleasedSettlementAmount(BigDecimal releasedSettlementAmount) { this.releasedSettlementAmount = releasedSettlementAmount; }

    public BigDecimal getAverageRating() { return averageRating; }
    public void setAverageRating(BigDecimal averageRating) { this.averageRating = averageRating; }

    public List<Map<String, Object>> getSalesTrend() { return salesTrend; }
    public void setSalesTrend(List<Map<String, Object>> salesTrend) { this.salesTrend = salesTrend; }

    public List<ProductDto> getLowStockAlerts() { return lowStockAlerts; }
    public void setLowStockAlerts(List<ProductDto> lowStockAlerts) { this.lowStockAlerts = lowStockAlerts; }
}
