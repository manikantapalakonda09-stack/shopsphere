package com.shopsphere.dto;

import java.util.List;

public class AuthResponse {
    private String token;
    private String tokenType = "Bearer";
    private Long userId;
    private String email;
    private String fullName;
    private List<String> roles;
    private Long sellerId;
    private String storeName;
    private String sellerStatus;
    private Long customerId;

    public AuthResponse() {}

    public AuthResponse(String token, Long userId, String email, String fullName, List<String> roles) {
        this.token = token;
        this.userId = userId;
        this.email = email;
        this.fullName = fullName;
        this.roles = roles;
    }

    public String getToken() { return token; }
    public void setToken(String token) { this.token = token; }

    public String getTokenType() { return tokenType; }
    public void setTokenType(String tokenType) { this.tokenType = tokenType; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }

    public List<String> getRoles() { return roles; }
    public void setRoles(List<String> roles) { this.roles = roles; }

    public Long getSellerId() { return sellerId; }
    public void setSellerId(Long sellerId) { this.sellerId = sellerId; }

    public String getStoreName() { return storeName; }
    public void setStoreName(String storeName) { this.storeName = storeName; }

    public String getSellerStatus() { return sellerStatus; }
    public void setSellerStatus(String sellerStatus) { this.sellerStatus = sellerStatus; }

    public Long getCustomerId() { return customerId; }
    public void setCustomerId(Long customerId) { this.customerId = customerId; }
}
