package com.shopsphere.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "seller_orders")
public class SellerOrder {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "master_order_id", nullable = false)
    private Order masterOrder;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "seller_id", nullable = false)
    private Seller seller;

    @Column(name = "seller_order_number", nullable = false, unique = true, length = 60)
    private String sellerOrderNumber;

    @Enumerated(EnumType.STRING)
    @Column(length = 30)
    private OrderStatus status = OrderStatus.PENDING;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal subtotal;

    @Column(name = "seller_discount", precision = 10, scale = 2)
    private BigDecimal sellerDiscount = BigDecimal.ZERO;

    @Column(name = "commission_rate", precision = 5, scale = 2)
    private BigDecimal commissionRate = new BigDecimal("10.00");

    @Column(name = "platform_commission", precision = 10, scale = 2)
    private BigDecimal platformCommission = BigDecimal.ZERO;

    @Column(name = "seller_payable_amount", nullable = false, precision = 10, scale = 2)
    private BigDecimal sellerPayableAmount;

    @OneToMany(mappedBy = "sellerOrder", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.EAGER)
    private List<OrderItem> items = new ArrayList<>();

    @OneToOne(mappedBy = "sellerOrder", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private Shipment shipment;

    @OneToOne(mappedBy = "sellerOrder", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private Settlement settlement;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "updated_at")
    private LocalDateTime updatedAt = LocalDateTime.now();

    public SellerOrder() {}

    @PreUpdate
    public void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Order getMasterOrder() { return masterOrder; }
    public void setMasterOrder(Order masterOrder) { this.masterOrder = masterOrder; }

    public Seller getSeller() { return seller; }
    public void setSeller(Seller seller) { this.seller = seller; }

    public String getSellerOrderNumber() { return sellerOrderNumber; }
    public void setSellerOrderNumber(String sellerOrderNumber) { this.sellerOrderNumber = sellerOrderNumber; }

    public OrderStatus getStatus() { return status; }
    public void setStatus(OrderStatus status) { this.status = status; }

    public BigDecimal getSubtotal() { return subtotal; }
    public void setSubtotal(BigDecimal subtotal) { this.subtotal = subtotal; }

    public BigDecimal getSellerDiscount() { return sellerDiscount; }
    public void setSellerDiscount(BigDecimal sellerDiscount) { this.sellerDiscount = sellerDiscount; }

    public BigDecimal getCommissionRate() { return commissionRate; }
    public void setCommissionRate(BigDecimal commissionRate) { this.commissionRate = commissionRate; }

    public BigDecimal getPlatformCommission() { return platformCommission; }
    public void setPlatformCommission(BigDecimal platformCommission) { this.platformCommission = platformCommission; }

    public BigDecimal getSellerPayableAmount() { return sellerPayableAmount; }
    public void setSellerPayableAmount(BigDecimal sellerPayableAmount) { this.sellerPayableAmount = sellerPayableAmount; }

    public List<OrderItem> getItems() { return items; }
    public void setItems(List<OrderItem> items) { this.items = items; }

    public Shipment getShipment() { return shipment; }
    public void setShipment(Shipment shipment) { this.shipment = shipment; }

    public Settlement getSettlement() { return settlement; }
    public void setSettlement(Settlement settlement) { this.settlement = settlement; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
