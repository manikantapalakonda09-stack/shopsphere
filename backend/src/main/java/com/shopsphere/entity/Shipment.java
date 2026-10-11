package com.shopsphere.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "shipments")
public class Shipment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @JsonIgnore
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "seller_order_id", nullable = false, unique = true)
    private SellerOrder sellerOrder;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "delivery_partner_id")
    private DeliveryPartner deliveryPartner;

    @Column(name = "tracking_number", nullable = false, unique = true, length = 100)
    private String trackingNumber;

    @Enumerated(EnumType.STRING)
    @Column(length = 30)
    private ShipmentStatus status = ShipmentStatus.ASSIGNED;

    @Column(name = "estimated_delivery")
    private LocalDateTime estimatedDelivery;

    @Column(name = "shipped_at")
    private LocalDateTime shippedAt;

    @Column(name = "delivered_at")
    private LocalDateTime deliveredAt;

    @Column(name = "delivery_notes", columnDefinition = "TEXT")
    private String deliveryNotes;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    public Shipment() {}

    public Shipment(SellerOrder sellerOrder, DeliveryPartner deliveryPartner, String trackingNumber) {
        this.sellerOrder = sellerOrder;
        this.deliveryPartner = deliveryPartner;
        this.trackingNumber = trackingNumber;
        this.status = ShipmentStatus.ASSIGNED;
        this.createdAt = LocalDateTime.now();
        this.estimatedDelivery = LocalDateTime.now().plusDays(3);
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public SellerOrder getSellerOrder() { return sellerOrder; }
    public void setSellerOrder(SellerOrder sellerOrder) { this.sellerOrder = sellerOrder; }

    public DeliveryPartner getDeliveryPartner() { return deliveryPartner; }
    public void setDeliveryPartner(DeliveryPartner deliveryPartner) { this.deliveryPartner = deliveryPartner; }

    public String getTrackingNumber() { return trackingNumber; }
    public void setTrackingNumber(String trackingNumber) { this.trackingNumber = trackingNumber; }

    public ShipmentStatus getStatus() { return status; }
    public void setStatus(ShipmentStatus status) { this.status = status; }

    public LocalDateTime getEstimatedDelivery() { return estimatedDelivery; }
    public void setEstimatedDelivery(LocalDateTime estimatedDelivery) { this.estimatedDelivery = estimatedDelivery; }

    public LocalDateTime getShippedAt() { return shippedAt; }
    public void setShippedAt(LocalDateTime shippedAt) { this.shippedAt = shippedAt; }

    public LocalDateTime getDeliveredAt() { return deliveredAt; }
    public void setDeliveredAt(LocalDateTime deliveredAt) { this.deliveredAt = deliveredAt; }

    public String getDeliveryNotes() { return deliveryNotes; }
    public void setDeliveryNotes(String deliveryNotes) { this.deliveryNotes = deliveryNotes; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
