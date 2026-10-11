package com.shopsphere.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "sellers")
public class Seller {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    @Column(name = "store_name", nullable = false, length = 150)
    private String storeName;

    @Column(name = "business_email", length = 120)
    private String businessEmail;

    @Column(length = 30)
    private String phone;

    @Column(name = "store_description", columnDefinition = "TEXT")
    private String storeDescription;

    @Column(name = "business_address", length = 255)
    private String businessAddress;

    @Column(name = "tax_id", length = 50)
    private String taxId;

    @Enumerated(EnumType.STRING)
    @Column(length = 30)
    private SellerStatus status = SellerStatus.PENDING;

    @Column(name = "commission_rate", precision = 5, scale = 2)
    private BigDecimal commissionRate = new BigDecimal("10.00");

    @Column(precision = 3, scale = 2)
    private BigDecimal rating = new BigDecimal("5.00");

    @Column(name = "total_ratings")
    private Integer totalRatings = 0;

    @OneToOne(mappedBy = "seller", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private SellerProfile profile;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "updated_at")
    private LocalDateTime updatedAt = LocalDateTime.now();

    public Seller() {}

    @PreUpdate
    public void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public String getStoreName() { return storeName; }
    public void setStoreName(String storeName) { this.storeName = storeName; }

    public String getBusinessEmail() { return businessEmail; }
    public void setBusinessEmail(String businessEmail) { this.businessEmail = businessEmail; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public String getStoreDescription() { return storeDescription; }
    public void setStoreDescription(String storeDescription) { this.storeDescription = storeDescription; }

    public String getBusinessAddress() { return businessAddress; }
    public void setBusinessAddress(String businessAddress) { this.businessAddress = businessAddress; }

    public String getTaxId() { return taxId; }
    public void setTaxId(String taxId) { this.taxId = taxId; }

    public SellerStatus getStatus() { return status; }
    public void setStatus(SellerStatus status) { this.status = status; }

    public BigDecimal getCommissionRate() { return commissionRate; }
    public void setCommissionRate(BigDecimal commissionRate) { this.commissionRate = commissionRate; }

    public BigDecimal getRating() { return rating; }
    public void setRating(BigDecimal rating) { this.rating = rating; }

    public Integer getTotalRatings() { return totalRatings; }
    public void setTotalRatings(Integer totalRatings) { this.totalRatings = totalRatings; }

    public SellerProfile getProfile() { return profile; }
    public void setProfile(SellerProfile profile) { this.profile = profile; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
