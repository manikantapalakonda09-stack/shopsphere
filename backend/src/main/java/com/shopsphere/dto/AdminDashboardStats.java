package com.shopsphere.dto;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

public class AdminDashboardStats {
    private Long totalUsers;
    private Long totalSellers;
    private Long pendingSellerApprovals;
    private Long totalProducts;
    private Long totalOrders;
    private BigDecimal totalRevenue;
    private BigDecimal totalCommissionEarned;
    private Long pendingDisputes;
    private Long suspiciousListingsCount;
    private Long openSupportTickets;
    private List<Map<String, Object>> recentSalesTrend;
    private List<Map<String, Object>> topSellers;

    public AdminDashboardStats() {}

    // Getters and Setters
    public Long getTotalUsers() { return totalUsers; }
    public void setTotalUsers(Long totalUsers) { this.totalUsers = totalUsers; }

    public Long getTotalSellers() { return totalSellers; }
    public void setTotalSellers(Long totalSellers) { this.totalSellers = totalSellers; }

    public Long getPendingSellerApprovals() { return pendingSellerApprovals; }
    public void setPendingSellerApprovals(Long pendingSellerApprovals) { this.pendingSellerApprovals = pendingSellerApprovals; }

    public Long getTotalProducts() { return totalProducts; }
    public void setTotalProducts(Long totalProducts) { this.totalProducts = totalProducts; }

    public Long getTotalOrders() { return totalOrders; }
    public void setTotalOrders(Long totalOrders) { this.totalOrders = totalOrders; }

    public BigDecimal getTotalRevenue() { return totalRevenue; }
    public void setTotalRevenue(BigDecimal totalRevenue) { this.totalRevenue = totalRevenue; }

    public BigDecimal getTotalCommissionEarned() { return totalCommissionEarned; }
    public void setTotalCommissionEarned(BigDecimal totalCommissionEarned) { this.totalCommissionEarned = totalCommissionEarned; }

    public Long getPendingDisputes() { return pendingDisputes; }
    public void setPendingDisputes(Long pendingDisputes) { this.pendingDisputes = pendingDisputes; }

    public Long getSuspiciousListingsCount() { return suspiciousListingsCount; }
    public void setSuspiciousListingsCount(Long suspiciousListingsCount) { this.suspiciousListingsCount = suspiciousListingsCount; }

    public Long getOpenSupportTickets() { return openSupportTickets; }
    public void setOpenSupportTickets(Long openSupportTickets) { this.openSupportTickets = openSupportTickets; }

    public List<Map<String, Object>> getRecentSalesTrend() { return recentSalesTrend; }
    public void setRecentSalesTrend(List<Map<String, Object>> recentSalesTrend) { this.recentSalesTrend = recentSalesTrend; }

    public List<Map<String, Object>> getTopSellers() { return topSellers; }
    public void setTopSellers(List<Map<String, Object>> topSellers) { this.topSellers = topSellers; }
}
