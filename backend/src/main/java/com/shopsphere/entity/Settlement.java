package com.shopsphere.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "settlements")
public class Settlement {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @JsonIgnore
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "seller_order_id", nullable = false, unique = true)
    private SellerOrder sellerOrder;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "seller_id", nullable = false)
    private Seller seller;

    @Column(name = "gross_amount", nullable = false, precision = 10, scale = 2)
    private BigDecimal grossAmount;

    @Column(name = "platform_commission", nullable = false, precision = 10, scale = 2)
    private BigDecimal platformCommission;

    @Column(name = "net_payable", nullable = false, precision = 10, scale = 2)
    private BigDecimal netPayable;

    @Enumerated(EnumType.STRING)
    @Column(length = 30)
    private SettlementStatus status = SettlementStatus.PENDING;

    @Column(name = "transaction_reference", length = 100)
    private String transactionReference;

    @Column(name = "released_at")
    private LocalDateTime releasedAt;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    public Settlement() {}

    public Settlement(SellerOrder sellerOrder, Seller seller, BigDecimal grossAmount, BigDecimal platformCommission, BigDecimal netPayable) {
        this.sellerOrder = sellerOrder;
        this.seller = seller;
        this.grossAmount = grossAmount;
        this.platformCommission = platformCommission;
        this.netPayable = netPayable;
        this.status = SettlementStatus.PENDING;
        this.createdAt = LocalDateTime.now();
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public SellerOrder getSellerOrder() { return sellerOrder; }
    public void setSellerOrder(SellerOrder sellerOrder) { this.sellerOrder = sellerOrder; }

    public Seller getSeller() { return seller; }
    public void setSeller(Seller seller) { this.seller = seller; }

    public BigDecimal getGrossAmount() { return grossAmount; }
    public void setGrossAmount(BigDecimal grossAmount) { this.grossAmount = grossAmount; }

    public BigDecimal getPlatformCommission() { return platformCommission; }
    public void setPlatformCommission(BigDecimal platformCommission) { this.platformCommission = platformCommission; }

    public BigDecimal getNetPayable() { return netPayable; }
    public void setNetPayable(BigDecimal netPayable) { this.netPayable = netPayable; }

    public SettlementStatus getStatus() { return status; }
    public void setStatus(SettlementStatus status) { this.status = status; }

    public String getTransactionReference() { return transactionReference; }
    public void setTransactionReference(String transactionReference) { this.transactionReference = transactionReference; }

    public LocalDateTime getReleasedAt() { return releasedAt; }
    public void setReleasedAt(LocalDateTime releasedAt) { this.releasedAt = releasedAt; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
